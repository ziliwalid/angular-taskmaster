import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User, LoginCredentials, RegisterData } from '../models/user.model';
import { ApiResponse, AuthResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  // État de l'utilisateur actuel
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // État de l'authentification
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
    this.startTokenRefreshTimer();
  }

  /**
   * Initialise l'état d'authentification au démarrage
   */
  private initializeAuthState(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (storedUser && token && !this.isTokenExpired(token)) {
      const user = JSON.parse(storedUser);
      this.setAuthenticatedUser(user);
    } else {
      this.clearAuthData();
    }
  }

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, credentials)
      .pipe(
        map(response => response.data),
        tap(authData => {
          this.storeAuthData(authData);
          this.setAuthenticatedUser(authData.user);
        }),
        map(authData => authData.user),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Inscription utilisateur
   */
  register(registerData: RegisterData): Observable<User> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/register`, registerData)
      .pipe(
        map(response => response.data),
        tap(authData => {
          this.storeAuthData(authData);
          this.setAuthenticatedUser(authData.user);
        }),
        map(authData => authData.user),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): void {
    // Appel API pour invalider le token côté serveur
    this.http.post(`${this.API_URL}/logout`, {}).subscribe();
    
    this.clearAuthData();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Rafraîchissement du token
   */
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<{ token: string; expiresIn: number }>>(`${this.API_URL}/refresh`, {
      refreshToken
    }).pipe(
      map(response => response.data),
      tap(tokenData => {
        localStorage.setItem(this.TOKEN_KEY, tokenData.token);
      }),
      map(tokenData => tokenData.token),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  /**
   * Récupère le token actuel
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Vérifie si le token est expiré
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Stocke les données d'authentification
   */
  private storeAuthData(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
  }

  /**
   * Définit l'utilisateur authentifié
   */
  private setAuthenticatedUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Supprime toutes les données d'authentification
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Démarre le timer de rafraîchissement automatique du token
   */
  private startTokenRefreshTimer(): void {
    timer(0, 300000) // Vérification toutes les 5 minutes
      .pipe(
        switchMap(() => {
          const token = this.getToken();
          if (token && this.isTokenExpired(token)) {
            return this.refreshToken();
          }
          return [];
        })
      )
      .subscribe();
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 401:
          errorMessage = 'Email ou mot de passe incorrect';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Service non trouvé';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          errorMessage = error.error?.message || 'Erreur inconnue';
      }
    }

    console.error('Auth Service Error:', error);
    return throwError(() => errorMessage);
  }
}
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // Ajouter le token d'authentification
    const authRequest = this.addTokenHeader(request);

    return next.handle(authRequest).pipe(
      catchError(error => {
        // Si erreur 401 et qu'on n'est pas déjà en train de rafraîchir
        if (error instanceof HttpErrorResponse && 
            error.status === 401 && 
            !this.isRefreshing &&
            !request.url.includes('/auth/')) {
          
          return this.handle401Error(authRequest, next);
        }

        return throwError(() => error);
      })
    );
  }

  /**
   * Ajoute le token d'authentification aux requêtes
   */
  private addTokenHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    
    if (token) {
      return request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return request;
  }

  /**
   * Gère les erreurs 401 en tentant de rafraîchir le token
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          
          // Relancer la requête avec le nouveau token
          return next.handle(this.addTokenHeader(request));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    }

    // Si on est déjà en train de rafraîchir, attendre
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(this.addTokenHeader(request)))
    );
  }
}
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1), // Retry une fois pour les erreurs réseau
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Gère les différents types d'erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): void {
    let errorMessage = '';
    let showNotification = true;

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client (réseau, etc.)
      errorMessage = `Erreur réseau: ${error.error.message}`;
      console.error('Client-side error:', error.error);
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Données invalides';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          showNotification = false; // Géré par AuthInterceptor
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 422:
          errorMessage = this.extractValidationErrors(error);
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        case 503:
          errorMessage = 'Service temporairement indisponible';
          break;
        default:
          errorMessage = error.error?.message || 'Une erreur est survenue';
      }

      console.error(`Server-side error: ${error.status}`, error);
    }

    // Afficher la notification d'erreur
    if (showNotification && errorMessage) {
      this.notificationService.error(errorMessage);
    }

    // Log pour le debugging
    this.logError(error, errorMessage);
  }

  /**
   * Extrait les erreurs de validation
   */
  private extractValidationErrors(error: HttpErrorResponse): string {
    if (error.error?.errors) {
      const errors = Object.values(error.error.errors).flat();
      return errors.join(', ');
    }
    return error.error?.message || 'Erreur de validation';
  }

  /**
   * Log les erreurs pour le debugging
   */
  private logError(error: HttpErrorResponse, message: string): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      url: error.url,
      status: error.status,
      message: message,
      error: error.error,
      user: this.authService.currentUser$
    };

    console.group('🚨 HTTP Error Intercepted');
    console.error('Error Details:', errorLog);
    console.groupEnd();

    // En production, envoyer les erreurs à un service de monitoring
    if (environment.production) {
      // this.sendToMonitoringService(errorLog);
    }
  }
}
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject, Observable } from 'rxjs';

export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  action?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationData>();
  public notifications$ = this.notificationSubject.asObservable();

  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Affiche une notification de succès
   */
  success(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'success',
      action,
      duration
    });
  }

  /**
   * Affiche une notification d'erreur
   */
  error(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'error',
      action,
      duration: duration || 6000 // Plus long pour les erreurs
    });
  }

  /**
   * Affiche une notification d'avertissement
   */
  warning(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'warning',
      action,
      duration
    });
  }

  /**
   * Affiche une notification d'information
   */
  info(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'info',
      action,
      duration
    });
  }

  /**
   * Affiche une notification générique
   */
  private show(data: NotificationData): void {
    const config = {
      ...this.defaultConfig,
      duration: data.duration || this.defaultConfig.duration,
      panelClass: [`notification-${data.type}`]
    };

    const snackBarRef = this.snackBar.open(
      data.message,
      data.action || 'Fermer',
      config
    );

    // Émet la notification pour d'autres composants
    this.notificationSubject.next(data);

    // Gestion de l'action
    if (data.action) {
      snackBarRef.onAction().subscribe(() => {
        // Logique personnalisée selon l'action
        console.log(`Action ${data.action} clicked`);
      });
    }
  }

  /**
   * Ferme toutes les notifications
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
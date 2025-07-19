import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { Observable, map, switchMap, take } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  /**
   * Protège une route
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(state.url, route.data);
  }

  /**
   * Protège les routes enfants
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

  /**
   * Vérifie l'authentification et les permissions
   */
  private checkAuth(url: string, routeData: any): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.notificationService.warning('Vous devez être connecté pour accéder à cette page');
          this.router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: url } 
          });
          return [false];
        }

        // Vérification des rôles si spécifiés
        if (routeData?.roles && routeData.roles.length > 0) {
          return this.checkRoles(routeData.roles);
        }

        return [true];
      })
    );
  }

  /**
   * Vérifie si l'utilisateur a les rôles requis
   */
   private checkRoles(requiredRoles: string[]): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.notificationService.error('Utilisateur non trouvé');
          this.router.navigate(['/auth/login']);
          return false;
        }

        const hasRequiredRole = requiredRoles.includes(user.role);
        if (!hasRequiredRole) {
          this.notificationService.error('Vous n\'avez pas les permissions pour accéder à cette page');
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true;
      })
    );
  }
}

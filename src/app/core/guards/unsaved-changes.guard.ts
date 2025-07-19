import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

// Interface pour les composants qui peuvent avoir des changements non sauvegardés
export interface ComponentCanDeactivate {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  canDeactivate(
    component: ComponentCanDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Si le composant implémente canDeactivate, on l'utilise
    if (component.canDeactivate) {
      return component.canDeactivate();
    }

    // Sinon, vérification générique
    return this.checkForUnsavedChanges(component);
  }

  /**
   * Vérification générique des changements non sauvegardés
   */
  private checkForUnsavedChanges(component: any): boolean {
    // Vérification si le composant a des formulaires modifiés
    if (component.form && component.form.dirty) {
      return confirm(
        'Vous avez des modifications non sauvegardées. ' +
        'Êtes-vous sûr de vouloir quitter cette page ?'
      );
    }

    // Vérification si le composant a des données modifiées
    if (component.hasUnsavedChanges === true) {
      return confirm(
        'Des changements n\'ont pas été sauvegardés. ' +
        'Voulez-vous vraiment quitter sans sauvegarder ?'
      );
    }

    return true;
  }
}

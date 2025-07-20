// src/app/features/dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard)
  }
];
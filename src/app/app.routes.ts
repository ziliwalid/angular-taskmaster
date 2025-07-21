import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
   //canActivate: [AuthGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.taskRoutes),
    //canActivate: [AuthGuard]
  },
  {
    path: 'users',  // 👈 La route oubliée !
    loadChildren: () => import('./features/users/users.routes').then(m => m.userRoutes),
    //canActivate: [AuthGuard],
    data: { roles: ['admin', 'manager'] }  // Seuls admin/manager peuvent gérer les users
  },
  { path: '**', redirectTo: '/auth/login' }
];
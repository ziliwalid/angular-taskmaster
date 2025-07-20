import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list').then(c => c.UserList)
  },
  {
    path: 'profile',
    loadComponent: () => import('./user-profile/user-profile').then(c => c.UserProfile)
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail/user-detail').then(c => c.UserDetail)
  }
];
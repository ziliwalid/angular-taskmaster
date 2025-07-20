import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component').then(c => c.UserListComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./user-profile/user-profile.component').then(c => c.UserProfileComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail/user-detail.component').then(c => c.UserDetailComponent)
  }
];
// src/app/features/tasks/tasks.routes.ts
import { Routes } from '@angular/router';

export const taskRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list').then(c => c.TaskList)
  },
  {
    path: ':id',
    loadComponent: () => import('./task-detail/task-detail').then(c => c.TaskDetail)
  }
];
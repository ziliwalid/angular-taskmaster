// src/app/features/tasks/tasks.routes.ts
import { Routes } from '@angular/router';

export const taskRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list.component').then(c => c.TaskListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./task-detail/task-detail.component').then(c => c.TaskDetailComponent)
  }
];
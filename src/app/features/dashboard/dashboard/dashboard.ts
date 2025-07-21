import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  stats = {
    totalTasks: 12,
    completedTasks: 8,
    pendingTasks: 4,
    todayTasks: 3
  };

  recentTasks = [
    { id: 1, title: 'Finaliser le projet Angular', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Préparer la présentation', status: 'todo', priority: 'medium' },
    { id: 3, title: 'Code review équipe', status: 'completed', priority: 'low' }
  ];

  getTaskStatusClass(status: string): string {
    return `status-${status}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }
}
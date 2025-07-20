import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList {
  tasks: Task[] = [
    {
      id: 1,
      title: 'Finaliser le projet Angular',
      description: 'Terminer l\'implémentation des composants et effectuer les tests',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2025-07-25',
      createdAt: '2025-07-20'
    },
    {
      id: 2,
      title: 'Préparer la présentation client',
      description: 'Créer les slides et préparer la démonstration',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-07-28',
      createdAt: '2025-07-20'
    },
    {
      id: 3,
      title: 'Code review équipe',
      description: 'Réviser le code des autres développeurs',
      status: 'completed',
      priority: 'low',
      dueDate: '2025-07-22',
      createdAt: '2025-07-19'
    },
    {
      id: 4,
      title: 'Mise à jour documentation',
      description: 'Mettre à jour la documentation technique du projet',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-07-30',
      createdAt: '2025-07-20'
    }
  ];

  filteredTasks: Task[] = [...this.tasks];
  selectedFilter: string = 'all';

  filterTasks(status: string) {
    this.selectedFilter = status;
    if (status === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === status);
    }
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'todo': 'À faire',
      'in-progress': 'En cours',
      'completed': 'Terminé'
    };
    return statusMap[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Haute'
    };
    return priorityMap[priority] || priority;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  editTask(taskId: number) {
    console.log('Modifier la tâche:', taskId);
    // TODO: Implémenter la logique d'édition
  }

  deleteTask(taskId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.filterTasks(this.selectedFilter); // Réappliquer le filtre
      console.log('Tâche supprimée:', taskId);
    }
  }

  addNewTask() {
    console.log('Ajouter une nouvelle tâche');
    // TODO: Implémenter la logique d'ajout
  }

  toggleTaskStatus(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      if (task.status === 'completed') {
        task.status = 'todo';
      } else if (task.status === 'todo') {
        task.status = 'in-progress';
      } else {
        task.status = 'completed';
      }
      this.filterTasks(this.selectedFilter); // Réappliquer le filtre
    }
  }

  getTaskCount(status?: string): number {
    if (!status || status === 'all') {
      return this.tasks.length;
    }
    return this.tasks.filter(task => task.status === status).length;
  }
}
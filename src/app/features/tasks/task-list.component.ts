import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Liste des Tâches</h1>
      <p>Vos tâches apparaîtront ici</p>
    </div>
  `
})
export class TaskListComponent { }
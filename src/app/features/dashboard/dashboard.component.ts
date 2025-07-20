import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenue dans TaskMaster!</p>
    </div>
  `
})
export class DashboardComponent { }
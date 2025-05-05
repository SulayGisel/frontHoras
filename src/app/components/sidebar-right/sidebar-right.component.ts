import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Notification {
  icon: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-sidebar-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-right.component.html',
  styleUrl: './sidebar-right.component.css'
})

export class SidebarRightComponent {
notifications: Notification[] = [
    {
      icon: 'fas fa-clock',
      message: 'Registraste 2 horas...',
      time: 'Just now'
    },
    {
      icon: 'fas fa-user',
      message: '2 horas extras no apr...',
      time: '59 minutes ago'
    },
    {
      icon: 'fas fa-clock',
      message: 'Registraste 5 horas e...',
      time: '12 hours ago'
    },
    {
      icon: 'fas fa-check-circle',
      message: '1 hora extra aprobada',
      time: 'Today, 11:59 AM'
    }
  ];
}

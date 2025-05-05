import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.css'
})
export class SidebarLeftComponent {

  constructor(private router: Router){}
  menuItems = {
    favoritos: [
      { title: 'Gestión de turnos', icon: 'fa-circle', link: '/gestion-turnos' },
      { title: 'Horas extras', icon: 'fa-circle', link: '/horas-extras' }
    ],
    tableros: [
      { title: 'Gestión de turnos', icon: 'fa-calendar', link: '/gestion-turnos', active: true },
      { title: 'Promación de turnos', icon: 'fa-calendar-check', link: '/promacion-turnos' },
      { title: 'Horas extras', icon: 'fa-folder', link: '/horas-extras' }
    ]
  };

  navigateToPage() {
    this.router.navigate(['/maestroTurno']); // Ajusta la ruta según sea necesario
  }
}

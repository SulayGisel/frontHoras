import { Component } from '@angular/core';
import { Router, NavigationEnd,RouterOutlet } from '@angular/router';
import { SidebarLeftComponent } from "./components/sidebar-left/sidebar-left.component";
import { SidebarRightComponent } from "./components/sidebar-right/sidebar-right.component";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatChipInput } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,SidebarLeftComponent, SidebarRightComponent,MatFormFieldModule,[MatChipsModule],MatAutocompleteModule,MatInputModule,MatChipInput
,    MatDatepickerModule,
] , 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-horas-extra';
  showSidebars = true; // Variable para controlar la visibilidad de los sidebars
  private noSidebarRoutes = ['/login', '/registro', '/recovery',"/"]; // Rutas sin sidebar

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSidebars = !this.noSidebarRoutes.includes(event.url);
      }
    });
  }


}

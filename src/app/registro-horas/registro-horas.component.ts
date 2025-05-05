import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-horas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './registro-horas.component.html',
  styleUrl: './registro-horas.component.css'
})
export class RegistroHorasComponent {
  registroHoraForm!: FormGroup;
  editandoTurno: boolean = false;
  constructor(){
    this.registroHoraForm = new FormGroup({
      ticket: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      horaInicio: new FormControl('', [Validators.required]),
      horaFin: new FormControl('', [Validators.required]),
      diaInicio: new FormControl('', [Validators.required]),
      diaFin: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
  
  }

  get ticketInvalid() {
    const control = this.registroHoraForm.get('ticket');
    return control?.invalid && control?.touched;
  }

  get fechaInvalid() {
    const control = this.registroHoraForm.get('fecha');
    return control?.invalid && control?.touched;
  }

  get horaInicioInvalid() {
    const control = this.registroHoraForm.get('horaInicio');
    return control?.invalid && control?.touched;
  }

  get horaFinInvalid() {
    const control = this.registroHoraForm.get('horaFin');
    return control?.invalid && control?.touched;
  }

  get diaInicioInvalid() {
    const control = this.registroHoraForm.get('diaInicio');
    return control?.invalid && control?.touched;
  }

  get diaFinInvalid() {
    const control = this.registroHoraForm.get('diaFin');
    return control?.invalid && control?.touched;
  }
}

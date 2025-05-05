import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../axios.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  preguntas: any[] = [];
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private axiosService: AxiosService, private router:Router) {
    this.registroForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      cedula: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(10),
        Validators.pattern('^[0-9]{6,10}$'),// Solo números, de 6 a 10 dígitos
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmPassword: ['', Validators.required],
      preguntas: ['', [Validators.required]],
      respuestaSeguridad: ['', [Validators.required, Validators.minLength(3)]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.cargarPreguntas();
  }


  async cargarPreguntas() {
    try {
      const response = await this.axiosService.get('/preguntas');
      console.log(response);
      this.preguntas = response.data;
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  async onSubmit() {
    if (!this.registroForm.valid) {
      this.markFormGroupTouched(this.registroForm);
      return;
    }
  
    const { fullname, cedula, password, preguntas, respuestaSeguridad } = this.registroForm.value;
  
    try {
      const response = await this.axiosService.post('/user', {
        fullname,
        cedula,
        password,
        preguntas: Number(preguntas),
        respuestaSeguridad
      });
  
    //  console.log(response);
      Swal.fire({
        title: 'Registro exitoso',
        text: 'Tu registro se completó correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigate(['/login']); // Redirige al login
      
    } catch (error: any) {
      console.error(error);
  
      let errorMessage = 'No se pudo registrar. Por favor, verifica tus datos e intenta de nuevo.';
  
      if (error.response && error.response.status === 409) {
        errorMessage = error.response.data.message; // Captura el mensaje del backend
      }
  
      Swal.fire({
        title: 'Error en el registro',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters for form validation
  get fullnameInvalid() {
    const control = this.registroForm.get('fullname');
    return control?.invalid && control?.touched;
  }

  get cedulaInvalid() {
    const control = this.registroForm.get('cedula');
    return control?.invalid && control?.touched;
  }

  get passwordInvalid() {
    const control = this.registroForm.get('password');
    return control?.invalid && control?.touched;
  }

  get confirmPasswordInvalid() {
    const control = this.registroForm.get('confirmPassword');
    return (control?.invalid || this.registroForm.hasError('mismatch')) && control?.touched;
  }

  get preguntasInvalid() {
    const control = this.registroForm.get('preguntas');
    return control?.invalid && control?.touched;
  }

  get respuestaSeguridadInvalid() {
    const control = this.registroForm.get('respuestaSeguridad');
    return control?.invalid && control?.touched;
  }
}

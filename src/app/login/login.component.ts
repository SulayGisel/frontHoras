import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../axios.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from './services/Login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private axiosService: AxiosService,private router: Router,
    private loginServices:LoginService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cedula: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      ...this.loginForm.value,
      cedula: Number(this.loginForm.value.cedula)
    };
    this.loginServices.auth(loginData).subscribe(data=>{
      this.router.navigate(['/listarUsuario']); 
    })
    // try {
    //   const response = await this.axiosService.post('/login/login', loginData);
    //   const { token } = response.data;
    //   localStorage.setItem('token', token);
    //   Swal.fire({
    //     title: 'Inicio de sesión exitoso',
    //     text: 'Has iniciado sesión correctamente.',
    //     icon: 'success',
    //     confirmButtonText: 'Aceptar'
    //   });
    //   this.router.navigate(['/listarUsuario']); // Redirige al login
    // } catch (error) {
    //   Swal.fire({
    //     title: 'Error en el inicio de sesión',
    //     text: 'No se pudo iniciar sesión. Por favor, verifica tus credenciales e intenta de nuevo.',
    //     icon: 'error',
    //     confirmButtonText: 'Aceptar'
    //   });
    // }
  }

  route(){
   
    this.router.navigate(['registro']).then(
      nav => {
        console.log('Navegación exitosa', nav);
      },  err=> console.log('Error en la navegación', err)
    );
     console.log('Intentando navegar a /registro');
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MaestroTurnoService } from './services/maestroTurno.service';

interface Turno {
  idTurno?: number;
  nombre: string;
  codigo: string;
  diaInicio: string;
  horaInicio: string;
  diaFin: string;
  horaFin: string;
}

interface PaginatedResponse {
  data: Turno[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-maestro-turno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './maestro-turno.component.html',
  styleUrl: './maestro-turno.component.css'
})
export class MaestroTurnoComponent implements OnInit {
  turnoForm!: FormGroup;
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  editandoTurno: boolean = false;
  turnoEditId: number | null = null;
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  totalPaginas: number = 1;
  terminoBusqueda: string = '';
  Math = Math;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private maestroTurnoService: MaestroTurnoService // nuevo servicio inyectado
  ) {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.turnoForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      diaInicio: ['', Validators.required],
      horaInicio: ['', [Validators.required]],
      diaFin: ['', Validators.required],
      horaFin: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarTurnos();
  }

  async cargarTurnos() {
    try {
      this.maestroTurnoService.getAllTurnos().subscribe((data: any) => {
        this.turnos = data ?? [];
        this.aplicarFiltro(); // <-- Agrega esto para actualizar turnosFiltrados
      });
    } catch (error) {
      this.mostrarError('No se pudieron cargar los turnos');
    }
  }

  async crearTurno(): Promise<void> {
    if (!this.turnoForm.valid) {
      this.markFormGroupTouched(this.turnoForm);
      return;
    }

    const turnoData = { ...this.turnoForm.value };
    if (turnoData.horaInicio) {
      const [horas, minutos] = turnoData.horaInicio.split(':');
      const horaInicio = new Date();
      horaInicio.setHours(parseInt(horas), parseInt(minutos), 0);
      turnoData.horaInicio = horaInicio.toISOString();
    }

    if (turnoData.horaFin) {
      const [horas, minutos] = turnoData.horaFin.split(':');
      const horaFin = new Date();
      horaFin.setHours(parseInt(horas), parseInt(minutos), 0);
      turnoData.horaFin = horaFin.toISOString();
    }

    this.maestroTurnoService.crearTurno(turnoData).subscribe({
      next: (nuevoTurno: any) => {
        this.mostrarExito('Turno creado correctamente');
        this.resetForm();
        // Agrega el nuevo turno al arreglo y actualiza la tabla sin recargar todo
        this.turnos.push(nuevoTurno);
        this.aplicarFiltro();
        // Si usas paginación, puedes ajustar la página actual si lo deseas
        // this.paginaActual = this.totalPaginas;
      },
      error: () => {
        this.mostrarError('El codigo de turno ya esta en uso');
      }
    });
  }

  actualizarTurno(): void {
    if (!this.turnoForm.valid || this.turnoEditId === null) {
      this.markFormGroupTouched(this.turnoForm);
      return;
    }

    const turnoData = this.turnoForm.value;
    const id = Number(this.turnoEditId);

    if (turnoData.horaInicio) {
      const [horas, minutos] = turnoData.horaInicio.split(':');
      const horaInicio = new Date();
      horaInicio.setHours(parseInt(horas), parseInt(minutos), 0);
      turnoData.horaInicio = horaInicio.toISOString();
    }

    if (turnoData.horaFin) {
      const [horas, minutos] = turnoData.horaFin.split(':');
      const horaFin = new Date();
      horaFin.setHours(parseInt(horas), parseInt(minutos), 0);
      turnoData.horaFin = horaFin.toISOString();
    }

    this.maestroTurnoService.actualizarTurno(id, turnoData).subscribe({
      next: () => {
        this.mostrarExito('Turno actualizado correctamente');
        this.resetForm();
        this.cargarTurnos(); // <-- Refresca la tabla dinámicamente
      },
      error: () => {
        this.mostrarError('No se pudo actualizar el turno');
      }
    });
  }

  onSubmit(): void {
    if (this.editandoTurno) {
      this.actualizarTurno();
    } else {
      this.crearTurno();
    }
  }

  editarTurno(turno: Turno): void {
    if (!turno || turno.idTurno === undefined) {
      console.error('Turno inválido o sin ID');
      return;
    }

    let horaInicio = turno.horaInicio;
    let horaFin = turno.horaFin;

    if (turno.horaInicio && turno.horaInicio.includes('T')) {
      const fecha = new Date(turno.horaInicio);
      horaInicio = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
    }

    if (turno.horaFin && turno.horaFin.includes('T')) {
      const fecha = new Date(turno.horaFin);
      horaFin = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
    }

    this.turnoForm.patchValue({
      nombre: turno.nombre || '',
      codigo: turno.codigo || '',
      diaInicio: turno.diaInicio || '',
      horaInicio: horaInicio || '',
      diaFin: turno.diaFin || '',
      horaFin: horaFin || ''
    });

    this.editandoTurno = true;
    this.turnoEditId = turno.idTurno;

    console.log('Editando turno:', turno);
    console.log('ID del turno en edición:', this.turnoEditId);
  }

  eliminarTurno(id: number): void {
    if (id === undefined || id === null) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.maestroTurnoService.eliminarTurno(id).subscribe({
          next: () => {
            this.mostrarExito('El turno ha sido eliminado correctamente');
            this.cargarTurnos();
          },
          error: () => {
            this.mostrarError('No se pudo eliminar el turno');
          }
        });
      }
    });
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.turnoForm.reset();
    this.editandoTurno = false;
    this.turnoEditId = null;
  }

  // Métodos para buscar y paginar
  buscar(event: Event): void {
    this.terminoBusqueda = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.paginaActual = 1; // Reset to first page when searching
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    // Filtrar por término de búsqueda
    if (this.terminoBusqueda) {
      this.turnosFiltrados = this.turnos.filter(turno => 
        turno.nombre.toLowerCase().includes(this.terminoBusqueda) ||
        turno.codigo.toLowerCase().includes(this.terminoBusqueda) ||
        turno.diaInicio.toLowerCase().includes(this.terminoBusqueda) ||
        turno.diaFin.toLowerCase().includes(this.terminoBusqueda)
      );
    } else {
      this.turnosFiltrados = [...this.turnos];
    }

    this.totalPaginas = Math.ceil(this.turnosFiltrados.length / this.itemsPorPagina);
    
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas || 1;
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get turnosPaginados(): Turno[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.turnosFiltrados.slice(inicio, fin);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  arregloPaginas(): number[] {
    return Array(this.totalPaginas).fill(0).map((_, index) => index + 1);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Métodos para mostrar notificaciones
  private mostrarExito(mensaje: string): void {
    Swal.fire({
      title: 'Éxito',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  private mostrarError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  forgotSecurityAnswer(): void {
    Swal.fire({
      title: '¿Olvidaste tu respuesta de seguridad?',
      text: 'Por favor comunícate con el administrador del sistema para restablecer tu cuenta',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  get fullnameInvalid() {
    const control = this.turnoForm.get('nombre');
    return control?.invalid && control?.touched;
  }

  get codigoInvalid() {
    const control = this.turnoForm.get('codigo');
    return control?.invalid && control?.touched;
  }

  get horaInicioInvalid() {
    const control = this.turnoForm.get('horaInicio');
    return control?.invalid && control?.touched;
  }

  get horaFinInvalid() {
    const control = this.turnoForm.get('horaFin');
    return control?.invalid && control?.touched;
  }

  get diaInicioInvalid() {
    const control = this.turnoForm.get('diaInicio');
    return control?.invalid && control?.touched;
  }

  get diaFinInvalid() {
    const control = this.turnoForm.get('diaFin');
    return control?.invalid && control?.touched;
  }
}

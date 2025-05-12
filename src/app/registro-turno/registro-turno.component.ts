import { MatTableModule } from '@angular/material/table';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable, map, startWith } from 'rxjs';
import { RegistroTurnoService } from './services/registro-Turno.service';
import Swal from 'sweetalert2';

export interface Ingeniero {
  fullname: string;
  id: number;
}

export interface CreateUsuarioTurnoDto {
  turnoFK: number;
  usuarioFK: number;
  fechaInicio: Date;
  fechaFin: Date;
}
export interface UsuarioTurno {
  idUsuarioTurno: number;
  fullname: string;
  fechaInicio: string; // luego la convertimos a Date
  fechaFin: string;
  codigo: string;
  usuarioFK: number; // Agregar esta propiedad
}

@Component({
  selector: 'app-registro-turno',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
  ],
  templateUrl: './registro-turno.component.html',
  styleUrls: ['./registro-turno.component.css'],
})
export class RegistroTurnoComponent implements OnInit {

    // Nueva propiedad para manejar la selección múltiple
  turnosSeleccionados: Set<number> = new Set();

  turnoEditId: number | null = null;

  usuarioTurnos: UsuarioTurno[] = [];
  usuarioTurnosPorSemana: UsuarioTurno[][] = [[], [], [], [], []];

  anio: number = 2025; // 🔥 Año quemado
  diasPorMes: number[] = [
    // 🔥 Días por cada mes quemado
    31, // Enero
    28, // Febrero (2024 es bisiesto)
    31, // Marzo
    30, // Abril
    31, // Mayo
    30, // Junio
    31, // Julio
    31, // Agosto
    30, // Septiembre
    31, // Octubre
    30, // Noviembre
    31, // Diciembre
  ];

  nombresMeses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  resultados: { mes: string; semanas: number }[] = [];
  semanaSeleccionada: number | null = null;

  // Formulario para la asignación
  AsignacionTurnoForm!: FormGroup;
  AsignacionTurnoFormMes!: FormGroup;

  // Resultados se usaba para mostrar mes y semanas; ahora usaremos "cabeceras"
  cabeceras: string[] = [];

  trackByTurno(index: number, item: any) {
    return item.idTurno;
  }

  fechaSeleccionada = new FormControl();
  editandoTurno: boolean = false;
  codigo: any[] = [];
  idturno: any[] = [];
  id: any[] = [];
  selectedIngenieros: Ingeniero[] = []; // guarda el objeto completo o solo los IDs si prefieres

  Ingenieros: Ingeniero[] = []; // Cambiado a any[] para almacenar los datos del servicio
  ingenieroCtrl = new FormControl<string | Ingeniero>('');
  filteredIngenieros!: Observable<Ingeniero[]>;
  usuarioTurnosFiltrados: UsuarioTurno[] = [];

  @ViewChild('ingenieroInput') ingenieroInput!: ElementRef<HTMLInputElement>;
  @ViewChild('picker') datepicker!: MatDatepicker<Date>;

  constructor(
    private fb: FormBuilder,
    private registroTurnoService: RegistroTurnoService
  ) {
    this.registroTurnoService.getAllTurno().subscribe((data: any) => {
      this.codigo = data;
      console.log('data--->', data);
    });

    this.registroTurnoService
      .getAllUsuarios()
      .subscribe((data: Ingeniero[]) => {
        this.Ingenieros = data;
        console.log('dataEnginerio--->', data);

        this.filteredIngenieros = this.ingenieroCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => {
            const nombre =
              typeof value === 'string' ? value : value?.fullname ?? '';
            return this.Ingenieros.filter((i: Ingeniero) =>
              i.fullname.toLowerCase().includes(nombre.toLowerCase())
            );
          })
        );
      });
  }

  inicializarFormulario(): void {
    this.AsignacionTurnoForm = this.fb.group({
      turnoFK: ['', Validators.required],
      ingenierosAsignados: [[], Validators.required], // 👈 Este es nuevo
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.AsignacionTurnoForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      turnoFK: [''],
      periodo: [''],
    });
    // Inicialización del formulario de filtrado para la tabla
    this.AsignacionTurnoFormMes = this.fb.group({
      mes: ['', Validators.required],
    });

    // Al cambiar el mes se recalcula la cantidad de semanas y se genera el arreglo de labels
    this.cargarTurnos(); // carga inicial de datos

    this.AsignacionTurnoFormMes.get('mes')?.valueChanges.subscribe(
      (mesIndexStr: string) => {
        const mesIndex = Number(mesIndexStr);
        if (!isNaN(mesIndex)) {
          // Obtener la cantidad de semanas para este mes
          const semanas = this.calcularSemanasDelMes(mesIndex);
          
          // Aplicar el filtro por mes y distribuir en semanas
          this.filtrarTurnosPorMesYDistribuirEnSemanas(mesIndex);
        } else {
          this.cabeceras = [];
          this.usuarioTurnosFiltrados = [];
          this.usuarioTurnosPorSemana = [[], [], [], [], []];
        }
      }
    );
  }
  
  // Método para filtrar turnos por mes y distribuirlos en semanas
  filtrarTurnosPorMesYDistribuirEnSemanas(mesIndex: number): void {
    // Filtra los turnos que tienen alguna intersección con el mes seleccionado
    this.usuarioTurnosFiltrados = this.usuarioTurnos.filter((turno) => {
      const inicio = new Date(turno.fechaInicio);
      const fin = new Date(turno.fechaFin);
      
      // El turno intersecta con el mes si:
      // 1. El mes está dentro del rango de fechas (inicio <= mes <= fin)
      // 2. O el mes contiene la fecha de inicio o la fecha de fin
      const mesInicio = inicio.getMonth();
      const mesFin = fin.getMonth();
      
      return (mesInicio <= mesIndex && mesFin >= mesIndex);
    });

    // Distribuir los turnos en las semanas del mes
    this.distribuirTurnosEnSemanas(mesIndex);
  }
  
  // Método para distribuir los turnos en las semanas correspondientes
  distribuirTurnosEnSemanas(mesIndex: number): void {
    // Obtener información del mes
    const anio = this.anio;
    const primerDiaMes = new Date(anio, mesIndex, 1);
    const ultimoDiaMes = new Date(anio, mesIndex + 1, 0);
    
    // Calcular el primer día de la semana (lunes) que incluye o precede al primer día del mes
    const primerLunes = new Date(primerDiaMes);
    const diaSemana = primerDiaMes.getDay(); // 0 = domingo, 1 = lunes, ...
    const ajusteDias = diaSemana === 0 ? 6 : diaSemana - 1; // Para que el lunes sea el día 0
    primerLunes.setDate(primerLunes.getDate() - ajusteDias);
    
    // Calcular cuántas semanas hay en el mes
    const totalSemanas = this.calcularSemanasDelMes(mesIndex);
    
    // Inicializar el array de semanas
    this.usuarioTurnosPorSemana = Array(totalSemanas).fill(null).map(() => []);
    
    // Para cada turno filtrado, determinar en qué semanas está activo
    this.usuarioTurnosFiltrados.forEach(turno => {
      const fechaInicio = new Date(turno.fechaInicio);
      const fechaFin = new Date(turno.fechaFin);
      
      // Para cada semana del mes
      for (let semanaIndex = 0; semanaIndex < totalSemanas; semanaIndex++) {
        // Calcular el rango de fechas de esta semana
        const inicioSemana = new Date(primerLunes);
        inicioSemana.setDate(primerLunes.getDate() + (semanaIndex * 7));
        
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6); // 6 días después del inicio (lunes a domingo)
        
        // Verificar si hay intersección entre el turno y esta semana
        if (!(fechaFin < inicioSemana || fechaInicio > finSemana)) {
          // Si hay intersección, agregar el turno a esta semana
          this.usuarioTurnosPorSemana[semanaIndex].push(turno);
        }
      }
    });
    
    // Generar etiquetas para las semanas
    this.cabeceras = Array.from({ length: totalSemanas }, (_, i) => {
      const inicio = new Date(primerLunes);
      inicio.setDate(primerLunes.getDate() + (i * 7));
      
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);
      
      return `Semana ${i + 1} (${inicio.getDate()}/${inicio.getMonth() + 1} - ${fin.getDate()}/${fin.getMonth() + 1})`;
    });
  }

  cargarTurnos() {
    this.registroTurnoService
      .getAllUsuariosTurno()
      .subscribe((data: UsuarioTurno[]) => {
        this.usuarioTurnos = data;
        const mesActual = Number(this.AsignacionTurnoFormMes.get('mes')?.value);
        if (!isNaN(mesActual)) {
          this.filtrarTurnosPorMesYDistribuirEnSemanas(mesActual);
        }
      });
  }

  cargarTurnosUser() {
    this.registroTurnoService
      .getAllUsuariosTurno()
      .subscribe((data: UsuarioTurno[]) => {
        this.usuarioTurnos = data;
        const mesActual = Number(this.AsignacionTurnoFormMes.get('mes')?.value);
        if (!isNaN(mesActual)) {
          this.filtrarTurnosPorMesYDistribuirEnSemanas(mesActual);
        }
      });
  }

  // Este método ya no se usa, pero lo mantenemos por compatibilidad
  separarTurnosPorSemana(turnos: UsuarioTurno[]): UsuarioTurno[][] {
    // Obtenemos el mes seleccionado
    const mesIndex = Number(this.AsignacionTurnoFormMes.get('mes')?.value);
    if (isNaN(mesIndex)) {
      return [[], [], [], [], []];
    }
    
    // Usamos el nuevo método para distribuir los turnos
    this.filtrarTurnosPorMesYDistribuirEnSemanas(mesIndex);
    return this.usuarioTurnosPorSemana;
  }

  calcularSemanasDelMes(mesIndex: number): number {
    const anio = this.anio;
    const primerDia = new Date(anio, mesIndex, 1); // 1er día del mes
    const ultimoDia = new Date(anio, mesIndex + 1, 0); // último día del mes

    const diaInicioSemana = primerDia.getDay(); // 0 (domingo) - 6 (sábado)
    const totalDias = ultimoDia.getDate(); // total de días del mes

    // Día de inicio ajustado para considerar semana desde lunes (1) a domingo (7)
    const offsetInicio = diaInicioSemana === 0 ? 6 : diaInicioSemana - 1;

    const totalCeldas = offsetInicio + totalDias;
    const totalSemanas = Math.ceil(totalCeldas / 7);

    return totalSemanas;
  }

  diaDeLaSemana(dia: number, mes: number, anio: number): number {
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.getDay(); // 0 = domingo, ..., 6 = sábado
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    //const value = event.option.viewValue;
    const selectedIng: Ingeniero = event.option.value; // Recibimos el objeto completo

    if (!this.selectedIngenieros.some((ing) => ing.id === selectedIng.id)) {
      this.selectedIngenieros.push(selectedIng);
    }
    this.ingenieroInput.nativeElement.value = '';
    this.ingenieroCtrl.setValue(null);
  }

  remove(ingeniero: Ingeniero): void {
    const index = this.selectedIngenieros.indexOf(ingeniero);
    if (index >= 0) {
      this.selectedIngenieros.splice(index, 1);
    }
  }

  agregar(): void {
    console.log('Ingenieros:', this.selectedIngenieros);
    console.log('Form data:', this.AsignacionTurnoForm.value);
  }
  onSubmit(): void {
    if (this.editandoTurno && this.turnoEditId !== null) {
      this.actualizarTurnoUsuario();
    } else {
      this.guardarTurno();
    }
  }

  // Métodos para mostrar notificaciones
  private mostrarExito(mensaje: string): void {
    Swal.fire({
      title: 'Éxito',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }
  resetForm(): void {
    this.AsignacionTurnoForm.reset();
  }

guardarTurno() {
  // Verificar que haya ingenieros seleccionados
  if (this.selectedIngenieros.length === 0) {
    Swal.fire({
      title: 'Error',
      text: 'Debes seleccionar al menos un ingeniero',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  // Verificar que los campos obligatorios estén completos
  if (this.AsignacionTurnoForm.invalid) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor completa todos los campos requeridos',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  const turnoFK = Number(this.AsignacionTurnoForm.value.turnoFK);
  const fechaInicio = this.AsignacionTurnoForm.value.fechaInicio;
  const fechaFin = this.AsignacionTurnoForm.value.fechaFin;

  // Verificar superposición para cada ingeniero
  const verificacionesPromises = this.selectedIngenieros.map(ingeniero => 
    this.registroTurnoService.verificarSuperposicionTurno(
      ingeniero.id, 
      fechaInicio, 
      fechaFin
    ).toPromise()
  );

  Promise.all(verificacionesPromises)
    .then(resultados => {
      // Buscar si algún ingeniero tiene superposición
      const superposicionesEncontradas = resultados.filter(resultado => resultado.existeSuperposicion);

      if (superposicionesEncontradas.length > 0) {
        // Mostrar confirmación para sobrescribir
        Swal.fire({
          title: 'Advertencia de Superposición',
          text: '¿Deseas continuar? Se han encontrado turnos que se superponen.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, guardar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            // Proceder con la creación de turnos
            this.crearTurnosConfirmados(turnoFK, fechaInicio, fechaFin);
          }
        });
      } else {
        // No hay superposiciones, crear turnos directamente
        this.crearTurnosConfirmados(turnoFK, fechaInicio, fechaFin);
      }
    })
    .catch(error => {
      console.error('Error al verificar superposición', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo verificar la superposición de turnos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
}

// Método para crear turnos después de confirmación
crearTurnosConfirmados(turnoFK: number, fechaInicio: Date, fechaFin: Date) {
  let completedOperations = 0;
  let erroredOperations = 0;
  const totalOperations = this.selectedIngenieros.length;

  this.selectedIngenieros.forEach((ingeniero) => {
    const nuevoTurno = {
      turnoFK: turnoFK,
      usuarioFK: ingeniero.id,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      calcularPorDias: true
    };

    this.registroTurnoService.crearUsuarioTurno(nuevoTurno).subscribe({
      next: (res) => {
        completedOperations++;
        
        // Éxito
        if (completedOperations + erroredOperations === totalOperations) {
          this.mostrarExito(`Se han guardado exitosamente ${completedOperations} turnos`);
          this.cargarTurnos();
          this.resetForm();
          this.selectedIngenieros = [];
        }
      },
      error: (err) => {
        erroredOperations++;
        
        // Manejo de errores
        Swal.fire({
          title: 'Error',
          text: err.error?.message || 'No se pudo guardar el turno',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  });
}

  eliminarTurno(id: number, semanaIndex?: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.registroTurnoService.deleteUsuarioTurno(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El turno ha sido eliminado', 'success');
            // Recarga todos los turnos desde el backend para mantener la persistencia y consistencia
            this.cargarTurnos();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el turno', 'error');
          }
        });
      }
    });
  }
  
  editarTurno(turno: UsuarioTurno) {
    this.editandoTurno = true;
    this.turnoEditId = turno.idUsuarioTurno;
  
    const turnoEncontrado = this.codigo.find(t => t.codigo === turno.codigo);
  
    this.AsignacionTurnoForm.patchValue({
      fechaInicio: new Date(turno.fechaInicio),
      fechaFin: new Date(turno.fechaFin),
      turnoFK: turnoEncontrado ? turnoEncontrado.idTurno : null
    });
  
    // Depuración: muestra el objeto turno recibido
    console.log('Turno recibido en editarTurno:', turno);
  
    let ingenieroId: number | null = null;
  
    // Prioriza usuarioFK si es un número válido
    if (typeof turno.usuarioFK === 'number' && !isNaN(turno.usuarioFK)) {
      ingenieroId = turno.usuarioFK;
    } else if (this.Ingenieros && this.Ingenieros.length > 0) {
      // Busca por nombre si usuarioFK no está disponible
      const encontrado = this.Ingenieros.find(i => i.fullname === turno.fullname);
      if (encontrado && typeof encontrado.id === 'number') {
        ingenieroId = encontrado.id;
      } else {
        console.warn('No se encontró ingeniero por nombre:', turno.fullname);
      }
    } else {
      console.warn('Ingenieros aún no cargados');
    }
  
    if (ingenieroId !== null && typeof ingenieroId === 'number') {
      this.selectedIngenieros = [{ id: ingenieroId, fullname: turno.fullname }];
    } else {
      this.selectedIngenieros = [];
      console.warn('No se pudo asignar ingenieroId válido para selectedIngenieros');
    }
  
    console.log('Ingeniero seleccionado:', this.selectedIngenieros);
  }
  
  obtenerIdTurnoPorCodigo(codigo: string): number | null {
    const turno = this.codigo.find(t => t.codigo === codigo);
    return turno ? turno.id : null;
  }

actualizarTurnoUsuario() {
  if (!this.turnoEditId) return;

  const turnoFK = Number(this.AsignacionTurnoForm.value.turnoFK);
  const fechaInicio = this.AsignacionTurnoForm.value.fechaInicio;
  const fechaFin = this.AsignacionTurnoForm.value.fechaFin;

  // Verificar que hay al menos un ingeniero seleccionado
  if (this.selectedIngenieros.length === 0) {
    Swal.fire({
      title: 'Error',
      text: 'Debe seleccionar al menos un ingeniero',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  const ingeniero = this.selectedIngenieros[0];

  // Verificar que todos los campos obligatorios estén llenos
  if (!turnoFK || !fechaInicio || !fechaFin || !ingeniero.id) {
    Swal.fire({
      title: 'Error',
      text: 'Todos los campos son obligatorios',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  const turnoActualizado = {
    idUsuarioTurno: Number(this.turnoEditId),
    turnoFK: turnoFK,
    usuarioFK: Number(ingeniero.id),
    fechaInicio: fechaInicio instanceof Date ? fechaInicio.toISOString() : fechaInicio,
    fechaFin: fechaFin instanceof Date ? fechaFin.toISOString() : fechaFin
  };

  this.registroTurnoService.updateUsuarioTurno(this.turnoEditId, turnoActualizado)
    .subscribe({
      next: (res) => {
        this.mostrarExito('Turno actualizado exitosamente');
        this.resetForm();
        this.selectedIngenieros = [];
        this.editandoTurno = false;
        this.turnoEditId = null;
        this.cargarTurnos();
      },
      error: (err) => {
        let errorMsg = 'No se pudo actualizar el turno';
        
        // Verifica si hay un mensaje de error específico
        if (err.error?.message) {
          errorMsg = err.error.message;
          
          // Manejamos mensajes específicos sobre la configuración de días
          if (errorMsg.includes('debe ser un')) {
            errorMsg = `Error de configuración: ${errorMsg}. Este turno tiene días específicos configurados.`;
          }
        }
        
        Swal.fire({
          title: 'Error',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
}

  cancelarEdicion(): void {
    this.editandoTurno = false;
    this.turnoEditId = null;
    this.resetForm();
    this.selectedIngenieros = [];
  }

  // 2. Agregar estos métodos para manejar la selección y eliminación masiva
  
  // Método para alternar la selección de un turno
  toggleSeleccion(idUsuarioTurno: number): void {
    if (this.turnosSeleccionados.has(idUsuarioTurno)) {
      this.turnosSeleccionados.delete(idUsuarioTurno);
    } else {
      this.turnosSeleccionados.add(idUsuarioTurno);
    }
  }
  
  // Método para comprobar si un turno está seleccionado
  estaSeleccionado(idUsuarioTurno: number): boolean {
    return this.turnosSeleccionados.has(idUsuarioTurno);
  }
  
  // Método para eliminar todos los turnos seleccionados
  eliminarSeleccionados(): void {
    // Verificar si hay turnos seleccionados
    if (this.turnosSeleccionados.size === 0) {
      Swal.fire({
        title: 'Información',
        text: 'No hay turnos seleccionados para eliminar',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    
    // Confirmar eliminación
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminarán ${this.turnosSeleccionados.size} turnos. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Convertir Set a Array para enviar al servicio
        const idsParaEliminar = Array.from(this.turnosSeleccionados);
        
        this.registroTurnoService.eliminarMultiplesTurnos(idsParaEliminar).subscribe({
          next: () => {
            Swal.fire({
              title: 'Éxito',
              text: `Se han eliminado ${idsParaEliminar.length} turnos correctamente`,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            
            // Limpiar selección y recargar datos
            this.turnosSeleccionados.clear();
            this.cargarTurnos();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'No se pudieron eliminar los turnos',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }
  
  // Método para seleccionar/deseleccionar todos los turnos de una semana
  toggleSeleccionarTodosSemana(semana: UsuarioTurno[], seleccionar: boolean): void {
    semana.forEach(turno => {
      if (seleccionar) {
        this.turnosSeleccionados.add(turno.idUsuarioTurno);
      } else {
        this.turnosSeleccionados.delete(turno.idUsuarioTurno);
      }
    });
  }
  
  // Método para verificar si todos los turnos de una semana están seleccionados
  todosSeleccionadosSemana(semana: UsuarioTurno[]): boolean {
    return semana.length > 0 && semana.every(turno => this.turnosSeleccionados.has(turno.idUsuarioTurno));
  }
  
  // Método para verificar si algún turno de una semana está seleccionado
  algunoSeleccionadoSemana(semana: UsuarioTurno[]): boolean {
    return semana.some(turno => this.turnosSeleccionados.has(turno.idUsuarioTurno));
  }
  
  // Método para limpiar todas las selecciones
  limpiarSeleccion(): void {
    this.turnosSeleccionados.clear();
  }
}

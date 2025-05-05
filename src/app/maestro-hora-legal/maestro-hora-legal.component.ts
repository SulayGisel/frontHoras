import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MaestroHoraExtraLegalService } from './services/maestroLegal.service';
import Swal from 'sweetalert2';
import { listarUsuarioService } from '../listar-usuarios/services/listarUsuario.service';

export interface MaestroHoraLegal {
  id: number;
  codigoHoraExtra: string;
  descripcion: string;
  horaInicio: Date;
  horaFin: Date;
}

export interface GetMaestroHoraLegal {
  codigoHoraExtra: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-maestro-hora-legal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './maestro-hora-legal.component.html',
  styleUrl: './maestro-hora-legal.component.css'
})
export class MaestroHoraLegalComponent implements OnInit {
  editandoTurno: boolean = false;
  editandoId: number | null = null;
  horaLegalForm!: FormGroup;
  maestroLista: GetMaestroHoraLegal[] = [];
  dataSource = new MatTableDataSource<GetMaestroHoraLegal>([]);

  displayedColumns: string[] = [
    'codigoHoraExtra',
    'descripcion',
    'horaInicio',
    'horaFin',
    'acciones'
  ];

  constructor(private maestroHoraLegalService: MaestroHoraExtraLegalService) {
    this.horaLegalForm = new FormGroup({
      codigoHoraExtra: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      horaInicio: new FormControl('', [Validators.required]),
      horaFin: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.listarHorasLegales();
  }

  listarHorasLegales(): void {
    this.maestroHoraLegalService.ListarHorasLegal().subscribe({
      next: (data: any) => {
        // Si el backend devuelve un array de objetos con las propiedades correctas
        if (Array.isArray(data)) {
          this.dataSource.data = data as GetMaestroHoraLegal[];
        } else if (data && data.data && Array.isArray(data.data)) {
          this.dataSource.data = data.data as GetMaestroHoraLegal[];
        } else {
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        this.dataSource.data = [];
      }
    });
  }


  
  private extraerHora(valor: string): string {
    // Si el valor es tipo "2025-12-27T14:00:00", devuelve "14:00"
    if (valor && valor.includes('T')) {
      const horaMin = valor.split('T')[1]?.substring(0,5);
      return horaMin || '';
    }
    return valor || '';
  }
  
  onSubmit(): void {
    if (this.horaLegalForm.valid) {
      const formValue = this.horaLegalForm.value;
      const hoy = new Date();
      const fechaBase = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
      const formatHora = (hora: string) => {
        if (!hora) return '';
        const [h, m] = hora.split(':');
        return `${fechaBase}T${h}:${m}:00`;
      };

      const datos = {
        codigoHoraExtra: formValue.codigoHoraExtra,
        descripcion: formValue.descripcion,
        horaInicio: formatHora(formValue.horaInicio),
        horaFin: formatHora(formValue.horaFin)
      };

      if (this.editandoTurno && this.editandoId) {
        // Actualizar registro existente
        this.maestroHoraLegalService.actualizarMaestroHoraLegal(this.editandoId, datos)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Actualización exitosa!',
                text: 'El tipo de hora legal fue actualizado correctamente.',
                confirmButtonColor: '#3085d6'
              });
              this.listarHorasLegales();
              this.horaLegalForm.reset();
              this.editandoTurno = false;
              this.editandoId = null;
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el tipo de hora legal.',
                confirmButtonColor: '#dc3545'
              });
            }
          });
      } else {
        // Crear nuevo registro
        this.maestroHoraLegalService.crearMaestroHoraLegal(datos)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'El tipo de hora legal fue registrado correctamente.',
                confirmButtonColor: '#3085d6'
              });
              this.listarHorasLegales();
              this.horaLegalForm.reset();
            },
            error: (err) => {
              // Manejar error
            }
          });
      }
    } else {
      this.horaLegalForm.markAllAsTouched();
      setTimeout(() => {
        Swal.fire({
          icon: 'warning',
          title: 'Campos obligatorios',
          text: 'Por favor, completa todos los campos: Código de Hora Extra, Descripción, Hora Inicio y Hora Fin.',
          confirmButtonColor: '#fbc02d'
        });
      }, 0);
    }
  }

  editarHoraExtra(element: any) {
    // Rellena el formulario con los datos del registro a editar
    this.horaLegalForm.patchValue({
      codigoHoraExtra: element.codigoHoraExtra,
      descripcion: element.descripcion,
      horaInicio: this.extraerHora(element.horaInicio),
      horaFin: this.extraerHora(element.horaFin)
    });
    this.editandoTurno = true;
    this.editandoId = element.id ?? element._id ?? null;
  }

  eliminarHoraExtra(element: any) {
    // Confirma antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro de tipo de hora legal.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const id = element.id ?? element._id;
        if (!id) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo identificar el registro a eliminar.',
            confirmButtonColor: '#dc3545'
          });
          return;
        }
        this.maestroHoraLegalService.deleteMaestroHoraLegal(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El tipo de hora legal fue eliminado correctamente.',
              confirmButtonColor: '#3085d6'
            });
            this.listarHorasLegales(); // Actualiza la tabla automáticamente
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el tipo de hora legal.',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }

  get codHoraLegal() {
    const control = this.horaLegalForm.get('codigoHoraExtra');
    return control?.invalid && control?.touched;
  }

  get descripcionInvalid() {
    const control = this.horaLegalForm.get('descripcion');
    return control?.invalid && control?.touched;
  }

  get horaInicioInvalid() {
    const control = this.horaLegalForm.get('horaInicio');
    return control?.invalid && control?.touched;
  }

  get horaFinInvalid() {
    const control = this.horaLegalForm.get('horaFin');
    return control?.invalid && control?.touched;
  }

  async obtenerListaMaestroLegal() {
    try {
      this.maestroHoraLegalService.ListarHorasLegal().subscribe((response: any) => {
       this.maestroLista=response ?? [];
        console.log("data de maesrtro legal",this.maestroLista); 
      });
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  }

}

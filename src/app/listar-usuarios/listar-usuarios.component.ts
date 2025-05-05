import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { listarUsuarioService } from './services/listarUsuario.service';

interface Rol {
  idRol: number;
  nombre: string;
}

interface Usuario {
  id: number;
  fullname: string;
  cedula: number;
  estado: boolean;
  rol: Rol;
  cambiosPendientes?: boolean;
  cambiosEstado?: boolean;
  cambiosRol?: boolean;
}

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  usuariosOriginales: Record<number, Usuario> = {};
  mostrarContrasena: boolean = false;
  
  mostrarPopup = false;
  usuarioSeleccionado: Usuario | null = null;
  nuevaContrasena: string = '';
  //confirmasContrasena: string = '';

  constructor(
    private listarUsuarioService: listarUsuarioService,
  ) {}

  abrirPopup(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.mostrarPopup = true;
    this.nuevaContrasena = '';
    //this.confirmasContrasena = '';
  }

  cerrarPopup() {
    this.mostrarPopup = false;
    this.nuevaContrasena = '';
    //this.confirmasContrasena = '';
    this.usuarioSeleccionado = null;
  }

  ngOnInit(): void {
    this.obtenerRoles().then(() => {
      this.obtenerUsuarios();
    });
  }

  asignarContrasena() {
    if (!this.usuarioSeleccionado) {
      Swal.fire('Error', 'No hay usuario seleccionado', 'error');
      return;
    }
    if (!this.nuevaContrasena.trim()) {
      Swal.fire('Error', 'La contraseña no puede estar vacía', 'error');
      return;
    }
    this.listarUsuarioService.asignarContrasena(this.usuarioSeleccionado.cedula, this.nuevaContrasena).subscribe({
      next: () => {
        Swal.fire(
          'Actualizado',
          `La contraseña del usuario ${this.usuarioSeleccionado!.fullname} ha sido actualizada`,
          'success'
        );
        this.cerrarPopup();
      },
      error: (error) => {
        console.error('Error al cambiar la contraseña:', error);
        Swal.fire(
          'Error',
          'No se pudo actualizar la contraseña. Inténtalo de nuevo más tarde.',
          'error'
        );
      }
    });
  }

  async obtenerRoles() {
    try {
      this.listarUsuarioService.obtenerRoles().subscribe((response: any) => {
       // this.roles = response.data;
        this.roles=response ?? [];
        //this.usuarios = response ?? [];
      });
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  }

  async obtenerUsuarios() {
    try {
      this.listarUsuarioService.obtenerUsuarios().subscribe((response: any) => {
        console.log('Respuesta de obtenerUsuarios:', response); // <-- Agrega esto temporalmente
        // Ajusta según la estructura real de la respuesta:
       // this.usuarios = response.data ?? response ?? [];
      this.usuarios = response ?? []; //array
      // this.usuarios = response.data ?? []; //
        this.usuarios.forEach(usuario => {
          if (usuario.rol && usuario.rol.idRol) {
            const matchedRole = this.roles.find(role => role.idRol === usuario.rol.idRol);
            if (matchedRole) {
              usuario.rol = matchedRole;
            }
          }
          // Guardar copia del estado original
          this.usuariosOriginales[usuario.id] = {
            ...usuario,
            rol: { ...usuario.rol }
          };
          usuario.cambiosPendientes = false;
          usuario.cambiosEstado = false;
          usuario.cambiosRol = false;
        });
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  }

  detectarCambiosEstado(usuario: Usuario) {
    const original = this.usuariosOriginales[usuario.id];
    usuario.cambiosEstado = usuario.estado !== original.estado;
    this.actualizarEstadoCambiosPendientes(usuario);
  }

  detectarCambiosRol(usuario: Usuario) {
    const original = this.usuariosOriginales[usuario.id];
    usuario.cambiosRol = usuario.rol.idRol !== original.rol.idRol;
    this.actualizarEstadoCambiosPendientes(usuario);
  }

  actualizarEstadoCambiosPendientes(usuario: Usuario) {
    usuario.cambiosPendientes = usuario.cambiosEstado || usuario.cambiosRol;
  }

  async actualizarUsuario(usuario: Usuario) {
    if (!usuario.cambiosPendientes) {
      return;
    }

    try {
      const datosActualizados = {
        id: Number(usuario.id),
        estado: usuario.estado,
        rol: Number(usuario.rol.idRol),
      };

      console.log(datosActualizados);
      this.listarUsuarioService.actualizarUsuario(datosActualizados).subscribe({
        next: () => {
          this.usuariosOriginales[usuario.id] = {
            ...usuario,
            rol: { ...usuario.rol }
          };

          usuario.cambiosPendientes = false;
          usuario.cambiosEstado = false;
          usuario.cambiosRol = false;

          Swal.fire(
            '¡Actualizado!',
            `El usuario ${usuario.fullname} ha sido actualizado correctamente.`,
            'success'
          );
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          Swal.fire(
            'Error',
            'No se pudo actualizar el usuario. Inténtalo de nuevo más tarde.',
            'error'
          );
        }
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Swal.fire(
        'Error',
        'No se pudo actualizar el usuario. Inténtalo de nuevo más tarde.',
        'error'
      );
    }
  }
}
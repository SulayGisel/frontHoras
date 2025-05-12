import { CreateUsuarioTurnoDto, RegistroTurnoComponent, UsuarioTurno } from './../registro-turno.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Ingeniero } from '../registro-turno.component';
import { catchError, throwError, Observable } from 'rxjs';

// Add interface for the response
interface TurnoResponse {
  message: string;
  data?: any;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroTurnoService {

  constructor(  private http:HttpClient) { }

  getAllTurno(){
    return this.http.post(`${environment.url}turno/codigo`,{})
  }

  getAllUsuarios(){
   /// return this.http.post(`${environment.url}user/fullname`,{})
   return this.http.post<Ingeniero[]>(`${environment.url}user/fullname`, {});

  }

  crearUsuarioTurno(dto: CreateUsuarioTurnoDto): Observable<TurnoResponse> {
    return this.http.post<TurnoResponse>(`${environment.url}usuario-turno`, dto)
      .pipe(
        catchError(error => {
          // Handle specific error cases
          if (error.error && error.error.message) {
            return throwError(() => error.error);
          }
          // Handle unexpected errors
          return throwError(() => ({
            message: 'Error inesperado al crear el turno',
            error: error.message
          }));
        })
      );
  }

  getAllUsuariosTurno() {
    return this.http.get<UsuarioTurno[]>(`${environment.url}usuario-turno`);
  }

  deleteUsuarioTurno(id: number) {
    return this.http.delete(`${environment.url}usuario-turno/${id}`);
  }

/*
updateUsuarioTurno(id: number, dto: CreateUsuarioTurnoDto) {
  return this.http.patch(`${environment.url}usuario-turno/${id}`, dto);
}*/

// Asegúrate de que el método updateUsuarioTurno esté configurado para manejar errores HTTP
updateUsuarioTurno(id: number,dto: CreateUsuarioTurnoDto) {
  return this.http.patch<any>(`${environment.url}usuario-turno/${id}`, dto)
    .pipe(
      catchError(error => {
        console.error('Error al actualizar turno:', error);
        // Reenviamos el error para que lo maneje el componente
        return throwError(() => error);
      })
    );
}

getAllTurnos() {
  return this.http.get<any[]>(`${environment.url}turno`);
}

// En registro-Turno.service.ts
verificarSuperposicionTurno(usuarioFK: number, fechaInicio: Date, fechaFin: Date): Observable<any> {
  return this.http.post<any>(`${environment.url}usuario-turno/verificar-superposicion`, {
    usuarioFK,
    fechaInicio,
    fechaFin
  });
}

eliminarMultiplesTurnos(ids: number[]) {
  return this.http.post<any>(`${environment.url}usuario-turno/delete-multiple`, { ids })
    .pipe(
      catchError(error => {
        console.error('Error al eliminar turnos:', error);
        return throwError(() => ({
          message: error.error?.message || 'Error al eliminar los turnos seleccionados',
          error: error
        }));
      })
    );
}
}


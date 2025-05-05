import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaestroTurnoService {

  constructor(  private http:HttpClient) { }


  // Nuevo método para obtener todos los turnos (sin DTO especial)
  getAllTurnos() {
    return this.http.get<any[]>(`${environment.url}turno`);
  }

  crearTurno(turnoData: any) {
    return this.http.post(`${environment.url}turno`, turnoData);
  }

  actualizarTurno(id: number, turnoData: any) {
    return this.http.put(`${environment.url}turno/${id}`, turnoData);
  }

  eliminarTurno(id: number) {
    return this.http.delete(`${environment.url}turno/${id}`);
  }

}
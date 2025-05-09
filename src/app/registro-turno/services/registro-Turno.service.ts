import { CreateUsuarioTurnoDto, RegistroTurnoComponent, UsuarioTurno } from './../registro-turno.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Ingeniero } from '../registro-turno.component';

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


   crearUsuarioTurno(dto: CreateUsuarioTurnoDto) {
    return this.http.post(`${environment.url}usuario-turno`, dto);
  }

  getAllUsuariosTurno(){
    /// return this.http.post(`${environment.url}user/fullname`,{})
   // return this.http.get(`${environment.url}usuario-turno`, {});
    return this.http.get<UsuarioTurno[]>(`${environment.url}usuario-turno`); 
   }
 
// usuario-turno.service.ts
deleteUsuarioTurno(id: number) {
  return this.http.delete(`${environment.url}usuario-turno/${id}`);
}

updateUsuarioTurno(id: number, dto: CreateUsuarioTurnoDto) {
  return this.http.patch(`${environment.url}usuario-turno/${id}`, dto);
}

getAllTurnos() {
  return this.http.get<any[]>(`${environment.url}turno`);
}


}
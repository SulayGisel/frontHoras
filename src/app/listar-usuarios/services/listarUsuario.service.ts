import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class listarUsuarioService {

  constructor(  private http:HttpClient) { }

  obtenerUsuarios() {
    return this.http.get<any>(`${environment.url}user`);
  }
  
  actualizarUsuario(datosActualizados: any) {
    return this.http.put(`${environment.url}user`, datosActualizados);
  }
  
  obtenerRoles() {
    return this.http.get<any>(`${environment.url}rol`);
  }

  asignarContrasena(cedula: number, newPassword: string) {
    return this.http.post(`${environment.url}user/update-password-admin`, {
      cedula,
      newPassword
    });
  }
  
}
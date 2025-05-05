import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaestroHoraExtraLegalService {

  constructor(  private http:HttpClient) { }

  crearMaestroHoraLegal(data: any) {
    return this.http.post(`${environment.url}tipo-horas-extras`, data);
  }

  ListarHorasLegal() {
    return this.http.get(`${environment.url}tipo-horas-extras`);
  }

  actualizarMaestroHoraLegal(id: number, data: any) {
    return this.http.patch(`${environment.url}tipo-horas-extras/${id}`, data);
  }

  deleteMaestroHoraLegal(id: number) {
    return this.http.delete(`${environment.url}tipo-horas-extras/${id}`);
  }

}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class lregistroHoraService {

  constructor(private http: HttpClient) { }

  crearHoraExtra(data: any) {
    return this.http.post(`${environment.url}/horas-extras`, data);
  }
  
}
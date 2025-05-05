import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecuperarPasswordService {

  constructor(  private http:HttpClient) { }

  getByCedula(cedula:string){
    return this.http.get(`${environment.url}user/security-question/cedula=${cedula}`)
  }
}

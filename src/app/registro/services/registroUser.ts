import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroUserService {
  constructor(private http: HttpClient) { }

  getPreguntas() {
    return this.http.get(`${environment.url}preguntas`);
  }

  registerUser(userData: any) {
    return this.http.post(`${environment.url}user`, userData);
  }
}

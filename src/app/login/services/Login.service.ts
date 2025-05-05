
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(  private http:HttpClient) { }

  auth(login:any){
    return this.http.post(`${environment.url}auth/login`,login).pipe(tap(data=>{
        this.saveAccessToken(data)
    }))
  }

  async saveAccessToken(data:any){
    localStorage.setItem('users', JSON.stringify(data.user ?? {})); 
    localStorage.setItem('access_token', data?.access_token ?? '');  
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

   getAccessToken() {
    return {
      access_token: localStorage.getItem('access_token')
    };
  }
}
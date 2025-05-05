import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  private axiosClient: AxiosInstance;
  constructor() {
//No te dar ni pena usa axios en angular gas llave 
    // Tu porque esta usado axios ?
// que tiene usar asiops? entonces que tengo que usar7
// No me presta antecion cuando uno te dice las cosa 
// Porque estausado axios ?
//que tiene de malo usar axios? 
// Explca



    this.axiosClient = axios.create({
      baseURL: 'http://localhost:3000/api/v1', // Reemplaza con la URL base de tu API
  //baseURL: 'https://backend-horas-production-4a76.up.railway.app/api/v1', // Reemplaza con la URL base de tu API

      //'https://backend-horas-production-4a76.up.railway.app/api/v1',
      timeout: 10000, // Tiempo de espera en milisegundos
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Interceptor para manejar tokens de autenticación
    this.axiosClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        /*if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }*/
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(url: string, config = {}): Promise<{ data: T }> {
    return this.axiosClient.get<T>(url, config);
  }

  public async post(url: string, data: any, config = {}) {
    return this.axiosClient.post(url, data, config);
  }

  public async put(url: string, data: any, config = {}) {
    return this.axiosClient.put(url, data, config);
  }

  public async delete(url: string, config = {}) {
    return this.axiosClient.delete(url, config);
  }
}
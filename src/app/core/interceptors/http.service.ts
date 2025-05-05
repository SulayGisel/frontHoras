import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, defer } from 'rxjs';
import { catchError, finalize, switchMap, tap, map } from 'rxjs/operators';
import { LoginService } from '../../login/services/Login.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private router : Router,

                private loginService: LoginService) {
     
    
       }
      intercept(req: HttpRequest<any>, next: HttpHandler):  Observable<HttpEvent<any>> {

        const headers = new HttpHeaders(
          {
            Authorization: 'Bearer ' + (  this.loginService.getAccessToken()?.access_token ?? ''),          })
        const reqClor = req.clone({
          headers
        })
     
        return next.handle(reqClor).pipe(catchError((error: HttpErrorResponse) => {
         
          if(error.status === 401){
    
              if((  this.loginService.getAccessToken()?.access_token ?? '')!=null){
  
                localStorage.clear();
                this.router.navigateByUrl("/login");
    
    
              }
    
              if(error.error.deshabilita == "deshabilita"){
    
              }
            if(error.error.deshabilita != "deshabilita"){
          
            }
    
    
          }
          if(error.status === 406){
            localStorage.clear();
            this.router.navigateByUrl("/login");
          }
          if(error.status === 403){
    
        
          }
          if(error.status === 404){
    
            this.router.navigateByUrl("**");
          }
          if(error.status === 409){
         
          }
          if(error.status === 410){
    
            this.router.navigateByUrl("/login");
          }
    
          if(error.status === 422){
    
            }
    
    
          if(error.status == 500 || error.status == 0 ||  error.status >= 500 ){
            if( error.status >= 500){
          
            }
       
    
            }
    
    
          return throwError (error);
          }))
    
      }
   
    }
    
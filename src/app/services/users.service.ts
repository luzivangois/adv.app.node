import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
 providedIn: 'root'
})
export class UsersService {

   private apiUrl = environment.apiUrl + "/auth"; 

 constructor(private http: HttpClient) { }

getToken(): string {   
   return sessionStorage.getItem('auth-token') as string;
}

getAllUsers(): Observable<any> {
   const token = this.getCookie("auth-token"); // Função para pegar o token do cookie
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.get(`${this.apiUrl}/allusers`, { headers });
}

getUsuarioById(idUsuario: string): Observable<any> {
   const headers = new HttpHeaders().set('Authorization', this.getToken());
   return this.http.get(`${this.apiUrl}/userid/${idUsuario}`, { headers });
}

// deleteUsuarioById(idUsuario: string): Observable<any> {
//    const headers = new HttpHeaders().set('Authorization', this.getToken());
//    return this.http.delete(`${this.apiUrl}/deluser/${idUsuario}`, { headers });
// }

deleteUsuarioById(idUsuario: string): Observable<any> {
   const token = this.getCookie("auth-token"); // Função para pegar o token do cookie
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.delete(`${this.apiUrl}/deluser/${idUsuario}`, { headers });
 }

updatePass(id: string, password: string): Observable<any> {
   const headers = new HttpHeaders().set('Authorization', this.getToken());
   const body = password
   return this.http.put(`${this.apiUrl}/updatepass/${id}`, body, { headers });
   }

getCookie(name: string): string | null {
   const value = `; ${document.cookie}`;
   const parts = value.split(`; ${name}=`);
   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
   return null;
   }
}
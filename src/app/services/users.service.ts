import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
 providedIn: 'root'
})
export class UsersService {

   private apiUrl = environment.apiUrl + "/api"; 

 constructor(private http: HttpClient) { }
 

getAllUsers(): Observable<any> {
   const token = this.getCookie("auth-token");
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.get(`${this.apiUrl}/allusers`, { headers });
}

getUsuarioById(idUsuario: string): Observable<any> {
   const token = this.getCookie("auth-token");
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.get(`${this.apiUrl}/userid/${idUsuario}`, { headers });
}

deleteUsuarioById(idUsuario: string): Observable<any> {
   const token = this.getCookie("auth-token");
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.delete(`${this.apiUrl}/deluser/${idUsuario}`, { headers });
 }

updatePass(id: string, password: string): Observable<any> {
   const token = this.getCookie("auth-token");
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   const body = { password: password }
   return this.http.put(`${this.apiUrl}/updatepass/${id}`, body, { headers });
   }

getCookie(name: string): string | null {
   const value = `; ${document.cookie}`;
   const parts = value.split(`; ${name}=`);
   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
   return null;
   }
}
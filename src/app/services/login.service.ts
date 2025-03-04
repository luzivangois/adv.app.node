import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl + "/auth";

  constructor(private httpClient: HttpClient) { }  

  login(login: string, password: string) {
  return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { login, password }).pipe(
    tap((value) => {
      document.cookie = `auth-token=${value.token}; path=/;`;      
      sessionStorage.setItem("username", value.login);
    })
  );
}

  signup(name: string, login: string, password: string, role: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, login, password, role }).pipe(
      tap((value) => {
        //sessionStorage.setItem("auth-token", value.token)
        sessionStorage.setItem("username", value.login)
      })
    )
  }
}
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
 selector: 'app-fileupload',
 standalone: true,
 imports: [HttpClientModule,
          CommonModule,
          FormsModule,
          AsyncPipe],
 templateUrl: './fileupload.component.html',
 styleUrls: ['./fileupload.component.scss']
})
export class FileUploadComponent {
 fileName: string = '';
 selectedFile!: File;

 private apiUrl = environment.apiUrl + "/archive/sendfile"; 

 constructor(private http: HttpClient, private router: Router, private toastService: ToastrService) {}

 onFileSelected(event: Event) {
  const fileList = (event.target as HTMLInputElement).files;
  if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
  }
}


onUpload() {
  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('name', this.fileName);

  const token = this.getCookie("auth-token");

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post(this.apiUrl, formData, { headers, observe: 'response' })
  .subscribe({
    next: () => {
    this.toastService.success("Arquivo salvo com Sucesso!");
  },
    error: (error: HttpErrorResponse) => {
      if (error.status === 400) {
        this.toastService.error("Extensão Inválida!");
      } else if (error.status === 401) {
        this.toastService.error("Erro! Usuário não autenticado.");
      } else if (error.status === 409) {
        this.toastService.error("Arquivo já existe no servidor!");
      } else {
        this.toastService.error("Erro inesperado! Tente novamente mais tarde.");
      }
    }
  });
}

backFilePanel() {
  this.router.navigate(["files-panel"])
}

getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
  }
}
import { Component, OnInit } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { MoldalContentFileComponent } from '../modal-content-file/modal-content-file.component';
import { environment } from '../../../environments/environment';

interface FileNameForm {
  filename: FormControl
}

@Component({
 selector: 'app-read-file',
 standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    UsersService
  ],
 templateUrl: './read-file.component.html',
 styleUrls: ['./read-file.component.scss']
})
export class ReadFileComponent {

  fileNameForm: FormGroup<FileNameForm>;
  content = '';

 private apiUrl = environment.apiUrl + "/archive/name"; 

constructor(
  private router: Router,
  private toastService: ToastrService,
  public dialog: MatDialog,
  private http: HttpClient
){
  this.fileNameForm = new FormGroup({
    filename: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
}

 submit(){
  const token = this.getCookie("auth-token");
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const params = new HttpParams().set('name', this.fileNameForm.value.filename)
  
  this.http.get(this.apiUrl, { params: params, headers, responseType: 'text' })
  .subscribe({
    next: (content) => {
      this.toastService.success("Arquivo localizado. O conteúdo será exibido.")
      this.dialog.open(MoldalContentFileComponent, {
      width: 'auto',
      minHeight: '200',
      data: {content: content}
      })
    },
    error: (err) => {
      if (err.status === 403) {
        this.toastService.error("Usuário não autenticado ou sem permissão para executar essa ação.")
      } else if (err.status === 404) {
        this.toastService.error("Arquivo não encontrado! Verifique o nome digitado e tente novamente.")
      } else {
        this.toastService.error("Erro Desconhecido. Tente novamente.")
      }
    }
  })    
}

backFilesPanel(){
  this.router.navigate(["files-panel"])
}

getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
  }
}
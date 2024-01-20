import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public messageService:MessageService
  ) { }

  handleError(message:string){
    this.messageService.add({
        key:'tst',
        severity:'error',
        summary:'Error Message',
        detail:message,
        life:4000
    });
  }

  handleSuccess(){
    this.messageService.add({
        key:'tst',
        severity:'info',
        summary:'Confirmado',
        detail:'Información registrada o actualizada',
        life:4000
    });
  }
}

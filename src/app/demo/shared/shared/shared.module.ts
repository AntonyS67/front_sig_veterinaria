import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports:[
    TableModule,
    PaginatorModule,
    PanelModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    TooltipModule
  ],
  providers:[
    MessageService
  ]
})
export class SharedModule { }

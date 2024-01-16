import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports:[
    TableModule,
    PaginatorModule
  ]
})
export class SharedModule { }

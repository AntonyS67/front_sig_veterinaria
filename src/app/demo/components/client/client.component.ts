
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Client } from '../../api/client';
import { DOCUMENT_TYPE, ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { ClientService } from '../../service/client.service';
import { CommonService } from '../../service/common.service';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  providers:[CommonService]
})
export class ClientComponent implements OnInit{
    req={
        index:0,
        limit:ROWS_DEFAULT
    }

    totalRecords:number = ROWS_DEFAULT
    rowsOptions:number[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo cliente'
    lstClients:Client[]
    loading:boolean = false
    isDialog:boolean = false
    client!:Client
    formClient:FormGroup
    submitted:boolean = false
    loadingSave:boolean = false

    file!:File
    documents:any[] = DOCUMENT_TYPE

    constructor(
        private clientService:ClientService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formClient = this.fb.group({
            names:['',[Validators.required]],
            lastnames:['',[Validators.required]],
            document_number:['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
            document_type:['',[Validators.required,Validators.minLength(1),Validators.maxLength(1)]],
            phone:[''],
            address:[''],
            city:[''],
            email:[''],
            photo:['']
        })
    }

    ngOnInit(): void {
        this.getClients(this.req)
    }

    getClients(request:any){
        try {
            this.clientService.List(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstClients = res.data
                    this.loading = false
                    this.totalRecords = res.total
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    newClient(){
        this.isDialog = true
        this.client = {}
        this.submitted = false
    }

    onFileChange(event:any){
        this.file = event.target.files[0]
    }
    changePage(event:any){
        this.req.index = event.first
        this.req.limit = event.rows
        this.first = event.first
    }

    hideDialog(){
        this.isDialog = false
        this.submitted = false
        this.loadingSave = false
    }

    save(item:Client){
        this.submitted = true
        let value = this.formClient.value

        for(let c in this.formClient.controls){
            this.formClient.controls[c].markAsTouched()
        }

        if(this.formClient.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                names:value.names,
                lastnames:value.lastnames,
                document_number:value.document_number,
                document_type:value.document_type,
                phone:value.phone,
                address:value.address,
                city:value.city,
                email:value.email,
                photo:this.file
            }
            this.clientService.Save(req).then((res:any) => {
                this.loadingSave = false
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    this.getClients(this.req)
                }else{
                    this.commonService.handleError(res.messageException)
                }
            })
            this.file = undefined
            this.hideDialog()
        }
    }


    editClient(item:Client){
        this.isDialog = true
        this.client = item
        this.titleForm = 'Editar cliente'
        this.submitted = false
    }

    deleteClient(event:Event,item:Client){
        this.confirmationService.confirm({
            key:'deleteClient'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.clientService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleSuccess()
                        this.getClients(this.req)
                    }else{
                        this.commonService.handleError(res.messageException)
                    }
                })
            }
        })
    }
}

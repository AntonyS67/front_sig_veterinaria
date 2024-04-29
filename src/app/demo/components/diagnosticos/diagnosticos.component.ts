import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { CommonService } from '../../service/common.service';
import { DiagnosticoService } from '../../service/diagnostico.service';
import { SharedModule } from '../../shared/shared/shared.module';
import { Diagnostico } from './../../api/diagnostico';

@Component({
  selector: 'app-diagnosticos',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './diagnosticos.component.html',
  styleUrl: './diagnosticos.component.scss',
  providers:[CommonService]
})
export class DiagnosticosComponent implements OnInit{
    private route = inject(ActivatedRoute)
    id:string = this.route.snapshot.paramMap.get("id")

    req={
        index:0,
        limit:ROWS_DEFAULT,
        consult_id:this.id
    }

    lstData: Diagnostico[]
    loading:boolean = false
    totalRecords:number = ROWS_DEFAULT
    rowsOptions:number[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo diagnostico'
    isDialog:boolean = false
    loadingSave:boolean = false
    submitted:boolean = false

    diagnostico!:Diagnostico;
    formDiagnostico:FormGroup

    constructor(
        private diagnosticoService:DiagnosticoService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formDiagnostico = this.fb.group({
            detalle:['',Validators.required],
            fecha_diagnostico:['']
        })
    }
    ngOnInit(): void {
        this.getDiagnosticos(this.req)
    }

    getDiagnosticos(request:any){
        try {
            this.diagnosticoService.List(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstData = res.data
                    this.loading = false
                    this.totalRecords = res.total
                }
            })
        } catch (error) {
            console.log(error);

        }
    }

    new(){
        this.isDialog = true
        this.submitted = false
        this.diagnostico = {}
    }

    save(item:Diagnostico){
        this.submitted = true
        let value = this.formDiagnostico.value

        for(let c in this.formDiagnostico.controls){
            this.formDiagnostico.controls[c].markAsTouched()
        }

        if(this.formDiagnostico.valid){
            this.loadingSave = true

            const req = {
                id:item.id ? item.id : 0,
                detalle:value.detalle,
                fecha_diagnostico:new Date(value.fecha_diagnostico).toISOString(),
                consult_id:this.id
            }

            this.diagnosticoService.Save(req).then((res:any) =>{
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    this.getDiagnosticos(this.req)
                }else{
                    this.commonService.handleError(res.messageException)
                }
            })

            this.hideDialog()
        }
    }

    edit(item:Diagnostico){
        this.isDialog = true
        this.submitted = false
        this.diagnostico = item;
    }


    delete(event:Event,item:Diagnostico){
        this.confirmationService.confirm({
            key:'deleteDiagnostico'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.diagnosticoService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleSuccess()
                        this.getDiagnosticos(this.req)
                    }else{
                        this.commonService.handleError(res.messageException)
                    }
                })
            }
        })
    }

    hideDialog(){
        this.isDialog = false
        this.submitted = false
        this.loadingSave = false
    }

    changePage(event:any){
        this.req.index = event.first
        this.req.limit = event.rows
        this.first = event.first
    }
}

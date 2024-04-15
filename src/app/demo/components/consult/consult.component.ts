import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { Consult } from '../../api/consult';
import { CommonService } from '../../service/common.service';
import { ConsultService } from '../../service/consult.service';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-consult',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.scss',
  providers:[CommonService]
})
export class ConsultComponent implements OnInit{
    private route = inject(ActivatedRoute)
    id:string = this.route.snapshot.paramMap.get("id")

    req={
        index:0,
        limit:ROWS_DEFAULT,
        patient_id:this.id
    }

    lstData:Consult[]
    loading:boolean = false
    totalRecords:number = ROWS_DEFAULT
    rowsOptions:number[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nueva consulta'
    isDialog:boolean = false
    loadingSave:boolean = false
    submitted:boolean = false

    consult!:Consult;
    formConsult:FormGroup

    constructor(
        private consultService:ConsultService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formConsult = this.fb.group({
            reason:[''],
            antecedents:[''],
            diseases:[''],
            next_consult:['']
        })

    }

    ngOnInit(): void {
        this.getConsults(this.req)
    }

    getConsults(request:any){
        try {
            this.consultService.List(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstData = res.data
                    this.loading = false
                    this.totalRecords = res.total
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    new(){
        this.isDialog = true
        this.submitted = false
        this.consult = {}
    }

    save(item:Consult){
        this.submitted = true
        let value = this.formConsult.value

        for(let c in this.formConsult.controls){
            this.formConsult.controls[c].markAsTouched()
        }

        if(this.formConsult.valid){
            this.loadingSave = true

            const req = {
                id:item.id ? item.id : 0,
                reason:value.reason,
                antecedents:value.antecedents,
                diseases:value.diseases,
                next_consult:new Date(value.next_consult).toISOString(),
                patient_id:this.id
            }

            this.consultService.Save(req).then((res:any) =>{
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    this.getConsults(this.req)
                }else{
                    this.commonService.handleError(res.messageException)
                }
            })

            this.hideDialog()
        }
    }

    edit(item:Consult){
        this.isDialog = true
        this.submitted = false
        this.consult = item
        this.titleForm = 'Editar consulta'
    }

    delete(event:Event,item:Consult){
        this.confirmationService.confirm({
            key:'deleteConsult'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.consultService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleSuccess()
                        this.getConsults(this.req)
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

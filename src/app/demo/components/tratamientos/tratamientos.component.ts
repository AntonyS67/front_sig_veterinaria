import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { Tratamiento } from '../../api/tratamiento';
import { CommonService } from '../../service/common.service';
import { TratamientoService } from '../../service/tratamiento.service';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [SharedModule,RouterModule],
  templateUrl: './tratamientos.component.html',
  styleUrl: './tratamientos.component.scss',
  providers:[CommonService]
})
export class TratamientosComponent implements OnInit{
    private route = inject(ActivatedRoute)
    id:string = this.route.snapshot.paramMap.get("id") //id diagnostico

    req = {
        index:0,
        limit:ROWS_DEFAULT,
        diagnostico_id:this.id
    }

    lstData:Tratamiento[]
    loading:boolean = false
    totalRecords:number = ROWS_DEFAULT
    rowsOptions:number[] = ROWS_OPTIONS
    first:number = 0

    constructor(
        private tratamientService:TratamientoService,
        private router:Router,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){}

    ngOnInit(): void {
        this.getAll(this.req)
    }

    getAll(request){
        try {
            this.tratamientService.List(request).then((res:any) => {
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
    edit(item:Tratamiento){
        this.router.navigate(["/diagnostico",this.id,"tratamientos",item.id,"edit"])
    }
    delete(event:Event,item:Tratamiento){
        this.confirmationService.confirm({
            key:'deleteTratamiento'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.tratamientService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleSuccess()
                        this.getAll(this.req)
                    }else{
                        this.commonService.handleError(res.messageException)
                    }
                })
            }
        })
    }
    changePage(event:any){
        this.req.index = event.first
        this.req.limit = event.rows
        this.first = event.first
    }
}

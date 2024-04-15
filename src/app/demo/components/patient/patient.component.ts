import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Breed } from '../../api/breed';
import { Patient } from '../../api/patient';
import { BreedService } from '../../service/breed.service';
import { CommonService } from '../../service/common.service';
import { PatientService } from '../../service/patient.service';
import { SharedModule } from '../../shared/shared/shared.module';
import { ROWS_ALL, ROWS_DEFAULT, ROWS_OPTIONS } from './../../api/config';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [SharedModule,RouterModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
  providers:[CommonService]
})
export class PatientComponent implements OnInit{
    private route = inject(ActivatedRoute)
    id:string = this.route.snapshot.paramMap.get("id")

    req={
        index:0,
        limit:ROWS_DEFAULT,
        client_id:this.id
    }
    reqBreeds={
        index:0,
        limit:ROWS_ALL
    }
    lstData:Patient[]
    lstBreeds:Breed[]
    loading:boolean = false
    totalRecords:number = ROWS_DEFAULT
    rowsOptions:number[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo paciente'
    isDialog:boolean = false
    loadingSave:boolean = false
    submitted:boolean = false

    patient!:Patient
    formPatient:FormGroup
    file!:File

    sexData = [{
        value:'M',
        label:'Macho'
    },{
        value:'H',
        label:'Hembra'
    }]
    constructor(
        private patientService:PatientService,
        private breedService:BreedService,
        private commonService:CommonService,
        private fb:FormBuilder,
        @Inject(LOCALE_ID) public locale:string,
        private conformationService:ConfirmationService
    ){
        this.formPatient = this.fb.group({
            names:['',[Validators.required]],
            photo:[''],
            birthday:[''],
            age:[''],
            sex:['',[Validators.required]],
            color:[''],
            fur:[''],
            particularity:[''],
            allergy:[''],
            breed_id:['',[Validators.required]]
        })
    }
    ngOnInit(): void {
        this.getPatients(this.req)
        this.ListBreeds()
    }

    getPatients(request:any){
        try {
            this.patientService.List(request).then((res:any) => {
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

    ListBreeds(){
        try {
            this.breedService.getBreeds(this.reqBreeds).then((res:any) => {
                if(res.isSuccess){
                    this.lstBreeds = res.data.map(item => ({
                        value:item.id,
                        label:item.name
                    }))
                    this.loading = false
                }
            })
        } catch (error) {
            console.log(error);

        }
    }

    new(){
        this.isDialog = true
        this.submitted = false
        this.patient = {}
    }

    save(item:Patient){
        this.submitted = true
        let value = this.formPatient.value

        for(let c in this.formPatient.controls){
            this.formPatient.controls[c].markAsTouched()
        }

        if(this.formPatient.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                names:value.names,
                breed_id:value.breed_id,
                client_id:this.id,
                birthday:formatDate(value.birthday,'dd/MM/yyyy',this.locale),
                age:value.age,
                sex:value.sex,
                color:value.color,
                fur:value.fur,
                particularity:value.particularity,
                allergy:value.allergy,
                photo:this.file != undefined ? this.file : ""
            }

            this.patientService.Save(req).then((res:any) => {
                this.loadingSave = false
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    this.getPatients(this.req)
                }else{
                    this.commonService.handleError(res.messageException)
                }
            })
            this.file = undefined
            this.hileDialog()
        }
    }

    edit(item:Patient){
        this.isDialog = true
        this.submitted = false
        this.patient = item
        this.titleForm = 'Editar paciente'
    }

    delete(event:Event,item:Patient){
        this.conformationService.confirm({
            key:'deletePatient'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.patientService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleSuccess()
                        this.getPatients(this.req)
                    }else{
                        this.commonService.handleError(res.messageException)
                    }
                })
            }
        })
    }

    hileDialog(){
        this.isDialog = false
        this.submitted = false
        this.loadingSave = false
    }

    onFileChange(event:any){
        this.file = event.target.files[0]
    }

    changePage(event:any){
        this.req.index = event.first
        this.req.limit = event.rows
        this.first = event.first
    }
}

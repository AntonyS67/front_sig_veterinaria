import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Breed } from '../../api/breed';
import { Specie } from '../../api/specie';
import { BreedService } from '../../service/breed.service';
import { CommonService } from '../../service/common.service';
import { SpecieService } from '../../service/specie.service';
import { SharedModule } from '../../shared/shared/shared.module';
import { ROWS_ALL, ROWS_DEFAULT, ROWS_OPTIONS } from './../../api/config';

@Component({
  selector: 'app-breed',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './breed.component.html',
  styleUrl: './breed.component.scss',
  providers:[CommonService]
})
export class BreedComponent implements OnInit {

    req = {
        index:0,
        limit:ROWS_DEFAULT
    }

    reqSpecies = {
        index:0,
        limit:ROWS_ALL
    }

    lstBreeds:Breed[];
    lstSpecies:Specie[];
    loading:boolean = false;
    first:number=0;
    totalRecords:number = ROWS_DEFAULT;
    rowsOptions:any[] = ROWS_OPTIONS;

    titleForm:string = 'Nueva raza';
    loadingSave:boolean = false;
    isBreedDialog:boolean = false;
    submitted:boolean = false;

    breed!:Breed;

    formBreed:FormGroup;

    constructor(
        private breedService:BreedService,
        private specieService:SpecieService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formBreed = this.fb.group({
            name:['',[Validators.required]],
            specie_id:['',[Validators.required]]
        })
    }

    ngOnInit(): void {
        this.ListSpecies()
        this.List(this.req);
    }

    List(request:any){
        try {
            this.breedService.getBreeds(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstBreeds = res.data
                    this.loading = false
                    this.totalRecords = res.total
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    ListSpecies(){
        try {
            this.specieService.getSpecies(this.reqSpecies).then((res:any) => {
                console.log(res)
                if(res.isSuccess){
                    this.lstSpecies = res.data.map(item => ({
                        value:item.id,
                        label:item.name
                    }))
                    this.loading = false
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    newBreed(){
        this.isBreedDialog = true;
        this.submitted = false;
        this.breed = {}
    }

    save(item:Breed){
        this.submitted = true;
        let value = this.formBreed.value;

        for(let c in this.formBreed.controls){
            this.formBreed.controls[c].markAsTouched()
        }

        if(this.formBreed.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                name:value.name,
                specie_id:value.specie_id
            }
            this.breedService.saveBreed(req).then((res:any) => {
                this.loadingSave = false;
                if(!res.isSuccess){
                    this.commonService.handleError(res.messageException)
                }else{
                    this.commonService.handleSuccess()
                    this.List(this.req)
                }
            })
            this.hideDialog()
        }
    }

    hideDialog(){
        this.isBreedDialog = false;
        this.submitted = false;
        this.loadingSave = false;
    }

    editBreed(item:Breed){
        this.isBreedDialog = true;
        this.submitted = false;
        this.breed = item;
        this.titleForm = 'Editar raza';
    }
    changePage(event:any){
        this.req.index = event.first;
        this.req.limit = event.rows;
        this.first = event.first;
        // LISTAR
    }

    deleteBreed(event:Event,item:Breed){
        this.confirmationService.confirm({
            key:'deleteBreed'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.breedService.deleteBreed(item.id).then((res:any) => {
                    if(!res.isSuccess){
                        this.commonService.handleError(res.messageException)
                    }else{
                        this.commonService.handleSuccess()
                        this.List(this.req);
                    }
                })
            }
        })
    }
}

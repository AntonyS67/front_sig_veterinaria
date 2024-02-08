import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { User } from '../../api/user';
import { CommonService } from '../../service/common.service';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers:[CommonService]
})
export class UserComponent implements OnInit{

    req = {
        index:0,
        limit:ROWS_DEFAULT
    }

    lstUsers:any[];
    first:number = 0;
    totalRecords:number=ROWS_DEFAULT;
    loading:boolean = false;
    rowsOptions:any[] = ROWS_OPTIONS;

    isUserDialog:boolean = false;
    submitted:boolean = false;
    titleForm:string = 'Crear usuario';
    loadingSave:boolean = false;

    lstRoles = [
        {
            'id':1,
            'role':'Administrador'
        },
        {
            'id':0,
            'role':'Usuario'
        }
    ];

    formUser:FormGroup;

    user!:User;
    isEdit:boolean = false;

    constructor(public userService:UserService,public fb:FormBuilder,public commonService:CommonService,public confirmationService:ConfirmationService){
        this.formUser = fb.group({
            username:['',[Validators.required]],
            password:['',[Validators.required]],
            role_id:['',[Validators.required]]
        })
    }

    ngOnInit(): void {
        this.List(this.req);
    }

    List(request:any){
        try {
            this.userService.getUsers(request).then((res:any) => {
                if(res.isSuccess){
                    this.lstUsers = res.data;
                    this.loading = false;
                    this.totalRecords = res.total;
                }
            })
        } catch (error) {
            console.error(error);

        }
    }

    changePage(event:any){
        this.req.index = event.first;
        this.req.limit = event.rows;
        this.first = event.first;

        this.List(this.req);
    }

    hideDialog(){
        this.isUserDialog = false;
        this.submitted = false;
        this.loadingSave = false;
        this.isEdit = false;
    }
    newUser(){
        this.isUserDialog = true;
        this.submitted = false;
        this.isEdit = false;
        this.user = {};
        this.formUser = this.fb.group({
            username:['',[Validators.required]],
            password:['',[Validators.required]],
            role_id:['',[Validators.required]]
        })
    }

    saveUser(item:User){
        this.submitted = true;

        let value = this.formUser.value;

        for(let c in this.formUser.controls){
            this.formUser.controls[c].markAsTouched();
        }
        if(this.formUser.valid){
            this.loadingSave = true;
            const req = {
                id:item.id ? item.id : 0,
                username:value.username,
                password:value.password,
                role_id:value.role_id
            };
            this.userService.saveUser(req).then((res:any) => {

                this.loadingSave = false;
                if(!res.isSuccess){
                    this.commonService.handleError(res.messageException);
                }else{
                    this.commonService.handleSuccess()
                    this.isUserDialog = false;
                    this.List(this.req);
                }
            })
        }
    }

    editUser(item:User){
       this.titleForm = 'Editar Usuario';
       this.isUserDialog = true;
       this.user = item;
       this.isEdit = true;

       this.formUser = this.fb.group({
            username:['',[Validators.required]],
            password:[''],
            role_id:['',[Validators.required]]
        })
    }

    deleteUser(event:Event,item:User){
        this.confirmationService.confirm({
            key:'deleteUser'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.userService.deleteUser({id:item.id}).then((res:any) => {
                    if(!res.isSuccess){
                        this.commonService.handleError(res.messageException);
                    }else{
                        this.commonService.handleSuccess();
                        this.List(this.req);
                    }
                })

            }
        })
    }
}

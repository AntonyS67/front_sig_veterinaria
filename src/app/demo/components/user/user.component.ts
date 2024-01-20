import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
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

    constructor(public userService:UserService,fb:FormBuilder,public commonService:CommonService){
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
    }
    newUser(){
        this.isUserDialog = true;
        this.submitted = false;
    }

    saveUser(){
        this.submitted = true;

        let value = this.formUser.value;

        for(let c in this.formUser.controls){
            this.formUser.controls[c].markAsTouched();
        }
        if(this.formUser.valid){
            this.loadingSave = true;
            const req = {
                id:0,
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
}

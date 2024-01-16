import { Component, OnInit } from '@angular/core';
import { ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
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

    constructor(public userService:UserService){}

    ngOnInit(): void {
        this.List(this.req);
    }


    List(request:any){
        try {
            this.userService.getUsers(request).then((res:any) => {
                console.log(res);
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
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthResponse } from './../../../api/auth';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    username:string = '';
    password!: string;

    constructor(
        public layoutService: LayoutService,
        public authService:AuthService,
        public router:Router
    ) { }


    Login(){
        try {
            const data = {
                username:this.username,
                password:this.password
            }
            this.authService.login(data).then((res:AuthResponse) => {
                if(res.isSuccess){
                    localStorage.setItem('token_sigvet',res.token);
                    localStorage.setItem('user_vet',JSON.stringify({
                        'username':res.user.username,
                        'role_id':res.user.role_id
                    }));
                    this.router.navigate(["/"]);
                }
            })
        } catch (error) {
            console.log(error);

        }
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as sha512 from 'js-sha512';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,private http:HttpClient) { }

  isLogued():boolean{
    let token = localStorage.getItem('token_sigvet');
    if(token == null){
        return false;
    }
    return true;
  }

  logout():void{
    localStorage.removeItem('token_sigvet');
    localStorage.removeItem('user_vet');
    this.router.navigate(["/auth/login"])
  }

  login(data){
    return this.http.post(`${URL_API}/login`,{
        username:data.username,
        password:sha512.sha512(data.password).toString().toUpperCase()
    }).toPromise().then((res) => res);
  }
}

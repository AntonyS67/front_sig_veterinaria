import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http:HttpClient
  ) { }

  List(request:any){
    return this.http.post(URL_API+"/api/categories/list",request,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }

  Save(request:any){
    return this.http.post(URL_API+"/api/categories/create",request,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }

  Delete(id:number){
    return this.http.delete(URL_API+"/api/categories/delete?id="+id,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }
}

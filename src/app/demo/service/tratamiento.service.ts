import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  constructor(
    private http:HttpClient
  ) { }

  List(request:any){
    return this.http.post(URL_API+"/api/tratamientos/list",request,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }

  Create(request:any){
    return this.http.post(URL_API+"/api/tratamientos/create",request,
    {
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }

  Detail(request:any){
    return this.http.post(URL_API+"/api/tratamientos/detail",request,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }

  Delete(id:number){
    return this.http.delete(URL_API+"/api/tratamientos/delete?id="+id,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }
}

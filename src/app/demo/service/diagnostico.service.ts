import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  constructor(
    private http:HttpClient
  ) { }

  List(request:any){
    return this.http.post(URL_API+"/api/diagnosticos/list",request,{
        headers:{
            'Content-Type':'Application/json'
        }
    }).toPromise()
    .then(res => res)
  }

  Save(request:any){
    return this.http.post(URL_API+"/api/diagnosticos/create",request,{
        headers:{
            'Content-Type':'Application/json'
        }
    }).toPromise()
    .then(res => res)
  }
  Delete(id:number){
    return this.http.delete(URL_API+"/api/diagnosticos/delete?id="+id,{
        headers:{
            'Content-Type':'Application/json'
        }
    }).toPromise()
    .then(res => res)
  }
}

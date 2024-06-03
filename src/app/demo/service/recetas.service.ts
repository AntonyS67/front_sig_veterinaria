import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  constructor(
    private http:HttpClient
  ) { }

  List(request:any){
    return this.http.post(URL_API+"/api/recetas/list",request,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }
  Create(request:any){
    return this.http.post(URL_API+"/api/recetas/create",request,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }
  Delete(id:number){
    return this.http.delete(URL_API+"/api/recetas/delete?id="+id,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }
  GeneratePDF(id:number):Observable<Blob>{
    return this.http.post(URL_API+"/api/recetas/pdf",{id},{responseType:'blob'})
  }
}

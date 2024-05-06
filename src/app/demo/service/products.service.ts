import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../api/config';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http:HttpClient
  ) { }

  List(req:any){
    return this.http.post(URL_API+"/api/products/list",req,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }

  Save(req:any){

    let formData:FormData = new FormData()
    formData.append("id",req.id)
    formData.append("name",req.name)
    formData.append("cost",req.cost)
    formData.append("price",req.price)
    formData.append("stock",req.stock)
    formData.append("proveedor",req.proveedor)
    formData.append("status_product",req.status_product)
    formData.append("category_id",req.category_id)
    formData.append("photo",req.photo)

    return this.http.post(URL_API+"/api/products/create",formData).toPromise().then(res => res)

  }

  Delete(id:number){
    return this.http.delete(URL_API+"/api/products/delete?id="+id,{
        headers:{
            'Content-Type':'application/json'
        }
    }).toPromise()
    .then(res => res)
  }
}

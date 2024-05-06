import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Category } from '../../api/category';
import { ROWS_ALL, ROWS_DEFAULT, ROWS_OPTIONS } from '../../api/config';
import { Products } from '../../api/products';
import { CategoryService } from '../../service/category.service';
import { CommonService } from '../../service/common.service';
import { ProductsService } from '../../service/products.service';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers:[CommonService]
})
export class ProductComponent implements OnInit {
    lstData:Products[]
    lstCategories:Category[]
    loading:boolean = false;
    req = {
        index: 0,
        limit: ROWS_DEFAULT
    }

    reqCategories = {
        index:0,
        limit:ROWS_ALL
    }

    totalRecords:number = ROWS_DEFAULT
    rowsOptions:number[] = ROWS_OPTIONS
    first:number = 0
    titleForm:string = 'Nuevo producto'
    isDialog:boolean = false;
    formProduct:FormGroup;
    product!:Products
    submitted:boolean = false
    loadingSave:boolean = false
    file!:File

    constructor(
        private productsService:ProductsService,
        private categoryService:CategoryService,
        private fb:FormBuilder,
        private commonService:CommonService,
        private confirmationService:ConfirmationService
    ){
        this.formProduct = this.fb.group({
            name:['',[Validators.required]],
            cost:['',[Validators.required]],
            price:['',[Validators.required]],
            stock:['',[Validators.required]],
            proveedor:['',[Validators.required]],
            status_product:['',[Validators.required]],
            category_id:['',[Validators.required]],
            photo:['']
        })
    }

    ngOnInit(): void {
        this.getCategories()
        this.getProducts(this.req)
    }

    getProducts(request:any){
        try {
            this.productsService.List(request).then((res:any) => {
                if(res.isSuccess){
                    this.loading = false
                    this.lstData = res.data
                    this.totalRecords = res.total
                }
            })
        } catch (error) {
            console.log(error);

        }
    }

    getCategories(){
        this.categoryService.List(this.reqCategories).then((res:any) => {
            if(res.isSuccess){
                this.lstCategories = res.data.map(item => ({
                    value:item.id,
                    label:item.name
                }))
                this.loading = false
            }
        })
    }

    new(){
        this.isDialog = true
        this.submitted = false
        this.product = {}
    }

    onFileChange(event:any){
        this.file = event.target.files[0]
    }

    save(item:Products){
        this.submitted = false
        let value = this.formProduct.value

        for(let c in this.formProduct.controls){
            this.formProduct.controls[c].markAsTouched()
        }

        if(this.formProduct.valid){
            this.loadingSave = true
            const req = {
                id:item.id ? item.id : 0,
                name:value.name,
                cost:value.cost,
                price:value.price,
                stock:value.stock,
                proveedor:value.proveedor,
                status_product:value.status_product,
                category_id:value.category_id,
                photo:this.file != undefined ? this.file : ""
            }
            this.productsService.Save(req).then((res:any) => {
                this.loadingSave = false
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    this.getProducts(this.req)
                }else{
                    this.commonService.handleError(res.messageException)
                }
            })
            this.file = undefined
            this.hideDialog()
        }
    }

    edit(item:Products){
        this.product = item
        this.titleForm = 'Editar producto'
        this.isDialog = true
        this.submitted = false
    }

    delete(event:Event,item:Products){
        this.confirmationService.confirm({
            key:'deleteProduct'+item.id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el registro?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:() => {
                this.productsService.Delete(item.id).then((res:any) => {
                    if(res.isSuccess){
                        this.commonService.handleSuccess()
                        this.getProducts(this.req)
                    }else{
                        this.commonService.handleError(res.messageException)
                    }
                })
            }
        })
    }

    hideDialog(){
        this.isDialog = false
        this.submitted = false
        this.loadingSave = false
    }
    changePage(event:any){
        this.req.index = event.first
        this.req.limit = event.rows
        this.first = event.first
    }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ROWS_ALL, ROWS_DEFAULT } from 'src/app/demo/api/config';
import { Products } from 'src/app/demo/api/products';
import { CommonService } from 'src/app/demo/service/common.service';
import { ProductsService } from 'src/app/demo/service/products.service';
import { TratamientoService } from 'src/app/demo/service/tratamiento.service';
import { SharedModule } from 'src/app/demo/shared/shared/shared.module';

@Component({
  selector: 'app-create-tratamiento',
  standalone: true,
  imports: [SharedModule,RouterModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  providers:[CommonService]
})
export class CreateTratamientoComponent implements OnInit {
    private route = inject(ActivatedRoute)
    id:string=this.route.snapshot.paramMap.get("id") //diagnostico id
    tratamiento_id:string = this.route.snapshot.paramMap.get("tratamiento_id")
    reqProducts = {
        index:0,
        limit:ROWS_ALL
    }
    reqTratamiento = {
        index:0,
        limit:ROWS_DEFAULT,
        tratamiento_id:this.tratamiento_id
    }
    lstProductos:Products[]
    loading:boolean = false
    loadingSave:boolean = false
    selectedProducts = []
    submitted:boolean = false
    formProducts:FormGroup
    detalle:string

    constructor(
        private productsService:ProductsService,
        private fb:FormBuilder,
        private confirmationService:ConfirmationService,
        private tratamientoService:TratamientoService,
        private commonService:CommonService,
        private router:Router
    ){
        this.formProducts = this.fb.group({
            detalle:['',[Validators.required]],
            products:['']
        })
    }

    ngOnInit(): void {
        this.getProducts()
        if(this.tratamiento_id != undefined && this.tratamiento_id != "" && this.tratamiento_id != null){
            this.detailTratamiento()
        }
    }

    getProducts(){
        this.productsService.List(this.reqProducts).then((res:any) => {
            if(res.isSuccess){
                this.loading = false
                this.lstProductos = res.data.map(item => ({
                    product_id:item.id,
                    label:item.name,
                    tratamiento_id:0
                }))
            }
        })
    }

    detailTratamiento(){
        this.tratamientoService.Detail(this.reqTratamiento).then((res:any) => {
            if(res.res.isSuccess){
                this.loading = false
                this.detalle = res.res.item.detalle
            }
            if(res.products.isSuccess){
                this.selectedProducts = res.products.data.map(item => ({
                    label:item.name,
                    product_id:item.product_id
                }))
            }
        })
    }
    addProduct(){
        let value = this.formProducts.value

        for(let c in this.formProducts.controls){
            this.formProducts.controls[c].markAsTouched()
        }
        if(value.products != ""){
            let productSelected = value.products
            let products = this.lstProductos.find((item:any) => item.product_id == productSelected)
            let existProduct = this.selectedProducts.find((item:any) => item.product_id == productSelected)
            if(existProduct == undefined){
                this.selectedProducts.push(products)
            }
        }
    }

    save(){
        this.submitted = true
        let value = this.formProducts.value

        for(let c in this.formProducts.controls){
            this.formProducts.controls[c].markAsTouched()
        }
        if(this.formProducts.valid){
            this.loadingSave = false
            const req = {
                id:this.tratamiento_id != null ? this.tratamiento_id : 0,
                diagnostico_id:this.id,
                detalle:value.detalle,
                products:this.selectedProducts
            }
            this.tratamientoService.Create(req).then((res:any) => {
                if(res.isSuccess){
                    this.commonService.handleSuccess()
                    setTimeout(() => {
                        this.router.navigate(["diagnostico",this.id,"tratamientos"])
                    }, 2000);
                }
            })
        }
    }

    delete(event,item:any){
        this.confirmationService.confirm({
            key:'deleteCreateProductTratamiento'+item.product_id,
            target:event.target || new EventTarget,
            message:'¿Desea eliminar el producto?',
            acceptLabel:'Si',
            icon:'pi pi-exclamation-triangle',
            accept:()=>{
                console.log(item);

                console.log(this.selectedProducts);

                this.selectedProducts = this.selectedProducts.filter((product:any) => product.product_id != item.product_id)
            }
        })
    }
}

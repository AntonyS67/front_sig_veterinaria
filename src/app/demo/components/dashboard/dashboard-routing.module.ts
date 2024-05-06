import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreedComponent } from '../breed/breed.component';
import { CategoryComponent } from '../category/category.component';
import { ClientComponent } from '../client/client.component';
import { ConsultComponent } from '../consult/consult.component';
import { DiagnosticosComponent } from '../diagnosticos/diagnosticos.component';
import { ExamsComponent } from '../exams/exams.component';
import { PatientComponent } from '../patient/patient.component';
import { ProductComponent } from '../product/product.component';
import { SpecieComponent } from '../specie/specie.component';
import { UserComponent } from '../user/user.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'user', component: UserComponent },
        { path: 'specie', component: SpecieComponent },
        { path: 'raza', component: BreedComponent },
        { path: 'client', component: ClientComponent },
        { path: 'client/:id/patient', component: PatientComponent },
        { path: 'patient/:id/consults', component: ConsultComponent },
        { path: 'consults/:id/exams', component: ExamsComponent },
        { path: 'consults/:id/diagnosticos', component: DiagnosticosComponent },
        { path: 'category', component: CategoryComponent },
        { path: 'product', component: ProductComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreedComponent } from '../breed/breed.component';
import { ClientComponent } from '../client/client.component';
import { PatientComponent } from '../patient/patient.component';
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
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }

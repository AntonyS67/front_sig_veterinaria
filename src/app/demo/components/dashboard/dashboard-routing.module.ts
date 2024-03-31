import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreedComponent } from '../breed/breed.component';
import { SpecieComponent } from '../specie/specie.component';
import { UserComponent } from '../user/user.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'user', component: UserComponent },
        { path: 'specie', component: SpecieComponent },
        { path: 'raza', component: BreedComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }

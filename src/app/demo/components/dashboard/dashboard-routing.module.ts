import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'user', component: UserComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }

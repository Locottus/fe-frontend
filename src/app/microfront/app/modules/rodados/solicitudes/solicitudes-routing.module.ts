import { RouterModule, Routes } from '@angular/router';
import { SolicitudesComponent } from './solicitudes.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: SolicitudesComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SolicitudesRoutingModule { }

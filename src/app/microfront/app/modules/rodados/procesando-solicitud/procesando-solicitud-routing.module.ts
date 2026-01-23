import { RouterModule, Routes } from '@angular/router';
import { ProcesandoSolicitudComponent } from './procesando-solicitud.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: ProcesandoSolicitudComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcesandoSolicitudRoutingModule { }

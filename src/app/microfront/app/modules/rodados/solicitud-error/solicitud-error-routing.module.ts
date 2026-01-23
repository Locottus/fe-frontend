import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudErrorComponent } from './solicitud-error.component';

const routes: Routes = [{path: '', component: SolicitudErrorComponent}];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SolicitudErrorRoutingModule { }

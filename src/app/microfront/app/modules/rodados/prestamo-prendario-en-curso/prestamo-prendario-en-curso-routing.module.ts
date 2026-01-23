import { RouterModule, Routes } from '@angular/router';
import { PrestamoPrendarioEnCursoComponent } from './prestamo-prendario-en-curso.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{path: '', component: PrestamoPrendarioEnCursoComponent}];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrestamoPrendarioEnCursoRoutingModule { }

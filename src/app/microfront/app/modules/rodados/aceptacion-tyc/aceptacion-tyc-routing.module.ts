import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AceptacionTycComponent } from './aceptacion-tyc.component';

const routes: Routes = [{ path: '', component: AceptacionTycComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AceptacionTycRoutingModule { }

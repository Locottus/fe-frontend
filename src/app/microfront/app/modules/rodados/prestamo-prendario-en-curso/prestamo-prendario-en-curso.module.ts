import { NgModule } from '@angular/core';
import { PrestamoPrendarioEnCursoComponent } from './prestamo-prendario-en-curso.component';
import { PrestamoPrendarioEnCursoRoutingModule } from './prestamo-prendario-en-curso-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { KiteModule } from 'src/app/core/kite/kite.module';
import { DetalleCuotaDrawerComponent } from '../detalle-cuota-drawer/detalle-cuota-drawer.component';

@NgModule({
    declarations: [
        PrestamoPrendarioEnCursoComponent,
        DetalleCuotaDrawerComponent
    ],
    imports: [
        PrestamoPrendarioEnCursoRoutingModule,
        CommonModule,
        SharedModule,
        KiteModule
    ]
})
export class PrestamoPrendarioEnCursoModule { }

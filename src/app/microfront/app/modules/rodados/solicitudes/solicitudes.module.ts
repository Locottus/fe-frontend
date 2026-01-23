import { NgModule } from '@angular/core';
import { SolicitudesComponent } from './solicitudes.component';
import { SolicitudesRoutingModule } from './solicitudes-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { KiteModule } from 'src/app/core/kite/kite.module';
import { SkeletonModule, SpinnerModule } from '@kite/angular';

@NgModule({
    declarations: [SolicitudesComponent],
    imports: [
        SolicitudesRoutingModule,
        CommonModule,
        SharedModule,
        KiteModule,
        SpinnerModule,
        SkeletonModule
    ]
})
export class SolicitudesModule { }

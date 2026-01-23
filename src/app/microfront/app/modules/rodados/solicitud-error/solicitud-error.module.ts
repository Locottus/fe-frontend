import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { KiteModule } from 'src/app/core/kite/kite.module';
import { SolicitudErrorComponent } from './solicitud-error.component';
import { SolicitudErrorRoutingModule } from './solicitud-error-routing.module';

@NgModule({
    declarations: [SolicitudErrorComponent],
    imports: [
        SolicitudErrorRoutingModule,
        CommonModule,
        SharedModule,
        KiteModule
    ]
})
export class SolicitudErrorModule { }

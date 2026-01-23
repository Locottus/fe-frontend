import { NgModule } from '@angular/core';
import { AceptacionTycComponent } from './aceptacion-tyc.component';
import { AceptacionTycRoutingModule } from './aceptacion-tyc-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { KiteModule } from 'src/app/core/kite/kite.module';

@NgModule({
    declarations: [AceptacionTycComponent],
    imports: [
        AceptacionTycRoutingModule,
        CommonModule,
        SharedModule,
        KiteModule
    ]
})
export class AceptacionTycModule { }

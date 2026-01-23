import { NgModule } from '@angular/core';
import { PendienteTycComponent } from './pendiente-tyc.component';
import { PendienteTycRoutingModule } from './pendiente-tyc-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { KiteModule } from 'src/app/core/kite/kite.module';
import { SkeletonModule, SpinnerModule } from '@kite/angular';
import { ModalModule, ModalHeaderModule, ModalContentModule, ModalFooterModule } from '@kite/angular';
import { ToastModule, ToastListModule } from '@kite/angular';

@NgModule({
  declarations: [PendienteTycComponent],
  imports: [
    PendienteTycRoutingModule,
    CommonModule,
    SharedModule,
    KiteModule,
    SpinnerModule,
    SkeletonModule,
    ModalModule,
    ModalHeaderModule,
    ModalContentModule,
    ModalFooterModule,
    ToastModule,
    ToastListModule
  ]
})
export class PendienteTycModule {}

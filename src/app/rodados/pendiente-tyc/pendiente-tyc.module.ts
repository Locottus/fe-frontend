import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendienteTycRoutingModule } from './pendiente-tyc-routing.module';
import { PendienteTycComponent } from './pendiente-tyc.component';
import { RodadosSharedModule } from '../shared/rodados-shared.module';

@NgModule({
  declarations: [
    PendienteTycComponent
  ],
  imports: [
    CommonModule,
    PendienteTycRoutingModule,
    RodadosSharedModule
  ]
})
export class PendienteTycModule { }

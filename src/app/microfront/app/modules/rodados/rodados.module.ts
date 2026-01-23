import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RodadosRoutingModule } from './rodados-routing.module';
import { KiteModule } from 'src/app/core/kite/kite.module';

@NgModule({
  declarations: [

  ],
  imports: [RodadosRoutingModule, CommonModule, KiteModule]
})
export class RodadosModule {}

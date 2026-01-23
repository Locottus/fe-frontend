import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KiteSharedModule } from '../rodados/shared/kite-shared.module';
import { KiteExamplesComponent } from './kite-examples.component';
import { KiteExamplesRoutingModule } from './kite-examples-routing.module';

@NgModule({
  declarations: [KiteExamplesComponent],
  imports: [
    CommonModule,
    FormsModule,
    KiteSharedModule,
    KiteExamplesRoutingModule
  ],
  exports: [KiteExamplesComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class KiteExamplesModule { }

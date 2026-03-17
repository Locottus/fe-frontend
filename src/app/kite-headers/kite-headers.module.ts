import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeaderModule,
  HeaderOptionsModule,
  HeaderNotifProfileModule,
  LayoutModule,
  ButtonModule,
} from '@kite/angular';
import { KiteHeadersComponent } from './kite-headers.component';
import { KiteHeadersRoutingModule } from './kite-headers-routing.module';

@NgModule({
  declarations: [KiteHeadersComponent],
  imports: [
    CommonModule,
    KiteHeadersRoutingModule,
    HeaderModule,
    HeaderOptionsModule,
    HeaderNotifProfileModule,
    LayoutModule,
    ButtonModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class KiteHeadersModule {}

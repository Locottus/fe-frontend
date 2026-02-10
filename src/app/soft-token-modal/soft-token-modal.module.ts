import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftTokenModalComponent } from './soft-token-modal.component';
import { KiteSharedModule } from '../rodados/shared/kite-shared.module';

@NgModule({
  declarations: [SoftTokenModalComponent],
  imports: [CommonModule, KiteSharedModule],
  exports: [SoftTokenModalComponent],
})
export class SoftTokenModalModule {}

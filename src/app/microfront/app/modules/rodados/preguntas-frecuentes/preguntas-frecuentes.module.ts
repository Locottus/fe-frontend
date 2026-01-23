import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { KiteModule } from 'src/app/core/kite/kite.module';
import { SkeletonModule, SpinnerModule } from '@kite/angular';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes.component';
import { PreguntasFrecuentesRoutingModule } from './preguntas-frecuentes-routing.module';

@NgModule({
  declarations: [PreguntasFrecuentesComponent],
  imports: [PreguntasFrecuentesRoutingModule, CommonModule, SharedModule, KiteModule, SpinnerModule, SkeletonModule]
})
export class PreguntasFrecuentesModule {}

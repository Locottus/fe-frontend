import { LOCALE_ID, NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe, registerLocaleData, TitleCasePipe } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { TooltipModule } from 'ng2-tooltip-directive';
registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  imports: [
    NoopAnimationsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  exports: [
    NoopAnimationsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  declarations: [],
  providers: [TitleCasePipe, DecimalPipe, { provide: LOCALE_ID, useValue: 'es-AR' }]
})
export class TestingModule {
  constructor() {}
}

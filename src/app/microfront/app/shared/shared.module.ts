import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterialModule } from '../angular-material.module';
import { InactividadDialogComponent } from './components/inactividad-dialog/inactividad-dialog.component';
import { SessionExpiradaDialogComponent } from './components/session-expirada-dialog/session-expirada-dialog.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { NotificationDrawerComponent } from './components/notification-drawer/notification-drawer.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { NgbAlertModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedRoutingModule } from './shared-routing.module';
import { BackgroundResponsiveDirective } from './directives/background-responsive.directive';
import { InputComponent } from './components/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';
import { StepperComponent } from './components/stepper/stepper.component';
import { MoveNextByMaxLengthDirective } from './directives/MoveNextByMaxLengthDirective';
import { AutofocusDirective } from './directives/AutofocusDirective';
import { ModalComponent } from './components/modal/modal.component';
import { HeaderPaginasInternasComponent } from './components/header-paginas-internas/header-paginas-internas.component';
import {NgxCurrencyModule} from 'ngx-currency';
import { HeaderSimpleComponent } from './components/header-simple/header-simple.component';
import { IngresoTokenDialogComponent } from './components/ingreso-token-dialog/ingreso-token-dialog.component';
import { KiteModule } from '../core/kite/kite.module';
import { RouterModule } from '@angular/router';
import { SideBarPrestamosComponent } from './components/side-bar-prestamos/side-bar-prestamos.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { NumberFormatPipe } from './number-format.pipe';
import { SkeletonModule, SpinnerModule } from '@kite/angular';
// Duplication refactor component imports
import { SolicitudResumenVehiculoComponent } from './components/solicitud-resumen-vehiculo/solicitud-resumen-vehiculo.component';
import { SolicitudResumenFinancieroComponent } from './components/solicitud-resumen-financiero/solicitud-resumen-financiero.component';
import { SolicitudInfoModalContentComponent } from './components/solicitud-info-modal-content/solicitud-info-modal-content.component';
import { PreguntasFrecuentesLinkComponent } from './components/preguntas-frecuentes-link/preguntas-frecuentes-link.component';
import { PrestamoPageLayoutComponent } from './components/prestamo-page-layout/prestamo-page-layout.component';
import { SeleccionarCuentaDrawerComponent } from './components/seleccionar-cuenta-drawer/seleccionar-cuenta-drawer.component';
import { SoftTokenDrawerComponent } from './components/soft-token-drawer/soft-token-drawer.component';

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SideMenuComponent,
    InactividadDialogComponent,
    SessionExpiradaDialogComponent,
    NotificationDrawerComponent,
    ClickOutsideDirective,
    BackgroundResponsiveDirective,
    InputComponent,
    StepperComponent,
    MoveNextByMaxLengthDirective,
    AutofocusDirective,
    ModalComponent,
    HeaderPaginasInternasComponent,
    HeaderSimpleComponent,
    IngresoTokenDialogComponent,
    SideBarPrestamosComponent,
    DefaultLayoutComponent,
    NumberFormatPipe,
    SolicitudResumenVehiculoComponent,
    SolicitudResumenFinancieroComponent,
  SolicitudInfoModalContentComponent,
  PreguntasFrecuentesLinkComponent,
  PrestamoPageLayoutComponent,
  SeleccionarCuentaDrawerComponent,
  SoftTokenDrawerComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    NgbDropdownModule,
    NgbAlertModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    NgxCurrencyModule,
    KiteModule,
    SkeletonModule,
    SpinnerModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NotificationDrawerComponent,
    ClickOutsideDirective,
    BackgroundResponsiveDirective,
    NgbDropdownModule,
    AngularMaterialModule,
    InputComponent,
    StepperComponent,
    ModalComponent,
    HeaderPaginasInternasComponent,
    NgxCurrencyModule,
    HeaderSimpleComponent,
    IngresoTokenDialogComponent,
    SideBarPrestamosComponent,
    NumberFormatPipe,
    SolicitudResumenVehiculoComponent,
    SolicitudResumenFinancieroComponent,
  SolicitudInfoModalContentComponent,
  PreguntasFrecuentesLinkComponent,
  PrestamoPageLayoutComponent,
  SeleccionarCuentaDrawerComponent,
  SoftTokenDrawerComponent
  ]
})
export class SharedModule {}

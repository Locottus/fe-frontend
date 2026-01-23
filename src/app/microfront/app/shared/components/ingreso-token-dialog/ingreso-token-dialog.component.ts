import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ClavesService } from 'src/app/shared/services/claves/claves.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { EstadosValidacionClave } from '../../enums/enums';


export enum EstadosDeComponente {
  predeterminado = 1,
  valido = 2,
  invalido = 3,
}
export const tiempoTotalEnSegundos = 30;
@Component({
  selector: 'ingreso-token-dialog',
  templateUrl: './ingreso-token-dialog.component.html',
  styleUrls: ['./ingreso-token-dialog.component.scss'],
  providers: [ ],
})
export class IngresoTokenDialogComponent implements OnInit {

  esCodigoPredeterminado = true;
  esCodigoValido = false;
  esCodigoInvalido = false;
  codigoErroneo = false;
  asociadoAToken = true;
  tokenIsBlock = false;

  loading: boolean;
  error: any;
  validTokenMsg = '';

  codigoSms = new FormGroup({
    caracter1: new FormControl('', [
      Validators.required]),
    caracter2: new FormControl('', [
      Validators.required]),
    caracter3: new FormControl('', [
      Validators.required]),
    caracter4: new FormControl('', [
      Validators.required]),
    caracter5: new FormControl('', [
      Validators.required]),
    caracter6: new FormControl('', [
      Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<IngresoTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public datos,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public clavesService: ClavesService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
  ) {
    this.asociadoAToken = datos.asociadoAToken;
    this.tokenIsBlock = datos.tokenIsBlock;
    this.matIconRegistry.addSvgIcon(
      'icon-transferencia-cohete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/transferencias/icon-cohete.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'icon-transferencia-warning',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/transferencias/icon-warning-circle.svg')
    );
  }

  ngOnInit(): void {
    if (this.asociadoAToken) {
      this.suscribirLoading();
      this.codigoSms.valueChanges.subscribe(data => {
        if (this.codigoSms.valid) {
          this.validarClave();
        }
      });
    }

  }


  suscribirLoading() {
    this.loadingService.isLoadingEmitter.subscribe(valor => this.loading = valor);
  }

  solicitarNuevoCodigo() {
    this.reiniciarDialog();
  }

  reiniciarDialog() {
    this.validTokenMsg = '';
    this.error = undefined;
    this.esCodigoPredeterminado = true;
    this.esCodigoValido = false;
    this.esCodigoInvalido = false;
    this.codigoErroneo = false;
    this.codigoSms.reset();
    this.codigoSms.enable();
  }


  asignarEstadoDeSms(valor: number) {
    this.esCodigoPredeterminado = false;
    this.esCodigoValido = false;
    this.esCodigoInvalido = false;
    switch (valor) {
      case EstadosDeComponente.predeterminado:
        this.esCodigoPredeterminado = true;
        break;
      case EstadosDeComponente.valido:
        this.esCodigoValido = true;
        break;
      case EstadosDeComponente.invalido:
        this.esCodigoInvalido = true;
        break;
    }
  }

  obtenerValorFormulario(): string {
    const clave = '';
    return clave.concat(
      '' + this.codigoSms.controls.caracter1.value +
      '' + this.codigoSms.controls.caracter2.value +
      '' + this.codigoSms.controls.caracter3.value +
      '' + this.codigoSms.controls.caracter4.value +
      '' + this.codigoSms.controls.caracter5.value +
      '' + this.codigoSms.controls.caracter6.value
    );
  }

  validarClave() {
    this.codigoSms.disable();
    this.loading = true;
    const validarBody = {
      token: this.obtenerValorFormulario()
    };
    this.clavesService.validarSoftToken(validarBody).subscribe(
      (response) => {
        if (response.valid_token.block) {
          this.tokenIsBlock = true;
        }
        if (response.valid_token.valid && !response.valid_token.block) {
          this.asignarEstadoDeSms(EstadosDeComponente.valido);
          setTimeout(() => {
            this.loading = false;
            this.cerrarDialogo(EstadosValidacionClave.Exito);
          }, 1000);
        } else {
          this.validTokenMsg = '<p>El código que ingresaste es incorrecto. <br> Revisá que coincida con el que te muestra la app</p>';
          this.loading = false;
          this.asignarEstadoDeSms(EstadosDeComponente.invalido);
        }
      },
      error => {
        this.loading = false;
        this.asignarEstadoDeSms(EstadosDeComponente.invalido);
        this.error = error;
      });
  }


  cerrarDialogo(resultado) {
    this.dialogRef.close(resultado);
  }


  soloNumeros(event: any) {
    const patt = /^([0-9])$/;
    return patt.test(event.key);
  }

  conocerMas() {
    const url = 'https://www.supervielle.com.ar/landings/registracion-soft-token';
    const nuevaVentana = window.open(url, '_blank', 'noopener,noreferrer');

    if (nuevaVentana) {
      nuevaVentana.focus();
    }
  }
}

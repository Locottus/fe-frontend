import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreditoData } from 'src/app/modules/rodados/interfaces/lista-credito.dto';
import { DetalleSolicitudDTO, DocumentosSolicitudResponse } from 'src/app/modules/rodados/interfaces/detalle-solicitud.dto';
import { DetallePrestamoDTO } from 'src/app/modules/rodados/interfaces/detalle-prestamo.dto';
import { map } from 'rxjs/operators';
import { FaqDTO } from '../models/faq.dto';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  //#region Porpiedades

  private creditosSubject = new BehaviorSubject<CreditoData[]>(null);
  creditos$: Observable<CreditoData[]> = this.creditosSubject.asObservable();

  private prestamosCabecera = new BehaviorSubject<CreditoData[]>(null);
  private solicitudesCabecera = new BehaviorSubject<CreditoData[]>(null);

  private documentosSolicitud = new BehaviorSubject<[string, DocumentosSolicitudResponse]>(null);

  private idPersona: string;
  private prestamoSelected: number;
  private solicitudSelected: string;

  private prestamosDetalladosMap$ = new BehaviorSubject<Map<number, DetallePrestamoDTO>>(new Map());
  private solicitudesDetalladasMap$ = new BehaviorSubject<Map<string, DetalleSolicitudDTO>>(new Map());

  private faqs = new BehaviorSubject<FaqDTO>(null);

  private existeCreditos = false;
  private existeDetalleSolicitudes = false;
  private existeDetallePrestamos = false;
  private existePreguntasFrecuentes = false;
  private firstSignIn = true;
  //#endregion

  constructor() {}

  //#region Accesores

  getExisteCreditos = () => this.existeCreditos;
  getExisteDetalleSolicitudes = () => this.existeDetalleSolicitudes;
  getExisteDetallePrestamos = () => this.existeDetallePrestamos;
  getExistePreguntasFrecuentes = () => this.existePreguntasFrecuentes;
  getExisteDocumentosSolicitudSeleccionada = () => this.getSolicitudSelected() === this.documentosSolicitud.getValue()?.[0];
  getFirstSignIn = () => this.firstSignIn;

  setFirstSignIn(data: boolean): void {
    this.firstSignIn = data;
  }

  // Persona
  getIdPersona(){
    return this.idPersona;
  }

  setIdPersona(id: string){
    this.idPersona = id;
  }

  // Creditos
  setCreditos(lista: CreditoData[]): void {
    this.creditosSubject.next(lista);
    this.existeCreditos = true;
  }

  getCreditos(): CreditoData[] {
    return this.creditosSubject.getValue();
  }

  // Solicitudes
  setCabeceraSolicitudes(lista: CreditoData[]): void {
    this.solicitudesCabecera.next(lista);
  }

  getCabeceraSolicitudes(): CreditoData[] {
    return this.solicitudesCabecera.getValue();
  }

  // Prestamos
  setCabeceraPrestamos(lista: CreditoData[]): void {
    this.prestamosCabecera.next(lista);
  }

  getCabeceraPrestamos(): CreditoData[] {
    return this.prestamosCabecera.getValue();
  }

  setPrestamoSelected(nro: number) {
    this.prestamoSelected = nro;
  }

  getPrestamoSelected(): number {
    return this.prestamoSelected;
  }

  setSolicitudSelected(id: string): void {
    this.solicitudSelected = id;
  }

  getSolicitudSelected(): string {
    return this.solicitudSelected;
  }

  // FAQs
  getFaqs(): FaqDTO {
    return this.faqs.getValue();
  }

  setFaqs(pf: FaqDTO): void {
    this.faqs.next(pf);
    this.existePreguntasFrecuentes = true;
  }

  // Detalles
  setPrestamosDetalladosMap(data: DetallePrestamoDTO[]): void {
    const m = new Map<number, DetallePrestamoDTO>(data.map((s) => [s.detallePrestamo.prestamo.operacion.codigo, s]));
    this.prestamosDetalladosMap$.next(m);
    this.existeDetallePrestamos = true;
  }

  getPrestamosDetalladosMap(): Map<number, DetallePrestamoDTO> {
    return this.prestamosDetalladosMap$.getValue();
  }

  getPrestamosDetallados(): DetallePrestamoDTO[] {
    return Array.from(this.prestamosDetalladosMap$.getValue(), ([key, value]) => value);
  }

  getPrestamoDetallado(): Observable<DetallePrestamoDTO | undefined> {
    return this.prestamosDetalladosMap$.pipe(map((m) => m.get(this.getPrestamoSelected())));
  }

  setSolicitudesDetalladasMap(data: DetalleSolicitudDTO[]): void {
    const m = new Map<string, DetalleSolicitudDTO>(data.map((s) => [String(s.id), s]));
    this.solicitudesDetalladasMap$.next(m);
    this.existeDetalleSolicitudes = true;
  }

  getSolicitudesDetalladasMap(): Map<string, DetalleSolicitudDTO> {
    return this.solicitudesDetalladasMap$.getValue();
  }

  getSolicitudesDetalladas(): DetalleSolicitudDTO[] {
    return Array.from(this.solicitudesDetalladasMap$.getValue(), ([key, value]) => value);
  }

  getSolicitudDetallada(): Observable<DetalleSolicitudDTO | undefined> {
    return this.solicitudesDetalladasMap$.pipe(
      map((m) => {
        return m.get(String(this.getSolicitudSelected()));
      })
    );
  }

  setDocumentosSolicitudSeleccionada(solicitud: string, documentos: DocumentosSolicitudResponse): void {
    this.documentosSolicitud.next([solicitud, documentos]);
  }

  getDocumentosSolicitudSeleccionada(): DocumentosSolicitudResponse {
    return this.documentosSolicitud.getValue()[1];
  }

  //#endregion
}

import { TestBed } from '@angular/core/testing';
import { GlobalService } from './global.service';
import { DetallePrestamoDTO } from 'src/app/modules/rodados/interfaces/detalle-prestamo.dto';
import { DetalleSolicitudDTO } from 'src/app/modules/rodados/interfaces/detalle-solicitud.dto';
import { CreditoData } from 'src/app/modules/rodados/interfaces/lista-credito.dto';
import { FaqDTO } from '../models/faq.dto';
import { DocumentosSolicitudResponse } from 'src/app/modules/rodados/interfaces/detalle-solicitud.dto';

describe('GlobalService', () => {
  let service: GlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalService);
  });
  
  it('debe setear y obtener créditos', () => {
    expect(service.getExisteCreditos()).toBeFalse();
    service.setCreditos([{ idSolicitud: 'A', estado: 'P', tipoOperacion: 'solicitud' } as any]);
    expect(service.getExisteCreditos()).toBeTrue();
    expect(service.getCreditos()?.length).toBe(1);
  });

  it('debe setear y recuperar persona', () => {
    service.setIdPersona('123');
    expect(service.getIdPersona()).toBe('123');
  });

  it('maneja mapas de prestamos detallados', () => {
    const detalle: DetallePrestamoDTO = {
      detallePrestamo: { prestamo: { operacion: { codigo: 999 } } } as any
    } as any;
    service.setPrestamosDetalladosMap([detalle]);
    expect(service.getExisteDetallePrestamos()).toBeTrue();
    const map = service.getPrestamosDetalladosMap();
    expect(map.get(999)).toBe(detalle);
    service.setPrestamoSelected(999);
    service.getPrestamoDetallado().subscribe((d) => expect(d).toBe(detalle));
  });

  it('maneja mapas de solicitudes detalladas', () => {
    const detalle: DetalleSolicitudDTO = { id: 'ABC', solicitud: {} } as any;
    service.setSolicitudesDetalladasMap([detalle]);
    expect(service.getExisteDetalleSolicitudes()).toBeTrue();
    service.setSolicitudSelected('ABC');
    service.getSolicitudDetallada().subscribe((d) => expect(d).toBe(detalle));
  });

  it('setea documentos de solicitud seleccionada y los obtiene', () => {
    service.setSolicitudSelected('SOL1');
    const documentos = { documentos: [], terminosYCondiciones: { id: 1, texto: 'TyC' } } as any;
    service.setDocumentosSolicitudSeleccionada('SOL1', documentos);
    expect(service.getExisteDocumentosSolicitudSeleccionada()).toBeTrue();
    expect(service.getDocumentosSolicitudSeleccionada()).toBe(documentos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get prestamos', () => {
    const contratos: CreditoData[] = [
      { nroOrden: 1, estado: 'Vigente', cantCuotas: 12, idSolicitud: 'P-A', idSolicitudSinOrigen: 'A', tipoOperacion: 'prestamo' }
    ];
    service.setCreditos(contratos);
    expect(service.getCreditos()).toEqual(contratos);
  });

  it('should set and get prestamoSelected', () => {
    service.setPrestamoSelected(123);
    expect(service.getPrestamoSelected()).toBe(123);
  });

  it('should set and get prestamosDetalladosMap', (done) => {
    const detalle: DetallePrestamoDTO = {
      detallePrestamo: {
        prestamo: {
          operacion: { codigo: 1 }
        }
      }
    } as any;
    service.setPrestamoSelected(1);
    service.setPrestamosDetalladosMap([detalle]);
    service.getPrestamoDetallado().subscribe((res) => {
      expect(res).toEqual(detalle);
      done();
    });
  });

  it('should set and get solicitudesDetalladasMap', (done) => {
    const detalle: DetalleSolicitudDTO = { id: '123', solicitud: {} } as any;
    service.setSolicitudSelected('123');
    service.setSolicitudesDetalladasMap([detalle]);
    service.getSolicitudDetallada().subscribe((res) => {
      expect(res).toEqual(detalle);
      done();
    });
  });

  it('should return undefined if no prestamoDetallado found', (done) => {
    service.setPrestamoSelected(999);
    service.setPrestamosDetalladosMap([]);
    service.getPrestamoDetallado().subscribe((res) => {
      expect(res).toBeUndefined();
      done();
    });
  });

  it('should return undefined if no solicitudDetallada found', (done) => {
    service.setSolicitudSelected('999');
    service.setSolicitudesDetalladasMap([]);
    service.getSolicitudDetallada().subscribe((res) => {
      expect(res).toBeUndefined();
      done();
    });
  });

  // Tests for IdPersona
  it('should set and get IdPersona', () => {
    const testId = 'test-persona-123';
    service.setIdPersona(testId);
    expect(service.getIdPersona()).toBe(testId);
  });

  // Tests for FirstSignIn
  it('should set and get FirstSignIn', () => {
    expect(service.getFirstSignIn()).toBe(true); // default value
    service.setFirstSignIn(false);
    expect(service.getFirstSignIn()).toBe(false);
    service.setFirstSignIn(true);
    expect(service.getFirstSignIn()).toBe(true);
  });

  // Tests for Solicitudes Cabecera
  it('should set and get cabeceraSolicitudes', () => {
    const solicitudes: CreditoData[] = [
      { nroOrden: 1, estado: 'Pendiente', cantCuotas: 10, idSolicitud: 'S-A', idSolicitudSinOrigen: 'A', tipoOperacion: 'solicitud' }
    ];
    service.setCabeceraSolicitudes(solicitudes);
    expect(service.getCabeceraSolicitudes()).toEqual(solicitudes);
  });

  // Tests for Prestamos Cabecera
  it('should set and get cabeceraPrestamos', () => {
    const prestamos: CreditoData[] = [
      { nroOrden: 2, estado: 'Vigente', cantCuotas: 24, idSolicitud: 'P-B', idSolicitudSinOrigen: 'B', tipoOperacion: 'prestamo' }
    ];
    service.setCabeceraPrestamos(prestamos);
    expect(service.getCabeceraPrestamos()).toEqual(prestamos);
  });

  // Tests for SolicitudSelected
  it('should set and get solicitudSelected', () => {
    const testId = 'sol-456';
    service.setSolicitudSelected(testId);
    expect(service.getSolicitudSelected()).toBe(testId);
  });

  // Tests for FAQs
  it('should set and get FAQs', () => {
    const faqs: FaqDTO = {
      preguntasFrecuentes: [
        { pregunta: '¿Cómo funciona?', respuesta: 'Funciona bien' }
      ]
    } as any;
    service.setFaqs(faqs);
    expect(service.getFaqs()).toEqual(faqs);
    expect(service.getExistePreguntasFrecuentes()).toBe(true);
  });

  // Tests for PrestamosDetallados methods
  it('should get prestamosDetallados array', () => {
    const detalle1: DetallePrestamoDTO = {
      detallePrestamo: {
        prestamo: {
          operacion: { codigo: 1 }
        }
      }
    } as any;
    const detalle2: DetallePrestamoDTO = {
      detallePrestamo: {
        prestamo: {
          operacion: { codigo: 2 }
        }
      }
    } as any;
    
    service.setPrestamosDetalladosMap([detalle1, detalle2]);
    const result = service.getPrestamosDetallados();
    expect(result.length).toBe(2);
    expect(result).toContain(detalle1);
    expect(result).toContain(detalle2);
    expect(service.getExisteDetallePrestamos()).toBe(true);
  });

  it('should get prestamosDetalladosMap', () => {
    const detalle: DetallePrestamoDTO = {
      detallePrestamo: {
        prestamo: {
          operacion: { codigo: 123 }
        }
      }
    } as any;
    
    service.setPrestamosDetalladosMap([detalle]);
    const map = service.getPrestamosDetalladosMap();
    expect(map.get(123)).toEqual(detalle);
  });

  // Tests for SolicitudesDetalladas methods
  it('should get solicitudesDetalladas array', () => {
    const detalle1: DetalleSolicitudDTO = { id: '1', solicitud: {} } as any;
    const detalle2: DetalleSolicitudDTO = { id: '2', solicitud: {} } as any;
    
    service.setSolicitudesDetalladasMap([detalle1, detalle2]);
    const result = service.getSolicitudesDetalladas();
    expect(result.length).toBe(2);
    expect(result).toContain(detalle1);
    expect(result).toContain(detalle2);
    expect(service.getExisteDetalleSolicitudes()).toBe(true);
  });

  it('should get solicitudesDetalladasMap', () => {
    const detalle: DetalleSolicitudDTO = { id: '789', solicitud: {} } as any;
    
    service.setSolicitudesDetalladasMap([detalle]);
    const map = service.getSolicitudesDetalladasMap();
    expect(map.get('789')).toEqual(detalle);
  });

  // Tests for DocumentosSolicitud
  it('should set and get documentosSolicitudSeleccionada', () => {
    const solicitudId = 'sol-docs-123';
    const documentos: DocumentosSolicitudResponse = {
      documentos: [{ nombre: 'doc1.pdf', tipo: 'PDF' }]
    } as any;
    
    service.setDocumentosSolicitudSeleccionada(solicitudId, documentos);
    expect(service.getDocumentosSolicitudSeleccionada()).toEqual(documentos);
  });

  // Tests for existence flags
  it('should track existeCreditos flag', () => {
    expect(service.getExisteCreditos()).toBe(false);
    const creditos: CreditoData[] = [
      { nroOrden: 1, estado: 'Vigente', cantCuotas: 12, idSolicitud: 'P-A', idSolicitudSinOrigen: 'A', tipoOperacion: 'prestamo' }
    ];
    service.setCreditos(creditos);
    expect(service.getExisteCreditos()).toBe(true);
  });

  it('should check existeDocumentosSolicitudSeleccionada', () => {
    const solicitudId = 'test-sol-id';
    const documentos: DocumentosSolicitudResponse = { documentos: [] } as any;
    
    service.setSolicitudSelected(solicitudId);
    service.setDocumentosSolicitudSeleccionada(solicitudId, documentos);
    
    expect(service.getExisteDocumentosSolicitudSeleccionada()).toBe(true);
    
    // Test when no solicitud is selected
    service.setSolicitudSelected('');
    expect(service.getExisteDocumentosSolicitudSeleccionada()).toBe(false);
  });

  // Tests for observable streams
  it('should have creditos$ observable stream', (done) => {
    const creditos: CreditoData[] = [
      { nroOrden: 1, estado: 'Vigente', cantCuotas: 12, idSolicitud: 'P-A', idSolicitudSinOrigen: 'A', tipoOperacion: 'prestamo' }
    ];
    
    service.creditos$.subscribe((result) => {
      if (result !== null) {
        expect(result).toEqual(creditos);
        done();
      }
    });
    
    service.setCreditos(creditos);
  });

  // Edge cases
  it('should handle empty arrays in setPrestamosDetalladosMap', () => {
    service.setPrestamosDetalladosMap([]);
    expect(service.getPrestamosDetallados()).toEqual([]);
    expect(service.getExisteDetallePrestamos()).toBe(true);
  });

  it('should handle empty arrays in setSolicitudesDetalladasMap', () => {
    service.setSolicitudesDetalladasMap([]);
    expect(service.getSolicitudesDetalladas()).toEqual([]);
    expect(service.getExisteDetalleSolicitudes()).toBe(true);
  });

  it('should handle null values gracefully', () => {
    expect(service.getCreditos()).toBeNull();
    expect(service.getCabeceraSolicitudes()).toBeNull();
    expect(service.getCabeceraPrestamos()).toBeNull();
    expect(service.getFaqs()).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';

import { ClavesService } from './claves.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from '../../../core/services/settings.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ClavesService', () => {
    let service: ClavesService;
    let httpMock: HttpTestingController;
    let settingServiceMock: SettingsService;

    beforeEach(() => {
        settingServiceMock = new SettingsService();
        settingServiceMock.settings.baseUrl = 'http://localhost:5000';
        settingServiceMock.settings.backendRodadosUrl = '/obi/cuotificacion/api/v1.0/';

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: SettingsService, useValue: settingServiceMock },
            ],
        });
        service = TestBed.inject(ClavesService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('deberia hacer una llamada HttpPost para generar una clave por sms ', () => {
        service.generar().subscribe(response => {
            expect(response).toBeTruthy();
        });
        const request = httpMock.expectOne(service.tokenUrl);
        expect(request.request.method).toBe('POST');
        httpMock.verify();
    });

    it('deberia hacer una llamada HttpPost para validar un token de clave por sms', () => {
        const claveMock = {
            identificador: '5344628515617409646',
            token: '085126'
        };
        service.validar(claveMock).subscribe(response => {
            expect(response).toBeTruthy();
        });
        const request = httpMock.expectOne(service.validacionUrl);
        expect(request.request.method).toBe('POST');
        request.flush(claveMock);
        httpMock.verify();
    });

    it('deberia hacer una llamada HttpGet para verificar si tiene asociado el teléfono del usuario al doble factor', () => {
        service.tieneAsociadoToken().subscribe(response => {
            expect(response).toBeTruthy();
        });
        const request = httpMock.expectOne(service.tieneAsociadoTokenUrl);
        expect(request.request.method).toBe('GET');
        httpMock.verify();
    });

    it('deberia hacer una llamada HttpGet para verificar si tiene asociado el soft Token', () => {
        service.existeSoftToken().subscribe(response => {
            expect(response).toBeTruthy();
        });
        const request = httpMock.expectOne(service.softTokenExisteUrl);
        expect(request.request.method).toBe('GET');
        httpMock.verify();
    });

    it('deberia hacer una llamada HttpPost para validar un token de soft Token', () => {
        const claveMock = {
            token: '085126'
        };
        service.validarSoftToken(claveMock).subscribe(response => {
            expect(response).toBeTruthy();
        });
        const request = httpMock.expectOne(service.softTokenValidarUrl);
        expect(request.request.method).toBe('POST');
        request.flush(claveMock);
        httpMock.verify();
    });

    // Tests adicionales de funcionalidad existente

    // Tests de casos edge y diferentes respuestas
    it('should handle empty response in generar()', () => {
        service.generar().subscribe(response => {
            expect(response).toEqual({});
        });

        const req = httpMock.expectOne(service.tokenUrl);
        req.flush({});
    });

    it('should handle null response in tieneAsociadoToken()', () => {
        service.tieneAsociadoToken().subscribe(response => {
            expect(response).toBeNull();
        });

        const req = httpMock.expectOne(service.tieneAsociadoTokenUrl);
        req.flush(null);
    });

    it('should handle boolean response in existeSoftToken()', () => {
        service.existeSoftToken().subscribe(response => {
            expect(response).toBe(false);
        });

        const req = httpMock.expectOne(service.softTokenExisteUrl);
        req.flush(false);
    });

    // Test con datos complejos
    it('should handle complex response in validar()', () => {
        const claveMock = {
            identificador: '1234567890123456789',
            token: '123456'
        };
        const complexResponse = {
            valid: true,
            timestamp: '2024-01-01T00:00:00.000Z',
            expiresIn: 300,
            metadata: {
                attempts: 1,
                maxAttempts: 3
            }
        };

        service.validar(claveMock).subscribe(response => {
            expect(response).toEqual(complexResponse);
        });

        const req = httpMock.expectOne(service.validacionUrl);
        expect(req.request.body).toEqual(claveMock);
        req.flush(complexResponse);
    });

    // Test básico de URL construction
    it('should validate service URLs are properly constructed', () => {
        expect(service.tokenUrl).toContain('http://localhost:5000/obi/cuotificacion/api/v1.0');
        expect(service.validacionUrl).toContain('http://localhost:5000/obi/cuotificacion/api/v1.0');
        expect(service.tieneAsociadoTokenUrl).toContain('http://localhost:5000/obi/cuotificacion/api/v1.0');
        expect(service.softTokenExisteUrl).toContain('http://localhost:5000/obi/cuotificacion/api/v1.0');
        expect(service.softTokenValidarUrl).toContain('http://localhost:5000/obi/cuotificacion/api/v1.0');
    });

    // Test con caracteres especiales
    it('should handle special characters in token validation', () => {
        const claveMock = {
            identificador: 'user@domain.com',
            token: 'abc-123_456'
        };
        const expectedResponse = { valid: true };

        service.validar(claveMock).subscribe(response => {
            expect(response).toEqual(expectedResponse);
        });

        const req = httpMock.expectOne(service.validacionUrl);
        expect(req.request.body).toEqual(claveMock);
        req.flush(expectedResponse);
    });

    afterEach(() => {
        httpMock.verify();
    });
});

import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('Deberia ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Deberia incrementar las request', () => {
    expect(service.requestsPendientes).toBe(0);
    service.aniadirRequest();
    expect(service.requestsPendientes).toBe(1);
  });

  it('Deberia decrementar las request', () => {
    service.aniadirRequest();
    expect(service.requestsPendientes).toBe(1);
    service.quitarRequest();
    expect(service.requestsPendientes).toBe(0);
  });
});

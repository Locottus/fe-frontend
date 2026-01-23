import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('deberia crear el servicio ErrorHandlerService', () => {
    expect(service).toBeTruthy();
  });
});

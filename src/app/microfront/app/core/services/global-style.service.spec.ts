import { TestBed } from '@angular/core/testing';

import { GlobalStyleService } from './global-style.service';

describe('GlobalStyleService', () => {
  let service: GlobalStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería emitir el valor del observable, cuando se settea un nuevo valor para showGlobalSpinnerSubject', () => {
    let result;
    service.getGlobalSpinnerState$().subscribe(newState => result = newState);

    expect(result).toBe(false);

    service.setGlobalSpinnerState(true);

    expect(result).toBe(true);
  });
});

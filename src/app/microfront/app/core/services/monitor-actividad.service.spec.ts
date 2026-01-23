import { TestBed } from '@angular/core/testing';

import { MonitorActividadService } from './monitor-actividad.service';

describe('MonitorActividadService', () => {
  let service: MonitorActividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorActividadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

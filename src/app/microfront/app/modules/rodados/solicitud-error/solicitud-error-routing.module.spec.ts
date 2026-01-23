import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SolicitudErrorRoutingModule } from './solicitud-error-routing.module';

describe('SolicitudErrorRoutingModule', () => {
  let module: SolicitudErrorRoutingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SolicitudErrorRoutingModule]
    });
    module = new SolicitudErrorRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

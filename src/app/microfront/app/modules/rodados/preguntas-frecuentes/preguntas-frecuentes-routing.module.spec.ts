import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PreguntasFrecuentesRoutingModule } from './preguntas-frecuentes-routing.module';

describe('PreguntasFrecuentesRoutingModule', () => {
  let module: PreguntasFrecuentesRoutingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PreguntasFrecuentesRoutingModule]
    });
    module = new PreguntasFrecuentesRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

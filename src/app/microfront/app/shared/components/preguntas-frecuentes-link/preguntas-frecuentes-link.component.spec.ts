import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreguntasFrecuentesLinkComponent } from './preguntas-frecuentes-link.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PreguntasFrecuentesLinkComponent', () => {
  let component: PreguntasFrecuentesLinkComponent;
  let fixture: ComponentFixture<PreguntasFrecuentesLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreguntasFrecuentesLinkComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasFrecuentesLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit select event when onToggle is called', () => {
    spyOn(component.select, 'emit');
    component.onToggle();
    expect(component.select.emit).toHaveBeenCalled();
  });

  it('should have select EventEmitter defined', () => {
    expect(component.select).toBeDefined();
  });
});

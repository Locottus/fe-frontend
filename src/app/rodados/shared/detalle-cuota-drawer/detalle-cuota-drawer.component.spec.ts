import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCuotaDrawerComponent } from './detalle-cuota-drawer.component';

describe('DetalleCuotaDrawerComponent', () => {
  let component: DetalleCuotaDrawerComponent;
  let fixture: ComponentFixture<DetalleCuotaDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCuotaDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCuotaDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiteExamplesComponent } from './kite-examples.component';

describe('KiteExamplesComponent', () => {
  let component: KiteExamplesComponent;
  let fixture: ComponentFixture<KiteExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiteExamplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KiteExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

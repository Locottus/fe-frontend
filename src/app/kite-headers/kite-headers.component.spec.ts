import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { KiteHeadersComponent } from './kite-headers.component';

describe('KiteHeadersComponent', () => {
  let component: KiteHeadersComponent;
  let fixture: ComponentFixture<KiteHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KiteHeadersComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KiteHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

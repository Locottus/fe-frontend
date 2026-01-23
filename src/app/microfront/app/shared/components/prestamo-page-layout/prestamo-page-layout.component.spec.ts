import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestamoPageLayoutComponent } from './prestamo-page-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrestamoPageLayoutComponent', () => {
  let component: PrestamoPageLayoutComponent;
  let fixture: ComponentFixture<PrestamoPageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestamoPageLayoutComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestamoPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isMobile).toBe(false);
    expect(component.containerCss).toEqual({});
    expect(component.layoutCss).toEqual({});
  });

  it('should accept title input', () => {
    component.title = 'Test Title';
    expect(component.title).toBe('Test Title');
  });

  it('should accept isMobile input', () => {
    component.isMobile = true;
    expect(component.isMobile).toBe(true);
  });

  it('should accept containerCss input', () => {
    const css = { padding: '10px' };
    component.containerCss = css;
    expect(component.containerCss).toEqual(css);
  });

  it('should accept layoutCss input', () => {
    const css = { margin: '20px' };
    component.layoutCss = css;
    expect(component.layoutCss).toEqual(css);
  });

  it('should emit backAction when onBack is called', () => {
    spyOn(component.backAction, 'emit');
    component.onBack();
    expect(component.backAction.emit).toHaveBeenCalled();
  });
});

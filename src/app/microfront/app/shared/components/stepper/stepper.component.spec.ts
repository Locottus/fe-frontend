import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperComponent } from './stepper.component';

describe('StepperComponent', () => {
    let component: StepperComponent;
    let fixture: ComponentFixture<StepperComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [StepperComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(StepperComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize stepsArray correctly', () => {
      component.stepsLength = 3;
      fixture.detectChanges();
      expect(component.stepsArray).toEqual([1, 2, 3]);
    });

    it('should receive @Input() values correctly', () => {
      component.step = 2;
      component.stepsLength = 5;
      fixture.detectChanges();
      expect(component.step).toBe(2);
      expect(component.stepsLength).toBe(5);
    });
  });

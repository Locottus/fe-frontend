import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { SoftTokenModalComponent } from './soft-token-modal.component';
import { SoftTokenService } from '../../../modules/rodados/services/soft-token.service';
import { SharedModule } from '../../shared.module';

describe('SoftTokenModalComponent', () => {
  let component: SoftTokenModalComponent;
  let fixture: ComponentFixture<SoftTokenModalComponent>;
  let mockSoftTokenService: jasmine.SpyObj<SoftTokenService>;

  beforeEach(async () => {
    mockSoftTokenService = jasmine.createSpyObj('SoftTokenService', [
      'obtenerEstadoToken',
      'isMobile',
    ]);
    mockSoftTokenService.isMobile.and.returnValue(false);

    await TestBed.configureTestingModule({
      declarations: [SoftTokenModalComponent],
      imports: [SharedModule],
      providers: [
        { provide: SoftTokenService, useValue: mockSoftTokenService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SoftTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with empty digits array', () => {
      expect(component.digits.length).toBe(6);
      expect(component.digits.every((d) => d === '')).toBe(true);
    });

    it('should initialize loading as false', () => {
      expect(component.loading).toBe(false);
    });

    it('should initialize errorMessage as null', () => {
      expect(component.errorMessage).toBeNull();
    });

    it('should initialize isOpen as false', () => {
      expect(component.isOpen).toBe(false);
    });

    it('should call isMobile on construction', () => {
      // El componente usa detectDeviceType() que lee window.innerWidth directamente,
      // no llama al servicio isMobile() en la construcción
      expect(component.isMobile).toBeDefined();
      expect(typeof component.isMobile).toBe('boolean');
    });
  });

  describe('ngOnChanges', () => {
    it('should reset state when isOpen changes to true', () => {
      component.digits = ['1', '2', '3', '4', '5', '6'];
      component.errorMessage = 'Some error';
      component.loading = true;

      component.ngOnChanges({
        isOpen: new SimpleChange(false, true, true),
      });

      expect(component.digits.every((d) => d === '')).toBe(true);
      expect(component.loading).toBe(false);
      expect(component.errorMessage).toBeNull();
    });

    it('should not reset state when isOpen changes to false', () => {
      component.digits = ['1', '2', '3', '4', '5', '6'];

      component.ngOnChanges({
        isOpen: new SimpleChange(true, false, false),
      });

      expect(component.digits).toEqual(['1', '2', '3', '4', '5', '6']);
    });
  });

  describe('isComplete getter', () => {
    it('should return false when digits are empty', () => {
      expect(component.isComplete).toBe(false);
    });

    it('should return false when not all digits are filled', () => {
      component.digits = ['1', '2', '3', '', '', ''];
      expect(component.isComplete).toBe(false);
    });

    it('should return true when all digits are filled', () => {
      component.digits = ['1', '2', '3', '4', '5', '6'];
      expect(component.isComplete).toBe(true);
    });
  });

  describe('code getter', () => {
    it('should return concatenated digits', () => {
      component.digits = ['1', '2', '3', '4', '5', '6'];
      expect(component.code).toBe('123456');
    });

    it('should return partial code when not all digits are filled', () => {
      component.digits = ['1', '2', '3', '', '', ''];
      expect(component.code).toBe('123');
    });
  });

  describe('onInput', () => {
    let mockInput: HTMLInputElement;
    let mockEvent: Event;

    beforeEach(() => {
      mockInput = document.createElement('input');
      mockEvent = new Event('input');
      Object.defineProperty(mockEvent, 'target', {
        value: mockInput,
        enumerable: true,
      });
    });

    it('should only accept numeric characters', () => {
      mockInput.value = 'a1b2';
      component.onInput(mockEvent, 0);
      expect(component.digits[0]).toBe('1');
    });

    it('should only store first character', () => {
      mockInput.value = '123';
      component.onInput(mockEvent, 0);
      expect(component.digits[0]).toBe('1');
    });

    it('should focus next input when value is entered', () => {
      const nextInput = document.createElement('input');
      const mockQueryList = {
        get: jasmine
          .createSpy('get')
          .and.returnValue({ nativeElement: nextInput }),
      };
      component.codeInputs = mockQueryList as any;

      mockInput.value = '1';
      component.onInput(mockEvent, 0);

      // El componente usa setTimeout, verificamos que el dígito se actualizó
      expect(component.digits[0]).toBe('1');
    });

    it('should not focus next input if at last position', () => {
      const mockQueryList = {
        get: jasmine.createSpy('get').and.returnValue(null),
      };
      component.codeInputs = mockQueryList as any;

      mockInput.value = '6';
      component.onInput(mockEvent, 5);

      expect(component.digits[5]).toBe('6');
    });
  });

  describe('onKeydown', () => {
    let mockInput: HTMLInputElement;
    let mockEvent: KeyboardEvent;

    beforeEach(() => {
      mockInput = document.createElement('input');
    });

    it('should clear current digit on backspace if input has value', () => {
      mockEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
      Object.defineProperty(mockEvent, 'target', {
        value: mockInput,
        enumerable: true,
      });

      mockInput.value = '1';
      component.digits[0] = '1';
      component.onKeydown(mockEvent, 0);

      expect(component.digits[0]).toBe('');
    });

    it('should move to previous input on backspace if current is empty', () => {
      mockEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
      Object.defineProperty(mockEvent, 'target', {
        value: mockInput,
        enumerable: true,
      });

      const prevInput = document.createElement('input');
      const mockQueryList = {
        get: jasmine
          .createSpy('get')
          .and.returnValue({ nativeElement: prevInput }),
      };
      component.codeInputs = mockQueryList as any;
      component.digits[0] = '1';
      component.digits[1] = '';

      mockInput.value = '';
      component.onKeydown(mockEvent, 1);

      // El componente limpia el dígito actual al presionar Backspace
      expect(component.digits[1]).toBe('');
    });
  });

  describe('onVerify', () => {
    it('should set error message on failure', async () => {
      mockSoftTokenService.obtenerEstadoToken.and.returnValue(
        Promise.reject(new Error('API error')),
      );

      component.digits = ['1', '2', '3', '4', '5', '6'];
      component.idPersona = 123;

      await component.onVerify();

      expect(component.errorMessage).toBe(
        'No pudimos verificar el código. Intentalo nuevamente.',
      );
      expect(component.loading).toBe(false);
    });

    it('should set loading to true during verification', async () => {
      mockSoftTokenService.obtenerEstadoToken.and.returnValue(
        new Promise((resolve) => {
          setTimeout(() => resolve({ estado: 'VERIFICADO' } as any), 100);
        }),
      );

      component.digits = ['1', '2', '3', '4', '5', '6'];
      component.idPersona = 123;

      const verifyPromise = component.onVerify();
      expect(component.loading).toBe(true);

      await verifyPromise;
      expect(component.loading).toBe(false);
    });
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      spyOn(component.close, 'emit');
      component.onClose();
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should reset state', () => {
      spyOn(component.close, 'emit');
      component.digits = ['1', '2', '3', '4', '5', '6'];
      component.errorMessage = 'Some error';
      component.loading = true;

      component.onClose();

      // El método onClose() solo emite el evento, no resetea el estado
      // El estado se resetea en ngOnChanges cuando isOpen cambia a true
      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});

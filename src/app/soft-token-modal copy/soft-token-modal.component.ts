import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import './soft-token-modal.component.scss';
import { SoftTokenEstadoDTO } from '../rodados/interfaces/soft-token.dto';

@Component({
  selector: 'app-soft-token-modal',
  templateUrl: './soft-token-modal.component.html',
  styleUrls: ['./soft-token-modal.component.scss'],
})
export class SoftTokenModalComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() isOpen: boolean = false;
  @Input() idPersona: number | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<SoftTokenEstadoDTO>();

  @ViewChildren('codeInput') codeInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  digits: string[] = Array(6).fill('');
  loading: boolean = false;
  errorMessage: string | null = null;
  isBlocked: boolean = false;
  isMobile: boolean = false;
  isTokenVerified: boolean = false;
  isTokenCorrect: boolean = true; // Nueva bandera agregada
  bouncy: boolean = false; // Nueva bandera para animación
  intentos: number = 3; //contador de intentos de verificación softoken

  private readonly TOTAL_DIGITS = 6;
  private readonly MOBILE_BREAKPOINT = 768;

  constructor() {
    this.detectDeviceType();
  }

  ngOnInit(): void {
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => this.detectDeviceType());
  }

  ngAfterViewInit(): void {
    this.focusFirstInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.resetState();
      setTimeout(() => this.focusFirstInput(), 100);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.detectDeviceType());
    this.resetState();
  }

  get isComplete(): boolean {
    return this.digits.every((digit) => digit.length === 1);
  }

  get code(): string {
    return this.digits.join('');
  }

  private detectDeviceType(): void {
    this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  handleInput(event: Event, fieldIndex: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Solo permitir dígitos
    value = value.replace(/[^\d]/g, '');

    // Tomar solo el primer dígito si hay múltiples
    if (value.length > 1) {
      value = value[0];
    }

    // Actualizar el dígito en el array
    this.digits[fieldIndex] = value;
    // Forzar la actualización del array mediante una nueva referencia
    this.digits = [...this.digits];
    // Si el usuario empieza a escribir, restaurar el color negro
    this.isTokenCorrect = true;

    // Moverse al siguiente input si se ingresó un número y no es el último
    if (value && fieldIndex < this.TOTAL_DIGITS - 1) {
      setTimeout(() => {
        this.focusInput(fieldIndex + 1);
      }, 10);
    }
  }

  handleKeydown(event: KeyboardEvent, fieldIndex: number): void {
    const input = event.target as HTMLInputElement;

    // Prevenir ingreso de caracteres no numéricos (excepto teclas de control)
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
    ];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Manejar Backspace
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.digits[fieldIndex] = '';
      this.digits = [...this.digits];

      // Moverse al campo anterior si existe
      if (fieldIndex > 0) {
        setTimeout(() => {
          this.focusInput(fieldIndex - 1);
        }, 10);
      }
      return;
    }

    // Manejar teclas numéricas
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      this.digits[fieldIndex] = event.key;
      this.digits = [...this.digits];

      // Moverse al siguiente input si no es el último
      if (fieldIndex < this.TOTAL_DIGITS - 1) {
        setTimeout(() => {
          this.focusInput(fieldIndex + 1);
        }, 10);
      }
    }
  }

  async onVerify(): Promise<void> {
    if (!this.isComplete || this.loading) return;

    this.loading = true;
    this.errorMessage = null;

    // Incrementar contador de intentos
    this.intentos--;

    try {
      const estado = {};
      // Marcar el token como verificado
      //this.isTokenVerified = true;
      this.verified.emit(estado);
      this.isTokenCorrect = true;
    } catch (error) {
      this.errorMessage =
        'No pudimos verificar el código. Intentalo nuevamente.';
      this.isTokenCorrect = false;
      this.bouncy = false;
      setTimeout(() => {
        this.bouncy = true;
      }, 10);
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  private focusFirstInput(): void {
    this.focusInput(0);
  }

  private focusInput(index: number): void {
    if (this.codeInputs && index >= 0 && index < this.TOTAL_DIGITS) {
      const input = this.codeInputs.get(index);
      if (input) {
        input.nativeElement.focus();
      }
    }
  }

  private resetState(): void {
    this.digits = Array(this.TOTAL_DIGITS).fill('');
    this.loading = false;
    this.errorMessage = null;
    this.isBlocked = false;
    this.isTokenVerified = false;
    this.intentos = 3;
    this.isTokenCorrect = false;
    this.bouncy = false; // Reiniciar la bandera bouncy
  }
}

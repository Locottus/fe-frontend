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

import { SoftTokenEstadoDTO } from '../rodados/interfaces/soft-token.dto';
import { SoftTokenService } from '../rodados/services/soft-token.service';

@Component({
  selector: 'app-soft-token-modal',
  standalone: false,
  templateUrl: './soft-token-modal.component.html',
  styleUrls: ['./soft-token-modal.component.scss'],
})
export class SoftTokenModalComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  private readonly TOTAL_DIGITS = 6;
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly DEFAULT_INTENTOS = 3;
  private readonly resizeHandler = () => this.detectDeviceType();

  estadoToken: SoftTokenEstadoDTO = {
    intentosRestantes: this.DEFAULT_INTENTOS,
    bloqueado: false,
    activo: true,
  };

  // Métodos públicos para compatibilidad con tests
  onInput(event: Event, fieldIndex: number): void {
    this.handleInput(event, fieldIndex);
  }

  onKeydown(event: KeyboardEvent, fieldIndex: number): void {
    this.handleKeydown(event, fieldIndex);
  }
  @Input() isOpen: boolean = false;
  @Input() idPersona: number | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<SoftTokenEstadoDTO>();

  @ViewChildren('codeInput') codeInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  digits: string[] = Array(this.TOTAL_DIGITS).fill('');
  loading: boolean = false;
  errorMessage: string | null = null;
  isMobile: boolean = true;
  isTokenCorrect: boolean = true; // Nueva bandera agregada
  bouncy: boolean = false; // Nueva bandera para animación

  constructor(private softTokenService: SoftTokenService) {
    this.detectDeviceType();
    this.resetState();
  }

  ngOnInit(): void {
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', this.resizeHandler);
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
    window.removeEventListener('resize', this.resizeHandler);
    this.resetState();
  }

  get isComplete(): boolean {
    return this.digits.every((digit) => digit.length === 1);
  }

  get code(): string {
    return this.digits.join('');
  }

  get intentosRestantes(): number {
    return this.estadoToken.intentosRestantes ?? this.DEFAULT_INTENTOS;
  }

  get bloqueado(): boolean {
    return Boolean(this.estadoToken.bloqueado);
  }

  get activo(): boolean {
    if (this.estadoToken.activo === undefined) {
      return true;
    }
    return Boolean(this.estadoToken.activo);
  }

  private detectDeviceType(): void {
    this.isMobile = true;
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

    if (this.bloqueado) {
      this.errorMessage =
        'Token bloqueado. Ingresá a la App para desbloquearlo.';
      return;
    }

    if (this.idPersona == null) {
      this.errorMessage =
        'Falta el identificador de persona para validar el token.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      const estado = await this.softTokenService.obtenerEstadoToken(
        this.idPersona,
      );
      const intentosRestantes =
        estado.intentosRestantes ?? this.DEFAULT_INTENTOS;
      const bloqueado =
        estado.bloqueado ?? estado.estado?.toUpperCase() === 'BLOQUEADO';

      this.estadoToken = {
        ...this.estadoToken,
        ...estado,
        bloqueado,
        intentosRestantes,
      };

      this.isTokenCorrect = !this.bloqueado;

      if (this.bloqueado) {
        this.errorMessage =
          'Token bloqueado. Ingresá a la App para desbloquearlo.';
        return;
      }

      this.errorMessage = null;
      this.verified.emit(this.estadoToken);
    } catch (error) {
      const remainingAttempts = Math.max(this.intentosRestantes - 1, 0);
      const bloqueado =
        (this.estadoToken.bloqueado ?? false) || remainingAttempts <= 0;
      this.estadoToken = {
        ...this.estadoToken,
        intentosRestantes: remainingAttempts,
        bloqueado,
      };

      this.errorMessage = this.bloqueado
        ? 'Token bloqueado. Ingresá a la App para desbloquearlo.'
        : 'No pudimos verificar el código. Intentalo nuevamente.';
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

  getInputStyle(): Record<string, string> {
    return {
      width: '48px',
      height: '60px',
      border: 'none',
      'border-bottom': '2px solid #cfd2df',
      background: 'transparent',
      'text-align': 'center',
      'font-size': '30px',
      'font-weight': '600',
      color: this.isTokenCorrect ? '#2b2f3a' : '#b10a2e',
      outline: 'none',
    };
  }

  getModalStyle(): Record<string, any> {
    return {
      gap: '$sm',
      maxWidth: 'auto',
    };
  }

  getContentStyle(): Record<string, any> {
    return {
      gap: '16px',
      padding: '0 16px',
      '@md': { gap: '18px', padding: '0 24px' },
    };
  }

  getStackStyle(): Record<string, any> {
    return { gap: '14px' };
  }

  getInfoTextStyle(): Record<string, any> {
    return {
      color: '#7b8094',
      lineHeight: '1.5',
      textAlign: 'center',
    };
  }

  getInputStackStyle(): Record<string, any> {
    return {
      gap: '12px',
      width: '100%',
      flexWrap: 'nowrap',
    };
  }

  getFooterStyle(): Record<string, any> {
    return {
      flexDirection: 'column',
      gap: '12px',
      padding: '0 $sm',
      alignItems: 'center',
      '@md': {
        flexDirection: 'column',
        gap: '12px',
        padding: '0 $sm',
        alignItems: 'center',
      },
    };
  }

  private resetState(): void {
    this.digits = Array(this.TOTAL_DIGITS).fill('');
    this.loading = false;
    this.errorMessage = null;
    this.estadoToken = {
      intentosRestantes: this.DEFAULT_INTENTOS,
      bloqueado: false,
      activo: true,
    };
    this.isTokenCorrect = true;
    this.bouncy = false; // Reiniciar la bandera bouncy
    this.isMobile = true;
  }
}

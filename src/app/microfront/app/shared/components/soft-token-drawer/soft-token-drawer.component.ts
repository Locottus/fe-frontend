import { Component, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren, ElementRef } from '@angular/core';
import { SoftTokenService } from 'src/app/modules/rodados/services/soft-token.service';
import { SoftTokenEstadoDTO } from 'src/app/modules/rodados/interfaces/soft-token.dto';

@Component({
  selector: 'app-soft-token-drawer',
  templateUrl: './soft-token-drawer.component.html'
})
export class SoftTokenDrawerComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() idPersona: number | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<SoftTokenEstadoDTO>();

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  digits: string[] = Array(6).fill('');
  loading: boolean = false;
  errorMessage: string | null = null;
  isMobile: boolean = false;
  isBlocked: boolean = false; // Controla si el token está bloqueado
  
  constructor(
    private softTokenService: SoftTokenService
  ) {
    this.isMobile = this.softTokenService.isMobile();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.resetState();
    }
  }

  get isComplete(): boolean {
    return this.digits.every((d) => d.length === 1);
  }

  get code(): string {
    return this.digits.join('');
  }

  onInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const clean = (inputEl.value || '').replace(/\D/g, '').slice(0, 1);
    this.digits[index] = clean;
    inputEl.value = clean;

    if (clean && this.codeInputs && this.codeInputs.get(index + 1)) {
      this.codeInputs.get(index + 1)!.nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      if (inputEl.value) {
        this.digits[index] = '';
        return;
      }
      if (this.codeInputs && this.codeInputs.get(index - 1)) {
        this.codeInputs.get(index - 1)!.nativeElement.focus();
        this.digits[index - 1] = '';
      }
    }
  }

  async onVerify(): Promise<void> {
    if (!this.isComplete || this.loading) return;
    if (!this.idPersona) {
      this.errorMessage = 'Falta el identificador de persona para validar el token.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      const estado = await this.softTokenService.obtenerEstadoToken(this.idPersona);
      this.verified.emit(estado);
    } catch (error) {
      this.errorMessage = 'No pudimos verificar el código. Intentalo nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.close.emit();
    this.resetState();
  }

  private resetState(): void {
    this.digits = Array(6).fill('');
    this.loading = false;
    this.errorMessage = null;
    this.isBlocked = false;
    if (this.codeInputs) {
      setTimeout(() => {
        const first = this.codeInputs.get(0);
        if (first) {
          first.nativeElement.focus();
        }
      });
    }
  }
}

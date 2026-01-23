import { Component, Input, OnInit } from '@angular/core';
import { FaqService } from '../../../shared/services/faq.service';
import { FaqDTO } from '../../../shared/models/faq.dto';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss']
})
export class PreguntasFrecuentesComponent implements OnInit {
  @Input() colorBg: string;
  @Input() pfType: 'fluid' | 'fixed';

  public pfStyle: any;
  isLoading = true;
  isMobile: boolean;

  pregFrecuentes: FaqDTO = null;

  constructor(
    public faqService: FaqService,
    public globalService: GlobalService,
    public router: Router,
    private layoutRemoteService: LayoutRemoteService,
    private authService: AuthService
  ) {
    if (location.pathname.includes('root')) {
      this.layoutRemoteService.ocultarLayout({ ocultarTodo: true });
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isMobile = this.authService.getAuthMethod() === 'mobile';
    this.pfStyle = {
      background: this.colorBg,
      '@md': { padding: '$lg $md', gap: '$lg' }
    };

    const headerEvent = new CustomEvent('customizeHeaderEvent', {
      detail: {
        title: 'Préstamos Prendarios',
        showCloseButton: false,
        showBackButton: true,
        hideLogo: false,
        actionBackButton: () => this.router.navigate(['rodados/solicitudes']),
        actionCloseButton: null
      }
    });

    window.dispatchEvent(headerEvent);

    this.obtenerFaq();
  }

  obtenerFaq(): void {
    if (!this.globalService.getExistePreguntasFrecuentes()) {
      this.faqService.getFaqs().subscribe({
        next: (faq) => {
          this.pregFrecuentes = faq;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener las preguntas frecuentes: ', error);
        }
      });
    } else {
      this.pregFrecuentes = this.globalService.getFaqs();
      this.isLoading = false;
    }
  }

  backAction() {
    this.router.navigate(['/solicitudes']);
  }
}

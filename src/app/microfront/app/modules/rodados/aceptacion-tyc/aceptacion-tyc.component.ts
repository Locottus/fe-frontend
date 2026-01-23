import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';
import { RoutingService } from 'src/app/core/services/routing.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Cliente } from 'src/app/shared/models/cliente';

@Component({
  selector: 'app-aceptacion-tyc',
  templateUrl: './aceptacion-tyc.component.html',
  styleUrls: ['./aceptacion-tyc.component.scss']
})
export class AceptacionTycComponent implements OnInit, AfterViewChecked {
  email = '';
  cliente: Cliente;
  isMobile: boolean;

  constructor(
    private route: RoutingService, 
    private layoutRemoteService: LayoutRemoteService,
    public clienteService: ClienteService,
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) 
  {
    if (location.pathname.includes('root')) {
      this.layoutRemoteService.ocultarLayout({ ocultarTodo: true });
    }
  }

  ngOnInit(): void {
    this.cliente = this.clienteService.getClienteSession();
    this.email = this.cliente.email;
    this.isMobile = this.authService.getAuthMethod() === 'mobile';
  }
  ngAfterViewChecked(): void {
    window.dispatchEvent(new CustomEvent('internalLoadingEvent', { detail: { loading: false, remote: 'feObiRodados' } }));
  }


  backAction() {
    this.route.navigate('/solicitudes');
  }

  salir() {
    // Analytics: click en botón "Salir"
    this.analyticsService.googleAnalyticsClick('button', 'Salir');
    this.route.navigate('rodados/procesando-solicitud');
  }
}

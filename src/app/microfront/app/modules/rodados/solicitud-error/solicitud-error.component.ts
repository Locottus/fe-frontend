import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/core/services/routing.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutRemoteService } from 'src/app/core/services/layout-remote.service';

@Component({
  selector: 'app-solicitud-error',
  templateUrl: './solicitud-error.component.html',
  styleUrls: ['./solicitud-error.component.scss']
})
export class SolicitudErrorComponent implements OnInit {
  isMobile: boolean;

  constructor(
    private route: RoutingService,
    private layoutRemoteService: LayoutRemoteService,
    private authService: AuthService
  ) {
    if (location.pathname.includes('root')) {
      this.layoutRemoteService.ocultarLayout({ ocultarTodo: true });
    }
  }

  ngOnInit(): void {
    this.isMobile = this.authService.getAuthMethod() === 'mobile';
  }

  navegar(value: boolean) {
    if (!value) {
      this.route.navigate('/');
    } else {
      this.route.navigate('/rodados/solicitudes');
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { QualtricsService } from 'src/app/core/services/qualtrics.service';
import { RoutingService } from 'src/app/core/services/routing.service';
import { ClienteRoda } from '../../models/cliente';
@Component({
  selector: 'app-header-paginas-internas',
  templateUrl: './header-paginas-internas.component.html',
  styleUrls: ['./header-paginas-internas.component.scss']
})
export class HeaderPaginasInternasComponent implements OnInit {

  @Input() linkPasoAtras: string;
  @Input() title: string;
  @Output() emitClickPasoAtras = new EventEmitter<boolean>();
  mostrarLogo = false;
  hasOptionsTitle = false;
  optionsTitle = '';
  hasNotifications = false;
  options: [
  ];
  user: ClienteRoda = {
    nombre: 'Usuario',
    apellido: 'Ejemplo',
    imagen: 'src/assets/icons/icon-contacto-svg',
    ultimo_login: new Date(),
    fecha_expiracion_clave: new Date()
  };
  notificationsList: [
    {
      icon: 'wallet',
      title: 'Titulo de Notificacion',
      subtitle: 'Bajada de Notif',
      action: () => {
        alert();
      },
    },
    {
      icon: 'wallet',
      title: 'Titulo de Notificacion 2',
      subtitle: 'Bajada de Notif 2',
      action: () => {
        alert();
      },
    },
  ];


  constructor(
    private readonly router: Router,
    // private readonly routingService: RoutingService // para el boton de ruteo
  ) { }

  ngOnInit(): void {
    if (location.pathname.includes('solicitudes')) {
      // this.botonPasoAtras = false;
    }
    if (window.innerWidth > 560) {
      this.mostrarLogo = true;
    }
  }

  navegar() {
    this.router.navigate([this.linkPasoAtras]);
  }

  onResize(event) {
    if (event.target.innerWidth > 560) {
      this.mostrarLogo = true;
    } else {
      this.mostrarLogo = false;
    }
  }

  navegarAObi() {
  }

  cerrar() {
    this.navegarAObi();
  }

  clickAtras() {
    this.emitClickPasoAtras.emit(true);
  }

  get estaDentroDeRoot() {
    return location.pathname.includes('root');
  }

  redireccionarEnRoot(url: string) {
  }

  extraIconAction() {
  }

  perfilAction() {
  }

  settingsAction() {
  }

  securityAction() {
  }

  moreNotificationsAction() {
  }
}

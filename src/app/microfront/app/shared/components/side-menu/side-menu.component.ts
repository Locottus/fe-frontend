import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Cliente, ClienteClubBeneficioId } from '../../models/cliente';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClienteService } from '../../../core/services/cliente.service';

interface MenuItem {
  id?: string;
  title: string;
  iconClass: string;
  linkClass?: string;
  visible?: boolean;
  action(): void;
}

enum Targets {
  _SELF = '_self',
  _BLANK = '_blank',
  _PARENT = '_parent',
  _TOP = '_top'
}

@Component({
  selector: 'shared-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  subscriptionHabilitacion: Subscription;
  subscriptionClubBeneficio: Subscription;
  subscriptionEsCuentaNegocio: Subscription;

  lastLoginDate: Date = null;

  estaHabilitadoInternaTarjeta: boolean;
  estaHabilitadoInternaTransferencias: boolean;
  estaHabilitadoInternaPrestamos: boolean;
  estaHabilitadoInternaCuentas: boolean;

  @Output() $sideMenuState: EventEmitter<boolean> = new EventEmitter();

  public menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      action: () => this.navigateTo('Resumen', '/mis-productos'),
      iconClass: 'icon-summary',
    },
    {
      id: 'menuItemCuentas',
      title: 'Cuentas',
      action: () => this.navigateToCuentas(),
      iconClass: 'icon-accounts',
      linkClass: 'link-es-nuevo'
    },
    {
      id: 'menuItemTarjetas',
      title: 'Tarjetas',
      action: () => this.navigateToTarjetas(),
      iconClass: 'icon-creditcards',
      linkClass: 'link-es-nuevo'
    },
    {
      title: 'Prestamos',
      action: () => this.navigateToPrestamos(),
      iconClass: 'icon-loans'
    },
    {
      id: 'sideMenuInversiones',
      title: 'Inversiones',
      action: () => this.navigateToInversiones(),
      iconClass: 'icon-investments'
    },
    {
      title: 'Seguros',
      action: () => this.navigateToExternalHbi('Inversiones', 'seguros'),
      iconClass: 'icon-insurances'
    },
    {
      id: 'menuItemTransferencias',
      title: 'Transferencias',
      action: () => this.navigateToTransferencias(),
      iconClass: 'icon-transfers',
      linkClass: 'link-es-nuevo'
    },
    {
      title: 'Pagos',
      action: () => this.navigateToExternalHbi('Pagos', 'pagos'),
      iconClass: 'icon-servicepayments'
    },
    {
      title: 'Extracción sin Tarjeta',
      action: () => this.navigateTo('Extraccion sin tarjeta', '/extraccion-sin-tarjeta'),
      iconClass: 'icon-extraction',
      visible: false
    },
    {
      id: 'menuItemClubSupervielle',
      title: 'Club Supervielle',
      action: () => {
        this.navigateTo('Club Supervielle', '/club-supervielle');
        this.navigateToExternal('Club Supervielle', '/Pages/TravelersClub/ClubSupervielleJump.aspx');
      },
      iconClass: 'icon-supervielleclub',
      visible: false
    },
    {
      id: 'menuItem123Chances',
      title: '123 Chances',
      action: () => this.navigateToExternalHbi('123 Chances', '123Chances'),
      iconClass: 'icon-123-chances',
      visible: false
    },
    {
      title: 'Tienda Supervielle',
      action: () => this.navigateToExternal('Tienda Supervielle', 'https://www.tiendasupervielle.com/'),
      iconClass: 'icon-storesupervielle'
    },
    {
      id: 'menuItemMiNegocio',
      title: 'Mi Negocio',
      action: () => {
        this.navigateTo('Mi Negocio', '/mi-negocio');
        this.navigateToExternal('Mi Negocio', '/Pages/MyBusiness/MiNegocioJump.aspx');
      },
      iconClass: 'icon-minegocio',
      visible: false
    }
  ];

  public secundaryMenuItems: MenuItem[] = [
    {
      title: 'Ayuda',
      action: () => this.navigateToExternal('Ayuda', 'https://www.supervielle.com.ar/tutoriales'),
      iconClass: 'icon-help'
    },
    {
      id: 'sideMenuAtencionVirtual',
      title: 'Atención Virtual',
      action: () => this.navigateToHubVirtual(),
      iconClass: 'icon-hub-virtual',
    },
    {
      title: 'Consultas y reclamos',
      action: () => this.navigateToExternalSelf('Consultas y reclamos', '/obi/reclamos'),
      iconClass: 'icon-reclamos',
      linkClass: 'link-es-nuevo',
    },
    {
      id: 'sideMenuLogout',
      title: 'Cerrar sesión',
      action: () => this.logout(),
      iconClass: 'icon-logout'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private clienteService: ClienteService
  ) {

  }

  ngOnInit(): void {
    this.setUserLastLoginDate();
    this.getClubBeneficio();
  }

  ngOnDestroy(): void {
    this.subscriptionHabilitacion.unsubscribe();
    this.subscriptionClubBeneficio.unsubscribe();
    this.subscriptionEsCuentaNegocio.unsubscribe();
  }

  navigateTo(section: string, path: string) {
    this.router.navigate([path]);
    this.close();
  }

  navigateToExternalHbi(section: string, queryValue: string) {
    window.location.href = '/DefaultObi.aspx?mostrar=' + queryValue;
  }

  navigateToExternal(section: string, url: string) {
    window.open(url, '_blank');
    this.close();
  }


  navigateToExternalSelf(section: string, url: string) {
    window.location.href = url;
    this.close();
  }

  navigateToTarjetas() {
    return this.estaHabilitadoInternaTarjeta ? this.navigateToExternalSelf('Tarjetas', '/obi/tarjetas/')
      : this.navigateToExternalHbi('Tarjetas', 'tarjetas');
  }

  navigateToTransferencias() {
    return this.estaHabilitadoInternaTransferencias ? this.navigateToExternalSelf('Transferencias', '/obi/transferencias')
      : this.navigateToExternalHbi('Transferencias', 'transferencias');
  }

  navigateToPrestamos() {
    return this.estaHabilitadoInternaPrestamos ? this.navigateToExternalSelf('Prestamos', '/obi/prestamos/home')
      : this.navigateToExternalHbi('Prestamos', 'prestamos');
  }

  navigateToCuentas() {
    return this.estaHabilitadoInternaCuentas ? this.navigateToExternalSelf('Cuentas', '/obi/cuentas/')
      : this.navigateToExternalHbi('Cuentas', 'cuentas');

  }

  navigateToInversiones() {
    return this.navigateToExternalSelf('Inversiones', '/obi/inversiones/home');
  }

  navigateToHubVirtual() {
    return this.navigateToExternalSelf('Atencion Virtual', '/obi/hub-virtual');
  }

  setUserLastLoginDate() {

    const cliente: Cliente = JSON.parse(sessionStorage.getItem('cliente'));
    this.lastLoginDate = cliente?.ultimo_login;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  close(): void {
    this.$sideMenuState.emit(false);
  }

  goBack(): void {
    window.location.href = '/Default.aspx';
  }

  private getClubBeneficio() {
    this.subscriptionClubBeneficio = this.clienteService.getcliente$().subscribe(
      cliente => {
        switch (cliente.club_beneficio_id) {
          case ClienteClubBeneficioId.clubSupervielle:
            this.menuItems.find(i => i.id === 'menuItemClubSupervielle').visible = true;
            break;
          case ClienteClubBeneficioId._123Chances:
            this.menuItems.find(i => i.id === 'menuItem123Chances').visible = true;
            break;
        }
      }
    );
  }
}

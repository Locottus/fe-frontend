import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';
import { Cliente } from '../../models/cliente';
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, ChildActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  nombre = '';
  isNotificationDrawerOpen = false;
  mostrarAvisoNotificacion = false;
  @Output() $sideMenuState: EventEmitter<boolean> = new EventEmitter<boolean>();
  subscriptions: Subscription[] = [];
  breadcrumbItems: string[] = [];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private routerService: Router,
    private activatedRouteService: ActivatedRoute,
  ) {
    this.matIconRegistry.addSvgIcon(
      'notificaciones',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/notificaciones.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'icon-logout-grey',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/icon-logout-grey.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'flecha-derecha',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/flecha-derecha.svg')
    );

    const routerSub = this.routerService.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getBreadcrumbItems(this.activatedRouteService.root);
      });

    this.subscriptions.push(routerSub);
  }

  ngOnInit(): void {
    this.getDatosHeader();
    const subscription = this.notificacionService.getMostrarAvisoNotificacion$().subscribe(
      item => {
        this.mostrarAvisoNotificacion = item;
      });

    this.subscriptions.push(subscription);
  }

  getDatosHeader(): void {
    const clienteData = sessionStorage.getItem('cliente');
    if (clienteData) {
      try {
        const cliente: Cliente = JSON.parse(clienteData);
        this.nombre = cliente?.nombre;
      } catch (error) {
        console.error('Error parsing cliente data from sessionStorage:', error);
        this.nombre = '';
      }
    } else {
      this.nombre = '';
    }
  }

  openMenu(): void {
    this.$sideMenuState.emit(true);
  }

  toggleNotificationDrawer(): void {
    this.notificacionService.setMostrarAvisoNotificacion(false);
    this.isNotificationDrawerOpen = !this.isNotificationDrawerOpen;
  }

  salir(): void {
    localStorage.removeItem('token');
  }

  getBreadcrumbItems(route: ActivatedRoute) {
    const breadcrumbItems: string[] = [];
    let childRoute: ActivatedRouteSnapshot = route.snapshot.children[0];

    while (childRoute) {
      const titluoBreadcrumb = childRoute.data.titulo;

      if (titluoBreadcrumb) {
        breadcrumbItems.push(titluoBreadcrumb);
      }

      childRoute = childRoute.children ? childRoute.children[0] : null;
    }

    this.breadcrumbItems = breadcrumbItems;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}

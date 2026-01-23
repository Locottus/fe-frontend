// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
// import {SideMenuComponent} from './side-menu.component';
// import {AuthService} from '../../../core/services/auth.service';
// import {By} from '@angular/platform-browser';
// import * as moment from 'moment';
// import {Cliente, ClienteClubBeneficioId, Preferencias} from '../../models/cliente';
// import {RouterTestingModule} from '@angular/router/testing';
// import {GoogleAnalyticsService} from 'src/app/core/services/google-analytics.service';
// import {HabilitacionService} from 'src/app/core/services/habilitacion.service';
// import {of, Subscription} from 'rxjs';
// import {ClienteService} from '../../../core/services/cliente.service';
// import {CuentaService} from '../../../modules/home/services/cuenta.service';

// describe('SideMenuComponent', () => {
//   let component: SideMenuComponent;
//   let fixture: ComponentFixture<SideMenuComponent>;
//   let mockAuthService;
//   let mockHabilitacionService;
//   let mockClienteService;
//   let mockCuentaService;
//   let mockCliente: Cliente;
//   let mockPreferencias: Preferencias;
//   let mockGoogleAnalyticsService;
//   const mockRespuestaHabilitado = { esta_habilitado: true };
//   beforeEach(async(() => {

//     mockAuthService = {
//         salir: jest.fn()
//     };

//     mockPreferencias = {
//       clave_por_vencer: false, vio_menu: true, vio_notificacion_clave: false
//     };

//     mockCliente = {
//       nombre: 'Nombre de usuario',
//       apellido: 'Apellido de usuario',
//       ultimo_login: moment('2000-01-01T00:00:00').toDate(),
//       preferencias: mockPreferencias,
//       fecha_expiracion_clave: new Date(),
//       email: '',
//       cuil: '20134987655',
//       tiene_activa_clave_sms: false,
//       celular: ''
//     };

//     mockGoogleAnalyticsService = {
//         abrioMenu: jest.fn(),
//         cerroMenu: jest.fn(),
//         clickEnMenu: jest.fn()
//     };

//     mockHabilitacionService = {
//       getHabilitacion$: jest.fn(),
//       getHabilitacionInternaTarjetas$: jest.fn(),
//       estaHabilitado: jest.fn(),
//       getHabilitacionInternaCuentas$: jest.fn(),
//       getHabilitacionHubVirtual$: jest.fn(),
//     };

//     mockClienteService = {
//       getcliente$: jest.fn()
//     };

//     mockCuentaService = {
//       getEsCuentaNegocio$: jest.fn()
//     };

//     mockHabilitacionService.getHabilitacion$.mockReturnValue(of(false));
//     mockHabilitacionService.getHabilitacionInternaTarjetas$.mockReturnValue(of(true));
//     mockHabilitacionService.estaHabilitado.mockReturnValue(of(mockRespuestaHabilitado));
//     mockHabilitacionService.getHabilitacionInternaCuentas$.mockReturnValue(of(true));
//     mockHabilitacionService.getHabilitacionHubVirtual$.mockReturnValue(of(false));
//     mockCuentaService.getEsCuentaNegocio$.mockReturnValue(of(false));

//     TestBed.configureTestingModule({
//       imports: [ RouterTestingModule ],
//       declarations: [ SideMenuComponent ],
//       providers: [
//         { provide: AuthService, useValue: mockAuthService },
//         { provide: HabilitacionService, useValue: mockHabilitacionService},
//         { provide: GoogleAnalyticsService, useValue: mockGoogleAnalyticsService },
//         { provide: ClienteService, useValue: mockClienteService },
//         { provide: CuentaService, useValue: mockCuentaService }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     sessionStorage.setItem('cliente', JSON.stringify(mockCliente));
//     fixture = TestBed.createComponent(SideMenuComponent);
//     component = fixture.componentInstance;
//     component.subscriptionEsCuentaNegocio = new Subscription();
//     component.subscriptionHabilitacion = new Subscription();
//     component.subscriptionClubBeneficio = new Subscription();
//   });

//   afterEach(() => {
//     sessionStorage.removeItem('cliente');
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('debería hacer el logout del usuario y redirigirlo', () => {
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.detectChanges();
//     const logoutButton  = fixture.debugElement.query(By.css('#sideMenuLogout'));
//     logoutButton.triggerEventHandler('click', null);

//     expect(mockAuthService.salir).toHaveBeenCalledWith(true);
//     expect(mockGoogleAnalyticsService.clickEnMenu).toHaveBeenCalledWith('Cerrar sesión');
//   });

//   it('debería emitir evento para cerrar el SideMenu', () => {
//     spyOn(component.$sideMenuState, 'emit');
//     const sideMenuCloseButton  = fixture.debugElement.query(By.css('#sideMenuClose'));
//     sideMenuCloseButton.triggerEventHandler('click', null);

//     expect(component.$sideMenuState.emit).toHaveBeenCalledWith(false);
//   });

//   it('debería aparecer la última fecha de login del usuario', () => {
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.detectChanges();
//     const lastLoginElem  = fixture.debugElement.query(By.css('.obi-menu-footer .last-connection'));
//     expect(lastLoginElem.nativeElement.textContent).toBe('Última conexión: 01/01/2000 00:00');
//   });

//   it('debería mostrar la opción de Club Supervielle si el beneficio del cliente es 35', () => {
//     mockCliente.club_beneficio_id = ClienteClubBeneficioId.clubSupervielle;
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.detectChanges();
//     const clubSupervielleMenu = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemClubSupervielle'));
//     expect(clubSupervielleMenu.nativeElement.textContent).toBe('Club Supervielle');
//   });

//   it('debería mostrar la opción de 123Chances si el beneficio del cliente es 34', () => {
//     mockCliente.club_beneficio_id = ClienteClubBeneficioId._123Chances;
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.detectChanges();
//     const _123CHANCES_MENU = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItem123Chances'));
//     expect(_123CHANCES_MENU.nativeElement.textContent).toBe('123 Chances');
//   });

//   it('debería no mostrar las opciones de Club Supervielle y 123Chances si el beneficio del cliente no se informa', () => {
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.detectChanges();
//     const clubSupervielleMenu = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemClubSupervielle'));
//     const _123CHANCES_MENU = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItem123Chances'));
//     expect(clubSupervielleMenu).toBeNull();
//     expect(_123CHANCES_MENU).toBeNull();
//   });

//   it('debería no mostrar las opciones de Club Supervielle y 123Chances si el beneficio del cliente es 0', () => {
//     mockCliente.club_beneficio_id = ClienteClubBeneficioId.sinClubBeneficio;
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.detectChanges();
//     const clubSupervielleMenu = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemClubSupervielle'));
//     const _123CHANCES_MENU = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItem123Chances'));
//     expect(clubSupervielleMenu).toBeNull();
//     expect(_123CHANCES_MENU).toBeNull();
//   });

//   it('deberia mostrar la opcion de Mi Negocio si el cliente posicion cuentas devuelve true', () => {
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     mockCuentaService.getEsCuentaNegocio$.mockReturnValue(of(true));
//     fixture.detectChanges();
//     const miNegocioMenu = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemMiNegocio'));
//     expect(miNegocioMenu.nativeElement.textContent).toBe('Mi Negocio');
//   });

//   it('no deberia mostrar la opcion de Mi Negocio si el cliente posicion cuentas devuelve false', () => {
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     mockCuentaService.getEsCuentaNegocio$.mockReturnValue(of(false));
//     fixture.detectChanges();
//     const miNegocioMenu = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemMiNegocio'));
//     expect(miNegocioMenu).toBeNull();
//   });

//   it('debería redirigir a Tarjetas cuando se hace click en Tarjetas y el usuario está habilitado', () => {
//     jest.spyOn(fixture.componentInstance, 'navigateToExternalSelf');

//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.componentInstance.estaHabilitadoInternaTarjeta = true;
//     fixture.detectChanges();
//     const tarjetasButton  = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemTarjetas'));
//     tarjetasButton.triggerEventHandler('click', null);

//     expect(fixture.componentInstance.navigateToExternalSelf).toHaveBeenCalledWith('Tarjetas', '/obi/tarjetas/');
//   });


//   it('debería redirigir a Transferencias cuando se hace click en Transferencias y el usuario está habilitado', () => {
//     jest.spyOn(fixture.componentInstance, 'navigateToExternalSelf');

//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.componentInstance.estaHabilitadoInternaTransferencias = true;
//     fixture.detectChanges();
//     const tarjetasButton  = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemTransferencias'));
//     tarjetasButton.triggerEventHandler('click', null);

//     expect(fixture.componentInstance.navigateToExternalSelf).toHaveBeenCalledWith('Transferencias', '/obi/transferencias');
//   });

//   it('debería redirigir a Cuentas cuando se hace click en Cuentas y el usuario está habilitado', () => {
//     jest.spyOn(fixture.componentInstance, 'navigateToExternalSelf');

//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     fixture.componentInstance.estaHabilitadoInternaCuentas = true;
//     fixture.detectChanges();
//     const cuentasButton  = fixture.debugElement.query(By.css('.obi-menu-list__link#menuItemCuentas'));
//     cuentasButton.triggerEventHandler('click', null);

//     expect(fixture.componentInstance.navigateToExternalSelf).toHaveBeenCalledWith('Cuentas', '/obi/cuentas/');

//   });

//   it('debería no visualizarse la opcion de acceso a Atencion Virtual', () => {
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     mockHabilitacionService.getHabilitacionHubVirtual$.mockReturnValue(of(false));
//     fixture.detectChanges();
//     const atencionVirtual = fixture.debugElement.query(By.css('.obi-menu-list__item #sideMenuAtencionVirtual'));
//     expect(atencionVirtual).toBeNull();
//   });

//   it('debería visualizarse la opcion de acceso a Atencion Virtual', () => {

//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     mockHabilitacionService.getHabilitacionHubVirtual$.mockReturnValue(of(true));
//     fixture.detectChanges();
//     const atencionVirtual = fixture.debugElement.query(By.css('.obi-menu-list__item #sideMenuAtencionVirtual'));
//     expect(atencionVirtual.nativeElement.textContent).toBe('Atención Virtual');
//   });

//   it('debería visualizarse la opcion de acceso a Inversiones', () => {
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     mockHabilitacionService.getHabilitacionHubVirtual$.mockReturnValue(of(true));
//     fixture.detectChanges();
//     const atencionVirtual = fixture.debugElement.query(By.css('.obi-menu-list__item #sideMenuInversiones'));
//     expect(atencionVirtual.nativeElement.textContent).toBe('Inversiones');
//   });

//   it('debería visualizarse la opcion de acceso a Inversiones', () => {
//     jest.spyOn(component, 'navigateToInversiones');
//     mockClienteService.getcliente$.mockReturnValue(of(mockCliente));
//     mockHabilitacionService.getHabilitacionHubVirtual$.mockReturnValue(of(true));
//     fixture.detectChanges();
//     const inversionesOpcionMenu = fixture.debugElement.query(By.css('.obi-menu-list__item #sideMenuInversiones'));
//     inversionesOpcionMenu.triggerEventHandler('click', null);
//     expect(component.navigateToInversiones).toHaveBeenCalled();
//   });

// });

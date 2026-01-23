import { SettingsHttpService } from './settings-http.service';

describe('SettingsHttpService', () => {
  let service: SettingsHttpService;
  let httpMock: any;
  let settingsServiceMock: any;
  let authServiceMock: any;
  let clienteServiceMock: any;
  let routingServiceMock: any;

  beforeEach(() => {
    httpMock = {
      get: jasmine.createSpy('get').and.returnValue({
        toPromise: () => Promise.resolve({ baseUrl: 'test', backendUrl: 'test', jwtProviderUrl: 'jwt' })
      })
    };
    settingsServiceMock = { settings: {} };
    authServiceMock = {
      fetchToken: jasmine.createSpy('fetchToken').and.returnValue({
        toPromise: () => Promise.resolve('test-token')
      })
    };
    clienteServiceMock = {
      getClienteSession: jasmine.createSpy('getClienteSession').and.returnValue(null),
      getCliente: jasmine.createSpy('getCliente').and.returnValue(Promise.resolve({}))
    };
    routingServiceMock = {
      logout: jasmine.createSpy('logout')
    };

    service = new SettingsHttpService(
      httpMock,
      settingsServiceMock,
      authServiceMock,
      clienteServiceMock,
      routingServiceMock
    );
    spyOn(localStorage, 'setItem');
  });

  it('should initialize app and fetch settings, token, cliente', async () => {
    await service.initializeApp();
    expect(httpMock.get).toHaveBeenCalled();
    expect(settingsServiceMock.settings).toEqual(jasmine.objectContaining({ baseUrl: 'test' }));
    expect(authServiceMock.fetchToken).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(clienteServiceMock.getCliente).toHaveBeenCalled();
  });

  it('should resolve if cliente is in session', async () => {
    clienteServiceMock.getClienteSession.and.returnValue({});
    await service.initializeApp();
    expect(clienteServiceMock.getCliente).not.toHaveBeenCalled();
  });

  it('should call logout and resolve if fetchToken fails', async () => {
    authServiceMock.fetchToken.and.returnValue({
      toPromise: () => Promise.reject('token error')
    });
    await service.initializeApp();
    expect(routingServiceMock.logout).toHaveBeenCalled();
  });

  it('should call logout and resolve if getCliente fails', async () => {
    clienteServiceMock.getCliente.and.returnValue(Promise.reject('cliente error'));
    await service.initializeApp();
    expect(routingServiceMock.logout).toHaveBeenCalled();
  });

});
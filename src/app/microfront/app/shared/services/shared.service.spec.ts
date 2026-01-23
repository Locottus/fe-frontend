import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: []
    });
    service = TestBed.inject(SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Deberia navegar hacia una url externa', () => {
    const navigateToResponseUrlSpy = spyOn<any>(service, 'redirect');
    const url = '/external-url';
    service.navigateToExternalUrl(url);
    expect(navigateToResponseUrlSpy).toHaveBeenCalledWith(`/external-url`);
  });

  it('Deberia navegar hacia url HBI', () => {
    const navigateToResponseUrlSpy = spyOn<any>(service, 'redirect');
    const url = 'prestamos';
    service.navigateToExternalHbi(url);
    expect(navigateToResponseUrlSpy).toHaveBeenCalledWith('/DefaultObi.aspx?mostrar=prestamos');
  });

  it('Deberia navegar hacia url HBI seguros por defecto', () => {
    const navigateToResponseUrlSpy = spyOn<any>(service, 'redirect');
    service.navigateToExternalHbi();
    expect(navigateToResponseUrlSpy).toHaveBeenCalledWith('/DefaultObi.aspx?mostrar=prestamos');
  });

});

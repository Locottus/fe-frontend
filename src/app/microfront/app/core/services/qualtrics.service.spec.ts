import { TestBed } from '@angular/core/testing';

import { QualtricsService } from './qualtrics.service';
import { SettingsService } from './settings.service';

describe('QualtricsService', () => {
  let service: QualtricsService;
  const settingsService: SettingsService = { settings: null };
  settingsService.settings = {
    baseUrl: 'http://localhost:5000',
    backendUrl: '/api/',
    backendRodadosUrl: '/obi/prestamos/api/',
    jwtProviderUrl: 'http://localhost:4200/obi/assets/jwt.txt',
    idleSeconds: 0,
    idleTimeoutSeconds: 0,
    mostrarAccesosDirectos: false,
    logoffUrl: '',
    qualtricsScriptId: 'ZN_blrxpuBYDVwNDmK',
    qualtricsContainerId: 'QSI_S_ZN_blrxpuBYDVwNDmK',
    qualtricsUrl: 'https://znblrxpubydvwndmk-superviellecx.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_blrxpuBYDVwNDmK',
    qualtricsScriptIdAbandono: 'SI_b9PR19iUsvhBro2',
    qualtricsContainerIdAbandono: 'QSI_S_SI_b9PR19iUsvhBro2',
    qualtricsUrlAbandono: 'https://sib9pr19iusvhbro2-superviellecx.siteintercept.qualtrics.com/SIE/?Q_ZID=SI_b9PR19iUsvhBro2',
    firebaseConfig: {
      apiKey: '',
      authDomain: 'ga-onboarding-pymes-dev.firebaseapp.com',
      projectId: 'ga-onboarding-pymes-dev',
      storageBucket: 'ga-onboarding-pymes-dev.appspot.com',
      messagingSenderId: '584283265419',
      appId: '1:584283265419:web:9f714d9c976990c5a8b78e',
      measurementId: 'G-HM7CZCVK2W'
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SettingsService, useValue: settingsService }]
    });
    service = TestBed.inject(QualtricsService);
  });

  it('Deberia crearse', () => {
    expect(service).toBeTruthy();
  });

  it('Deberia crear un elemento script', () => {
    service.activarEncuestaRodados();
    spyOn(document.body, 'appendChild');
    expect(document.body.innerHTML).toContain('</script>');
  });

  it('Deberia crear un elemento script', () => {
    service.activar();
    spyOn(document.body, 'appendChild');
    expect(document.body.innerHTML).toContain('</script>');
  });
});

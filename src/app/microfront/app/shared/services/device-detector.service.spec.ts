import { TestBed } from '@angular/core/testing';
import { DeviceDetectorService } from './device-detector.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestingModule } from '../../../test/utils/utils';
import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

describe('DeviceDetectorService', () => {
  let service: DeviceDetectorService;

  const matchObj = [
    { matchStr: '(max-width: 411px)', result: true },
    { matchStr: '(max-width: 600px)', result: true },
    { matchStr: '(max-width: 767px)', result: false },
    { matchStr: '(min-width: 768px)', result: true },
  ];
  const fakeObserve = (s: string[]): Observable<BreakpointState> =>
    from(matchObj).pipe(
      filter(match => match.matchStr === s[0]),
      map(match => ({ matches: match.result, breakpoints: {} })),
    );
  const mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe', 'isMatched']);
  mockBreakpointObserver.observe.and.callFake(fakeObserve);
  mockBreakpointObserver.isMatched.and.returnValue(true);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        DeviceDetectorService,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    });
    service = TestBed.inject(DeviceDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería retornar si es isSmallScreen', () => {
    const actual = service.isSmallScreen();
    expect(actual).toBeTruthy();
  });

  it('Debería retornar si es isMobileScreen', () => {
    const actual = service.isMobileScreen();
    expect(actual).toBeTruthy();
  });

  it('Debería retornar si es isMediumScreen', () => {
    const actual = service.isMediumScreen();
    expect(actual).toBeTruthy();
  });

  it('Debería retornar si es isDesktopScreen', () => {
    const actual = service.isDesktopScreen();
    expect(actual).toBeTruthy();
  });
});

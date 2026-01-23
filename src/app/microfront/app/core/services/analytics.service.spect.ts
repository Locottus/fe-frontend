import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService (mocked)', () => {
  let service: AnalyticsService;

  const mock = {
    googleAnalyticsClick: jasmine.createSpy('googleAnalyticsClick'),
    googleAnalyticsButton: jasmine.createSpy('googleAnalyticsButton'),
    googleAnalyticsPage: jasmine.createSpy('googleAnalyticsPage'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AnalyticsService, useValue: mock }
      ]
    });

    service = TestBed.inject(AnalyticsService);
  });

  it('should be created (using mock)', () => {
    expect(service).toBeTruthy();
  });

  it('should call googleAnalyticsClick', () => {
    service.googleAnalyticsClick('test', 'detail');
    expect(mock.googleAnalyticsClick).toHaveBeenCalledWith('test', 'detail');
  });

  it('should call googleAnalyticsButton', () => {
    service.googleAnalyticsButton('detail');
    expect(mock.googleAnalyticsButton).toHaveBeenCalled();
  });

  it('should call googleAnalyticsPage', () => {
    service.googleAnalyticsPage('home');
    expect(mock.googleAnalyticsPage).toHaveBeenCalled();
  });
});

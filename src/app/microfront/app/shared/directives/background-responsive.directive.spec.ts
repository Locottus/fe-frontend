import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BackgroundResponsiveDirective } from './background-responsive.directive';
import { DeviceDetectorService } from 'src/app/shared/services/device-detector.service';

@Component({
  selector: 'dummy',
  template: ` <div backgroundResponsive
                   [imgMobile]="bgUrl.desktop"
                   [imgDesktop]="bgUrl.mobile" class="main"></div>`
})
class DummyComponent implements OnInit {
  bgUrl = {
    desktop: 'imgDesktop.png',
    mobile: 'imgMobile.png'
  };

  ngOnInit(): void {
  }
}

describe('BackgroundResponsiveDirective', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;
  let debugElement: DebugElement;

  const mockDetectorService = {
    isSmallScreen: jasmine.createSpy(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent, BackgroundResponsiveDirective],
      providers: [
        { provide: DeviceDetectorService, useValue: mockDetectorService },
      ]
    });
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Deberia mostrar background tipo mobile', () => {
    mockDetectorService.isSmallScreen.and.returnValue(true);
    fixture.detectChanges();
    component.ngOnInit();
    const main = debugElement.query(By.css('.main'));
    expect(main.nativeElement.style.backgroundImage).toBe('url("imgMobile.png")');
  });
});

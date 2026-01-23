import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  constructor(private breakpointObserver: BreakpointObserver) { }

  public isSmallScreen = (): boolean => this.checkBreakpoint('max', '411');

  public isMobileScreen = (): boolean => this.checkBreakpoint('max', '600');

  public isMediumScreen = (): boolean => this.checkBreakpoint('max', '767');

  public isDesktopScreen = (): boolean => this.checkBreakpoint('min', '768');

  private checkBreakpoint = (maxMin: string, size: string) => {
    return this.breakpointObserver.isMatched(`(${maxMin}-width: ${size}px)`);
  }

}

import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DeviceDetectorService } from 'src/app/shared/services/device-detector.service';

@Directive({
  selector: '[backgroundResponsive]'
})
export class BackgroundResponsiveDirective implements OnInit {

  @Input() imgMobile = '';
  @Input() imgDesktop = '';

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private deviceDetectorService: DeviceDetectorService) {}

  ngOnInit(): void {
    this.setBackground();
  }

  @HostListener('window:resize', ['$event.target'])
  public onResize() {
    this.setBackground();
  }

  private setBackground = (): void => {
    const src = this.deviceDetectorService.isSmallScreen() ? this.imgMobile : this.imgDesktop;
    this.renderer.setStyle(this.el.nativeElement,
      'backgroundImage',
      `url(${src})`
    );
  }

}

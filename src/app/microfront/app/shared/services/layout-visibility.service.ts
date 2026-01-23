import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';

/**
 * Servicio responsable de manejar la visibilidad del header/footer
 * Usa BehaviorSubject para mantener el estado actual y emitir cambios
 */
@Injectable({
  providedIn: 'root'
})
export class LayoutVisibilityService {
  /**
   * BehaviorSubject que mantiene el estado actual de visibilidad
   * true = mostrar header/footer
   * false = ocultar header/footer
   */
  private headerFooterVisible$ = new BehaviorSubject<boolean>(this.shouldShowHeaderFooter());

  constructor(private router: Router) {
    this.initializeRouterSubscription();
  }

  /**
   * Observable público que emite cambios de visibilidad
   */
  public getHeaderFooterVisibility$(): Observable<boolean> {
    return this.headerFooterVisible$.asObservable().pipe(
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  /**
   * Obtener el estado actual de forma sincrónica
   */
  public isHeaderFooterVisible(): boolean {
    return this.headerFooterVisible$.value;
  }

  /**
   * Inicializar la suscripción a eventos del router
   */
  private initializeRouterSubscription(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.shouldShowHeaderFooter()),
      distinctUntilChanged()
    ).subscribe(shouldShow => {
      const timestamp = () => new Date().toLocaleTimeString('es-AR');
      console.log(`[${timestamp()}] [LayoutVisibilityService] Navegación detectada - Mostrar header/footer: ${shouldShow}`);
      this.headerFooterVisible$.next(shouldShow);
    });
  }

  /**
   * Determinar si se debe mostrar header/footer basado en la URL actual
   * No muestra header/footer en rutas que contengan 'root'
   */
  private shouldShowHeaderFooter(): boolean {
    const currentUrl = location.pathname;
    const shouldShow = !currentUrl.includes('root');
    return shouldShow;
  }
}

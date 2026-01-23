import { Injectable } from '@angular/core';
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';
import { SettingsService } from './settings.service';
import { getOrCreateFirebaseApp } from '../firebase/firebase-app';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private analytics: Analytics | null = null;

  constructor(private settingsService: SettingsService) {
    this.initAnalytics();
  }

  private initAnalytics(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const firebaseConfig = this.settingsService.settings?.firebaseConfig;

      if (!firebaseConfig?.apiKey) {
        // En tests / entornos sin Firebase no hacemos nada
        console.warn('Firebase config no encontrada; Analytics desactivado.');
        return;
      }

      // Usa la app nombrada del MFE, NO el DEFAULT
      const app = getOrCreateFirebaseApp(firebaseConfig);
      this.analytics = getAnalytics(app);
    } catch (e) {
      console.warn('Error inicializando Firebase Analytics', e);
      this.analytics = null;
    }
  }

  private logSafeEvent(eventName: string, params: Record<string, any>): void {
    if (!this.analytics) return;

    try {
      logEvent(this.analytics, eventName, params);
    } catch (e) {
      console.warn('Error en analytics', e);
    }
  }

  googleAnalyticsClick(
    type: string,
    detail: string,
    flow: string = 'obi - prestamos - prendarios'
  ) {
    this.logSafeEvent('click', {
      click_type: type,
      click_detail: detail,
      flow,
    });
  }

  googleAnalyticsButton(
    detail: string,
    pageRoute: string = '/necesito-ayuda',
    flow: string = 'obi - prestamos - prendarios'
  ) {
    const pageLocation =
      typeof window !== 'undefined'
        ? window.location.origin + pageRoute
        : pageRoute;

    this.logSafeEvent('click', {
      click_type: 'button',
      click_detail: detail,
      page_location: pageLocation,
      flow,
    });
  }

  googleAnalyticsPage(
    title: string,
    pageRoute: string = '/necesito-ayuda',
    flow: string = 'obi - prestamos - prendarios'
  ) {
    const pageLocation =
      typeof window !== 'undefined'
        ? window.location.origin + pageRoute
        : pageRoute;

    this.logSafeEvent('page_view', {
      page_title: title,
      page_location: pageLocation,
      flow,
    });
  }
}

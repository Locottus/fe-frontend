import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  Analytics,
  getAnalytics,
  logEvent,
  setUserId,
} from 'firebase/analytics';
import { FirebaseOptions } from 'firebase/app';
import { SettingsService } from './settings.service';
import { getOrCreateFirebaseApp } from '../firebase/firebase-app';


@Injectable({ providedIn: 'root' })
export class Ga4FirebaseService {
  private firebaseConfig: FirebaseOptions;
  private analytics: Analytics | null = null;

  private window: Window;
  initOk = false;

  constructor(
    settingsService: SettingsService,
    @Inject(DOCUMENT) document: Document
  ) {
    this.firebaseConfig = settingsService.settings.firebaseConfig;
    this.window = (document.defaultView ?? window) as Window;
  }

  public initFireAnalytics(userId: string): void {
    if (this.initOk) {
      console.warn('ga4 initialized');
      return;
    }

    if (!this.firebaseConfig?.apiKey) {
      console.warn('Firebase config no encontrada en settings');
      return;
    }

    // Reutiliza la app nombrada del MFE (evita colisiones con [DEFAULT])
    const app = getOrCreateFirebaseApp(this.firebaseConfig);

    try {
      this.analytics = getAnalytics(app);
      setUserId(this.analytics, userId);
      this.initOk = true;
    } catch (e) {
      console.warn('Error inicializando GA4 Firebase Analytics', e);
      this.analytics = null;
      this.initOk = false;
    }
  }

  private getWindowLocation(): string {
    try {
      return (
        this.window.location.origin +
        this.window.location.pathname +
        '/'
      );
    } catch {
      return '';
    }
  }

  logEvent(eventName: string, eventParams: any): void {
    if (!this.initOk || !this.analytics) {
      console.warn('ga4 not initialized');
      return;
    }
    logEvent(this.analytics, eventName, eventParams);
  }

  logPageView(
    pageTitle: string,
    pageLocation: string,
    flow = 'obi - Prestamos - Prendarios'
  ): void {
    this.logEvent('page_view', {
      pageTitle,
      page_location: this.getWindowLocation() + pageLocation,
      flow,
    });
  }
}

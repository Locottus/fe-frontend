import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';

const MFE_APP_NAME = 'obi-rodados';

export function getOrCreateFirebaseApp(config: FirebaseOptions): FirebaseApp {
  const existing = getApps().find(app => app.name === MFE_APP_NAME);
  if (existing) {
    return getApp(MFE_APP_NAME);
  }
  return initializeApp(config, MFE_APP_NAME);
}

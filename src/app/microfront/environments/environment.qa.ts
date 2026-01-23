const AUTOS_API = 'autos';
const UBICACION_API = 'ubicacion';
const RODADOS_API = 'https://bff-obi-rodados.k8sds.gscorp.ad/api'

export const environment = {
  production: false,
/*
  Los valores correspondientes a los ambientes de desarrollo, testing
  y producción son sobrescritos dinámicamente mediante la configuración
  centralizada almacenada en:
  https://consul.k8s.gscorp.ad/ui/dc1/kv
  \fe-obi-rodados\build.config\config\application.yaml  
*/  
  firebaseConfig: {
			apiKey: "AIzaSyAXDDkrGiyYcICOwCM1LA-DfSsRnmmeU-k",
			authDomain: "ga-onboarding-pymes-tst.firebaseapp.com",
			projectId: "ga-onboarding-pymes-tst",
			storageBucket: "ga-onboarding-pymes-tst.appspot.com",
			messagingSenderId: "984094286380",
			appId: "1:984094286380:web:e27faf640c1d5c822ea789",
			measurementId: "G-T1L27FXYSH"
  },
  endpoints: {
    prestamos: {
      prestamos_post: `${RODADOS_API}/prestamos`,
      prestamos_get: `${RODADOS_API}/prestamos`
    },
    autos: {
      marcas: `${AUTOS_API}/marcas`,
      anios: `${AUTOS_API}/anios`,
      modelos: `${AUTOS_API}/modelos`,
      versiones: `${AUTOS_API}/versiones`,
    },
    ubicacion: {
      provincias: `${UBICACION_API}/provincias`,
      localidades: `${UBICACION_API}/localidades`
    },
    persona: 'persona',
    prospectos: 'prospectos',
    coberturas: 'coberturas',
    companias: 'companias',
    cotizaciones: 'cotizaciones',
    tyc: 'tyc',
    ping: 'ping',
    polizas: 'polizas',
    productos: 'productos',
    configProductos: 'productos/configuraciones'
  },
  jwtProvider: '/Pages/Token/Token.aspx',
  publicPath: "http://localhost:4200/obi/rodados/"
};

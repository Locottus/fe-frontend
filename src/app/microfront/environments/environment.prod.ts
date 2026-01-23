const AUTOS_API = 'autos';
const UBICACION_API = 'ubicacion';
const RODADOS_API = 'https://bff-obi-rodados.k8sds.gscorp.ad/obi/rodados/api/v1';

export const environment = {
  production: true,
/*
  Los valores correspondientes a los ambientes de desarrollo, testing
  y producción son sobrescritos dinámicamente mediante la configuración
  centralizada almacenada en:
  https://consul.k8s.gscorp.ad/ui/dc1/kv
  \fe-obi-rodados\build.config\config\application.yaml
*/  
  firebaseConfig: {
			apiKey: "AIzaSyBkm4BlEBh6vf9K_1B7IllnxI5O7bqABl8",
			authDomain: "ga-onboarding-pymes-prod.firebaseapp.com",
			projectId: "ga-onboarding-pymes-prod",
			storageBucket: "ga-onboarding-pymes-prod.appspot.com",
			messagingSenderId: "247092451817",
			appId: "1:247092451817:web:6c75c12cf9f408546f9378",
			measurementId: "G-690C9P27C2"
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
  publicPath: '/obi/rodados/'
};

const AUTOS_API = 'autos';
const UBICACION_API = 'ubicacion';
const RODADOS_API = 'https://bff-obi-rodados.k8sds.gscorp.ad/obi/rodados/api/v1';

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
    apiKey: "AIzaSyDN1F9QrxtXrr5C3xZ48ouQlOyBL-Ho6M4",
    authDomain: "ga-onboarding-pymes-dev.firebaseapp.com",
    projectId: "ga-onboarding-pymes-dev",
    storageBucket: "ga-onboarding-pymes-dev.appspot.com",
    messagingSenderId: "584283265419",
    appId: "1:584283265419:web:9f714d9c976990c5a8b78e",
    measurementId: "G-HM7CZCVK2W"
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
  publicPath: 'http://localhost:4200/obi/rodados/'
};

const LOCAL_API = 'https://localhost:44366/api/v1.0';
const AUTOS_API = 'autos';
const UBICACION_API = 'ubicacion';
const RODADOS_API = 'http://bff-obi-rodados.k8sds.gscorp.ad/obi/rodados/api/v1';

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
    authDomain: "test-e0010.firebaseapp.com",
    projectId: "test-e0010",
    storageBucket: "test-e0010.appspot.com",
    messagingSenderId: "224857792432",
    appId: "1:224857792432:web:ecbad29acf6dd1e1eb0075"
  },
  endpoints: {
    persona: `${LOCAL_API}/Personas`,
    prestamos: {
      prestamos_get: `${LOCAL_API}/Personas/{id}/creditos`,
      prestamos_post: `${RODADOS_API}/prestamos`
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
  jwtProvider: `${LOCAL_API}/Auth/token`,
  publicPath: '/'
};
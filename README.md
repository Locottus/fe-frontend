# FE Local Playground

## Descripción

Angular Playground / Sandbox local para diseñar y visualizar componentes UI antes de migrarlos a un proyecto de micro frontend. Este proyecto es completamente standalone sin dependencias externas de module federation o micro-frontends.

## Stack Técnico

- **Angular**: 12.2.x
- **Angular CLI**: 12.2.x
- **TypeScript**: ~4.3.5
- **Node**: >=14
- **RxJS**: ~6.5.4
- **Zone.js**: ~0.11.4

## Dependencias Principales

- `@angular/material` ^12.2.13
- `@angular/cdk` ^12.2.13
- `@kite/angular` ^1.47.0
- `bootstrap` ^4.4.1
- `moment` ^2.24.0
- `ngx-currency` ^2.5.1
- `ng2-tooltip-directive` ^2.9.22
- `@ng-bootstrap/ng-bootstrap` ^6.1.0
- `@auth0/angular-jwt` ^4.0.0

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

## Ejecución

### Desarrollo (ng serve)

```bash
npm start
# o
ng serve
```

El proyecto estará disponible en `http://localhost:4200`

### Build para Producción

```bash
npm run build
```

### Pruebas

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── playground/
│   │   ├── playground.component.ts
│   │   ├── playground.component.html
│   │   └── playground.component.scss
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.component.scss
├── styles.scss
├── main.ts
├── index.html
└── polyfills.ts
```

## Componentes Disponibles en el Playground

### Kite Components
- Kite Buttons
- Kite Inputs

### Angular Material Components
- Material Buttons (various styles)
- Material Form Fields (fill, outline, legacy)
- Material Select
- Material Checkboxes
- Material Radio Buttons
- Material Icons

### Bootstrap Components
- Bootstrap Buttons (all color variants)
- Bootstrap Alerts
- Bootstrap Cards & Grid
- Bootstrap Responsive Layout

### Formulario Reactivo
- Validación de formularios
- Controles Material
- Manejo de errores
- Reset de formulario

## Cómo Extender el Proyecto

### Agregar un Nuevo Componente

1. Generar el componente:
```bash
ng generate component components/my-new-component
```

2. Actualizar `app.module.ts`:
```typescript
import { MyNewComponentComponent } from './components/my-new-component/my-new-component.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    MyNewComponentComponent  // Añadir aquí
  ],
  // ...
})
export class AppModule { }
```

3. Agregar una sección de ejemplo en `playground.component.html`

4. Importar los módulos Material/Kite necesarios en `app.module.ts`

### Importar Módulos Material Adicionales

Actualizar `app.module.ts`:
```typescript
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    // ... otros imports
    MatMenuModule,
    MatTableModule
  ]
})
export class AppModule { }
```

## Características Clave

✓ Proyecto Angular funcional sin micro-frontends  
✓ Compila sin errores  
✓ Corre localmente con `ng serve`  
✓ Permite visualizar y diseñar componentes Kite, Material y Bootstrap  
✓ Incluye formulario reactivo con validación  
✓ Código limpio y mantenible  
✓ Fácil de extender con nuevos componentes  

## Restricciones Implementadas

- ✗ NO micro-frontends
- ✗ NO module federation runtime
- ✗ NO referencias a remoteEntry
- ✗ NO dependencias externas obligatorias

## Notas Técnicas

- Bootstrap se importa globalmente en `angular.json` para disponibilidad en todos los componentes
- Los estilos SCSS se compilan automáticamente
- Material Icons se cargan desde Google Fonts en `index.html`
- Roboto font se utiliza como font-family global
- El enrutamiento está habilitado aunque actualmente solo tiene la ruta del playground

## Troubleshooting

### Error: "Cannot find module '@kite/angular'"
Verificar que el registro npm está correctamente configurado con acceso a `@kite/angular`

### Error de compilación con TypeScript
Verificar que la versión de TypeScript es ~4.3.5:
```bash
npm list typescript
```

### ng serve no inicia
Limpiar caché y reinstalar:
```bash
rm -rf node_modules package-lock.json
npm install
ng serve
```

## Licencia

Proyecto privado para uso interno

## Contacto

Para preguntas o sugerencias, contactar al equipo de arquitectura Angular.

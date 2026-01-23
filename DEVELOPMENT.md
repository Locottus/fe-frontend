# Angular Playground - Guía de Desarrollo

## Visión General

Este proyecto es un Playground/Sandbox local de Angular 12 para diseñar, prototipar y validar componentes UI antes de su migración a un proyecto de micro-frontend.

**Características principales:**
- ✅ Sandbox completamente local
- ✅ Sin dependencias de Module Federation
- ✅ Integración de Kite, Angular Material y Bootstrap
- ✅ Formularios reactivos completos
- ✅ Fácil extensión

## Stack Técnico

| Tecnología | Versión |
|-----------|---------|
| Angular | 12.2.x |
| Angular CLI | 12.2.x |
| TypeScript | ~4.3.5 |
| Node | >=14 |
| RxJS | ~6.5.4 |
| Zone.js | ~0.11.4 |

## Instalación y Configuración

### Requisitos Previos
- Node.js >= 14
- npm >= 6

### Instalación

```bash
# Clonar/navegar al proyecto
cd c:\banco\fe-local

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
npm start
```

El proyecto estará disponible en `http://localhost:4200`

## Estructura del Proyecto

```
fe-local/
├── src/
│   ├── app/
│   │   ├── playground/
│   │   │   ├── playground.component.ts
│   │   │   ├── playground.component.html
│   │   │   ├── playground.component.scss
│   │   │   └── playground.component.spec.ts
│   │   ├── app.component.*
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.spec.ts
│   │   └── app-routing.module.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.scss
│   ├── main.ts
│   ├── polyfills.ts
│   ├── index.html
│   └── test.ts
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── karma.conf.js
├── package.json
├── .editorconfig
├── .gitignore
├── tslint.json
├── README.md
└── .vscode/
    ├── settings.json
    ├── extensions.json
```

## Comandos Disponibles

### Desarrollo
```bash
# Iniciar servidor con hot reload
npm start
# o
ng serve

# Con configuración específica
ng serve --configuration development
```

### Build
```bash
# Build para producción
npm run build

# Build de desarrollo
ng build --configuration development
```

### Testing
```bash
# Ejecutar pruebas unitarias
npm test

# Run tests con coverage
ng test --code-coverage
```

### Linting
```bash
# Verificar código
npm run lint
```

## Configuración de Módulos Angular

### AppModule
Incluye todos los módulos necesarios para Material, Kite y ng-bootstrap:

```typescript
@NgModule({
  declarations: [AppComponent, PlaygroundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Material modules
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    // ... más módulos
    KiteModule,
    NgbModule
  ]
})
```

## Componentes Disponibles en el Playground

### 1. Kite Components
- **Botones Kite**: Variantes de botones del diseño Kite
- **Inputs Kite**: Campos de entrada personalizados

### 2. Angular Material
- **Buttons**: Basic, Raised, Stroked, Flat, Icon, FAB
- **Form Fields**: Fill, Outline, Legacy
- **Select**: Dropdown con validación
- **Checkboxes**: Con colores y estados
- **Radio Buttons**: Selección única
- **Icons**: Material Icons

### 3. Bootstrap
- **Buttons**: Todos los colores Bootstrap
- **Alerts**: Primary, Success, Warning, Danger, Info
- **Cards**: Componentes card con grid responsivo
- **Grid System**: Columnas y layout responsivo

### 4. Formulario Reactivo
- **Validaciones**: Required, Email, MinLength
- **Controles**: Input, Select, Checkbox
- **Estados**: Dirty, Valid, Touched
- **Acciones**: Submit, Reset

## Extensibilidad

### Agregar Nuevo Componente

1. **Generar componente**
   ```bash
   ng generate component components/mi-componente
   ```

2. **Actualizar AppModule**
   ```typescript
   import { MiComponenteComponent } from './components/mi-componente/mi-componente.component';
   
   @NgModule({
     declarations: [
       AppComponent,
       PlaygroundComponent,
       MiComponenteComponent  // Agregar aquí
     ]
   })
   ```

3. **Agregar ejemplo en Playground**
   En `playground.component.html`, agregar nueva sección:
   ```html
   <section class="section">
     <h2 class="section-title">Mi Componente</h2>
     <div class="card">
       <app-mi-componente></app-mi-componente>
     </div>
   </section>
   ```

### Importar Nuevos Módulos Material

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
```

## Estilos Globales

### Archivos SCSS
- **styles.scss**: Variables, tipografía, utilities globales
- **playground.component.scss**: Estilos del playground
- **app.component.scss**: Estilos de la aplicación raíz

### Bootstrap Integración
Bootstrap CSS se importa globalmente en `angular.json`:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]
```

### Variables SCSS Disponibles
```scss
$primary-color: #1976d2
$accent-color: #ff4081
$warn-color: #f44336
$success-color: #4caf50
$light-gray: #f5f5f5
$dark-gray: #333
```

## Validación y Testing

### TypeScript Strict Mode
El proyecto está configurado con `strict: false` para compatibilidad, pero puede habilitarse:

```json
// tsconfig.json
"strict": true
```

### Testing Unitario
```bash
# Ejecutar pruebas
npm test

# Con coverage
ng test --code-coverage --watch=false
```

### Debugging
- **Chrome DevTools**: Integrado en `ng serve`
- **VS Code Debugger**: Configurar en `.vscode/launch.json`

## Troubleshooting

### Problema: "Cannot find module '@kite/angular'"
**Solución**: Verificar credenciales npm y acceso al registro privado

### Problema: Error de dependencias (ERESOLVE)
**Solución**: Usar flag `--legacy-peer-deps`
```bash
npm install --legacy-peer-deps
```

### Problema: ng serve no inicia
**Solución**: Limpiar caché
```bash
rm -rf node_modules package-lock.json dist .angular
npm install --legacy-peer-deps
ng serve
```

### Problema: Puerto 4200 en uso
**Solución**: Usar puerto alternativo
```bash
ng serve --port 4300
```

## Mejores Prácticas

1. **Componentes**: Mantener componentes pequeños y reutilizables
2. **Módulos**: Agrupar componentes relacionados
3. **Estilos**: Usar SCSS y variables globales
4. **Validación**: Implementar validadores en formularios reactivos
5. **Testing**: Escribir tests para cada componente
6. **Documentación**: Comentar código complejo

## Próximos Pasos

- [ ] Agregar más componentes Material
- [ ] Implementar tema oscuro
- [ ] Agregar storybook para documentación de componentes
- [ ] Configurar CI/CD
- [ ] Migración a micro-frontend con Module Federation

## Recursos

- [Angular Docs](https://angular.io/docs)
- [Material Design](https://material.angular.io/)
- [Bootstrap 4 Docs](https://getbootstrap.com/docs/4.5/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Soporte

Para problemas o preguntas, contactar al equipo de arquitectura Angular.

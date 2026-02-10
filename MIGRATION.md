# Guía de Migración a Angular 19 y Node 24.13.0

## Cambios Realizados

### 1. Node.js
- **Versión anterior**: No especificada
- **Versión nueva**: 24.13.0 (especificada en `.nvmrc`)

### 2. Angular
- **Versión anterior**: 12.2.17
- **Versión nueva**: 19.0.0

### 3. Dependencias Principales Actualizadas

#### Angular Core
- Todas las dependencias de `@angular/*` actualizadas a v19.0.0
- TypeScript actualizado a v5.6.3
- RxJS actualizado a v7.8.1
- zone.js actualizado a v0.15.0

#### Otras Dependencias
- Bootstrap: 4.4.1 → 5.3.3
- @ng-bootstrap/ng-bootstrap: 6.1.0 → 17.0.1
- @auth0/angular-jwt: 4.0.0 → 5.2.0
- ngx-currency: 2.5.1 → 18.0.0
- ng2-tooltip-directive: 2.9.22 → 3.3.1
- moment: 2.24.0 → 2.30.1

### 4. Cambios de Herramientas

#### TSLint → ESLint
- Removido `tslint.json`
- Agregado `.eslintrc.json` con configuración de ESLint
- Script de lint actualizado en `package.json`

#### Nuevo Application Builder
- Cambiado de `@angular-devkit/build-angular:browser` a `@angular-devkit/build-angular:application`
- Este es el nuevo builder predeterminado de Angular 17+
- Mejora el rendimiento de compilación y optimización

### 5. Configuración Actualizada

#### TypeScript (tsconfig.json)
- `target`: es2017 → ES2022
- `module`: es2020 → ES2022
- `moduleResolution`: node → bundler
- Agregado `esModuleInterop: true`
- Agregado `useDefineForClassFields: false`

#### Angular.json
- Builder actualizado a `application`
- Polyfills ahora se especifican como array en lugar de archivo
- `browserTarget` renombrado a `buildTarget` en configuración de serve
- Removidas opciones obsoletas (`vendorChunk`, `buildOptimizer`)

#### Archivos de Configuración de TypeScript
- Removida referencia a `polyfills.ts` de `tsconfig.app.json`
- Removida referencia a `polyfills.ts` de `tsconfig.spec.json`
- Removida referencia a `main.ts` del test config

## Pasos de Instalación

### 1. Cambiar a Node.js 24.13.0

Si usas nvm (Node Version Manager):
```bash
nvm install 24.13.0
nvm use 24.13.0
```

O en Windows con nvm-windows:
```bash
nvm install 24.13.0
nvm use 24.13.0
```

Verifica la versión:
```bash
node --version  # Debe mostrar v24.13.0
```

### 2. Limpiar instalación anterior

```bash
# Eliminar node_modules y archivos de lock
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Verificar instalación

```bash
# Ver versión de Angular CLI
npx ng version

# Debería mostrar Angular CLI: 19.0.x
```

## Ejecutar el Proyecto

### Desarrollo
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

### Build de Producción
```bash
npm run build
# o
ng build
```

### Tests
```bash
npm test
# o
ng test
```

### Linting (ahora con ESLint)
```bash
npm run lint
# o
ng lint
```

## Cambios Importantes a Considerar

### 1. Bootstrap 5
Bootstrap se actualizó de v4 a v5. Algunos cambios importantes:
- Clases renombradas (ej: `ml-*` → `ms-*`, `mr-*` → `me-*`)
- Eliminación de jQuery
- Sistema de grid actualizado
- [Ver guía de migración de Bootstrap](https://getbootstrap.com/docs/5.3/migration/)

### 2. RxJS 7
- Mejoras de rendimiento
- Algunos operadores obsoletos removidos
- La mayoría del código debería funcionar sin cambios

### 3. TypeScript 5.6
- Nuevas características del lenguaje
- Mejoras en type checking
- El código existente debería ser compatible

### 4. Application Builder
El nuevo builder de aplicaciones de Angular ofrece:
- Compilación más rápida con esbuild
- Mejor tree-shaking
- Optimizaciones mejoradas
- Soporte nativo para ESM

### 5. ESLint en lugar de TSLint
- TSLint está deprecado
- Ahora se usa ESLint con plugins de Angular
- Reglas configuradas en `.eslintrc.json`

## Problemas Conocidos y Soluciones

### Si encuentras errores de compilación:
1. Verifica que estés usando Node 24.13.0: `node --version`
2. Limpia cache de npm: `npm cache clean --force`
3. Elimina y reinstala: 
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install
   ```

### Si los estilos de Bootstrap no se ven correctamente:
- Revisa clases actualizadas según la [guía de migración de Bootstrap 5](https://getbootstrap.com/docs/5.3/migration/)

### Si tienes problemas con @kite/angular:
- Verifica que la versión 1.47.0 sea compatible con Angular 19
- Puede ser necesario actualizar a una versión más reciente de @kite/angular

## Recursos Adicionales

- [Guía de actualización de Angular](https://update.angular.io/)
- [Changelog de Angular 19](https://github.com/angular/angular/releases)
- [Documentación de Angular](https://angular.io/)
- [Migration desde TSLint a ESLint](https://github.com/angular-eslint/angular-eslint)

## Próximos Pasos Recomendados

1. ✅ Considera migrar a Standalone Components (característica de Angular 14+)
2. ✅ Explora el nuevo control flow syntax de Angular 17 (@if, @for, @switch)
3. ✅ Implementa Signals para estado reactivo (Angular 16+)
4. ✅ Revisa y actualiza dependencias de terceros según sea necesario
5. ✅ Ejecuta tests completos para verificar que todo funciona correctamente

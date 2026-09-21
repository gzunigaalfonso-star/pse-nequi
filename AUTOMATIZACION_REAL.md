# Automatización Real de Recargas Nequi

## 🎯 Objetivo

Automatizar el **llenado real del formulario** en https://clientes.nequi.com.co/recargas usando Playwright.

## 🚀 Comenzar Rápido

### 1. Instalar Dependencias

```bash
npm install
npx playwright install chromium
```

### 2. Ejecutar Modo Interactivo (Recomendado)

```bash
npm run interactive
```

Este modo:
- ✅ Abre el navegador en tu pantalla
- ✅ Espera a que cargue la página de Nequi
- ✅ Te permite elegir qué datos ingresar
- ✅ Llena el formulario automáticamente
- ✅ Puedes ver todo en tiempo real

### 3. Ejecutar Modo Batch (Automático)

```bash
npm start
```

Este modo:
- ✅ Procesa todos los datos de `src/data.js` automáticamente
- ✅ Una tras otra sin parar
- ✅ Toma screenshots de cada una
- ✅ Genera reporte final

## 📋 Modo Interactivo - Paso a Paso

```
1. Ejecuta: npm run interactive
2. Se abre el navegador con el sitio de Nequi
3. Ves un menú con opciones:

   --- OPCIONES ---
   1. Llenar con datos de prueba
   2. Llenar manualmente
   3. Ver página actual
   4. Limpiar formulario
   5. Salir

4. Selecciona opción 1 o 2
5. El script llena el formulario en tiempo real
6. Decides si procesar o cancelar
7. Repite si quieres hacer más recargas
```

## 🎬 Ejemplo en Vivo

```bash
$ npm run interactive

=== MODO INTERACTIVO - Automatización de Recargas Nequi ===

URL: https://clientes.nequi.com.co/recargas
Este script abrirá el navegador y llenará el formulario en tiempo real.

📱 Abriendo página de Nequi...
✓ Página cargada

--- OPCIONES ---
1. Llenar con datos de prueba
2. Llenar manualmente
3. Ver página actual
4. Limpiar formulario
5. Salir

Selecciona una opción (1-5): 1

📝 Llenando formulario con datos:
   Número: 3001234567
   Monto: $5,000
   Tipo: Natural
   Banco: ACCION FIDUCIARIA

🔍 Buscando campos...
   ✓ Campo de número encontrado
   ✓ Número ingresado: 3001234567
   ✓ Confirmación ingresada
   ✓ Campo de monto encontrado
   ✓ Monto ingresado: $5,000
   ✓ Tipo de persona seleccionado: Natural
   ✓ Banco seleccionado: ACCION FIDUCIARIA

✅ Formulario llenado exitosamente

¿Procesar la recarga? (s/n): s

⏳ Procesando recarga...
✓ Recarga enviada
```

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|------------|
| `npm start` | Procesa todas las recargas automáticamente |
| `npm run interactive` | Modo interactivo con navegador visible |
| `npm run debug` | Modo debug con logs detallados |
| `npm test` | Ejecuta pruebas |

## 📊 Datos de Prueba

Los datos están en `src/data.js`. Por defecto incluye:

```javascript
{
  numero: '3001234567',
  monto: 5000,
  tipoPersona: 'Natural',
  banco: 'ACCION FIDUCIARIA'
}
```

Puedes agregar más en el array `testData`.

## 🖼️ Screenshots

Cada ejecución genera capturas en `screenshots/`:
- `inicial-*.png` - Estado inicial del formulario
- `completado-*.png` - Formulario lleno
- `error-*.png` - Si hay errores

## ⚙️ Configuración (.env)

Crea un archivo `.env` en la raíz:

```env
NEQUI_URL=https://clientes.nequi.com.co/recargas
HEADLESS=false
PAGE_LOAD_TIMEOUT=30000
FORM_FILL_DELAY=2000
DEBUG=false
SAVE_SCREENSHOTS=true
```

### Variables:

- **NEQUI_URL**: URL del formulario (cambiar si es diferente)
- **HEADLESS**: `true` = sin navegador visible, `false` = navegador visible
- **PAGE_LOAD_TIMEOUT**: Tiempo máximo para cargar (ms)
- **FORM_FILL_DELAY**: Pausa entre campos (ms)
- **DEBUG**: Logs detallados
- **SAVE_SCREENSHOTS**: Guardar capturas

## 🔍 Cómo Funciona

### 1. Abre la página de Nequi
```javascript
await page.goto('https://clientes.nequi.com.co/recargas')
```

### 2. Busca campos del formulario
```javascript
const phoneInputs = await page.locator('input[type="tel"], input[type="text"]').all()
```

### 3. Llena número de celular
```javascript
await phoneInputs[0].fill(datos.numero)
```

### 4. Llena monto
```javascript
const amountInputs = await page.locator('input[type="number"]').all()
await amountInputs[0].fill(datos.monto.toString())
```

### 5. Selecciona tipo de persona y banco
```javascript
const selects = await page.locator('select').all()
await selects[0].selectOption(datos.tipoPersona)
await selects[1].selectOption(datos.banco)
```

### 6. Toma screenshot y verifica
```javascript
await page.screenshot({ path: `screenshots/completado-${datos.numero}.png` })
```

## 🐛 Solución de Problemas

### El script no encuentra los campos

**Problema:** Los selectores no coinciden
**Solución:** Activa DEBUG:

```bash
DEBUG=true npm start
```

O ejecuta el modo interactivo y observa dónde falla.

### La página no carga

**Problema:** Timeout
**Solución:** Aumenta el timeout en `.env`:

```env
PAGE_LOAD_TIMEOUT=60000
```

### No se puede seleccionar banco

**Problema:** El nombre del banco no coincide
**Solución:** Verifica los nombres en `src/data.js` y asegúrate que sean exactos.

## 📈 Resultados

Después de ejecutar, verás:

```
📈 RESUMEN:
[OK] Exitosos: 5/5
[FAIL] Fallidos: 0/5
```

Y en la carpeta `screenshots/` encontrarás todas las capturas.

## 🚨 Notas Importantes

⚠️ **USAR SOLO PARA TESTING**
- Únicamente con datos de prueba reales autorizados
- No usar para hacer fraude o transacciones no autorizadas
- Respetar los términos de servicio de Nequi
- No acelerar excesivamente el llenado (humanizar delays)

## 🔐 Seguridad

- Los datos se mantienen locales (no se envían a servidores)
- El navegador es real (no está headless por defecto)
- Puedes ver exactamente qué está haciendo

## 📞 Soporte

Si algo no funciona:

1. Ejecuta modo interactivo: `npm run interactive`
2. Observa qué pasa en el navegador
3. Verifica los logs en consola
4. Revisa si los selectores coinciden
5. Compara con DATOS_RECARGA.md

## Próximas Mejoras

- [ ] Integración con base de datos
- [ ] Panel web para controlar automatización
- [ ] Reportes detallados en JSON
- [ ] Notificaciones por email
- [ ] Retry automático en errores

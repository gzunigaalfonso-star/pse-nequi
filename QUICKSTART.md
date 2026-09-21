# Quick Start - Automatización Nequi

## 🎯 Dos Opciones

### Opción A: HTML (Rápido - Para Ver)
```bash
Abre directamente: index.html
```
- No requiere Node.js
- Interfaz visual
- Simulación en navegador

### Opción B: Automatización Real (Interactivo - Para Automatizar)
```bash
npm install
npm run interactive
```
- Automatiza el sitio real de Nequi
- Navegador visible
- Llenar datos en tiempo real

### Opción C: Batch Automático (Para Procesar Múltiples)
```bash
npm install
npm start
```
- Procesa todos los datos automáticamente
- Uno tras otro
- Screenshots de cada una

## 1. Instalación Rápida (Solo para Automatización)

```bash
npm install
npx playwright install chromium
```

## 2. Vista Previa HTML (Sin instalación)

Abre en tu navegador:
```bash
index.html              ← Centro de control (COMIENZA AQUÍ)
pse-welcome.html       ← Sistema PSE + Nequi completo
preview.html           ← Simulador visual
```

## 3. Ejecutar Automatización Real

### Modo Interactivo (Recomendado)
```bash
npm run interactive
```
- ✅ Abre el navegador
- ✅ Carga el sitio de Nequi
- ✅ Menú interactivo para llenar datos
- ✅ Ve todo en tiempo real

### Modo Automático (Batch)
```bash
npm start
```
- ✅ Procesa todos los datos de src/data.js
- ✅ Automatiza cada recarga
- ✅ Genera screenshots
- ✅ Reporte final

## 4. Configuración (Opcional)

Crea un archivo `.env` en la raíz del proyecto:

```env
NEQUI_URL=https://clientes.nequi.com.co/recargas
HEADLESS=false
PAGE_LOAD_TIMEOUT=15000
FORM_FILL_DELAY=2000
DEBUG=false
SAVE_SCREENSHOTS=true
```

## 5. Personalizar Datos de Prueba

Edita `src/data.js`:

```javascript
export const testData = [
  {
    numero: '300XXXXXXXX',
    monto: 5000,
    tipoPersona: 'Natural',
    banco: 'Bancolombia'
  },
  // ... más registros
];
```

## 6. Ver Resultados

- **Screenshots**: Se guardan en carpeta `screenshots/`
- **Logs**: Se muestran en la consola
- **Reporte**: Descárgalo desde preview.html

## Características Disponibles

| Feature | Descripción |
|---------|------------|
| 🌐 **Preview** | Interfaz visual en HTML |
| 🤖 **Automatización** | Playwright automation |
| 📸 **Screenshots** | Captura cada formulario |
| 📊 **Reportes** | Resumen de resultados |
| ⚙️ **Configurable** | Variables de entorno |
| 🔄 **Reutilizable** | Datos de prueba modulares |

## Solución de Problemas

**Error de navegador no encontrado:**
```bash
npx playwright install chromium
```

**Timeout en página:**
- Aumenta `PAGE_LOAD_TIMEOUT` en `.env`

**Formulario no se llena:**
- Activa `DEBUG=true` para ver logs detallados
- Verifica que los selectores sean correctos

## Próximos Pasos

1. Abre `preview.html` para ver la interfaz
2. Ejecuta `npm start` para automatizar
3. Personaliza `src/data.js` con tus datos
4. Revisa `screenshots/` para confirmar resultados

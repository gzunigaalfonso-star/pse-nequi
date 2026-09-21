# Guía Completa - Automatización Recargas Nequi

## Descripción General

Sistema remoto completo para automatizar el llenado de formularios de recargas en Nequi. Incluye:

- ✅ Script de automatización con Playwright
- ✅ Previsualización HTML interactiva
- ✅ Datos de prueba configurables
- ✅ Generación de reportes
- ✅ Capturas de pantalla automáticas

## Componentes

### 1. **Script Principal** (`src/index.js`)

Automatiza el navegador para llenar el formulario:

```javascript
- Abre la URL de Nequi
- Espera a que cargue el formulario
- Rellena: número, cantidad, tipo de persona, banco
- Toma screenshot de cada resultado
- Genera reporte final
```

**Uso:**
```bash
npm start
```

### 2. **Vista Previa HTML** (`preview.html`)

Interfaz visual en tiempo real:

- 📝 Simulador del formulario
- 📊 Tabla con datos de prueba
- 📈 Estadísticas en vivo
- 📥 Descarga de reportes
- 🔴 Log de actividad

**Cómo abrir:**
- Doble clic en `preview.html`
- O en terminal: `start preview.html` (Windows)

### 3. **Datos de Prueba** (`src/data.js`)

```javascript
export const testData = [
  {
    numero: '3001234567',      // Teléfono
    monto: 5000,               // Dinero a recargar
    tipoPersona: 'Natural',    // Natural o Jurídica
    banco: 'Bancolombia'       // Banco seleccionado
  },
  // ... más registros
];
```

**Agregar más datos:**
```javascript
{
  numero: '300XXXXXXXX',
  monto: 50000,
  tipoPersona: 'Natural',
  banco: 'BBVA'
}
```

### 4. **Configuración** (`.env`)

```env
# URL del formulario
NEQUI_URL=https://clientes.nequi.com.co/recargas

# Mostrar navegador (false = modo invisible)
HEADLESS=false

# Tiempo máximo para cargar página
PAGE_LOAD_TIMEOUT=15000

# Pausa entre registros (ms)
FORM_FILL_DELAY=2000

# Mostrar logs detallados
DEBUG=false

# Guardar capturas de pantalla
SAVE_SCREENSHOTS=true
```

## Flujo de Uso

### Opción A: Vista Previa (Recomendado para Testing)

```bash
1. Abre preview.html en navegador
2. Click en "Ejecutar Todos"
3. Observa resultados en tiempo real
4. Descarga reporte JSON
```

### Opción B: Automatización Completa

```bash
1. npm install
2. npm start
3. Observa el navegador realizando acciones
4. Revisa screenshots en carpeta screenshots/
```

### Opción C: Modo Headless (Producción)

```bash
# En .env:
HEADLESS=true

# Ejecutar:
npm start
```

## Selectors (Cómo Funciona)

El script busca elementos por tipo de input:

```javascript
// Números telefónicos
input[type="text"], input[type="tel"]

// Monto de recarga
input[type="number"]

// Tipo de persona y banco
select
```

## Resultados y Reportes

### Carpeta `screenshots/`

Cada recarga genera una captura:
```
screenshots/
├── recarga-3001234567-1726956300000.png
├── recarga-3009876543-1726956302000.png
└── recarga-3015555555-1726956304000.png
```

### Consola

```
🚀 Iniciando automatizacion de recargas Nequi
[INFO] Total de registros: 5

[INFO] Procesando recarga: 3001234567
[SUCCESS] Formulario completado

[INFO] Procesando recarga: 3009876543
[SUCCESS] Formulario completado

[REPORT] RESUMEN:
[OK] Exitosos: 5/5
[FAIL] Fallidos: 0/5
```

### Descarga desde HTML

Click en "Descargar Reporte" genera:
```json
{
  "timestamp": "2024-09-21T10:30:45.123Z",
  "total": 5,
  "success": 5,
  "failed": 0,
  "records": [...]
}
```

## Casos de Uso

### 1. Testing Manual

```bash
# Abrir preview.html
# Llenar formulario manualmente
# Ver que funciona la interfaz
```

### 2. Testing Automatizado

```bash
npm start
# Script completa todos los datos automáticamente
```

### 3. Carga Masiva

```javascript
// Agregar 100+ registros en src/data.js
export const testData = [
  { numero: '300...', monto: 5000, ... },
  { numero: '301...', monto: 10000, ... },
  // ... 98 más
];

npm start
```

### 4. Testing de Banco Específico

```javascript
// Filtrar solo un banco:
export const testData = [
  { numero: '3001234567', banco: 'Bancolombia' },
  { numero: '3009876543', banco: 'Bancolombia' },
];
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Navegador no abre | Instalar: `npx playwright install chromium` |
| Formulario no se llena | Activar DEBUG=true y revisar selectores |
| Timeout en página | Aumentar PAGE_LOAD_TIMEOUT a 20000 |
| No se generan screenshots | Verificar carpeta `screenshots/` existe |
| Error de dependencias | Ejecutar: `npm install` nuevamente |

## API Disponible

Puedes usar el script desde otra aplicación:

```javascript
import { testData } from './src/data.js';
import { config } from './src/config.js';

// Acceder a datos de prueba
testData.forEach(record => {
  console.log(record.numero, record.monto);
});

// Acceder a configuración
console.log(config.url);
console.log(config.headless);
```

## Seguridad y Notas

⚠️ **IMPORTANTE:**
- Usar SOLO en ambiente de testing
- Los datos incluidos son ficticios
- No usar en producción sin validación
- Nunca compartir URLs con credenciales reales
- Respetar términos de servicio de Nequi

## Actualizaciones Futuras

Posibles mejoras:
- [ ] Integración con BD para guardar resultados
- [ ] API REST para controlar automatización
- [ ] Dashboard de estadísticas
- [ ] Notificaciones por email
- [ ] Exportar a Excel

## Soporte

Para problemas:
1. Revisar logs en consola
2. Verificar .env está correctamente
3. Revisar que URL sea accesible
4. Comprobar que Playwright está instalado

---

**Última actualización:** 2026-09-21  
**Versión:** 1.0.0  
**Estado:** Production Ready ✅

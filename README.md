# Automatización de Recargas Nequi - Sistema de Testing

Solución automatizada para llenar y procesar formularios de recargas en la plataforma Nequi. Utiliza Playwright para automatizar la interacción con el navegador.

## Características

✅ **Automatización de formularios** - Llena automáticamente todos los campos  
✅ **Datos de prueba** - Conjunto de datos configurables  
✅ **Capturas de pantalla** - Registra cada formulario completado  
✅ **Reporte de resultados** - Muestra resumen de ejecución  
✅ **Manejo de errores** - Control robusto de excepciones  

## Instalación

```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install chromium
```

## Uso

```bash
# Ejecutar automatización
npm start

# Ver ejecución en modo headless
npm run test
```

## Estructura

```
pse-nequi/
├── package.json          # Dependencias del proyecto
├── README.md            # Este archivo
├── src/
│   ├── index.js        # Script principal de automatización
│   └── data.js         # Datos de prueba
└── screenshots/        # Capturas de pantalla (generadas)
```

## Personalización

### Agregar más datos de prueba

Edita `src/data.js` y agrega objetos con la estructura:

```javascript
{
  numero: '300XXXXXXXX',
  monto: 5000,
  tipoPersona: 'Natural',
  banco: 'Bancolombia'
}
```

### Campos disponibles

- **numero**: Número telefónico (10 dígitos)
- **monto**: Valor de recarga en pesos
- **tipoPersona**: 'Natural' o 'Jurídica'
- **banco**: Nombre del banco

## Configuración

Para modificar comportamientos:

- **URL**: Cambiar `BASE_URL` en `src/index.js`
- **Modo headless**: Establecer `headless: true` en `chromium.launch()`
- **Timeout**: Ajustar valores de espera en `page.waitForSelector()`
- **Delay entre registros**: Modificar `page.waitForTimeout(2000)`

## Requisitos

- Node.js >= 16
- Windows 10+, macOS, o Linux
- Conexión a internet

## Notas

⚠️ Este script es solo para **testing** en ambiente de pruebas  
⚠️ Los datos de prueba son ficticios  
⚠️ No utilizar en producción sin validación adicional  

## Soporte

Para problemas o preguntas, revisar:
- Logs en consola
- Capturas de pantalla en `screenshots/`
- Documentación de Playwright: https://playwright.dev

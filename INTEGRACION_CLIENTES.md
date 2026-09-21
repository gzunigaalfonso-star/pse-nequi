# 📖 Guía de Integración - SDK de Pago Nequi

## 🎯 ¿Qué es?

SDK JavaScript que permite a tus clientes procesar pagos PSE-Nequi desde tu sitio web de forma **100% remota y automática**.

## ⚡ Inicio Rápido

### 1. Obtener API Key

Contacta con nosotros para obtener tu **API Key**:
```
API Key: sk_tu_api_key_aqui
```

### 2. Insertar Script en tu Sitio

Agregar en el `<head>` o antes del `</body>`:

```html
<script src="https://tu-dominio.com/sdk-pago.js"></script>

<script>
  // Inicializar SDK
  NequiPago.init({
    apiUrl: 'https://tu-servidor.com',  // URL de tu servidor
    apiKey: 'sk_tu_api_key_aqui',       // Tu API Key
    debug: true                           // Mostrar logs
  });
</script>
```

### 3. Botón de Pago

```html
<button onclick="procesarPago()">
  Pagar $5,000
</button>

<script>
  function procesarPago() {
    NequiPago.pagar(
      '3001234567',  // Número de celular del cliente
      5000,          // Monto en pesos
      {
        tipoPersona: 'Natural'  // Opcional: Natural o Juridica
      }
    );
  }
</script>
```

---

## 📋 Métodos Disponibles

### `NequiPago.init(opciones)`

Inicializar el SDK con configuración.

**Parámetros:**
- `apiUrl` (string): URL de tu servidor API
- `apiKey` (string): Tu clave API
- `debug` (boolean): Mostrar logs (default: false)

**Ejemplo:**
```javascript
NequiPago.init({
  apiUrl: 'https://api.tudominio.com',
  apiKey: 'sk_demo_123456789',
  debug: true
});
```

---

### `NequiPago.pagar(numero, monto, opciones)`

Iniciar proceso de pago.

**Parámetros:**
- `numero` (string): Número celular (10 dígitos)
- `monto` (number): Monto en pesos
- `opciones` (object):
  - `tipoPersona` (string): 'Natural' o 'Juridica' (default: 'Natural')
  - `banco` (string): Código del banco (opcional)

**Ejemplo:**
```javascript
NequiPago.pagar('3001234567', 50000, {
  tipoPersona: 'Natural',
  banco: 'BANCOLOMBIA'
});
```

---

### `NequiPago.obtenerEstado(transaccionId)`

Obtener estado de una transacción.

**Parámetros:**
- `transaccionId` (string): ID de la transacción

**Retorna:**
```javascript
{
  transaccionId: "txn_1234567890",
  estado: "procesada",  // iniciada, procesando, procesada, error
  numero: "3001234567",
  monto: 5000,
  banco: "BANCOLOMBIA",
  resultado: "Recarga procesada exitosamente"
}
```

**Ejemplo:**
```javascript
NequiPago.obtenerEstado('txn_1234567890').then(estado => {
  console.log('Estado:', estado.estado);
});
```

---

### `NequiPago.historial()`

Obtener historial de pagos.

**Retorna:**
```javascript
{
  total: 5,
  transacciones: [
    { transaccionId, estado, monto, ... },
    ...
  ]
}
```

**Ejemplo:**
```javascript
NequiPago.historial().then(datos => {
  console.log('Total pagos:', datos.total);
});
```

---

### `NequiPago.onSuceso`

Callback cuando el pago se procesa exitosamente.

**Ejemplo:**
```javascript
NequiPago.onSuceso = function(resultado) {
  console.log('Pago exitoso:', resultado);
  // Redirigir a página de confirmación
  window.location.href = '/confirmacion?id=' + resultado.transaccionId;
};
```

---

### `NequiPago.onError`

Callback cuando hay error en el pago.

**Ejemplo:**
```javascript
NequiPago.onError = function(error) {
  console.error('Error en pago:', error);
  alert('Error: ' + error.error);
};
```

---

## 🔄 Flujo Completo

```
1. Usuario hace click en "Pagar"
        ↓
2. Se abre modal PSE
        ↓
3. Usuario selecciona:
   - Tipo de persona (Natural/Jurídica)
   - Banco
        ↓
4. Click en "Pagar Ahora"
        ↓
5. Backend procesa automáticamente:
   - Abre navegador (Playwright)
   - Llena formulario Nequi
   - Marca checkbox
   - Clickea botón
   - Procesa recarga
        ↓
6. Retorna resultado
        ↓
7. Se ejecuta onSuceso o onError
```

---

## 💻 Ejemplo Completo

### HTML
```html
<!DOCTYPE html>
<html>
<head>
  <title>Mi Tienda</title>
</head>
<body>

<div style="text-align: center; padding: 50px;">
  <h1>Carrito de Compras</h1>
  <p>Total: $5,000</p>
  
  <button id="btn-pagar" style="
    padding: 15px 30px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
  ">
    Pagar con PSE-Nequi
  </button>
</div>

<!-- SDK -->
<script src="https://tu-dominio.com/sdk-pago.js"></script>

<script>
  // Inicializar
  NequiPago.init({
    apiUrl: 'https://tu-servidor.com',
    apiKey: 'sk_demo_123456789',
    debug: true
  });

  // Callbacks
  NequiPago.onSuceso = function(resultado) {
    alert('✅ Pago procesado exitosamente');
    console.log('ID Transacción:', resultado.transaccionId);
    // Guardar en base de datos, enviar email, etc.
  };

  NequiPago.onError = function(error) {
    alert('❌ Error: ' + error.error);
  };

  // Botón de pago
  document.getElementById('btn-pagar').addEventListener('click', function() {
    const numero = prompt('Ingresa tu número celular:');
    if (numero && numero.length === 10) {
      NequiPago.pagar(numero, 5000, {
        tipoPersona: 'Natural'
      });
    } else {
      alert('Número inválido');
    }
  });
</script>

</body>
</html>
```

---

## 🔐 Seguridad

- ✅ **API Key privada** - Nunca la expongas en código cliente público
- ✅ **HTTPS obligatorio** - Siempre usar HTTPS
- ✅ **Validación en servidor** - El servidor valida cada solicitud
- ✅ **Transacciones encriptadas** - Los datos se envían de forma segura

---

## 🐛 Debugging

### Habilitar logs:
```javascript
NequiPago.debug(true);
```

### Ver en consola:
```javascript
// Abrir DevTools (F12) → Console
// Verás logs como:
// [NequiPago] Iniciando pago...
// [NequiPago] Transacción: txn_1234567890
```

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa con el dinero?
El dinero se recarga realmente en la cuenta Nequi del número especificado.

### ¿Cuáles son los límites?
- Monto mínimo: $1,000
- Monto máximo: Depende del banco
- Transacciones diarias: Sin límite

### ¿Se ve el formulario de Nequi?
No. Todo se procesa en background. El usuario solo ve el modal PSE.

### ¿Cuánto tarda?
- Generalmente: 2-5 segundos
- El usuario ve pantalla de carga mientras se procesa

### ¿Qué bancos soportan?
Todos los bancos colombianos. Ver lista completa en documentación.

---

## 📞 Soporte

Email: soporte@tudominio.com
Teléfono: +57 1 xxxxxx

---

**Versión:** 1.0.0  
**Última actualización:** 2026-09-21

# 🚀 Servidor API - Automatización Nequi Remota

## ¿Qué es?

Servidor Express.js que maneja todo el procesamiento de pagos **remotamente** sin necesidad de que el cliente vea la pantalla de Nequi.

---

## ⚡ Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar el Servidor

```bash
node server.js
```

**Salida esperada:**
```
🚀 Servidor API ejecutándose en puerto 3000
📍 http://localhost:3000

API Key Demo: sk_demo_123456789
```

### 3. Probar la API

```bash
# Obtener información
curl -H "X-API-Key: sk_demo_123456789" http://localhost:3000/api/clientes/info

# Iniciar pago
curl -X POST http://localhost:3000/api/pagos/iniciar \
  -H "X-API-Key: sk_demo_123456789" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "3001234567",
    "monto": 5000,
    "tipoPersona": "Natural",
    "banco": "ACCION FIDUCIARIA"
  }'
```

---

## 📡 Endpoints API

### **POST** `/api/clientes/registrar`

Registrar un nuevo cliente y obtener API Key.

**Request:**
```json
{
  "nombre": "Mi Tienda",
  "email": "contacto@miienda.com"
}
```

**Response:**
```json
{
  "exito": true,
  "apiKey": "sk_xxxxxxxxxxxxxxxxxx",
  "mensaje": "Cliente registrado exitosamente"
}
```

---

### **GET** `/api/clientes/info`

Obtener información del cliente.

**Headers:**
```
X-API-Key: sk_tu_api_key
```

**Response:**
```json
{
  "cliente": "Mi Tienda",
  "email": "contacto@miienda.com",
  "activo": true,
  "fechaCreacion": "2026-09-21T..."
}
```

---

### **POST** `/api/pagos/iniciar`

Iniciar una transacción de pago.

**Headers:**
```
X-API-Key: sk_tu_api_key
Content-Type: application/json
```

**Request:**
```json
{
  "numero": "3001234567",
  "monto": 5000,
  "tipoPersona": "Natural",
  "banco": "ACCION FIDUCIARIA"
}
```

**Response:**
```json
{
  "exito": true,
  "transaccionId": "txn_1234567890_abc123",
  "monto": 5000,
  "estado": "iniciada"
}
```

---

### **POST** `/api/pagos/procesar`

Procesar una transacción (ejecuta el script de automatización).

**Headers:**
```
X-API-Key: sk_tu_api_key
Content-Type: application/json
```

**Request:**
```json
{
  "transaccionId": "txn_1234567890_abc123"
}
```

**Response:**
```json
{
  "exito": true,
  "transaccionId": "txn_1234567890_abc123",
  "estado": "procesando"
}
```

---

### **GET** `/api/pagos/estado/:transaccionId`

Obtener estado de una transacción.

**Headers:**
```
X-API-Key: sk_tu_api_key
```

**Response:**
```json
{
  "transaccionId": "txn_1234567890_abc123",
  "estado": "procesada",
  "numero": "3001234567",
  "monto": 5000,
  "banco": "ACCION FIDUCIARIA",
  "tipoPersona": "Natural",
  "resultado": "Recarga procesada exitosamente"
}
```

---

### **GET** `/api/pagos/historial`

Obtener historial de pagos del cliente.

**Headers:**
```
X-API-Key: sk_tu_api_key
```

**Response:**
```json
{
  "total": 5,
  "transacciones": [
    {
      "transaccionId": "txn_...",
      "estado": "procesada",
      "monto": 5000,
      ...
    }
  ]
}
```

---

## 🔄 Flujo de Uso

```
Cliente               Tu Servidor            Backend Nequi
   |                      |                        |
   | 1. Click Pagar       |                        |
   |--------------------->|                        |
   |                      | 2. POST /pagos/iniciar |
   |                      |                        |
   |<-- 3. Modal SDK ----|                        |
   |                      |                        |
   | 4. Selecciona banco  |                        |
   | y tipo de persona    |                        |
   |                      |                        |
   | 5. Click Pagar       |                        |
   |--------------------->|                        |
   |                      | 6. POST /pagos/procesar|
   |                      |                        |
   |<-- 7. Pantalla ------|                        |
   |    cargando          |                        |
   |                      | 8. Abre navegador      |
   |                      | 9. Llena formulario    |
   |                      | 10. Procesa pago      |
   |                      |                        |
   |<-- 11. Resultado ----|                        |
   |
   | 12. Redirige a confirmación
```

---

## 🔐 Seguridad

### API Keys

Cada cliente tiene una API Key única:
- Valida en cada solicitud
- No debe ser expuesta
- Regenerable si se compromete

### Validación

- ✅ Verificar API Key en cada endpoint
- ✅ Validar datos de entrada
- ✅ HTTPS obligatorio en producción
- ✅ Rate limiting (opcional)

---

## 🛠️ Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
PORT=3000
NODE_ENV=production
HEADLESS=true
LOG_LEVEL=info
```

### Puerto Personalizado

```bash
PORT=8080 node server.js
```

---

## 📊 Estados de Transacción

| Estado | Descripción |
|--------|------------|
| `iniciada` | Transacción creada, pendiente de procesar |
| `procesando` | En proceso de automatización |
| `procesada` | Completada exitosamente |
| `error` | Error durante el procesamiento |

---

## 🐛 Debugging

### Ver logs detallados

En `server.js`, línea 140:

```javascript
console.log(`[${transaccionId}] Abriendo Nequi...`);
```

### Verificar transacciones en memoria

```javascript
// En consola del servidor
console.log(transacciones.get('txn_xxxxx'));
```

---

## 📈 Producción

### Hosting Recomendado

1. **Heroku** - Gratis/Pago
2. **Railway** - Moderno y fácil
3. **Render** - Muy bueno
4. **AWS EC2** - Escalable
5. **DigitalOcean** - Económico

### Checklist

- [ ] Cambiar API Keys de demostración
- [ ] Usar HTTPS
- [ ] Agregar autenticación más fuerte
- [ ] Implementar base de datos (MongoDB/PostgreSQL)
- [ ] Agregar rate limiting
- [ ] Configurar logs
- [ ] Agregar monitoreo
- [ ] Hacer backup de transacciones

---

## 🔄 Base de Datos (Opcional)

Actualmente usa memoria. Para producción:

### MongoDB

```javascript
import mongoose from 'mongoose';

const transaccionSchema = new mongoose.Schema({
  apiKey: String,
  numero: String,
  monto: Number,
  estado: String,
  resultado: String,
  fechaCreacion: Date
});

const Transaccion = mongoose.model('Transaccion', transaccionSchema);
```

### PostgreSQL

```sql
CREATE TABLE transacciones (
  id VARCHAR PRIMARY KEY,
  api_key VARCHAR NOT NULL,
  numero VARCHAR NOT NULL,
  monto INTEGER NOT NULL,
  estado VARCHAR NOT NULL,
  resultado TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);
```

---

## 📞 Soporte

Para soporte contactar: soporte@tudominio.com

---

**Versión:** 1.0.0  
**Última actualización:** 2026-09-21

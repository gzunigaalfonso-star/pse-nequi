# Gestión de Números de Recarga y Montos

## Base de Datos de Recargas

Los números de recarga y sus montos están definidos en `pse-welcome.html` en la sección de JavaScript.

## Números Configurados Actualmente

```
3001234567  →  $5,000
3009876543  →  $10,000
3015555555  →  $15,000
3025555555  →  $20,000
3035555555  →  $25,000
3041111111  →  $8,000
3052222222  →  $12,000
3063333333  →  $18,000
3074444444  →  $30,000
3085555555  →  $7,000
3101111111  →  $50,000
3112222222  →  $3,000
3123333333  →  $6,000
3134444444  →  $9,000
3145555555  →  $11,000
```

## Cómo Agregar Nuevos Números

### Paso 1: Abre `pse-welcome.html`

### Paso 2: Busca esta sección (línea ~100)

```javascript
const rechargeDatabase = {
  '3001234567': 5000,
  '3009876543': 10000,
  // ... más números
};
```

### Paso 3: Agrega tus números

```javascript
const rechargeDatabase = {
  '3001234567': 5000,
  '3009876543': 10000,
  // ... números existentes ...
  '3009999999': 25000,  // ← NUEVO número
  '3008888888': 40000   // ← OTRO número nuevo
};
```

## Formato

- **Clave:** Número telefónico (string con comillas)
- **Valor:** Monto en pesos (número sin comillas)

```javascript
'NUMERO_TELEFONO': MONTO
```

## Ejemplo Completo

```javascript
const rechargeDatabase = {
  '3001234567': 5000,
  '3009876543': 10000,
  '3015555555': 15000,
  '3025555555': 20000,
  '3035555555': 25000,
  '3041111111': 8000,
  '3052222222': 12000,
  '3063333333': 18000,
  '3074444444': 30000,
  '3085555555': 7000,
  '3101111111': 50000,
  '3112222222': 3000,
  '3123333333': 6000,
  '3134444444': 9000,
  '3145555555': 11000,
  '3150000001': 100000,  // Nuevo
  '3160000002': 20000,   // Nuevo
  '3170000003': 35000    // Nuevo
};
```

## Cómo Funciona

1. **Usuario ingresa número:** Escribe un número de 10 dígitos
2. **Sistema busca:** Si el número existe en `rechargeDatabase`
3. **Si existe:**
   - ✅ Muestra el monto automáticamente (fondo verde)
   - El monto está listo para procesar
4. **Si NO existe:**
   - ❌ Muestra $0 (fondo rojo)
   - No permite procesar

## Editar Monto de un Número Existente

Simplemente cambia el valor:

```javascript
// Antes:
'3001234567': 5000,

// Después:
'3001234567': 7500,  // Cambio el monto
```

## Eliminar un Número

Quita la línea completa:

```javascript
// Elimina esta línea:
'3001234567': 5000,
```

## Validación Automática

El sistema valida que:
- ✓ El número sea válido en la base de datos
- ✓ El monto se encuentre
- ✓ El usuario seleccione banco y tipo de persona
- ✗ No permite procesar si el número no existe

## Montos Predeterminados

Si quieres cambiar montos por defecto para ciertos rangos, puedes agregar lógica en JavaScript:

```javascript
// Ejemplo: Montos por rango
function getMontoByNumber(numero) {
  if (numero in rechargeDatabase) {
    return rechargeDatabase[numero];
  }
  
  // Fallback: si no está en BD, calcula automático
  const ultimoDigito = parseInt(numero[numero.length - 1]);
  return ultimoDigito * 5000;
}
```

## Backup de Configuración

Siempre mantén un backup de los números y montos. Puedes guardar una copia en un archivo JSON:

```json
{
  "rechargeDatabase": {
    "3001234567": 5000,
    "3009876543": 10000
  }
}
```

## Notas Importantes

⚠️ **Importante:**
- El número debe tener exactamente 10 dígitos
- Los montos deben ser números positivos
- Cuida la sintaxis de JavaScript (comas, comillas, puntos y comas)
- Si cometes un error de sintaxis, el formulario no funciona

## Soporte

Si necesitas más números de recarga o un sistema más robusto:
- Crea una conexión a base de datos
- O un panel de administración
- O un archivo CSV que se cargue dinámicamente

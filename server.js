import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Base de datos en memoria (en producción usar MongoDB/PostgreSQL)
const transacciones = new Map();
const apiKeys = new Map();

// Generar API key para clientes
function generarApiKey() {
  return 'sk_' + crypto.randomBytes(32).toString('hex');
}

// Validar API key
function validarApiKey(key) {
  return apiKeys.has(key);
}

// Datos de prueba - API keys de clientes
apiKeys.set('sk_demo_123456789', {
  cliente: 'Cliente Demo',
  activo: true,
  fechaCreacion: new Date()
});

// ============ RUTAS API ============

// 1. Registrar nuevo cliente (para obtener API key)
app.post('/api/clientes/registrar', (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email requeridos' });
  }

  const apiKey = generarApiKey();
  apiKeys.set(apiKey, {
    cliente: nombre,
    email: email,
    activo: true,
    fechaCreacion: new Date()
  });

  res.json({
    exito: true,
    apiKey: apiKey,
    mensaje: 'Cliente registrado exitosamente'
  });
});

// 2. Obtener información del cliente
app.get('/api/clientes/info', (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key requerida' });
  }

  if (!validarApiKey(apiKey)) {
    return res.status(401).json({ error: 'API key inválida' });
  }

  const cliente = apiKeys.get(apiKey);
  res.json({
    cliente: cliente.cliente,
    email: cliente.email,
    activo: cliente.activo,
    fechaCreacion: cliente.fechaCreacion
  });
});

// 3. RUTA PRINCIPAL: Iniciar proceso de pago
app.post('/api/pagos/iniciar', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const { numero, monto, tipoPersona, banco } = req.body;

    // Validar API key
    if (!apiKey || !validarApiKey(apiKey)) {
      return res.status(401).json({ error: 'API key inválida' });
    }

    // Validar datos
    if (!numero || !monto || !tipoPersona || !banco) {
      return res.status(400).json({
        error: 'Faltan campos: numero, monto, tipoPersona, banco'
      });
    }

    // Generar ID de transacción
    const transaccionId = 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Guardar transacción
    transacciones.set(transaccionId, {
      id: transaccionId,
      apiKey: apiKey,
      numero: numero,
      monto: monto,
      tipoPersona: tipoPersona,
      banco: banco,
      estado: 'iniciada',
      fechaCreacion: new Date(),
      fechaProcesamiento: null,
      resultado: null
    });

    res.json({
      exito: true,
      transaccionId: transaccionId,
      monto: monto,
      estado: 'iniciada',
      mensaje: 'Proceso de pago iniciado. Procesa la recarga automáticamente.'
    });

  } catch (error) {
    console.error('Error en /api/pagos/iniciar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 4. RUTA: Procesar recarga automáticamente
app.post('/api/pagos/procesar', async (req, res) => {
  try {
    const { transaccionId } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!validarApiKey(apiKey)) {
      return res.status(401).json({ error: 'API key inválida' });
    }

    if (!transaccionId || !transacciones.has(transaccionId)) {
      return res.status(400).json({ error: 'Transacción no encontrada' });
    }

    const transaccion = transacciones.get(transaccionId);

    if (transaccion.estado === 'procesada') {
      return res.json({
        exito: true,
        estado: 'procesada',
        transaccionId: transaccionId,
        resultado: transaccion.resultado
      });
    }

    // Automatizar en background
    procesarRecargaEnBackground(transaccionId).catch(err => {
      console.error('Error procesando recarga:', err);
      const txn = transacciones.get(transaccionId);
      if (txn) {
        txn.estado = 'error';
        txn.resultado = 'Error al procesar: ' + err.message;
      }
    });

    res.json({
      exito: true,
      transaccionId: transaccionId,
      estado: 'procesando',
      mensaje: 'Recarga en proceso...'
    });

  } catch (error) {
    console.error('Error en /api/pagos/procesar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 5. RUTA: Obtener estado de transacción
app.get('/api/pagos/estado/:transaccionId', (req, res) => {
  const { transaccionId } = req.params;
  const apiKey = req.headers['x-api-key'];

  if (!validarApiKey(apiKey)) {
    return res.status(401).json({ error: 'API key inválida' });
  }

  if (!transacciones.has(transaccionId)) {
    return res.status(404).json({ error: 'Transacción no encontrada' });
  }

  const transaccion = transacciones.get(transaccionId);

  res.json({
    transaccionId: transaccion.id,
    estado: transaccion.estado,
    numero: transaccion.numero,
    monto: transaccion.monto,
    banco: transaccion.banco,
    tipoPersona: transaccion.tipoPersona,
    fechaCreacion: transaccion.fechaCreacion,
    fechaProcesamiento: transaccion.fechaProcesamiento,
    resultado: transaccion.resultado
  });
});

// 6. RUTA: Listar transacciones
app.get('/api/pagos/historial', (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (!validarApiKey(apiKey)) {
    return res.status(401).json({ error: 'API key inválida' });
  }

  const clienteTransacciones = Array.from(transacciones.values())
    .filter(t => t.apiKey === apiKey);

  res.json({
    total: clienteTransacciones.length,
    transacciones: clienteTransacciones
  });
});

// ============ FUNCIÓN DE PROCESAMIENTO ============

async function procesarRecargaEnBackground(transaccionId) {
  const transaccion = transacciones.get(transaccionId);
  const NEQUI_URL = 'https://clientes.nequi.com.co/recargas';

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    console.log(`[${transaccionId}] Abriendo Nequi...`);
    await page.goto(NEQUI_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Llenar campos
    const allInputs = await page.locator('input[type="text"], input[type="tel"], input[type="number"]').all();

    if (allInputs.length >= 3) {
      await allInputs[0].click();
      await allInputs[0].clear();
      await allInputs[0].fill(transaccion.numero);
      await page.waitForTimeout(300);

      await allInputs[1].click();
      await allInputs[1].clear();
      await allInputs[1].fill(transaccion.numero);
      await page.waitForTimeout(300);

      await allInputs[2].click();
      await allInputs[2].clear();
      await allInputs[2].fill(transaccion.monto.toString());
      await page.waitForTimeout(300);
    }

    // Seleccionar dropdowns
    const selects = await page.locator('select').all();
    if (selects.length > 0) {
      await selects[0].selectOption(transaccion.tipoPersona);
      await page.waitForTimeout(300);
    }

    if (selects.length > 1) {
      await selects[1].selectOption(transaccion.banco);
      await page.waitForTimeout(300);
    }

    // Marcar checkbox
    await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.waitForTimeout(500);

    // Clickear botón
    const buttons = await page.locator('button').all();
    let submitBtn = null;

    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text && (text.includes('Continuar') || text.includes('Procesar'))) {
        submitBtn = btn;
        break;
      }
    }

    if (submitBtn) {
      console.log(`[${transaccionId}] Procesando recarga...`);
      await submitBtn.click({ force: true });
      await page.waitForTimeout(3000);

      transaccion.estado = 'procesada';
      transaccion.resultado = 'Recarga procesada exitosamente';
      transaccion.fechaProcesamiento = new Date();

      console.log(`[${transaccionId}] ✅ Recarga procesada`);
    } else {
      throw new Error('Botón de envío no encontrado');
    }

  } catch (error) {
    console.error(`[${transaccionId}] Error:`, error.message);
    transaccion.estado = 'error';
    transaccion.resultado = 'Error: ' + error.message;
    transaccion.fechaProcesamiento = new Date();
  } finally {
    await browser.close();
  }
}

// ============ SERVIDOR ============

app.get('/', (req, res) => {
  res.json({
    nombre: 'API Automatización Nequi',
    version: '1.0.0',
    endpoints: [
      'POST /api/clientes/registrar',
      'GET /api/clientes/info',
      'POST /api/pagos/iniciar',
      'POST /api/pagos/procesar',
      'GET /api/pagos/estado/:transaccionId',
      'GET /api/pagos/historial'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor API ejecutándose en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n📚 Documentación: http://localhost:${PORT}/docs`);
  console.log(`\nAPI Key Demo: sk_demo_123456789\n`);
});

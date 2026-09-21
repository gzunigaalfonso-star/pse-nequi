/**
 * SDK de Pago PSE Nequi
 * Versión: 1.0.0
 * Uso: <script src="https://tu-dominio.com/sdk-pago.js"></script>
 */

window.NequiPago = (function() {
  'use strict';

  const config = {
    apiUrl: 'http://localhost:3000',
    apiKey: '',
    debug: true
  };

  // ============ FUNCIONES INTERNAS ============

  function log(mensaje) {
    if (config.debug) console.log('[NequiPago]', mensaje);
  }

  function mostrarModal(contenido) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'nequi-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'nequi-modal';
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 40px;
      max-width: 600px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease-out;
    `;

    modal.innerHTML = contenido;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Agregar estilos de animación
    if (!document.getElementById('nequi-styles')) {
      const style = document.createElement('style');
      style.id = 'nequi-styles';
      style.textContent = `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .nequi-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }

    return overlay;
  }

  function cerrarModal() {
    const overlay = document.getElementById('nequi-overlay');
    if (overlay) {
      overlay.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => overlay.remove(), 300);
    }
  }

  function mostrarPantallaCarga() {
    const html = `
      <div style="text-align: center;">
        <div class="nequi-spinner" style="margin: 20px auto;"></div>
        <h2 style="color: #333; margin: 20px 0;">Procesando pago PSE</h2>
        <p style="color: #666; font-size: 14px;">
          Te estamos redireccionando a tu entidad financiera...
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Por favor no cierres esta ventana
        </p>
      </div>
    `;
    return mostrarModal(html);
  }

  function mostrarFormulario(transaccionId, numeroSinFormato) {
    const html = `
      <style>
        .nequi-form {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .nequi-form h2 {
          color: #667eea;
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .nequi-form p {
          color: #666;
          margin: 0 0 30px 0;
          font-size: 14px;
        }
        .nequi-form-group {
          margin-bottom: 20px;
        }
        .nequi-form-group label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .nequi-form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }
        .nequi-form-group select:focus {
          outline: none;
          border-color: #667eea;
        }
        .nequi-info {
          background: #f0f7ff;
          border-left: 4px solid #667eea;
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-size: 13px;
          color: #555;
        }
        .nequi-info strong {
          color: #667eea;
        }
        .nequi-buttons {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }
        .nequi-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        .nequi-btn-primary {
          background: #667eea;
          color: white;
        }
        .nequi-btn-primary:hover {
          background: #5568d3;
        }
        .nequi-btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: 2px solid #e0e0e0;
        }
        .nequi-btn-secondary:hover {
          background: #e8e8e8;
        }
      </style>

      <div class="nequi-form">
        <h2>Confirmar Pago</h2>
        <p>Completa los datos para procesar tu recarga</p>

        <div class="nequi-info">
          <strong>Número:</strong> ${numeroSinFormato}<br>
          <strong>Monto:</strong> $${parseInt(transaccionId.split('_')[1] || 0).toLocaleString()}
        </div>

        <div class="nequi-form-group">
          <label for="tipo-persona">Tipo de Persona:</label>
          <select id="tipo-persona" required>
            <option value="">-- Selecciona --</option>
            <option value="Natural">Natural</option>
            <option value="Juridica">Jurídica</option>
          </select>
        </div>

        <div class="nequi-form-group">
          <label for="banco">Elige el Banco:</label>
          <select id="banco" required>
            <option value="">-- Selecciona --</option>
            <option value="ACCION FIDUCIARIA">ACCION FIDUCIARIA</option>
            <option value="ALIANZA FIDUCIARIA">ALIANZA FIDUCIARIA</option>
            <option value="BAN100">BAN100</option>
            <option value="BANCAMIA S.A.">BANCAMIA S.A.</option>
            <option value="BANCO AGRARIO">BANCO AGRARIO</option>
            <option value="BANCO AV VILLAS">BANCO AV VILLAS</option>
            <option value="BANCO BBVA COLOMBIA S.A.">BANCO BBVA COLOMBIA S.A.</option>
            <option value="BANCO DAVIVIENDA">BANCO DAVIVIENDA</option>
            <option value="BANCO DE BOGOTA">BANCO DE BOGOTA</option>
            <option value="BANCOLOMBIA">BANCOLOMBIA</option>
            <option value="BANCO ITAU">BANCO ITAU</option>
            <option value="BANCO SANTANDER COLOMBIA">BANCO SANTANDER COLOMBIA</option>
            <option value="DAVIPLATA">DAVIPLATA</option>
            <option value="NEQUI">NEQUI</option>
          </select>
        </div>

        <div class="nequi-buttons">
          <button class="nequi-btn nequi-btn-secondary" onclick="document.getElementById('nequi-overlay').remove();">
            Cancelar
          </button>
          <button class="nequi-btn nequi-btn-primary" onclick="procederPago('${transaccionId}')">
            Pagar Ahora
          </button>
        </div>
      </div>
    `;

    return mostrarModal(html);
  }

  // ============ API CALLS ============

  async function llamarApi(metodo, endpoint, datos = null) {
    const opciones = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey
      }
    };

    if (datos) {
      opciones.body = JSON.stringify(datos);
    }

    try {
      const respuesta = await fetch(config.apiUrl + endpoint, opciones);
      const json = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(json.error || 'Error en la API');
      }

      return json;
    } catch (error) {
      log('Error en API: ' + error.message);
      throw error;
    }
  }

  async function procederPago(transaccionId) {
    const tipoPersona = document.getElementById('tipo-persona').value;
    const banco = document.getElementById('banco').value;

    if (!tipoPersona || !banco) {
      alert('Por favor selecciona tipo de persona y banco');
      return;
    }

    log('Procesando pago...');
    cerrarModal();
    mostrarPantallaCarga();

    try {
      await llamarApi('POST', '/api/pagos/procesar', { transaccionId });

      // Esperar a que se procese
      await esperarProcesamiento(transaccionId);

      cerrarModal();

      // Mostrar resultado
      const resultado = transacciones.get(transaccionId);
      if (resultado && resultado.estado === 'procesada') {
        alert('✅ Pago procesado exitosamente');
        window.NequiPago.onSuceso && window.NequiPago.onSuceso(resultado);
      } else {
        alert('❌ Error al procesar el pago');
        window.NequiPago.onError && window.NequiPago.onError(resultado);
      }

    } catch (error) {
      cerrarModal();
      alert('Error: ' + error.message);
      window.NequiPago.onError && window.NequiPago.onError({ error: error.message });
    }
  }

  let transacciones = new Map();

  async function esperarProcesamiento(transaccionId, intentos = 0) {
    const maxIntentos = 30; // 30 segundos

    if (intentos >= maxIntentos) {
      throw new Error('Timeout al procesar pago');
    }

    try {
      const respuesta = await llamarApi('GET', `/api/pagos/estado/${transaccionId}`);
      transacciones.set(transaccionId, respuesta);

      if (respuesta.estado === 'procesada' || respuesta.estado === 'error') {
        return respuesta;
      }

      await new Promise(r => setTimeout(r, 1000));
      return esperarProcesamiento(transaccionId, intentos + 1);
    } catch (error) {
      log('Error esperando procesamiento: ' + error.message);
      throw error;
    }
  }

  // ============ API PÚBLICA ============

  return {
    // Inicializar
    init: function(opciones) {
      Object.assign(config, opciones);
      log('SDK Inicializado');
      log('API URL: ' + config.apiUrl);
    },

    // Iniciar pago
    pagar: async function(numero, monto, opciones = {}) {
      if (!config.apiKey) {
        alert('Error: API key no configurada');
        return;
      }

      if (!numero || !monto) {
        alert('Error: Número y monto requeridos');
        return;
      }

      try {
        log(`Iniciando pago: ${numero} - $${monto}`);

        // Obtener valores por defecto
        const tipoPersona = opciones.tipoPersona || 'Natural';

        // Iniciar transacción
        const resultado = await llamarApi('POST', '/api/pagos/iniciar', {
          numero: numero,
          monto: parseInt(monto),
          tipoPersona: tipoPersona,
          banco: opciones.banco || ''
        });

        if (!resultado.exito) {
          throw new Error(resultado.error);
        }

        const transaccionId = resultado.transaccionId;
        transacciones.set(transaccionId, resultado);

        // Mostrar formulario
        mostrarFormulario(transaccionId, numero);

        // Hacer window.procederPago disponible globalmente
        window.procederPago = procederPago;

      } catch (error) {
        alert('Error: ' + error.message);
        this.onError && this.onError({ error: error.message });
      }
    },

    // Obtener estado
    obtenerEstado: async function(transaccionId) {
      if (!config.apiKey) {
        throw new Error('API key no configurada');
      }

      return await llamarApi('GET', `/api/pagos/estado/${transaccionId}`);
    },

    // Historial
    historial: async function() {
      if (!config.apiKey) {
        throw new Error('API key no configurada');
      }

      return await llamarApi('GET', '/api/pagos/historial');
    },

    // Callbacks
    onSuceso: null,
    onError: null,

    // Debug
    debug: function(estado) {
      config.debug = estado;
    }
  };

})();

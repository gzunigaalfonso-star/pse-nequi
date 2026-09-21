import { chromium } from 'playwright';
import { testData } from './data.js';
import { config } from './config.js';
import fs from 'fs';

async function fillRecargarForm(browser, datos) {
  const page = await browser.newPage();
  let retries = 0;
  const maxRetries = 3;

  try {
    console.log(`\n[INFO] Procesando recarga: ${datos.numero}`);

    // Ir al sitio de Nequi
    await page.goto(config.url, { waitUntil: 'networkidle', timeout: config.pageLoadTimeout });
    console.log(`[INFO] Página cargada: ${config.url}`);

    // Dar tiempo a que cargue completamente
    await page.waitForTimeout(2000);

    // Tomar screenshot inicial
    if (config.debug) {
      if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
      await page.screenshot({ path: `screenshots/inicial-${datos.numero}-${Date.now()}.png` });
    }

    // Intentar encontrar y llenar el campo de número
    console.log(`[INFO] Buscando campos del formulario...`);

    // Estrategia 1: Por placeholder o nombre
    let numeroInputs = await page.locator('input[placeholder*="Número"], input[placeholder*="número"], input[name="phoneNumber"], input[type="tel"]').all();

    if (numeroInputs.length === 0) {
      console.log(`[WARN] No se encontraron campos de teléfono específicos, intentando con todos los inputs`);
      numeroInputs = await page.locator('input[type="tel"], input[type="text"]').all();
    }

    // Llenar primer campo de número
    if (numeroInputs.length > 0) {
      await numeroInputs[0].click();
      await numeroInputs[0].fill(datos.numero);
      console.log(`[SUCCESS] Número ingresado: ${datos.numero}`);

      // Simular comportamiento humano
      await page.waitForTimeout(500);

      // Llenar segundo campo si existe (confirmación)
      if (numeroInputs.length > 1) {
        await numeroInputs[1].click();
        await numeroInputs[1].fill(datos.numero);
        console.log(`[SUCCESS] Número confirmado`);
      }
    } else {
      console.warn(`[WARN] No se encontraron campos de número de teléfono`);
    }

    // Llenar monto
    const amountInputs = await page.locator('input[type="number"], input[placeholder*="Cuánto"], input[placeholder*="cuánto"], input[placeholder*="monto"]').all();

    if (amountInputs.length > 0) {
      await amountInputs[0].click();
      await amountInputs[0].fill(datos.monto.toString());
      console.log(`[SUCCESS] Monto ingresado: $${datos.monto}`);
      await page.waitForTimeout(500);
    } else {
      console.warn(`[WARN] No se encontró campo de monto`);
    }

    // Seleccionar tipo de persona
    const typeSelects = await page.locator('select').all();

    if (typeSelects.length > 0) {
      try {
        await typeSelects[0].selectOption(datos.tipoPersona);
        console.log(`[SUCCESS] Tipo de persona: ${datos.tipoPersona}`);
        await page.waitForTimeout(300);
      } catch (e) {
        console.warn(`[WARN] No se pudo seleccionar tipo de persona`);
      }
    }

    // Seleccionar banco (segundo select)
    if (typeSelects.length > 1) {
      try {
        await typeSelects[1].selectOption(datos.banco);
        console.log(`[SUCCESS] Banco seleccionado: ${datos.banco}`);
        await page.waitForTimeout(300);
      } catch (e) {
        console.warn(`[WARN] No se pudo seleccionar banco: ${e.message}`);
      }
    }

    // Tomar screenshot final del formulario completado
    if (config.saveScreenshots) {
      if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
      await page.screenshot({ path: `screenshots/completado-${datos.numero}-${Date.now()}.png` });
      console.log(`[INFO] Screenshot guardado`);
    }

    console.log(`[SUCCESS] Formulario completado exitosamente`);
    return { success: true, numero: datos.numero, timestamp: new Date().toISOString() };

  } catch (error) {
    console.error(`[ERROR] Fallo al procesar ${datos.numero}: ${error.message}`);

    // Tomar screenshot del error
    if (config.saveScreenshots) {
      if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
      await page.screenshot({ path: `screenshots/error-${datos.numero}-${Date.now()}.png` }).catch(() => null);
    }

    return { success: false, numero: datos.numero, error: error.message, timestamp: new Date().toISOString() };
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: config.headless });

  console.log('[START] Iniciando automatizacion de recargas Nequi');
  console.log(`[INFO] Total de registros: ${testData.length}\n`);

  const resultados = [];

  for (const datos of testData) {
    const resultado = await fillRecargarForm(browser, datos);
    resultados.push(resultado);
    await new Promise(resolve => setTimeout(resolve, config.formFillDelay));
  }

  // Resumen
  const exitosos = resultados.filter(r => r.success).length;
  console.log('\n[REPORT] RESUMEN:');
  console.log(`[OK] Exitosos: ${exitosos}/${resultados.length}`);
  console.log(`[FAIL] Fallidos: ${resultados.length - exitosos}/${resultados.length}`);

  await browser.close();
  process.exit(exitosos === resultados.length ? 0 : 1);
}

main().catch(console.error);

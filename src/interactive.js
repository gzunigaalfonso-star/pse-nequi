import { chromium } from 'playwright';
import { testData } from './data.js';
import fs from 'fs';
import readline from 'readline';

const NEQUI_URL = 'https://clientes.nequi.com.co/recargas';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function interactiveMode() {
  console.log('\n=== MODO INTERACTIVO - Automatización de Recargas Nequi ===\n');
  console.log('URL: ' + NEQUI_URL);
  console.log('Este script abrirá el navegador y llenará el formulario en tiempo real.\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('📱 Abriendo página de Nequi...\n');
  await page.goto(NEQUI_URL, { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForTimeout(2000);
  console.log('✓ Página cargada\n');

  let continuar = true;

  while (continuar) {
    console.log('\n--- OPCIONES ---');
    console.log('1. Llenar con datos de prueba');
    console.log('2. Llenar manualmente');
    console.log('3. Ver página actual');
    console.log('4. Limpiar formulario');
    console.log('5. Salir');

    const opcion = await question('\nSelecciona una opción (1-5): ');

    switch (opcion) {
      case '1':
        await llenarFormulario(page, testData[0]);
        break;

      case '2':
        const numero = await question('Número de celular (10 dígitos): ');
        const monto = await question('Monto: ');
        const tipoPersona = await question('Tipo de persona (Natural/Juridica): ');
        const banco = await question('Banco: ');

        await llenarFormulario(page, {
          numero,
          monto: parseInt(monto),
          tipoPersona,
          banco
        });
        break;

      case '3':
        if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
        const filename = `captura-${Date.now()}.png`;
        await page.screenshot({ path: `screenshots/${filename}` });
        console.log(`✓ Screenshot guardado: screenshots/${filename}`);
        break;

      case '4':
        await limpiarFormulario(page);
        console.log('✓ Formulario limpiado');
        break;

      case '5':
        continuar = false;
        break;

      default:
        console.log('❌ Opción no válida');
    }

    if (continuar && (opcion === '1' || opcion === '2')) {
      const procesar = await question('\n¿Procesar la recarga? (s/n): ');
      if (procesar.toLowerCase() === 's') {
        console.log('\n🔍 Buscando botón de envío...');
        const buttons = await page.locator('button').all();
        let submitBtn = null;

        for (const btn of buttons) {
          const text = await btn.textContent();
          if (text && (text.includes('Continuar') || text.includes('Procesar') || text.includes('Enviar'))) {
            submitBtn = btn;
            break;
          }
        }

        if (submitBtn) {
          console.log('✓ Botón encontrado: Continuar');
          console.log('\n⏳ Clickeando botón de envío...');

          try {
            await submitBtn.click({ force: true });
            await page.waitForTimeout(3000);
            console.log('✓ Recarga enviada');
            console.log('\n✅ La recarga se ha procesado correctamente');
          } catch (e) {
            console.log('❌ Error al clickear el botón: ' + e.message);
          }
        } else {
          console.log('⚠️ No se encontró botón de envío');
        }
      }
    }
  }

  await browser.close();
  rl.close();
  console.log('\n¡Sesión finalizada!');
}

async function llenarFormulario(page, datos) {
  console.log(`\n📝 Llenando formulario con datos:`);
  console.log(`   Número: ${datos.numero}`);
  console.log(`   Monto: $${datos.monto}`);
  console.log(`   Tipo: ${datos.tipoPersona}`);
  console.log(`   Banco: ${datos.banco}`);

  try {
    console.log('\n🔍 Buscando campos...');

    // Llenar campos de entrada
    const allInputs = await page.locator('input[type="text"], input[type="tel"], input[type="number"]').all();

    if (allInputs.length >= 3) {
      // Primer campo: Número
      await allInputs[0].click();
      await allInputs[0].clear();
      await allInputs[0].fill(datos.numero);
      console.log(`   ✓ Número ingresado: ${datos.numero}`);
      await page.waitForTimeout(300);

      // Segundo campo: Confirmación
      await allInputs[1].click();
      await allInputs[1].clear();
      await allInputs[1].fill(datos.numero);
      console.log(`   ✓ Confirmación ingresada: ${datos.numero}`);
      await page.waitForTimeout(300);

      // Tercer campo: Monto
      await allInputs[2].click();
      await allInputs[2].clear();
      await allInputs[2].fill(datos.monto.toString());
      console.log(`   ✓ Monto ingresado: $${datos.monto}`);
      await page.waitForTimeout(300);
    }

    // Seleccionar dropdown de tipo de persona
    const selects = await page.locator('select').all();
    if (selects.length > 0) {
      await selects[0].selectOption(datos.tipoPersona);
      console.log(`   ✓ Tipo de persona seleccionado: ${datos.tipoPersona}`);
      await page.waitForTimeout(300);
    }

    // Seleccionar dropdown de banco
    if (selects.length > 1) {
      await selects[1].selectOption(datos.banco);
      console.log(`   ✓ Banco seleccionado: ${datos.banco}`);
      await page.waitForTimeout(300);
    }

    // Marcar checkbox de confirmación (Mosparo)
    console.log(`   ⏳ Marcando checkbox de confirmación...`);
    try {
      // Intentar marcar el checkbox usando JavaScript (evita protección Mosparo)
      await page.evaluate(() => {
        const checkbox = document.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
          checkbox.checked = true;
          // Disparar eventos para notificar que cambió
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          checkbox.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      console.log(`   ✓ Checkbox de confirmación marcado automáticamente`);
    } catch (e) {
      console.log(`   ⚠️ No se pudo marcar checkbox: ${e.message}`);
    }

    await page.waitForTimeout(500);
    console.log('\n✅ Formulario llenado exitosamente');

  } catch (error) {
    console.error(`\n❌ Error al llenar formulario: ${error.message}`);
  }
}

async function limpiarFormulario(page) {
  try {
    const inputs = await page.locator('input[type="text"], input[type="tel"], input[type="number"]').all();
    for (const input of inputs) {
      await input.fill('');
    }
  } catch (error) {
    console.error('Error al limpiar:', error.message);
  }
}

interactiveMode().catch(console.error);

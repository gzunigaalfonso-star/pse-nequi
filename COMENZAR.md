# 🚀 INSTRUCCIONES PASO A PASO - Cómo Comenzar

## ✅ Paso 1: Verificar que tienes Node.js

Abre PowerShell o CMD y verifica:

```powershell
node --version
npm --version
```

**Si ves números (ej: v18.0.0)** ✓ Está instalado
**Si ves "comando no encontrado"** ✗ Descarga e instala desde: https://nodejs.org

---

## ✅ Paso 2: Abrir la Carpeta del Proyecto

1. Abre PowerShell
2. Navega a la carpeta:

```powershell
cd "C:\Users\Usuario\Desktop\pse nequi"
```

3. Verifica que estés en la carpeta correcta:

```powershell
dir
```

Deberías ver archivos como: `index.html`, `package.json`, `src/` etc.

---

## ✅ Paso 3: Ver la Previsualización en HTML (SIN INSTALAR NADA)

### Opción Rápida - Solo HTML:

1. En el Explorador de Archivos, ve a: `C:\Users\Usuario\Desktop\pse nequi`
2. Doble clic en: **`index.html`**
3. Se abre en tu navegador automáticamente ✓

**Aquí puedes:**
- Ver todas las características
- Ver los números de recarga disponibles
- Entender el flujo del sistema
- Abrir `pse-welcome.html` para ver el formulario interactivo

---

## ✅ Paso 4: Instalar Dependencias (PARA AUTOMATIZACIÓN)

Si quieres automatizar el sitio real de Nequi, ejecuta en PowerShell:

```powershell
cd "C:\Users\Usuario\Desktop\pse nequi"
npm install
```

**Esto descargará** las librerías necesarias (Playwright, dotenv, etc.)

⏱️ **Tarda 2-5 minutos** la primera vez

---

## ✅ Paso 5: Instalar Navegador (PARA AUTOMATIZACIÓN)

Después de instalar npm, ejecuta:

```powershell
npx playwright install chromium
```

**Esto descargará** el navegador Chrome que usará Playwright

⏱️ **Tarda 5-10 minutos**

---

## ✅ Paso 6: Ejecutar en Modo Interactivo (RECOMENDADO)

Una vez instalado, ejecuta:

```powershell
npm run interactive
```

**Esto hará:**
1. ✓ Abre el navegador
2. ✓ Carga la página de Nequi
3. ✓ Te muestra un menú

```
--- OPCIONES ---
1. Llenar con datos de prueba
2. Llenar manualmente
3. Ver página actual
4. Limpiar formulario
5. Salir

Selecciona una opción (1-5): 
```

4. **Escribe `1`** y presiona Enter
5. **Verás** cómo el script llena automáticamente el formulario
6. Te pregunta: `¿Procesar la recarga? (s/n):`
7. Escribe `s` y presiona Enter

---

## 🎯 Resumen Rápido

### **SIN Instalar (Solo Ver):**
```
1. Abre C:\Users\Usuario\Desktop\pse nequi\index.html
2. Click en "Abrir Sistema"
3. Interactúa con el formulario
```

### **CON Instalación (Automatizar Real):**
```
1. Abre PowerShell
2. cd "C:\Users\Usuario\Desktop\pse nequi"
3. npm install
4. npx playwright install chromium
5. npm run interactive
6. Selecciona opción 1
7. Verás cómo se llena el formulario real
```

---

## 🐛 Solucionar Problemas

### Error: "node: comando no reconocido"
**Solución:** Instala Node.js desde https://nodejs.org

### Error: "npm no se reconoce"
**Solución:** Reinicia PowerShell o la computadora

### El navegador no abre
**Solución:** Verifica que instalaste Playwright:
```powershell
npx playwright install chromium
```

### "No puedo encontrar la carpeta"
**Solución:** Copia esta ruta en PowerShell:
```powershell
cd "C:\Users\Usuario\Desktop\pse nequi"
```

### "npm install tarda mucho"
**Normal:** La primera vez tarda 2-5 minutos. Espera.

---

## ✨ Qué Verás en Cada Paso

### Paso 1: npm install
```
npm WARN deprecated ...
npm notice ...
added XXX packages in 2m
```

### Paso 2: playwright install
```
Downloading chromium-1234...
Downloading firefox-1234...
Downloading webkit-1234...
```

### Paso 3: npm run interactive
```
=== MODO INTERACTIVO ===
URL: https://clientes.nequi.com.co/recargas
Se abre un navegador...
```

### Paso 4: Selecciona opción 1
```
📝 Llenando formulario con datos:
   Número: 3001234567
   Monto: $5,000
   Tipo: Natural
   Banco: ACCION FIDUCIARIA

🔍 Buscando campos...
   ✓ Número ingresado: 3001234567
   ✓ Monto ingresado: $5,000
   ✓ Tipo de persona seleccionado: Natural
   ✓ Banco seleccionado: ACCION FIDUCIARIA

✅ Formulario llenado exitosamente

¿Procesar la recarga? (s/n): 
```

---

## 📋 Checklist de Inicio

- [ ] Tengo Node.js instalado (`node --version` funciona)
- [ ] Abro PowerShell y navego a la carpeta
- [ ] Ejecuto `npm install` (espero a que termine)
- [ ] Ejecuto `npx playwright install chromium` (espero)
- [ ] Ejecuto `npm run interactive`
- [ ] Selecciono opción `1` en el menú
- [ ] Veo cómo se llena el formulario automáticamente ✓

---

## 🎉 ¡Listo!

Una vez funcione, puedes:

1. **Ver reportes** en: `screenshots/`
2. **Editar datos** en: `src/data.js`
3. **Cambiar números** en: `DATOS_RECARGA.md`
4. **Procesar múltiples** con: `npm start`

---

## 📞 Problemas Específicos

### "npm ERR! code E404"
Solución: Verifica que estás en la carpeta correcta
```powershell
dir package.json
```

### "Playwright no encontró el navegador"
Solución: Ejecuta de nuevo:
```powershell
npx playwright install chromium
```

### "El formulario no se llena"
Solución: Revisa los logs. Ejecuta con debug:
```powershell
npm run debug
```

---

## 💡 Tips Útiles

**Para ver qué está pasando:**
```powershell
npm run debug
```

**Para procesar múltiples automáticamente:**
```powershell
npm start
```

**Para ver los números disponibles:**
Abre: `DATOS_RECARGA.md`

**Para agregar más números:**
Edita: `src/data.js`

---

## ✓ Verificación Final

Antes de empezar, verifica:

```powershell
# Estás en la carpeta correcta
dir index.html

# Node.js funciona
node --version

# npm funciona
npm --version

# El proyecto existe
dir package.json
```

Si todo muestra información ✓ Estás listo.

---

## 🚀 Comenzar Ahora Mismo

```powershell
cd "C:\Users\Usuario\Desktop\pse nequi"
npm install
npx playwright install chromium
npm run interactive
```

Selecciona `1` en el menú y **¡verás la magia!** ✨

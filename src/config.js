import dotenv from 'dotenv';

dotenv.config();

export const config = {
  url: process.env.NEQUI_URL || 'https://clientes.nequi.com.co/recargas',
  headless: process.env.HEADLESS === 'true',
  pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT || '15000'),
  formFillDelay: parseInt(process.env.FORM_FILL_DELAY || '2000'),
  debug: process.env.DEBUG === 'true',
  saveScreenshots: process.env.SAVE_SCREENSHOTS !== 'false',
};

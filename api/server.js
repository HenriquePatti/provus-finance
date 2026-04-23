import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Provus Finance API iniciada com sucesso!');
  console.log('');
  console.log(`   📍 Servidor:   http://localhost:${PORT}`);
  console.log(`   📘 Swagger:    http://localhost:${PORT}/api-docs`);
  console.log(`   ❤️  Health:     http://localhost:${PORT}/api/health`);
  console.log('');
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});
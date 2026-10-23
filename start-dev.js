import { createInterface } from 'readline';
import { spawn } from 'child_process';
import process from 'process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('¿Qué backend deseas usar para desarrollo?');
console.log('1) Backend Real (OnRender)');
console.log('2) Backend Falso / Local (http://localhost:8080)');

rl.question('\nElige una opción (1 o 2): ', (answer) => {
  const isLocal = answer.trim() === '2';
  
  // Asignamos la URL dependiendo de la respuesta
  const apiUrl = isLocal 
    ? 'http://localhost:8080/api/v1' 
    : 'https://backend-proyecto-si6n.onrender.com/api/v1';

  console.log(`\n🚀 Iniciando servidor apuntando a: ${apiUrl}\n`);
  rl.close();

  // Ejecutamos Vite e inyectamos la variable VITE_API_URL
  spawn('npx', ['vite'], {
    stdio: 'inherit',
    shell: true,
    env: { 
      ...process.env, 
      VITE_API_URL: apiUrl 
    }
  });
});
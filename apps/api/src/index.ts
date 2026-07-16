import { Server } from './server';

async function bootstrap() {
  const server = new Server();
  await server.init();
  server.start();
}

bootstrap()
  .then()
  .catch(err => console.error(err));

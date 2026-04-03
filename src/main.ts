import { config as loadEnv } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({
    origin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

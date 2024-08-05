import { NestFactory } from '@nestjs/core';
import * as mongoose from 'mongoose';
import { AppModule } from '../app.module';
import { runRoleSeeder } from './roles.seeder';
import { runUserSeeder } from './users.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    await runRoleSeeder(app);
    await runUserSeeder(app);
    console.log('All seeders executed successfully');
  } catch (error) {
    console.error('Error executing seeders', error);
  } finally {
    await app.close();
    mongoose.disconnect();
  }
}

bootstrap()
  .then(() => console.log('Seeding completed'))
  .catch((error) => {
    console.error('Seeding error', error);
    mongoose.disconnect();
  });

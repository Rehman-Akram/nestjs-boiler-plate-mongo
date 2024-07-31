import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { AppModule } from '../app.module';
import { Permission } from '../permissions/schemas/permission.schema';
import { Role } from '../roles/schemas/role.schema';
import { rolesSeedData } from '../roles/seed-data/role.seed-data';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roleModel = app.get<Model<Role>>(getModelToken(Role.name));
  const permissionModel = app.get<Model<Role>>(getModelToken(Permission.name));
  for (const { permissions, ...rest } of rolesSeedData) {
    const existingRole = await roleModel.findOne({ name: rest.name });
    if (!existingRole) {
      const permissionCreated = await permissionModel.create(permissions);
      const roleToBeCreated = { ...rest, permission: permissionCreated._id };
      const roleCreated = await roleModel.create(roleToBeCreated);
      await permissionModel.updateOne(
        { _id: permissionCreated._id },
        { role: roleCreated._id },
      );
      console.log(`Role ${rest.name} created`);
    } else {
      console.log(`Role ${rest.name} already exists`);
    }
  }

  await app.close();
}

bootstrap()
  .then(() => {
    console.log('Roles Seeding completed');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Roles Seeding error', error);
    mongoose.disconnect();
  });

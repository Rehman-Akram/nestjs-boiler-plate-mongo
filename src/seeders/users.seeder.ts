import { Logger } from '@nestjs/common';
import { NotFoundError } from '../shared/errors';
import { ERRORS } from '../shared/constants/constants';
import mongoose, { Model } from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '../roles/schemas/role.schema';
import { usersData } from '../users/seed-data/user.seed-data';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const roleModel = app.get<Model<Role>>(getModelToken(Role.name));
  // add USERS from users data in users/seeds/seed-data.ts
  for (const userWithRole of usersData) {
    const isExistingUser = await userModel.findOne({
      email: userWithRole.email,
    });
    if (!isExistingUser) {
      const { role, ...rest } = userWithRole;
      // fetch role
      const roleFetched = await roleModel.findOne({ name: role });
      if (!roleFetched) {
        Logger.error(
          `Role with name ${userWithRole.role} not found in users seeder`,
        );
        throw new NotFoundError(ERRORS.RESOURCE_NOT_FOUND);
      }
      const userCreated = await userModel.create({
        ...rest,
        roles: [roleFetched._id],
      });
      // add user in role table
      const updatedUsers = [...roleFetched.users, userCreated._id];
      await roleModel.updateOne(
        {
          _id: roleFetched._id,
        },
        { users: updatedUsers },
      );
      console.log(
        '>>>>>>>>>>>>>>>>USER WITH ROLES CREATED SUCCESSFULLY>>>>>>>>>>>>>>>>>>',
      );
    }
  }
}

bootstrap()
  .then(() => {
    console.log('Users seeded completed');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Users seeding error', error);
    mongoose.disconnect();
  });

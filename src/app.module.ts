import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import configurations from './config/configurations';
import { SharedModule } from './shared/shared.module';
import {
  BadRequestExceptionFilter,
  ConflictExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
} from './shared/exceptions';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { PermissionGuard } from './auth/guards/permission.guard';

const globalFilters = [
  ConflictExceptionFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
].map((filter) => ({
  provide: APP_FILTER,
  useClass: filter,
}));

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/boiler-plate'),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      cache: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    ...globalFilters,
  ],
})
export class AppModule {}

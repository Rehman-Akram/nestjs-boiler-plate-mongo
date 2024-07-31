import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PermissionObject } from '../permission.interface';

const defaultPermissionObject: PermissionObject = {
  create: false,
  read: false,
  update: false,
  delete: false,
};

@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop({
    type: {
      create: { type: Boolean },
      read: { type: Boolean },
      update: { type: Boolean },
      delete: { type: Boolean },
    },
    required: true,
    default: defaultPermissionObject,
  })
  userPermissions: PermissionObject;

  @Prop({
    type: {
      create: { type: Boolean },
      read: { type: Boolean },
      update: { type: Boolean },
      delete: { type: Boolean },
    },
    required: true,
    default: defaultPermissionObject,
  })
  rolePermissions: PermissionObject;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: { type: MongooseSchema.Types.ObjectId, ref: 'Role' } })
  role: MongooseSchema.Types.ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

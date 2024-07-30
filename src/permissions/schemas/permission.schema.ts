import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { PermissionObject } from '../permission.interface';

const defaultPermissionObject: PermissionObject = {
  create: false,
  read: false,
  update: false,
  delete: false,
};

@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop({ required: true, default: uuidv4 })
  id: string;

  @Prop({ required: true, default: defaultPermissionObject })
  userPermissions: string;

  @Prop({ required: true, default: defaultPermissionObject })
  rolePermissions: string;

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

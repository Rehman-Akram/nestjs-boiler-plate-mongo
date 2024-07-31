import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserStatus } from '../enums/status.enum';
import { UserGender } from '../enums/gender.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({
    enum: UserStatus,
    required: true,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Prop({ enum: UserGender })
  gender: UserGender;

  @Prop({ default: false, required: true })
  emailVerified: boolean;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: false, required: true })
  phoneVerified: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }] })
  roles: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

//email small letters (pre-save)
// password hash (pre-save, updateone)

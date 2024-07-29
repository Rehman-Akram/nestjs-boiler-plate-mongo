import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserStatus } from '../enums/status.enum';
import { UserGender } from '../enums/gender.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, default: uuidv4 })
  id: string;

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

  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  avatar: string;

  @Prop({ default: false, required: true })
  phoneVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

//email small letters (pre-save)
// password hash (pre-save, updateone)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, UpdateQuery } from 'mongoose';
import { UserStatus } from '../enums/status.enum';
import { UserGender } from '../enums/gender.enum';
import { Utils } from '../../shared/utils/utils';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
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

  @Prop({ type: [{ type: MongooseSchema.Types.String, ref: 'Role' }] })
  roles: MongooseSchema.Types.String[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next) {
  // Convert email to lowercase
  this.email = this.email.toLowerCase();

  // Hash the password if it has been modified
  if (this.isModified('password')) {
    this.password = Utils.generateHash(this.password);
  }
  next();
});

UserSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate() as UpdateQuery<User>;
  if (update.password) {
    update.password = Utils.generateHash(update.password);
    this.setUpdate(update);
  }
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UpdateQuery<User>;
  if (update.password) {
    update.password = Utils.generateHash(update.password);
    this.setUpdate(update);
  }
  next();
});

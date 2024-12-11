import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserType {
  CLIENT = 'client',
  PHARAMIST = 'pharamcist',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  contactNo: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: UserType, default: UserType.CLIENT })
  userType: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);

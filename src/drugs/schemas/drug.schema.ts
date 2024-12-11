import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Drug extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({
    required: true,
    enum: ['mg', 'ml', 'g', 'tablet', 'capsule'],
    default: 'tablet',
  })
  unit: string;

  @Prop({
    required: true,
    default: true,
  })
  isAvailable: boolean;

  @Prop({
    required: false,
    trim: true,
  })
  description?: string;

  @Prop({
    required: false,
    default: null,
  })
  expirationDate?: Date;
}

export const DrugSchema = SchemaFactory.createForClass(Drug);

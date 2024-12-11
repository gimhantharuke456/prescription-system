import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/user.schema';
import { Drug } from '../../drugs/schemas/drug.schema';

export enum PrescriptionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Schema({ timestamps: true })
export class Prescription extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  client: User;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  assignedPharmacist?: User;

  @Prop({
    type: [
      {
        drug: {
          type: Types.ObjectId,
          ref: 'Drug',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    validate: {
      validator: function (v) {
        return v.length > 0 && v.length <= 10; // Limit to 10 unique drugs
      },
      message: 'A prescription must have at least one and at most 10 drugs',
    },
  })
  drugs: {
    drug: Drug;
    quantity: number;
  }[];

  @Prop({
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 5; // Maximum 5 images
      },
      message: 'A prescription can have at most 5 images',
    },
  })
  images: string[]; // URLs or file paths to images

  @Prop({
    type: String,
    enum: PrescriptionStatus,
    default: PrescriptionStatus.OPEN,
  })
  status: PrescriptionStatus;

  @Prop({ required: false })
  notes?: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);

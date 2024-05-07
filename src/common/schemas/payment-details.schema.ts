import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, HydratedDocument, SchemaTypes } from 'mongoose'

export type PaymentDetailsDocument = HydratedDocument<PaymentDetails>

@Schema({ timestamps: true })
export class PaymentDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  method: string

  @Prop({ required: true })
  providerDetails: string

  @Prop({ required: true })
  billingAddress: string

  @Prop({ default: false })
  isDefault: boolean
}

export const PaymentDetailsSchema = SchemaFactory.createForClass(PaymentDetails)

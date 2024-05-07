import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ShippingDetailsDocument = HydratedDocument<ShippingDetails>

@Schema()
export class ShippingDetails {
  @Prop({ required: true })
  method: string

  @Prop({ required: true })
  cost: number

  @Prop({ required: true })
  estimatedDeliveryTime: string

  @Prop({ type: [String] })
  regionsAvailable: string[]
}

export const ShippingDetailsSchema =
  SchemaFactory.createForClass(ShippingDetails)

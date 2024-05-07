import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Types, HydratedDocument, SchemaTypes } from 'mongoose'

export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId

  @Prop(
    raw({
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    })
  )
  items: Record<string, any>[]

  @Prop({
    required: true,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
  })
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'

  @Prop({ required: true, enum: ['pending', 'paid', 'refunded'] })
  paymentStatus: 'pending' | 'paid' | 'refunded'

  @Prop(
    raw({
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    })
  )
  shippingDetails: Record<string, any>

  @Prop({ required: true })
  totalPrice: number

  @Prop({ required: true })
  paymentMethod: string

  @Prop()
  shippedDate?: Date

  @Prop()
  deliveredDate?: Date

  @Prop()
  cancelledDate?: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)

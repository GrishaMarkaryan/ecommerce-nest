import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, HydratedDocument, SchemaTypes } from 'mongoose'

export type OrderHistoryDocument = HydratedDocument<OrderHistory>

@Schema({ timestamps: true })
export class OrderHistory {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId

  @Prop(
    raw([
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        notes: { type: String, required: false },
      },
    ])
  )
  statusChanges: Array<Record<string, any>>
}

export const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory)

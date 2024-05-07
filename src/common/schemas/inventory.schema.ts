import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, HydratedDocument, SchemaTypes } from 'mongoose'

export type InventoryDocument = HydratedDocument<Inventory>

@Schema({ timestamps: true })
export class Inventory {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: Types.ObjectId

  @Prop({ required: true })
  quantityAvailable: number

  @Prop({ required: true })
  warehouseLocation: string

  @Prop()
  restockDate?: Date
}

export const InventorySchema = SchemaFactory.createForClass(Inventory)

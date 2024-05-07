import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, HydratedDocument, SchemaTypes } from 'mongoose'

export type ReviewDocument = HydratedDocument<Review>

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  reviewerId: Types.ObjectId

  @Prop({ required: true })
  rating: number

  @Prop()
  comment: string
}

export const ReviewSchema = SchemaFactory.createForClass(Review)

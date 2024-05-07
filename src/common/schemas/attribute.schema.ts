import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AttributeDocument = HydratedDocument<Attribute>

@Schema()
export class Attribute {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true })
  label: string

  @Prop({ type: [String], required: true })
  values: string[]

  @Prop({ type: [String], required: true })
  categoryPaths: string[]

  @Prop({ required: true, enum: ['size', 'color', 'description'] })
  type: 'size' | 'color' | 'description'

  @Prop({ required: true, default: false })
  isRequired: boolean
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute)

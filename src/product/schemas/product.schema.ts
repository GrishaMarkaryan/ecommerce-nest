import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

@Schema({ _id: false })
class ProductAttribute {
  @Prop({ type: Types.ObjectId, ref: 'Attribute', required: true })
  attributeId: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  label: string

  @Prop({ required: true })
  value: string
}

const ProductAttributeSchema = SchemaFactory.createForClass(ProductAttribute)

@Schema({ timestamps: true })
class ProductVariant {
  @Prop({ type: [ProductAttributeSchema], default: [] })
  variantAttributes?: ProductAttribute[]

  @Prop({ required: true })
  stockQuantity: number

  @Prop({ required: true })
  price: number

  @Prop()
  salePrice?: number

  @Prop()
  saleStartDate?: Date

  @Prop()
  saleEndDate?: Date

  @Prop({ type: [{ type: String, required: true }] })
  pictures: string[]

  @Prop()
  video?: string

  @Prop({
    required: true,
    enum: [
      'Under Review',
      'Published',
      'Draft',
      'Archived',
      'Out Of Stock',
      'Suspended',
      'Preorder',
      'Backorder',
    ],
  })
  status: string
}

const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant)

@Schema({ _id: false })
class Dimensions {
  @Prop({ required: true })
  weight: number

  @Prop({ required: true })
  length: number

  @Prop({ required: true })
  width: number

  @Prop({ required: true })
  height: number
}

const DimensionsSchema = SchemaFactory.createForClass(Dimensions)

export type ProductDocument = HydratedDocument<Product>

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  brand: string

  @Prop({ required: true, unique: true })
  sku: string

  @Prop()
  upc?: string

  @Prop()
  manufacturer?: string

  @Prop()
  warranty?: string

  @Prop()
  returnPolicy?: string

  @Prop({ type: DimensionsSchema, required: true })
  dimensions: Dimensions

  @Prop({ type: [ProductVariantSchema], required: true })
  variants: Types.DocumentArray<ProductVariant>

  @Prop({ type: [ProductAttributeSchema], default: [] })
  commonAttributes?: Types.DocumentArray<ProductAttribute>

  @Prop({ type: [{ type: String }] })
  seoTags?: string[]

  @Prop({ type: [{ type: String }] })
  tags?: string[]

  @Prop({ type: [{ type: String }] })
  shippingOptions?: string[]

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  relatedProductIds?: Types.ObjectId[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] })
  reviewIds?: Types.ObjectId[]
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.index({ brand: 1 })
ProductSchema.index({ categoryId: 1 })
ProductSchema.index({ tags: 1 })
ProductSchema.index({ name: 'text', description: 'text' })

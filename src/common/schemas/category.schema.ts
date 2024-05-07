import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CategoryDocument = HydratedDocument<Category>

@Schema()
export class Category {
  @Prop({ unique: true, trim: true })
  name: string

  @Prop({ required: true, trim: true })
  label: string

  @Prop({ required: true, unique: true, trim: true })
  labelForSeller: string

  @Prop({ required: true, unique: true, trim: true })
  path: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.index({ path: 1 })

// TODO: move the middleware to the module file - https://docs.nestjs.com/techniques/mongodb#hooks-middleware
CategorySchema.pre('save', function (next) {
  if (!this.isModified('label')) return next()
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .trim()
  }
  let slug = slugify(this.label)
  const randomNum = Math.floor(Math.random() * 10000)
  slug += `-${randomNum}`
  this.name = slug
  next()
})

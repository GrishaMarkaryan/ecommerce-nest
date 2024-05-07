import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ trim: true, lowercase: true, unique: true, sparse: true })
  email?: string

  @Prop({ trim: true, unique: true, sparse: true })
  phoneNumber?: string

  @Prop()
  passwordHash?: string

  @Prop({ trim: true })
  fullName?: string

  @Prop({ trim: true, unique: true, sparse: true })
  googleId?: string

  @Prop({ trim: true, unique: true, sparse: true })
  facebookId?: string

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Product' }])
  wishlistProductIds?: Types.ObjectId[]

  @Prop(
    raw([
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ])
  )
  cartItems: Array<Record<string, any>>

  @Prop({ required: true, enum: ['admin', 'user', 'seller'], default: 'user' })
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.path('email').validate(function (this: UserDocument, value: string) {
  return value || this.phoneNumber
}, 'Either email or phone number must be provided')

UserSchema.path('phoneNumber').validate(function (
  this: UserDocument,
  value: string
) {
  return value || this.email
}, 'Either phone number or email must be provided')

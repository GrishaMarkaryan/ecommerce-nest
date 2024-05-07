import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    return this.userModel.findById(id)
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email })
  }

  async createWithPassword(email: string, password: string, fullName: string) {
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    console.log(password, email, fullName)
    const newUser = new this.userModel({ email, passwordHash, fullName })
    console.log(newUser)
    return await newUser.save()
  }

  async upsertWithPhone(phoneNumber: string) {
    return this.userModel.findOneAndUpdate(
      { phoneNumber },
      { phoneNumber },
      { upsert: true, new: true }
    )
  }

  async upsertWithGoogleInfo(
    fullName: string,
    email: string,
    googleId: string
  ) {
    return this.userModel.findOneAndUpdate(
      { email },
      { fullName, email, googleId },
      { upsert: true, new: true }
    )
  }
}

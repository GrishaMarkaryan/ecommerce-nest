import { UserDocument } from '../../user/schemas/user.schema'

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}

export {}

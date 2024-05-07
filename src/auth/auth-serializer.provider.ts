import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super()
  }
  serializeUser(user: Express.User, done: (err: Error, id?: unknown) => void) {
    done(null, user._id)
  }

  async deserializeUser(
    id: string,
    done: (err: Error, user?: false | Express.User | null | undefined) => void
  ) {
    const user = await this.userService.findById(id)
    done(null, user)
  }
}

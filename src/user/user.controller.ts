import { Controller, Get, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { Request } from 'express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findById(@Req() req: Request) {
    return {
      user: await this.userService.findById(req.user?._id?.toString()),
    }
  }
}

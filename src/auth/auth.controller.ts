import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  Body,
  Redirect,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { GoogleAuthGuard } from './google-auth.guard'
import { SignInWithEmailDto, SignUpWithEmailDto } from './dto/email-auth.dto'
import { SendOtpDto, VerifyOtpDto } from './dto/otp-auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/sign-in')
  async signInWithEmail(
    @Req() req: Request,
    @Body() signInWithEmailDto: SignInWithEmailDto
  ) {
    return await this.authService.signInWithEmail(req, signInWithEmailDto)
  }

  @Post('email/sign-up')
  async signUpWithEmail(
    @Req() req: Request,
    @Body() signUpWithEmailDto: SignUpWithEmailDto
  ) {
    return await this.authService.signUpWithEmail(req, signUpWithEmailDto)
  }

  @Post('sign-out')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.signOut(req, res)
  }

  @Post('otp/send')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await this.authService.sendOtp(sendOtpDto)
  }

  @Post('otp/verify')
  async verifyOtp(@Req() req: Request, @Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(req, verifyOtpDto)
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  startGoogleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Redirect('http://localhost:3000')
  handleGoogleCallback() {}
}

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import * as twilio from 'twilio'
import { Request, Response } from 'express'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'
import { SignInWithEmailDto, SignUpWithEmailDto } from './dto/email-auth.dto'
import { SendOtpDto, VerifyOtpDto } from './dto/otp-auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  private readonly twilioClient = twilio(
    this.configService.get<string>('twilio.accountSid'),
    this.configService.get<string>('twilio.authToken')
  )

  async signInWithEmail(req: Request, signInWithEmailDto: SignInWithEmailDto) {
    const user = await this.verifyUserCredentials(signInWithEmailDto)
    return await this.createSession(req, user)
  }

  async signUpWithEmail(req: Request, signUpWithEmailDto: SignUpWithEmailDto) {
    const user = await this.createUserWithEmail(signUpWithEmailDto)
    // Create a session and store user ID in Redis (serializeUser is called)
    return await this.createSession(req, user)
  }

  async signOut(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      req.logout((error) => {
        // req.logout does not clear the session, but instead it clears the login information from the session
        if (error) {
          reject(error)
        } else {
          // req.session.destroy removes the session from Redis (serializeUser is called)
          req.session.destroy(() => {
            //req.clearCookie clears the cookie
            res.clearCookie('connect.sid')
            resolve({ message: 'Logged out successfully' })
          })
        }
      })
    })
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    await this.sendOtpSms(sendOtpDto.phone)
    console.log('445')
    return {
      message: 'Login successful 123',
    }
  }

  async verifyOtp(req: Request, verifyOtpDto: VerifyOtpDto) {
    await this.verifyOtpSms(verifyOtpDto)
    const user = await this.userService.upsertWithPhone(verifyOtpDto.phone)

    // Create a session and store user ID in Redis (serializeUser is called)
    return await this.createSession(req, user)
  }

  async verifyUserCredentials(signInWithEmailDto: SignInWithEmailDto) {
    const user = await this.userService.findByEmail(signInWithEmailDto.email)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(
      signInWithEmailDto.password,
      user.passwordHash
    )
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return user
  }

  async createUserWithEmail(signUpWithEmailDto: SignUpWithEmailDto) {
    const { password, repeatPassword, email, fullName } = signUpWithEmailDto

    if (password !== repeatPassword) {
      throw new BadRequestException("Passwords don't match")
    }

    const existingUser = await this.userService.findByEmail(email)
    if (existingUser) {
      throw new ConflictException('User already exists')
    }

    return await this.userService.createWithPassword(email, password, fullName)
  }

  async createSession(req: Request, user: Express.User) {
    return new Promise((resolve, reject) => {
      req.login(user, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve({
            message: 'Registration successful 123',
            user,
          })
        }
      })
    })
  }

  async sendOtpSms(phoneNumber: string) {
    await this.twilioClient.verify.v2
      .services(this.configService.get<string>('twilio.serviceSid'))
      .verifications.create({ to: phoneNumber, channel: 'sms' })
  }

  async verifyOtpSms(verifyOtpDto: VerifyOtpDto) {
    const { phone, otp } = verifyOtpDto

    const verification = await this.twilioClient.verify.v2
      .services(this.configService.get<string>('twilio.serviceSid'))
      .verificationChecks.create({ to: phone, code: otp })
    if (!verification.valid) {
      throw new UnauthorizedException('OTP is not valid')
    }
  }
}

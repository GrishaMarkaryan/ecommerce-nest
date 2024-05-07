import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { SendOtpDto, VerifyOtpDto } from '../dto/otp-auth.dto'
import * as bcrypt from 'bcrypt'
import { AuthService } from '../auth.service'
import { UserService } from '../../user/user.service'
import { SignInWithEmailDto, SignUpWithEmailDto } from '../dto/email-auth.dto'

describe('AuthService', () => {
  let service: AuthService
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn().mockImplementation((email) => {
              if (email === 'exist@example.com') {
                return Promise.resolve({
                  _id: 'userId',
                  email: 'exist@example.com',
                  passwordHash: bcrypt.hashSync('password', 10),
                  username: 'existingUser',
                })
              }
              return null
            }),
            createWithPassword: jest.fn().mockResolvedValue({
              _id: 'newUserId',
              email: 'new@example.com',
              username: 'newUser',
            }),
            upsertWithPhone: jest.fn().mockResolvedValue({
              _id: 'userId',
              phone: '+1234567890',
              username: 'phoneUser',
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              switch (key) {
                case 'twilio.accountSid':
                  return 'ACtest_sid'
                case 'twilio.authToken':
                  return 'test_token'
                case 'twilio.serviceSid':
                  return 'test_service_sid'
                default:
                  return null
              }
            }),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('signInWithEmail', () => {
    it('should throw UnauthorizedException if user credentials are invalid', async () => {
      const signInWithEmailDto = new SignInWithEmailDto()
      signInWithEmailDto.email = 'nonexist@example.com'
      signInWithEmailDto.password = 'wrongpassword'
      await expect(
        service.signInWithEmail({} as any, signInWithEmailDto)
      ).rejects.toThrow()
    })

    it('should successfully sign in with valid credentials', async () => {
      const signInWithEmailDto = new SignInWithEmailDto()
      signInWithEmailDto.email = 'exist@example.com'
      signInWithEmailDto.password = 'password'

      const mockReq = {
        login: jest.fn((user, callback) => callback(null)),
      } as any

      const result = await service.signInWithEmail(mockReq, signInWithEmailDto)
      expect(result).toBeDefined()
      expect(mockReq.login).toHaveBeenCalled()
    })
  })

  describe('signUpWithEmail', () => {
    it('should throw BadRequestException if passwords do not match', async () => {
      const signUpWithEmailDto = new SignUpWithEmailDto()
      signUpWithEmailDto.password = 'password'
      signUpWithEmailDto.repeatPassword = 'differentPassword'
      await expect(
        service.signUpWithEmail({} as any, signUpWithEmailDto)
      ).rejects.toThrow()
    })

    it('should successfully sign up with valid credentials', async () => {
      const signUpWithEmailDto = new SignUpWithEmailDto()
      signUpWithEmailDto.email = 'new@example.com'
      signUpWithEmailDto.password = 'password'
      signUpWithEmailDto.repeatPassword = 'password'
      signUpWithEmailDto.fullName = 'New User'

      const mockReq = {
        login: jest.fn((user, callback) => callback(null)),
      } as any

      const result = await service.signUpWithEmail(mockReq, signUpWithEmailDto)
      expect(result).toBeDefined()
      expect(mockReq.login).toHaveBeenCalled()
    })
  })

  describe('verifyOtp', () => {
    it('should throw UnauthorizedException if OTP verification fails', async () => {
      jest.spyOn(service, 'verifyOtpSms').mockImplementation(async () => {
        throw new Error('OTP is not valid')
      })
      await expect(
        service.verifyOtp({} as any, new VerifyOtpDto())
      ).rejects.toThrow()
    })
  })
})

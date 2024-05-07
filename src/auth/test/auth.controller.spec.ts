import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { SignInWithEmailDto, SignUpWithEmailDto } from '../dto/email-auth.dto'
import { SendOtpDto, VerifyOtpDto } from '../dto/otp-auth.dto'
import { Request, Response } from 'express'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signInWithEmail: jest.fn(),
            signUpWithEmail: jest.fn(),
            signOut: jest.fn(),
            sendOtp: jest.fn(),
            verifyOtp: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('signInWithEmail', () => {
    it('should call authService.signInWithEmail with expected params', async () => {
      const reqMock = {} as Request
      const signInWithEmailDto = new SignInWithEmailDto()
      await controller.signInWithEmail(reqMock, signInWithEmailDto)
      expect(authService.signInWithEmail).toHaveBeenCalledWith(
        reqMock,
        signInWithEmailDto
      )
    })
  })

  describe('signUpWithEmail', () => {
    it('should call authService.signUpWithEmail with expected params', async () => {
      const reqMock = {} as Request
      const signUpWithEmailDto = new SignUpWithEmailDto()
      await controller.signUpWithEmail(reqMock, signUpWithEmailDto)
      expect(authService.signUpWithEmail).toHaveBeenCalledWith(
        reqMock,
        signUpWithEmailDto
      )
    })
  })

  describe('signOut', () => {
    it('should call authService.signOut with expected params', async () => {
      const reqMock = {} as Request
      const resMock = {} as Response
      await controller.signOut(reqMock, resMock)
      expect(authService.signOut).toHaveBeenCalledWith(reqMock, resMock)
    })
  })

  describe('sendOtp', () => {
    it('should call authService.sendOtp with expected params', async () => {
      const sendOtpDto = new SendOtpDto()
      await controller.sendOtp(sendOtpDto)
      expect(authService.sendOtp).toHaveBeenCalledWith(sendOtpDto)
    })
  })

  describe('verifyOtp', () => {
    it('should call authService.verifyOtp with expected params', async () => {
      const reqMock = {} as Request
      const verifyOtpDto = new VerifyOtpDto()
      await controller.verifyOtp(reqMock, verifyOtpDto)
      expect(authService.verifyOtp).toHaveBeenCalledWith(reqMock, verifyOtpDto)
    })
  })
})

import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'

export class SendOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string
}

export class VerifyOtpDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  otp: string
}

import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInWithEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class SignUpWithEmailDto {
  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  repeatPassword: string
}

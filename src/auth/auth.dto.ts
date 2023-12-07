import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';
import { LoginRequest, RegisterRequest, ValidateIdRequest, ValidateRequest } from './auth.pb';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(6)
  public readonly password: string;

  @IsString()
  public readonly name: string;
}
export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  public readonly token: string;
}

export class ValidateIdRequestDto implements ValidateIdRequest {
  @IsNumber()
  public readonly userId: number;
}
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateIdRequestDto,
  ValidateRequestDto,
} from './auth.dto';
import {
  AUTH_SERVICE_NAME,
  RegisterResponse,
  LoginResponse,
  ValidateResponse,
  ValidateIdResponse,
} from './auth.pb';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
  public register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.service.register(payload);
  }
  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  public login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.service.login(payload);
  }
  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  public validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
    return this.service.validate(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ValidateId')
  public validateId(payload: ValidateIdRequestDto): Promise<ValidateIdResponse>{
    return this.service.validateId(payload);
  }
}

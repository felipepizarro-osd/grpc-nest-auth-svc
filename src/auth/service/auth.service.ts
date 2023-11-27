import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  ValidateRequestDto,
} from '../auth.dto';
import { Auth } from '../auth.entity';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';

@Injectable()
export class AuthService {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;

  @Inject(JwtService)
  private readonly jwtService: JwtService;
  public async register({
    email,
    password,
    name,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    let auth: Auth = await this.repository.findOne({ where: { email } });
    if (auth) {
      return { status: HttpStatus.CONFLICT, error: ['Email already exists'] };
    }
    auth = new Auth();
    auth.email = email;
    auth.password = this.jwtService.encodePassword(password);
    auth.name = name;
    await this.repository.save(auth);
    return { status: HttpStatus.CREATED, error: [] };
  }
  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const auth: Auth = await this.repository.findOne({ where: { email } });
    if (!auth) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['Email not found'],
        token: null,
      };
    }
    if (!this.jwtService.isPasswordValid(password, auth.password)) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid password'],
        token: null,
      };
    }
    const token: string = this.jwtService.generateToken(auth);
    return { status: HttpStatus.OK, error: [], token };
  }
  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded: any = await this.jwtService.verify(token);
    if (!decoded) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid token'],
        userId: null,
      };
    }
    const auth: Auth = await this.jwtService.validateUser(decoded);
    if (!auth) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid user not found'],
        userId: null,
      };
      return { status: HttpStatus.OK, error: [], userId: decoded.id };
    }
  }
}

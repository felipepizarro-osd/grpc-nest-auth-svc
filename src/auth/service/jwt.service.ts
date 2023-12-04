import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../auth.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  @InjectRepository(Auth)
  private readonly repository: Repository<Auth>;
  private readonly jwt: Jwt;

  constructor(jwt: Jwt) {
    this.jwt = jwt;
  }

  //Decodificando el token de jwt
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }
  public async validateUser(decoded: any): Promise<Auth> {
    return await this.repository.findOne({ where: { id: decoded.id } });
  }  
  public generateToken(auth: Auth): string {
    return this.jwt.sign({ id: auth.id, email: auth.email });
  }
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  public async verify(token: string): Promise<boolean> {
    try {
      await this.jwt.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}

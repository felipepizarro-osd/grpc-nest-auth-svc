import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../service/auth.service';
import { Auth } from '../auth.entity';
import { JwtService } from '../service/jwt.service'
import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto,ValidateIdRequestDto  } from '../auth.dto';
import { RegisterResponse } from '../auth.pb';
//import { GetGamesResponse, GetGameResponse } from '../games.pb';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        JwtModule,
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it ( 'should create a user and return a registerResponse', async () => {
        const auth: Auth = new Auth();
        auth.email = 'test';
        auth.password = 'test';
        auth.name = 'test';

        const payload: RegisterRequestDto = {
            email: auth.email,
            password: auth.password,
            name: auth.name,
        };
        const result: RegisterResponse = {
          status: HttpStatus.CREATED,
          error: [],
      };
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(repository, 'save').mockImplementation(() => Promise.resolve(auth));
      expect(await service.register(payload)).toStrictEqual(result);
    });
  });

  describe('login', () => {
    it('should login user and return a LoginResponse', async () => {
      const auth: Auth = new Auth();
      auth.email = 'test';
      auth.password = 'test';
      auth.name = 'test';
    
      const payload: LoginRequestDto = {
        email: auth.email,
        password: auth.password,
      };
      const result = {
        status: HttpStatus.OK,
        error: [],
        token: 'test',
      };
      jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.resolve(auth));
      jest.spyOn(service, 'login').mockImplementation(() => Promise.resolve(result));
      expect(await service.login(payload)).toStrictEqual(result);
    });
  });

  describe('validate', () => {
    it('should validate user and return a ValidateResponse', async () => {
      const auth: Auth = new Auth();
      auth.email = 'test';
      auth.password = 'test';
      auth.name = 'test';
      const payload: ValidateRequestDto = {
        token: 'test',
      };
      const result = {
        status: HttpStatus.OK,
        error: [],
        userId: expect.any(Number),
      };
      jest.spyOn(service, 'validate').mockImplementation(() => Promise.resolve(result));
      expect(await service.validate(payload)).toStrictEqual(result);
    });
  });

  describe('validateId', () => {
    it('should validate user and return a ValidateIdResponse', async () => {
      const auth: Auth = new Auth();
      auth.email = 'test';
      auth.password = 'test';
      auth.name = 'test';
      const payload: ValidateIdRequestDto = {
        userId: 1,
      };
      const result = {
        status: HttpStatus.OK,
        error: [],
      };
      jest.spyOn(service, 'validateId').mockImplementation(() => Promise.resolve(result));
      expect(await service.validateId(payload)).toStrictEqual(result);
    });
  });
});
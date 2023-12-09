import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../service/auth.service';
import { Auth } from '../auth.entity';
import { JwtService } from '../service/jwt.service'
import { HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto,ValidateIdRequestDto  } from '../auth.dto';
//import { GetGamesResponse, GetGameResponse } from '../games.pb';

describe('AuthController', () => {
  let controller: AuthController;
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
        AuthController,
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a RegisterResponse', async () => {
    const payload: RegisterRequestDto = {
        email: 'test',
        password: 'test',
        name: 'test',
    };
    const response = {
        status: HttpStatus.CREATED,
        error: [],
    };
    jest.spyOn(service, 'register').mockImplementation(async () => response);
    expect(await controller.register(payload)).toBe(response);
  })

  it('should return a LoginResponse', async () => {
    const payload: LoginRequestDto = {
        email: 'test',
        password: 'test',
    };
    const response = {
        status: HttpStatus.OK,
        error: [],
        token: 'test',
    };
    jest.spyOn(service, 'login').mockImplementation(async () => response);
    expect(await controller.login(payload)).toBe(response);
  })

  it('should return a ValidateResponse', async () => {
    const payload: ValidateRequestDto = {
        token: 'test',
    }
    const response = {
        status: HttpStatus.OK,
        error: [],
        userId: expect.any(Number),
    }
    jest.spyOn(service, 'validate').mockImplementation(async () => response);
    expect(await controller.validate(payload)).toBe(response);
  })

  it('should return a ValidateIdResponse', async () => {
    const payload: ValidateIdRequestDto = {
        userId: 1,
    }
    const response = {
        status: HttpStatus.OK,
        error: [],
    }
    jest.spyOn(service, 'validateId').mockImplementation(async () => response);
    expect(await controller.validateId(payload)).toBe(response);
  })
});
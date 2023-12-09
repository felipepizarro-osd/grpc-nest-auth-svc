import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '../service/jwt.service';
import { Auth } from '../auth.entity';
import { JwtModule } from '@nestjs/jwt';

describe('JwtService', () => {
  let service: JwtService;
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
        JwtService,
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    repository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
/*
  describe('decode', () =>{
    it('should return a decoded token', async () => {
      const auth: Auth = new Auth();
      auth.id = 1;
      auth.email = 'test';
      auth.password = 'test';
      auth.name = 'test';
      const token: string = service.generateToken(auth);
      const result: unknown = await service.decode(token);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('name');
    });
  })
  */
});
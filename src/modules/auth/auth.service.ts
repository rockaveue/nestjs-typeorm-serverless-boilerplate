import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { plainToClass } from 'class-transformer';

const ITERATIONS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}
  async register(body: RegisterUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (user) {
      throw new UnprocessableEntityException('User already registered');
    }
    const password = await this.hashPassword(body.password);
    const confirmToken = this.jwtService.sign({ email: body.email });
    const res = await this.userRepository.save({
      ...body,
      password,
      confirmToken,
      name: body.email.split('@')[0],
    });
    return res;
  }

  async login(body: LoginUserDto) {
    const user = await this.findByEmail(body.email);
    const passwordIsValid = this.comparePassword(body.password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Wrong password');
    }
    const payload = {
      email: user.email,
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);

    return { user: plainToClass(Users, user), metadata: { accessToken } };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  public async findByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
  hashPassword(password: string) {
    return bcrypt.hash(password, ITERATIONS);
  }
}

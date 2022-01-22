import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @MaxLength(60)
  password: string;
}

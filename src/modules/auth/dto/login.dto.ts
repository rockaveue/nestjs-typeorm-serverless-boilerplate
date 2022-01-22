import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @MaxLength(60)
  password: string;
}

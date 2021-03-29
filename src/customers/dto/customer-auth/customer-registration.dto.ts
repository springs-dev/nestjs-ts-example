import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CustomerRegistrationDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform(email => email.toLowerCase())
  email: string;

  @ApiProperty()
  @Length(6, 255)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  passwordConfirmation: string;
}

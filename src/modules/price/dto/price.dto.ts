import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNumber, IsPositive, IsEmail, IsEnum, Min } from 'class-validator';
import { Chain } from 'src/common/constants/enums';

export class CreateAlertDto {
  @ApiProperty({
    description: 'Blockchain asset for which the alert is set',
    enum: Chain, // Enum type helps Swagger to generate the dropdown list in the UI
  })
  @IsEnum(Chain)
  chain: Chain;

  @ApiProperty({
    description: 'The target price that triggers the alert',
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  targetPrice: number;

  @ApiProperty({
    description: 'Email address to send the alert to',
    type: String,
  })
  @IsEmail()
  email: string;
}
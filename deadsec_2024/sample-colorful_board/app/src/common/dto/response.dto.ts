import { IsString } from 'class-validator';
import { IsNumber } from 'nestjs-swagger-dto';

export class ResponseDto {
  @IsNumber({ description: 'status code', example: 0 })
  status: number;

  @IsString()
  message: string;
}

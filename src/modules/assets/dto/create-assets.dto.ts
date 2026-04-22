import { IsNumber, IsOptional } from 'class-validator';

export class CreateAssetsDto {
  @IsNumber()
  @IsOptional()
  landValue: number;

  @IsNumber()
  @IsOptional()
  carValue: number;

  @IsNumber()
  @IsOptional()
  goldValue: number;

  @IsNumber()
  @IsOptional()
  otherAssets: number;
}

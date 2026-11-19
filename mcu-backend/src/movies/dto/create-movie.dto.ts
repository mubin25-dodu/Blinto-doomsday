import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNumber()
  @Min(1880, { message: 'Release year must be greater than or equal to 1880' })
  @Max(new Date().getFullYear() + 1, { message: 'Release year must be in the Past' })
  releaseYear: number;

  @IsString()
  @IsNotEmpty()
  runtimeMinutes: number;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  prerequisites?: string[];
}

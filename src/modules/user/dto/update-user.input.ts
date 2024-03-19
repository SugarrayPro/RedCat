import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

@InputType()
export class UpdateUserInput {
  @Field(() => [Role])
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @IsEnum(Role, { each: true })
  roles: Role[];
}

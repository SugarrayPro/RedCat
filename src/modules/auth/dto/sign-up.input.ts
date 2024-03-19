import { InputType, Field } from '@nestjs/graphql';
import { SignInInput } from './sign-in.input';
import { Role } from '../enums/role.enum';

@InputType()
export class SignUpInput extends SignInInput {
  @Field(() => [Role], { nullable: true })
  roles!: Role[];
}

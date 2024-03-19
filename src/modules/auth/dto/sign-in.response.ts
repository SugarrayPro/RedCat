import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class SignInResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => User, { nullable: true })
  user!: User;
}

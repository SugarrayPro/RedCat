import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserResponse {
  @Field()
  success: boolean;
}

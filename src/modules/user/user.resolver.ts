import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UUID } from 'crypto';
import { PaginationArgs } from '../../shared/pagination.arguments';
import { Article } from '../article/entities/article.entity';
import { ArticleService } from '../article/article.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UpdateUserResponse } from './dto/update-user.response';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  @Roles(Role.ADMIN)
  @Query(() => [User])
  async users(@Args() args: PaginationArgs): Promise<User[]> {
    return this.userService.findAll(args);
  }

  @ResolveField(() => [Article])
  async articles(@Parent() user: User, @Args() args: PaginationArgs) {
    return this.articleService.findByUser(user.id, args);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => UpdateUserResponse)
  async updateUser(
    @Args('id') id: UUID,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    await this.userService.update(id, updateUserInput);
    return { success: true }; // yikes
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: UUID) {
    await this.userService.remove(id);
    return true;
  }
}

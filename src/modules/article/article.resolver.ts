import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { ArticleInput } from './dto/article.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UUID } from 'crypto';
import { PaginationArgs } from '../../shared/pagination.arguments';
import { UseGuards } from '@nestjs/common';
import { ArticleGuard } from './guards/article.guard';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Roles(Role.ADMIN, Role.VIEWER, Role.EDITOR)
  @Query(() => [Article], { name: 'allArticles' })
  allArticles(@Args() args: PaginationArgs) {
    return this.articleService.findAll(args);
  }

  @Roles(Role.ADMIN, Role.VIEWER, Role.EDITOR)
  @Query(() => [Article], { name: 'myArticles' })
  myArticles(@Context('req') request, @Args() args: PaginationArgs) {
    return this.articleService.findByUser(request.user.id, args);
  }

  @Roles(Role.EDITOR)
  @Mutation(() => Boolean)
  async createArticle(
    @Args('createArticleInput') createArticleInput: ArticleInput,
    @Context('req') request,
  ) {
    await this.articleService.create(request.user.id, createArticleInput);
    return true;
  }

  @Roles(Role.EDITOR)
  @UseGuards(ArticleGuard) // guards works for id, but role prevents admin to edit
  @Mutation(() => Boolean)
  async updateArticle(
    @Args('id') id: UUID,
    @Args('updateArticleInput') updateArticleInput: ArticleInput,
  ) {
    await this.articleService.update(id, updateArticleInput);
    return true;
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @UseGuards(ArticleGuard)
  @Mutation(() => Boolean)
  async removeArticle(@Args('id') id: UUID) {
    await this.articleService.remove(id);
    return true;
  }
}

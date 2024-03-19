import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ArticleService } from '../article.service';
import { Article } from '../entities/article.entity';
import { Role } from '../../auth/enums/role.enum';

@Injectable()
export class ArticleGuard implements CanActivate {
  constructor(private readonly articleService: ArticleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const { id } = ctx.getArgs();
    const article: Article = await this.articleService.findOneById(id);

    if (!article) {
      return false; // Article not found, access denied
    }
    if (user.role === Role.ADMIN) {
      return true; // Admin can delete any article
    }

    return article.user.id === user.id; // article belongs to user
  }
}

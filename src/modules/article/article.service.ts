import { Injectable } from '@nestjs/common';
import { ArticleInput } from './dto/article.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { UUID } from 'crypto';
import { PaginationArgs } from '../../shared/pagination.arguments';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  findAll(args: PaginationArgs) {
    const { skip, take } = args;
    return this.articleRepository.find({ skip, take, relations: ['user'] });
  }

  findByUser(userId: UUID, args: PaginationArgs) {
    const { skip, take } = args;
    return this.articleRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      skip,
      take,
    });
  }

  findOneById(id: UUID) {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  create(userId: UUID, input: ArticleInput) {
    const user = { id: userId } as User;
    const article = this.articleRepository.create({
      ...input,
      user,
    });

    return this.articleRepository.save(article);
  }

  update(id: UUID, updateUserInput: ArticleInput) {
    return this.articleRepository.update(
      id,
      updateUserInput as Partial<Article>,
    );
  }

  remove(id: UUID) {
    return this.articleRepository.delete(id);
  }
}

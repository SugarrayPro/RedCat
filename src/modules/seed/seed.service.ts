import { Injectable } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
import { faker } from '@faker-js/faker';
import { UserService } from '../user/user.service';
import { ArticleService } from '../article/article.service';
import { SignUpInput } from '../auth/dto/sign-up.input';
import { ArticleInput } from '../article/dto/article.input';
import { ConfigService } from '@nestjs/config';
import { hash } from 'argon2';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
    public config: ConfigService,
  ) {}

  private async fakerUser(): Promise<SignUpInput> {
    const hashedPassword = await hash(faker.internet.password());
    return {
      email: faker.internet.email(),
      password: hashedPassword,
      roles: [Role.EDITOR, Role.VIEWER],
    };
  }

  private fakeArticle(): ArticleInput {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
    };
  }

  async seedUsers() {
    const users = await this.userService.findAll({ skip: 0, take: 1 }); // if we have least one user record, then db is pre-seeded

    if (users.length > 0) return;

    const userRounds = this.config.get<number>('USER_SEED_ROUNDS') || 10;
    const articleRounds = this.config.get<number>('ARTICLE_SEED_ROUNDS') || 10;

    for (let i = 0; i < userRounds; i++) {
      const fakeUserData = await this.fakerUser();
      const newUser = await this.userService.create(fakeUserData);
      for (let j = 0; j < articleRounds; j++) {
        await this.articleService.create(newUser.id, this.fakeArticle());
      }
    }
  }
}

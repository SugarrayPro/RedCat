import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [UserModule, ArticleModule],
  providers: [SeedService],
})
export class SeedModule {}

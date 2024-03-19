import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum';
import { UUID } from 'crypto';
import { Article } from '../../article/entities/article.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: UUID;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Field(() => [Role])
  @Column('enum', { enum: Role, array: true, default: [Role.VIEWER] })
  roles: Role[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}

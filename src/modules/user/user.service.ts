import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpInput } from '../auth/dto/sign-up.input';
import { UUID } from 'crypto';
import { PaginationArgs } from '../../shared/pagination.arguments';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(args: PaginationArgs) {
    const { skip, take } = args;
    return this.usersRepository.find({ skip, take });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  create(user: SignUpInput) {
    return this.usersRepository.save(user);
  }

  update(id: UUID, updateUserInput: UpdateUserInput) {
    if (updateUserInput.roles.length === 0) {
      throw new BadRequestException('Provide least one role');
    }

    return this.usersRepository.update(id, updateUserInput as Partial<User>);
  }

  remove(id: UUID) {
    return this.usersRepository.delete(id);
  }
}

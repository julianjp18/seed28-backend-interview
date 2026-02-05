import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async createDefaultUser(): Promise<User> {
    const existingUser = await this.findByEmail('admin@seed28.com');
    if (existingUser) {
      return existingUser;
    }

    const hashedPassword = await bcrypt.hash('seed28', 10);
    const user = this.usersRepository.create({
      email: 'admin@seed28.com',
      password: hashedPassword,
      name: 'Admin User',
    });

    return this.usersRepository.save(user);
  }
}

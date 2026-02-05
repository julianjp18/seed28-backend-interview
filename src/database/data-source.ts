import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Bull } from '../bulls/entities/bull.entity';
import { User } from '../users/entities/user.entity';
import { Favorite } from '../bulls/entities/favorite.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [Bull, User, Favorite],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
});

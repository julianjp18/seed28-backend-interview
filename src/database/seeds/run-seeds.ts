import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Bull } from '../../bulls/entities/bull.entity';
import { User } from '../../users/entities/user.entity';
import { Favorite } from '../../bulls/entities/favorite.entity';
import { seedBulls } from './bulls.seed';
import { seedUsers } from './users.seed';

config();

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    entities: [Bull, User, Favorite],
    synchronize: true, // Creates/updates tables from entities if they don't exist (dev seeds)
  });

  try {
    await dataSource.initialize();
    console.log('📦 Database connection established');

    await seedUsers(dataSource);
    await seedBulls(dataSource);

    await dataSource.destroy();
    console.log('✅ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeeds();

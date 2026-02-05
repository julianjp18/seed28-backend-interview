import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  console.log('🌱 Seeding users...');

  const defaultUser = await userRepository.findOne({
    where: { email: 'admin@seed28.com' },
  });

  if (!defaultUser) {
    const hashedPassword = await bcrypt.hash('seed28', 10);
    const user = userRepository.create({
      email: 'admin@seed28.com',
      password: hashedPassword,
      name: 'Admin User',
    });

    await userRepository.save(user);
    console.log('✅ Created default user: admin@seed28.com');
  } else {
    console.log('⏭️  Default user already exists');
  }

  console.log('✅ Users seeding completed!');
}

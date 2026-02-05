import { DataSource } from 'typeorm';
import { Bull } from '../../bulls/entities/bull.entity';

const seedData = [
  {
    earTag: '992',
    name: 'Toro Black Emerald',
    useType: 'vaquillona',
    origin: 'propio',
    coat: 'negro',
    breed: 'Angus',
    ageMonths: 36,
    standoutFeature: 'Top 1% calving ease',
    growth: 85,
    calvingEase: 98,
    reproduction: 75,
    moderation: 60,
    carcass: 82,
  },
  {
    earTag: '845',
    name: 'Red Diamond',
    useType: 'vaca',
    origin: 'catalogo',
    coat: 'colorado',
    breed: 'Angus',
    ageMonths: 42,
    standoutFeature: 'Top 5% carcass',
    growth: 90,
    calvingEase: 40,
    reproduction: 88,
    moderation: 70,
    carcass: 95,
  },
  {
    earTag: '102',
    name: 'General 102',
    useType: 'vaquillona',
    origin: 'catalogo',
    coat: 'negro',
    breed: 'Brangus',
    ageMonths: 30,
    standoutFeature: null,
    growth: 70,
    calvingEase: 92,
    reproduction: 65,
    moderation: 80,
    carcass: 60,
  },
  {
    earTag: '554',
    name: 'Indomable',
    useType: 'vaca',
    origin: 'propio',
    coat: 'colorado',
    breed: 'Hereford',
    ageMonths: 48,
    standoutFeature: null,
    growth: 60,
    calvingEase: 30,
    reproduction: 95,
    moderation: 50,
    carcass: 75,
  },
  {
    earTag: '210',
    name: 'Midnight Express',
    useType: 'vaquillona',
    origin: 'propio',
    coat: 'negro',
    breed: 'Angus',
    ageMonths: 28,
    standoutFeature: 'Efficiency Leader',
    growth: 78,
    calvingEase: 95,
    reproduction: 82,
    moderation: 85,
    carcass: 68,
  },
  {
    earTag: '773',
    name: 'Rustic King',
    useType: 'vaca',
    origin: 'catalogo',
    coat: 'colorado',
    breed: 'Braford',
    ageMonths: 54,
    standoutFeature: 'Heat Tolerant',
    growth: 92,
    calvingEase: 35,
    reproduction: 90,
    moderation: 45,
    carcass: 88,
  },
  {
    earTag: '304',
    name: 'Shadow Warrior',
    useType: 'vaquillona',
    origin: 'propio',
    coat: 'negro',
    breed: 'Brangus',
    ageMonths: 32,
    standoutFeature: 'Performance Pro',
    growth: 88,
    calvingEase: 85,
    reproduction: 70,
    moderation: 65,
    carcass: 91,
  },
];

export async function seedBulls(dataSource: DataSource): Promise<void> {
  const bullRepository = dataSource.getRepository(Bull);

  console.log('🌱 Seeding bulls...');

  for (const bullData of seedData) {
    const existingBull = await bullRepository.findOne({
      where: { earTag: bullData.earTag },
    });

    if (!existingBull) {
      const bull = bullRepository.create(bullData);
      await bullRepository.save(bull);
      console.log(`✅ Created bull: ${bullData.name}`);
    } else {
      console.log(`⏭️  Bull already exists: ${bullData.name}`);
    }
  }

  console.log('✅ Bulls seeding completed!');
}

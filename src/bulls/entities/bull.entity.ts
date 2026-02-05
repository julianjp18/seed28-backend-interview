import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Favorite } from './favorite.entity';

@Entity('bulls')
@Index(['earTag'])
@Index(['origin'])
@Index(['coat'])
@Index(['useType'])
export class Bull {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ear_tag', unique: true })
  earTag: string;

  @Column()
  name: string;

  @Column({ name: 'use_type', type: 'enum', enum: ['vaquillona', 'vaca'] })
  useType: string;

  @Column({ type: 'enum', enum: ['propio', 'catalogo'] })
  origin: string;

  @Column({ type: 'enum', enum: ['negro', 'colorado'] })
  coat: string;

  @Column()
  breed: string;

  @Column({ name: 'age_months' })
  ageMonths: number;

  @Column({ name: 'standout_feature', nullable: true, type: 'text' })
  standoutFeature: string | null;

  // Stats
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  growth: number;

  @Column({ name: 'calving_ease', type: 'decimal', precision: 5, scale: 2 })
  calvingEase: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  reproduction: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  moderation: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  carcass: number;

  @OneToMany(() => Favorite, (favorite) => favorite.bull)
  favorites: Favorite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Column,
  Index,
} from 'typeorm';
import { Bull } from './bull.entity';
import { User } from '../../users/entities/user.entity';

@Entity('favorites')
@Unique(['userId', 'bullId'])
@Index(['userId'])
@Index(['bullId'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'bull_id' })
  bullId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Bull)
  @JoinColumn({ name: 'bull_id' })
  bull: Bull;

  @CreateDateColumn()
  createdAt: Date;
}

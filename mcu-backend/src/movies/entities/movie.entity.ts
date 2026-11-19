import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MoviePrerequisite } from './movie-prerequisite.entity.js';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  title: string;

  @Column({ name: 'release_year', type: 'int' })
  releaseYear: number;

  @Column({ name: 'runtime_minutes', type: 'int' })
  runtimeMinutes: number;

  @Column({ type: 'boolean', default: false })
  watched: boolean;

  @OneToMany(() => MoviePrerequisite, (link) => link.movie)
  prerequisiteLinks: MoviePrerequisite[];

  @OneToMany(() => MoviePrerequisite, (link) => link.prerequisite)
  dependentLinks: MoviePrerequisite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
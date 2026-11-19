import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Movie } from './movie.entity.js';

@Entity('movie_prerequisites')
export class MoviePrerequisite {
  @PrimaryColumn('uuid', { name: 'movie_id' })
  movieId: string;

  @PrimaryColumn('uuid', { name: 'prerequisite_id' })
  prerequisiteId: string;

  @ManyToOne(() => Movie, (movie) => movie.prerequisiteLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id', referencedColumnName: 'id' })
  movie: Relation<Movie>;

  @ManyToOne(() => Movie, (movie) => movie.dependentLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prerequisite_id', referencedColumnName: 'id' })
  prerequisite: Relation<Movie>;
}

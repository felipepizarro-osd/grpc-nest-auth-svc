import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  public password: string;

  @Column({ type: 'varchar' })
  public name: string;
}

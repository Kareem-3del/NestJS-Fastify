import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { compare, hash } from '../../../utils/helpers';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  protected password: string;

  @ApiProperty()
  @CreateDateColumn()
  public createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  public updatedAt?: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  public refresh_token?: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }

  /**
   * @description Compare password with hashed password
   * @param password
   */
  public async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}

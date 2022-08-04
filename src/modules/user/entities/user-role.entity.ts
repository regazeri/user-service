import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role, User } from './';

/**
 * @description create Many to Many Relation between  Role and User tables
 */
@Entity()
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.userRoles)
  user: User;

  @ManyToOne(() => Role, role => role.userRoles)
  role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  @IsEmpty()
  @ApiProperty()
  createdAt?: Date;
}

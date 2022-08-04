import { IsEmpty } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Permission, Role } from './';

/**
 * @description create Many to Many Relation between  Role and Permission tables
 */
@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, role => role.rolePermissions)
  role: Role;

  @ManyToOne(() => Permission, permission => permission.rolePermissions)
  permissions: Permission;

  @CreateDateColumn({ type: 'timestamp' })
  @IsEmpty()
  createdAt?: Date;
}

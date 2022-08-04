import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermission, UserRole } from './';

/**
 * @description stor all defined Roles
 */
@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id?: string;

  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles?: UserRole[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  rolePermissions: RolePermission[];

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @ApiProperty()
  name: string;
}

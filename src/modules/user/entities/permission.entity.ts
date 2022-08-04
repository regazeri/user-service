import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermission } from './';
/**
 * @description store all user permission , services send their permission via rabbitMQ to stor
 */
@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id?: string;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.permissions)
  rolePermissions?: RolePermission[];

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  @ApiProperty()
  description: string;
}

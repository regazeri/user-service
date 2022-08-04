import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsLowercase,
  IsMobilePhone,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CalendarTypeEnum, GenderEnum, SituationEnum } from '../enums';
import { IAddress } from '../interfaces';
import { UserRole } from './';

/**
 * @description when user's Email is verified then we can insert user Email,situation and id in database
 * after complete Registration ,user send your profile data to user service
 * @remarks obligatory fields
 * @param {id:string}
 * @param {situation:enum}
 * @param {Email:string}
 *
 */

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @IsUUID()
  id?: string;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles?: UserRole[];

  @Column({
    type: 'enum',
    enum: SituationEnum,
    default: SituationEnum.ACTIVE,
  })
  @IsEnum(SituationEnum)
  situation?: SituationEnum;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  @Index({ unique: true })
  @IsOptional()
  @IsString()
  @IsLowercase()
  @Length(3, 50)
  username?: string;

  @Column({ type: 'varchar', length: 150, select: false, nullable: true })
  @IsOptional()
  @IsString()
  @Length(64, 100)
  password?: string;

  @Column({ type: 'varchar', unique: true })
  @Index({ unique: true })
  @IsEmail()
  @IsString()
  @IsLowercase()
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  firstname?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  lastname?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  nickname?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsMobilePhone()
  @IsOptional()
  mobileNumber?: string;

  /**
   * If true, the user can login in admin panel
   */
  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isStaff?: boolean;

  @Column('boolean', { default: false })
  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index()
  @IsOptional()
  @Length(10, 100)
  @Matches(/apikey-\d+-\d+-[a-z0-9]+/)
  webServiceKey?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  avatar?: string;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 800)
  about?: string;

  @Column({
    type: 'enum',
    enum: CalendarTypeEnum,
    default: CalendarTypeEnum.JALALI,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(CalendarTypeEnum)
  calendarType?: CalendarTypeEnum;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  language?: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsObject({})
  address?: IAddress;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @IsUrl()
  website?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  lastPasswordUpdate?: Date;

  /**
   * Description by admin
   */
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  expireTime?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  @IsEmpty()
  @IsDate()
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @IsEmpty()
  @IsDate()
  updatedAt?: Date;

  @DeleteDateColumn()
  @IsEmpty()
  deletedAt?: Date;

  @Column({ type: 'varchar', length: 70, nullable: true })
  @IsOptional()
  @IsString()
  resetPassword?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @IsEmpty()
  @IsDate()
  resetPasswordExpired?: Date;
}

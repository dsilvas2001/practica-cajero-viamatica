import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { BaseTable } from "../../common/base.entity";
import { Cash } from "./cash.entity";
import { UserStatus } from "./userstatus.entity";
import { Rol } from "./rol.entity";

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn("uuid")
  userid: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @Column({ type: "boolean", default: false })
  userApproval: boolean;

  @Column({ type: "timestamptz", default: null })
  dateApproval: string | null;

  @ManyToOne(() => Rol, (rol) => rol.users)
  rol: Rol;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users)
  userStatus: UserStatus;

  @ManyToMany(() => Cash, (cash) => cash.users)
  cashes: Cash[]; // Relación inversa
}

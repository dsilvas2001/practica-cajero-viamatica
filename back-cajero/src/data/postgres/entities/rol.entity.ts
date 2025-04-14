import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Rol {
  @PrimaryGeneratedColumn("uuid")
  rolid: string;

  @Column({ length: 50 })
  rolName: string;

  @OneToMany(() => User, (user) => user.userStatus)
  users: User[];
}

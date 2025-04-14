import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Turn } from "./turn.entity";
import { User } from "./user.entity";

@Entity()
export class Cash {
  @PrimaryGeneratedColumn("uuid")
  cashid: string;

  @Column({ length: 50 })
  cashdescription: string;

  @Column({ default: true })
  active: boolean;
  @ManyToMany(() => User, (user) => user.cashes)
  @JoinTable() // Tabla de rompimiento automática
  users: User[]; // Relación ManyToMany

  /**
   * -
   */
  @OneToMany(() => Turn, (turn) => turn.cash)
  turns: Turn[];
}

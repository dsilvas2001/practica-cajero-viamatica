import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Client } from "./client.entity";

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  paymentdate: Date;

  /**
   *
   */
  @ManyToOne(() => Client, (client) => client.payments)
  client: Client;
}

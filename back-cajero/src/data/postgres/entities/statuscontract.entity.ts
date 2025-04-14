import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Contract } from "./contract.entity";

@Entity()
export class StatusContract {
  @PrimaryColumn({ type: "varchar", length: 3 })
  statusid: string;

  @Column({ length: 50 })
  description: string;

  /**
   *
   */

  @OneToMany(() => Contract, (contract) => contract.contractStatus)
  contracts: Contract[];
}

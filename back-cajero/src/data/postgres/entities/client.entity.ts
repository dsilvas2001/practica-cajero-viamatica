import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseTable } from "../../common/base.entity";
import { Contract } from "./contract.entity";
import { Payments } from "./payments.entity";
import { Attention } from "./attention.entity";

@Entity()
export class Client extends BaseTable {
  @PrimaryGeneratedColumn("uuid")
  clientid: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ length: 13, unique: true })
  identification: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column({ length: 13 })
  phonenumber: string;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 100 })
  referenceaddress: string;

  /**
   *
   */
  @OneToMany(() => Contract, (contract) => contract.client)
  contracts: Contract[];

  /**
   *
   */
  @OneToMany(() => Payments, (payments) => payments.client)
  payments: Payments[];
  /**
   *
   */

  @OneToMany(() => Attention, (attention) => attention.client)
  attentions: Attention[];
}

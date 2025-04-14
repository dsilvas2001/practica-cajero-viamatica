import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { BaseTable } from "../../common/base.entity";
import { Cash } from "./cash.entity";
import { Attention } from "./attention.entity";

@Entity()
export class Turn extends BaseTable {
  @PrimaryGeneratedColumn("uuid")
  turnid: string;

  @Column({ length: 7 })
  description: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @ManyToOne(() => Cash, (cash) => cash.turns)
  cash: Cash;

  @Column()
  userGestorId: string;

  @OneToMany(() => Attention, (attention) => attention.turn)
  attentions: Attention[];
}

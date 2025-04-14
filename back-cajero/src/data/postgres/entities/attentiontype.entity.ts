import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attention } from "./attention.entity";

@Entity()
export class AttentionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  description: string;

  /**
   *
   */
  @OneToMany(() => Attention, (attention) => attention.attentionType)
  attentions: Attention[];
}

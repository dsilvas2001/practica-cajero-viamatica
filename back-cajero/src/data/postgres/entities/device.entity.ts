import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Service } from "./service.entity";

@Entity()
export class Device {
  @PrimaryGeneratedColumn("uuid")
  deviceid: string;

  @Column({ length: 50 })
  devicename: string;

  /**
   *
   */
  @ManyToOne(() => Service, (service) => service.devices)
  service: Service;
}

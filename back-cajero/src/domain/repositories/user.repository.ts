import { UserDto } from "../dtos/user.dto";
import { UserModel } from "../models/user.model";

export abstract class UserRepository {
  abstract register(
    currentUserId: string,
    registerUserDto: UserDto
  ): Promise<UserModel>;

  abstract bulkRegister(
    currentUserId: string,
    usersData: UserDto[]
  ): Promise<UserModel[]>;

  abstract update(
    userId: string,
    userUpdateDto: UserDto,
    currentUserId: string
  ): Promise<UserModel>;

  abstract validator(userId: string, currentUserId: string): Promise<UserModel>;

  abstract findAll(): Promise<UserModel[]>;
  abstract delete(currentUserId: string, userId: string): Promise<void>;

  abstract findByCredentials(
    email: string,
    password: string
  ): Promise<UserModel>;

  abstract getUserStatistics(userId: string, rolName: string): Promise<any>;
}

import {
  UserDatasource,
  UserDto,
  UserModel,
  UserRepository,
} from "../../domain";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDatasource: UserDatasource) {}

  async register(
    currentUserId: string,
    createUserDto: UserDto
  ): Promise<UserModel> {
    return this.userDatasource.register(currentUserId, createUserDto);
  }
  async bulkRegister(
    currentUserId: string,
    usersData: UserDto[]
  ): Promise<UserModel[]> {
    return this.userDatasource.bulkRegister(currentUserId, usersData);
  }

  async update(
    userId: string,
    userUpdateDto: UserDto,
    currentUserId: string
  ): Promise<UserModel> {
    return this.userDatasource.update(userId, userUpdateDto, currentUserId);
  }

  async validator(userId: string, currentUser: string): Promise<UserModel> {
    return this.userDatasource.validator(userId, currentUser);
  }

  async findAll(): Promise<UserModel[]> {
    return this.userDatasource.findAll();
  }

  async delete(currentUserId: string, userId: string): Promise<void> {
    return this.userDatasource.delete(currentUserId, userId);
  }

  async findByCredentials(email: string, password: string): Promise<UserModel> {
    return await this.userDatasource.findByCredentials(email, password);
  }

  async getUserStatistics(userId: string, rolName: string): Promise<any> {
    return this.userDatasource.getUserStatistics(userId, rolName);
  }
}

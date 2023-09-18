import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, EntityNotFoundError } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async getById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async getUser(query: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { email: query },
      });
    } catch (e) {
      throw new NotFoundException(`User with email ${query} not found`);
    }
  }

  /**
   * @description Create user
   * @param {CreateUserDto} createUserDto
   * @return {Promise<User>}
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (e) {
      if (e.code === '23505')
        throw new BadRequestException('User with this email already exists');
      throw new UnprocessableEntityException(e.message);
    }
  }

  /**
   * @description Update user by id
   * @param {number} id
   * @param updates
   * @return {Promise<User>}
   */
  async update(id: number, updates: Partial<User>): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id } });
      const updateResult = await this.userRepository.update({ id }, updates);
      if (updateResult.affected) {
        return { ...user, ...updates, password: undefined } as unknown as User;
      } else {
        throw new EntityNotFoundError(User, id);
      }
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
    }
  }

  /**
   * @description Find all users
   * @return {Promise<User[]>}
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * @description Find one user by id or fail
   * @param id
   */
  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw e;
    }
  }

  /**
   * @description Remove user by id
   * @param {number} id
   * @return {Promise<User>}
   * @throws {EntityNotFoundError}
   */
  async remove(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneByOrFail({ id });
      return await this.userRepository.remove(user);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
    }
  }

  /**
   * @description Find one user by email
   * @param email
   * @return {User}
   * @throws {NotFoundException}
   */
  async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { email } });
    } catch (err) {
      throw new NotFoundException('User could not found by given email');
    }
  }

  /**
   * @description
   * @param {CreateUserDto} dto
   * @return {User}
   * @throws {UnprocessableEntityException}
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const newUser: User = this.userRepository.create({
      email: dto.email,
      password: dto.password,
    });
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new UnprocessableEntityException(error.errmsg);
    }
  }
}

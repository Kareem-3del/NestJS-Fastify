import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError, UpdateResult } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'example@gmail.com',
        password: 'password',
      };
      const user = new User();
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await usersService.create(createUserDto);

      expect(result).toBe(user);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        // Provide necessary data for updating a user
      };
      const user = new User();
      const updateResult: UpdateResult = {
        affected: 1, // Assuming the update affected one row
        raw: {},
        generatedMaps: [],
      };
      jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValue(user);
      jest.spyOn(userRepository, 'update').mockResolvedValue(updateResult);

      const result = await usersService.update(id, updateUserDto);
      expect(result).toBeDefined();
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw EntityNotFoundError if user is not found', async () => {
      const id = 99999999;
      const updateUserDto: UpdateUserDto = {
        // Provide necessary data for updating a user
      };
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValue(new EntityNotFoundError(User, id));

      await expect(usersService.update(id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        // Provide sample users for testing
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await usersService.findAll();

      expect(result).toEqual(users);
    });
  });

  it('should throw EntityNotFoundError if user is not found', async () => {
    const id = 1;
    jest
      .spyOn(userRepository, 'findOneOrFail')
      .mockRejectedValue(new EntityNotFoundError(User, id));

    await expect(usersService.findOne(id)).rejects.toThrow(NotFoundException);
  });
});

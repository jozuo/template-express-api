import { User } from '@/entities/user'
import { UserNotFoundError } from '@/errors/http/user-not-found'
import UserRepository from '@/repositories/user-repository'
import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
} from 'routing-controllers'

@JsonController('/users')
export default class UserControllers {
  private readonly repository: UserRepository

  constructor() {
    this.repository = new UserRepository()
  }

  @Get('/')
  public async getAll(): Promise<User[]> {
    return this.repository.find()
  }

  @Get('/:id')
  @OnUndefined(UserNotFoundError)
  public async get(@Param('id') id: number): Promise<User | undefined> {
    return this.repository.findOne(id)
  }

  @HttpCode(201)
  @Post('/')
  public async post(@Body() user: User): Promise<User> {
    user.id = undefined
    return this.repository.save(user)
  }

  @Put('/:id')
  @OnUndefined(UserNotFoundError)
  public async put(@Param('id') id: number, @Body() user: User): Promise<User | undefined> {
    if (!(await this.repository.findOne(id))) {
      throw new UserNotFoundError()
    }
    user.id = id
    return this.repository.save(user)
  }

  @Delete('/:id')
  public async delete(@Param('id') id: number): Promise<{}> {
    if (!(await this.repository.findOne(id))) {
      throw new UserNotFoundError()
    }
    await this.repository.delete(id)
    return {}
  }
}

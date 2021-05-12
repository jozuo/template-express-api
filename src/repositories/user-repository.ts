import User from '@/entities/user'
import { getRepository, Repository } from 'typeorm'

/**
 * TypeOrmのRepositoryを単純にラップする層。カバレッジ計測には含めない。
 * 冗長だが、呼び出し元のテストを行う際にモック化しやすくするためにこの層を設ける。
 *
 * TypeOrm#getRepository()を呼び出すとユニットテスト時のようにDB接続を作成していない状態だと
 * エラーになるので、コンストラクタでTypeOrm#getRepository()の呼び出しは行わないこと。
 */
export default class UserRepository {
  public async find(): Promise<User[]> {
    return this.getRepository().find()
  }

  public async findOne(id: number): Promise<User | undefined> {
    return this.getRepository().findOne(id)
  }

  public async save(user: User): Promise<User> {
    return this.getRepository().save(user)
  }

  public async delete(id: number): Promise<void> {
    await this.getRepository().delete(id)
  }

  private getRepository(): Repository<User> {
    return getRepository(User)
  }
}

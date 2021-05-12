import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number | undefined

  @Column({ name: 'name' })
  public name: string = ''

  @Column({ name: 'age' })
  public age: number = 0
}

export default User

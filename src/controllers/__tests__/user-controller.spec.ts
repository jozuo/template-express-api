import app from '@/app'
import UserRepository from '@/repositories/user-repository'
import request from 'supertest'

// class-validatorがよくわからない警告メッセージを出すので抑止のためSpy化する
let logSpy: jest.SpyInstance
beforeEach(() => {
  logSpy = jest.spyOn(console, 'warn')
  logSpy.mockImplementation(log => log)
})
afterEach(() => {
  logSpy.mockRestore()
})

describe('getAll', () => {
  const data = [
    { name: 'hoge', age: 25 },
    { name: 'fuga', age: 28 },
    { name: 'piyo', age: 27 },
  ]

  let findSpy: jest.SpyInstance
  beforeEach(() => {
    findSpy = jest.spyOn(UserRepository.prototype, 'find')
  })
  afterEach(() => {
    findSpy.mockRestore()
  })

  test('データが存在する場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    findSpy.mockImplementation(async () => Promise.resolve(data))
    // -- exercise
    const response = await request(app).get('/users')
    // -- verify
    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      { name: 'hoge', age: 25 },
      { name: 'fuga', age: 28 },
      { name: 'piyo', age: 27 },
    ])
  })
  test('データが存在しない場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    findSpy.mockImplementation(async () => Promise.resolve([]))
    // -- exercise
    const response = await request(app).get('/users')
    // -- verify
    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })
})
describe('get', () => {
  const data = { id: 1, name: 'hoge', age: 25 }

  let findOneSpy: jest.SpyInstance
  beforeEach(() => {
    findOneSpy = jest.spyOn(UserRepository.prototype, 'findOne')
  })
  afterEach(() => {
    findOneSpy.mockRestore()
  })

  test('データが存在する場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    findOneSpy.mockImplementation(async () => Promise.resolve(data))
    // -- exercise
    const response = await request(app).get('/users/0/')
    // -- verify
    expect(response.status).toBe(200)
    expect(response.body).toEqual(data)
    // --- spy
    expect(findOneSpy).toHaveBeenCalledWith(0)
  })
  test('データが存在しない場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    findOneSpy.mockImplementation(async () => Promise.resolve(undefined))
    // -- exercise
    const response = await request(app).get('/users/4/')
    // -- verify
    expect(response.status).toBe(404)
    expect(response.body.name).toBe('HttpError')
    expect(response.body.message).toBe('User not found!')
    // --- spy
    expect(findOneSpy).toHaveBeenCalledWith(4)
  })
})
describe('post', () => {
  const data = { name: 'hoge', age: 25 }

  let saveSpy: jest.SpyInstance
  beforeEach(() => {
    saveSpy = jest.spyOn(UserRepository.prototype, 'save')
  })
  afterEach(() => {
    saveSpy.mockRestore()
  })

  test('正しいレスポンスが返却されること', async () => {
    // -- setup
    saveSpy.mockImplementation(async () => Promise.resolve({ id: 1, ...data }))

    // -- exercise
    const response = await request(app)
      .post('/users')
      .send({ id: 1, ...data })
    // -- verify
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ id: 1, ...data })
    // --- spy
    expect(saveSpy).toHaveBeenCalledWith(data) // リクエストにIDが指定されてもIDが無い状態で呼び出される
  })
})
describe('put', () => {
  const data = { name: 'hoge', age: 25 }

  let findOneSpy: jest.SpyInstance
  let saveSpy: jest.SpyInstance
  beforeEach(() => {
    findOneSpy = jest.spyOn(UserRepository.prototype, 'findOne')
    saveSpy = jest.spyOn(UserRepository.prototype, 'save')
  })
  afterEach(() => {
    findOneSpy.mockRestore()
    saveSpy.mockRestore()
  })

  test('データが存在する場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    const exsitData = { id: 1, name: '--', age: 11 }
    findOneSpy.mockImplementation(async () => Promise.resolve(exsitData))
    saveSpy.mockImplementation(async () => Promise.resolve({ id: 1, ...data }))

    // -- exercise
    const response = await request(app)
      .put('/users/1/')
      .send(data)
    // -- verify
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ id: 1, ...data })
    // --- spy
    expect(findOneSpy).toHaveBeenCalledWith(1)
    expect(saveSpy).toHaveBeenCalledWith({ id: 1, ...data })
  })
  test('データが存在しない場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    findOneSpy.mockImplementation(async () => Promise.resolve(undefined))
    // -- exercise
    const response = await request(app)
      .put('/users/5/')
      .send(data)
    // -- verify
    expect(response.status).toBe(404)
    expect(response.body.name).toBe('HttpError')
    expect(response.body.message).toBe('User not found!')
    // --- spy
    expect(findOneSpy).toHaveBeenCalledWith(5)
    expect(saveSpy).toHaveBeenCalledTimes(0)
  })
})
describe('delete', () => {
  const data = { id: 1, name: 'hoge', age: 25 }

  let findOneSpy: jest.SpyInstance
  let deleteSpy: jest.SpyInstance
  beforeEach(() => {
    findOneSpy = jest.spyOn(UserRepository.prototype, 'findOne')
    deleteSpy = jest.spyOn(UserRepository.prototype, 'delete')
  })
  afterEach(() => {
    findOneSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  test('データが存在する場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    findOneSpy.mockImplementation(async () => Promise.resolve(data))
    deleteSpy.mockImplementation(async () => Promise.resolve())
    // -- exercise
    const response = await request(app).delete('/users/1/')
    // -- verify
    expect(response.status).toBe(200)
    expect(response.body).toEqual({})
    // --- spy
    expect(findOneSpy).toHaveBeenCalledWith(1)
    expect(deleteSpy).toHaveBeenCalledWith(1)
  })
  test('データが存在しない場合、正しいレスポンスが返却されること', async () => {
    // -- setup
    findOneSpy.mockImplementation(async () => Promise.resolve(undefined))
    // -- exercise
    const response = await request(app).delete('/users/5/')
    // -- verify
    expect(response.status).toBe(404)
    expect(response.body.name).toBe('HttpError')
    expect(response.body.message).toBe('User not found!')
    // --- spy
    expect(findOneSpy).toHaveBeenCalledWith(5)
    expect(deleteSpy).toHaveBeenCalledTimes(0)
  })
})

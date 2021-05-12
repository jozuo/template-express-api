import UserController from '@/controllers/user-controler'
import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'

const app = createExpressServer({
  controllers: [UserController],
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

export default app

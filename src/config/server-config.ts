import dotenv from 'dotenv'
import { envTypes } from '../interfaces/types'

dotenv.config()

const ENV:envTypes = {
    PORT: process.env.PORT!,
    MONGO_URI: process.env.MONGO_URI!,
    RABBITMQ_URI: process.env.RABBITMQ_URI!,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
    REDIS_PORT: process.env.REDIS_PORT!
}

export default ENV
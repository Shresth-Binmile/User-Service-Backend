import { Request, Response } from "express";
import { response } from "../common/responses";
import { StatusCodes } from "http-status-codes";
import messages from "../utils/messages";
import userModel from "../models/usersModel";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ENV from "../config/server-config";
import { tokenPayloadType } from "../interfaces/types";
import redisClient from "../redis/connectToLocalRedis";

export async function login(req:Request, res:Response) {
    try {
        // also apply proper validations on user inputs
        const {email, password} = req.body

        // find user using email
        const userInDB = await userModel.findOne({email})
        if(!userInDB){
            return response({res, statusCode: StatusCodes.NOT_FOUND, success: false, message: messages.USER_NOT_FOUND})
        }
        
        // verify user credentials
        const isPasswordMatch = await bcryptjs.compare(password, userInDB.password)
        if(!isPasswordMatch){
            return response({res, statusCode:StatusCodes.CONFLICT, success:false, message:messages.INVALID_CREDENTIALS})
        }
        const userID = userInDB.userID
        // generate token
        const tokenPayload:tokenPayloadType = {
            _id: userID
        }
        const token = jwt.sign(tokenPayload, ENV.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })

        // save the logged in user details in Redis.
        await redisClient.hSet(userID, {
            username: userInDB.username,
            email
        })
        
        await redisClient.expire(userID, 3600)
        const ttl1 = await redisClient.ttl(userID)
        console.log('Time To Live 1:', ttl1)

        response({res, statusCode:StatusCodes.OK, success: true, message: messages.AUTH_SUCCESS, data:{token}})
    } catch (error) {
        response({res, statusCode:StatusCodes.BAD_REQUEST, success: false, message: messages.AUTH_FAILED, error: {error}})
    }
}
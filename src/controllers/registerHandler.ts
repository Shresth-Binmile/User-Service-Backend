import { Request, Response } from "express";
import { response } from "../common/responses";
import { StatusCodes } from "http-status-codes";
import messages from "../utils/messages";
import userModel from "../models/usersModel";
import bcryptjs from 'bcryptjs'
import {v4 as uuidv4} from 'uuid'

export async function register(req:Request, res:Response) {
    try {
        // also apply proper validations on user inputs
        const {username, email, password} = req.body

        // check if user already exists in DB
        // IF yes THEN throw error
        const isUserAlreadyInDB = await userModel.findOne({email})
        if(isUserAlreadyInDB){
            return response({res, statusCode:StatusCodes.CONFLICT, success:false, message:messages.USER_ALREADY_EXISTS})
        }
        // ELSE continue creating a new user in DB
        const salt = await bcryptjs.genSalt()
        const hashedPassword = await bcryptjs.hash(password, salt)

        const userUUID = uuidv4()
        // create & save new user in Database.
        const newUser = new userModel({
            userID: userUUID,
            username,
            email,
            password: hashedPassword
        })
        await newUser.save()

        response({res, statusCode:StatusCodes.CREATED, success: true, message: messages.REGISTER_SUCCESS})
    } catch (error) {
        response({res, statusCode:StatusCodes.INTERNAL_SERVER_ERROR, success: false, message: messages.REGISTER_FAILURE, error: {error}})
    }
}
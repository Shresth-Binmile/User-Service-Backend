import mongoose from "mongoose";
import { userSchemaTypes } from "../interfaces/types";

const userSchema = new mongoose.Schema<userSchemaTypes>({
    userID: {
        type: String || mongoose.SchemaTypes.UUID,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model('Users', userSchema)

export default userModel

/* 

productList = [
    {
        productID: 'pi-01',
        price: 500,
        quantity: 1
    },
    {
        productID: 'pi-02',
        price: 100,
        quantity: 2
    },
    {
        productID: 'pi-02',
        price: 1000,
        quantity: 1
    }
]

*/
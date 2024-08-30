import { Router } from "express";
import { urls } from "../utils/enums";
import { register } from "../controllers/registerHandler";
import { login } from "../controllers/loginHandler";

const router = Router()

router.post(urls.USER_CREATE, register)

router.post(urls.USER_AUTH, login)

export default router
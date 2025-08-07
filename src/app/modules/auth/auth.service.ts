import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { generateToken } from "../../utils/jwt";


const credentialsLogin = async (payload: Partial<IUser>) => {
    const { phone, password } = payload;

    const isUserExist = await User.findOne({ phone })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }
    const jwtPayload = {
        userId: isUserExist._id,
        phone: isUserExist.phone,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }

}

export const AuthServices = {
    credentialsLogin
}
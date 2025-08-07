import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IUser, Role } from "../types/index";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ phone: envVars.SUPER_ADMIN_PHONE })

        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }

        console.log("Trying to create Super Admin...");

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const payload: IUser = {
            name: "Super admin",
            role: Role.SUPER_ADMIN,
            phone: envVars.SUPER_ADMIN_PHONE,
            password: hashedPassword,
            isVerified: true,
        }

        const superadmin = await User.create(payload)
        console.log("Super Admin Created Successfuly! \n");
    } catch (error) {
        console.log(error);
    }
}
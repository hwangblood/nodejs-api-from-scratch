import UserModel from "@/resources/user/user.model";

import token from "@/utils/token";
import { Error } from "mongoose";

class UserService {
    private user = UserModel;

    /**
     * register a new user
     */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await UserModel.create({
                name,
                email,
                password,
                role,
            });

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error) {
            throw new Error("Unable to create user");
        }
    }

    /**
     * login a user
     */
    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await UserModel.findOne({ email });

            if (!user) {
                throw new Error("Unable to find user with that Email Address");
            }

            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error("Wrong password given");
            }
        } catch (error) {
            throw new Error("Unable to login user");
        }
    }
}

export default UserService;

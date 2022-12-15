import { Document } from "mongoose";

interface User extends Document {
    email: string;
    name: string;
    password: string;
    role: string;

    isValidPassword(pasword: string): Promise<Error | boolean>;
}

export default User;

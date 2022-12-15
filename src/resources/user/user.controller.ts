import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validateMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/user/user.validation";
import UserService from "@/resources/user/user.service";
import authenticted from "@/middleware/authenticted.middleware";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initRoutes();
    }
    initRoutes() {
        this.router.post(
            `${this.path}/register`,
            validateMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validateMiddleware(validate.login),
            this.login
        );
        this.router.get(`${this.path}`, authenticted, this.getUser);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const token = await this.userService.register(
                name,
                email,
                password,
                "user"
            );
            res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.toString()));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.toString()));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(400, "No logged in user"));
        }

        return res.status(200).json({ user: req.user });
    };
}

export default UserController;

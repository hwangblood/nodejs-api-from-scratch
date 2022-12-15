import express, { Application } from "express";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import Controller from "@/utils/interfaces/controller.interface";
import errorMiddleware from "@/middleware/error.middleware";

class App {
    public express: Application;
    public port: number;
    public controllers: Controller[];
    public onSuccess: () => void;

    constructor(
        controllers: Controller[],
        port: number,
        onSuccess: () => void
    ) {
        this.express = express();
        this.port = port;
        this.controllers = controllers;
        this.onSuccess = onSuccess;

        this.setup();
    }
    private async setup() {
        await this.initDatabseConnection();
        this.initMiddleware();
        this.initControllers();
        this.initErrorHanding();

        this.onSuccess();
    }
    private initErrorHanding(): void {
        this.express.use(errorMiddleware);
    }
    private initControllers(): void {
        this.controllers.forEach((controller: Controller) => {
            this.express.use("/api", controller.router);
        });
    }
    private initMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan("dev"));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }
    private async initDatabseConnection(): Promise<void> {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        await mongoose
            .connect(
                `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/?retryWrites=true&w=majority`
            )
            .then(function () {
                console.log(`Database connection succeeded.`);
            })
            .catch(function (e) {
                console.log(`Database connection failed. ${e}`);
            });
    }

    public listen() {
        this.express.listen(this.port, () => {
            // console.log(`App running on port ${this.port}`);
        });
    }
}

export default App;

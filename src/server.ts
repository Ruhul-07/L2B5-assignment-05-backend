/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

(async () => {
    let server: Server | null = null;
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("✅ MongoDB connected successfully")

        server = app.listen(envVars.PORT, () => {
            console.log(`🚀 Server running on port ${envVars.PORT}`)
        });

        await seedSuperAdmin();

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error)
        // Exit the process immediately if the database connection fails.
        process.exit(1);
    }

    // Define the shutdown handlers here, where they have access to the 'server' variable.
    const shutdownServer = (signal: string) => {
        console.log(`${signal} signal received... Server shutting down..`);
        if (server) {
            server.close(() => {
                console.log("Server gracefully shut down.");
                process.exit(0); // Exit with a successful status code
            });
        } else {
            // If the server hasn't started yet, just exit.
            process.exit(1);
        }
    };

    process.on("SIGTERM", () => shutdownServer("SIGTERM"));
    process.on("SIGINT", () => shutdownServer("SIGINT"));

    process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection Detected...! Server Shutting Down", err);
        shutdownServer("unhandledRejection");
    });

    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception detected... Server shutting down..", err);
        shutdownServer("uncaughtException");
    });
})();

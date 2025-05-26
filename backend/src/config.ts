import dotenv from "dotenv";
dotenv.config()

interface Config {
    database_url: string,
    port: number
}

export const config: Config = {
    database_url: getEnvVariable("DATABASE_URL"),
    port: getEnvVariable("PORT", 8080)
}

/*
import { drizzle } from "drizzle-orm/node-postgres"
import { users } from "./schema"
const db = drizzle(process.env.DATABASE_URL);
const usersCount = await db.$count(users);
thats from their docs^^^^ So yeahyou dont do this

*/

/**
 * Retrieves an environment variable and casts it to the desired type.
 * 
 * @template T - The type to cast the environment variable value to.
 * @param {string} name - The name of the environment variable.
 * @param {T} [fallback] - Optional fallback value if the variable is not set.
 * @returns {T} - The value of the environment variable, or the fallback if provided.
 * @throws {Error} - If the environment variable is not found and no fallback is provided, exits the process after logging an error.
 */
function getEnvVariable<T>(name: string, fallback?: T): T {
    const value = process.env[name];

    if (!value && fallback) {
        console.warn(`Variable ${name} not found. Falling back to ${fallback}.`);

        return fallback;
    } else if (!value) {
        Error(`Variable ${name} not found.`)
        process.exit(1)
    } else {
        return value as T; 
    }
}
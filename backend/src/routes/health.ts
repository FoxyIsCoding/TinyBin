import { Router, Request, Response } from "express";
import { makeResponse, respond } from "../modules/Response";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        return respond(
            res,
            makeResponse( // This is what we call an STD (standard library) For consistency we always return in *this* format that way no matter what we stay consistent.
                true,
                undefined,
                "Server is healthy! YAY 🐑🥳"
            ),
            200
            // Ensure you're vaccinated before handling these and please see a doctor if you feel any symptoms
        )
    } catch (error: any) { // Please dont go spamming any everywhere :skull: (💀)
        return respond(res, makeResponse(false, undefined, "Internal server error", error), 500)
    };
});

export default { prefix: "/health", router: router };
//--------------------------------------------------------------
// Standardized response system and library
//--------------------------------------------------------------

import { Response } from "express";

interface qResponse {
    success: boolean;
    data: any;
    message: string;
    error?: string; // Make 'error' optional
}

export const makeResponse = (
    success: boolean,
    data: any,
    message: string,
    error?: string
): qResponse => {
    return {
        success,
        data,
        message,
        ...(error && { error })
    };
};

/**
 * 
 * @param res - Response object
 * @param data - Data to send
 * @param statusCode - HTTP status code
 * @returns - void
 */
export const respond = (res: Response, data: qResponse, statusCode: number = 200): void => {
    return void res.status(statusCode).send(JSON.stringify(data));
};
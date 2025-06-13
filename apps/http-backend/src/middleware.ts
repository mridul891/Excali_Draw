import { NextFunction } from "express";
import { JWT_SECRET } from "./config.js";
import jwt from "jsonwebtoken";
export function middleware ( req :Request, res:Response  , next:NextFunction ) {
        const token = req.headers["authorization"] ?? "";


        const decoded = jwt.verify(token, JWT_SECRET)

        if(decoded.userId) {
            // @ts-ignore 
            req.userId = decoded.userId;
            next();
        }else{
            res.status(403).json({
                message : "unauthorized"
            })
        }
}
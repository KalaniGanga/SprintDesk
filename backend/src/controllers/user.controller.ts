import { Request, Response } from "express";
import prisma from "../config/prisma";


export const getCurrentUser = async (
    req: Request,
    res: Response
) => {
    console.log("GGGGGGGGGG")
    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }


        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        return res.status(200).json({
            user
        });


    } catch(error) {

        console.log(error);

        return res.status(500).json({
            message: "Server error"
        });

    }

};
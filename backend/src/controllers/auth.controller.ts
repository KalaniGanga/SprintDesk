import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


export const login = async (
  req: Request,
  res: Response
) => {
  try {

    // 1. Get email and password
    const { email, password } = req.body;


    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });


    // 3. User doesn't exist
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }


    // 4. Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );


    // 5. Password is wrong
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }


    // 6. Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h"
      }
    );


    // 7. Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
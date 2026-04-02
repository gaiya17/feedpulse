import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check against hardcoded credentials in .env
    const isEmailValid = email === process.env.ADMIN_EMAIL;
    const isPasswordValid = password === process.env.ADMIN_PASSWORD;

    if (!isEmailValid || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create the Token (Valid for 1 day)
    const token = jwt.sign(
      { role: 'admin' }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token, 
      message: 'Login successful'
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Server Error during login',
      error: error.message
    });
  }
};
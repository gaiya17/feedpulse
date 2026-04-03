import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server misconfiguration: ADMIN_EMAIL, ADMIN_PASSWORD, or JWT_SECRET missing in environment'
      });
    }

    // Check against hardcoded credentials in .env
    const isEmailValid = email === ADMIN_EMAIL;
    const isPasswordValid = password === ADMIN_PASSWORD;

    if (!isEmailValid || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create the Token (Valid for 1 day)
    const token = jwt.sign(
      { role: 'admin' }, 
      JWT_SECRET, 
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
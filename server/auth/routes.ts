import express from 'express';
import { loginSchema, registerSchema } from './validation';
import { hashPassword, comparePasswords } from './password';
import { generateTokens, setTokenCookies, clearTokenCookies, verifyRefreshToken } from './jwt';
import { storage } from '../storage';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Check if username already exists
    const existingUser = await storage.getUserByUsername(validatedData.username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password);
    const user = await storage.createUser({
      username: validatedData.username,
      password: hashedPassword,
    });

    // Generate tokens
    if (!user) {
      return res.status(500).json({ message: 'Failed to create user' });
    }

    const tokens = generateTokens({
      userId: user.id,
      username: user.username,
    });

    // Set cookies
    setTokenCookies(res, tokens);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username },
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as any).name === 'ZodError'
    ) {
      return res.status(400).json({
        message: 'Validation error',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors: (error as any).errors,
      });
    }
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await storage.getUserByUsername(validatedData.username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await comparePasswords(validatedData.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      username: user.username,
    });

    // Set cookies
    setTokenCookies(res, tokens);

    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username },
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as any).name === 'ZodError'
    ) {
      return res.status(400).json({
        message: 'Validation error',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors: (error as any).errors,
      });
    }
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.post('/logout', (req, res) => {
  clearTokenCookies(res);
  res.json({ message: 'Logged out successfully' });
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Verify user still exists
    const user = await storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      username: user.username,
    });

    // Set new cookies
    setTokenCookies(res, tokens);

    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    clearTokenCookies(res);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export default router;

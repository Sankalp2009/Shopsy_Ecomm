import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

describe('User Routes - Validation Tests', () => {
  describe('POST /api/v1/users/register', () => {
    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('required fields');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ name: 'Test User', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('required fields');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ name: 'Test User', email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('required fields');
    });

    it('should return 400 if all fields are empty', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 400 if name is empty string', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ name: '', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 400 if email is empty string', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ name: 'Test User', email: '', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 400 if password is empty string', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ name: 'Test User', email: 'test@example.com', password: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 400 if name is only whitespace', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ name: '   ', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 400 if trying to register with admin email', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          name: 'Admin User',
          email: process.env.SUPER_ADMIN_EMAIL || 'admin@test.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('reserved');
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('email and password');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('email and password');
    });

    it('should return 400 if both email and password are missing', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should handle empty body gracefully', async () => {
      const response = await request(app)
        .post('/api/v1/users/login');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/users/refreshToken', () => {
    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .post('/api/v1/users/refreshToken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('not logged in');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/users/refreshToken')
        .set('Authorization', 'Bearer invalid-token-here');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 401 with malformed authorization header', async () => {
      const response = await request(app)
        .post('/api/v1/users/refreshToken')
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).toBe(401);
    });

    it('should return 401 with empty Bearer token', async () => {
      const response = await request(app)
        .post('/api/v1/users/refreshToken')
        .set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
    });
  });
});

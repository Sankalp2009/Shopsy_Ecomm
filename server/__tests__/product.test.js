import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

describe('Product Routes - Validation & Auth Tests', () => {
  describe('GET /api/v1/Products', () => {
    it('should be publicly accessible (no auth required)', async () => {
      const response = await request(app).get('/api/v1/Products');

      // May return 500 if DB not connected, but should not return 401
      expect(response.status).not.toBe(401);
    });

    it('should accept query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/Products')
        .query({ page: 1, limit: 10 });

      expect(response.status).not.toBe(401);
    });

    it('should accept search query parameter', async () => {
      const response = await request(app)
        .get('/api/v1/Products')
        .query({ search: 'test' });

      expect(response.status).not.toBe(401);
    });
  });

  describe('GET /api/v1/Products/:id', () => {
    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .get('/api/v1/Products/507f1f77bcf86cd799439011');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should return 401 without Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'some-token');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/Products', () => {
    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .post('/api/v1/Products')
        .send({
          name: 'Test Product',
          description: 'Test description that is long enough',
          price: 99.99,
          category: 'Electronics',
          brand: 'TestBrand',
          stock: 100,
          image: 'https://example.com/image.jpg',
        });

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/Products')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Test Product',
          description: 'Test description that is long enough',
          price: 99.99,
          category: 'Electronics',
          brand: 'TestBrand',
          stock: 100,
          image: 'https://example.com/image.jpg',
        });

      expect(response.status).toBe(401);
    });

    it('should return 401 with empty Bearer token', async () => {
      const response = await request(app)
        .post('/api/v1/Products')
        .set('Authorization', 'Bearer ')
        .send({ name: 'Test' });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/v1/Products/:id', () => {
    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .put('/api/v1/Products/507f1f77bcf86cd799439011')
        .send({ name: 'Updated Product' });

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .put('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'Bearer invalid-token')
        .send({ name: 'Updated Product' });

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/Products/:id', () => {
    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .patch('/api/v1/Products/507f1f77bcf86cd799439011')
        .send({ stock: 200 });

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .patch('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'Bearer invalid-token')
        .send({ stock: 200 });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/Products/:id', () => {
    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .delete('/api/v1/Products/507f1f77bcf86cd799439011');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .delete('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should return 401 with malformed authorization', async () => {
      const response = await request(app)
        .delete('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'NotBearer token');

      expect(response.status).toBe(401);
    });
  });

  describe('Authorization Header Validation', () => {
    it('should reject missing authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/Products/507f1f77bcf86cd799439011');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('NO_AUTH_HEADER');
    });

    it('should reject non-Bearer authorization', async () => {
      const response = await request(app)
        .get('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'Basic credentials');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_AUTH_FORMAT');
    });

    it('should reject empty token after Bearer', async () => {
      const response = await request(app)
        .get('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
      // Middleware may return INVALID_AUTH_FORMAT or EMPTY_TOKEN depending on parsing
      expect(['EMPTY_TOKEN', 'INVALID_AUTH_FORMAT']).toContain(response.body.code);
    });

    it('should reject malformed JWT token', async () => {
      const response = await request(app)
        .get('/api/v1/Products/507f1f77bcf86cd799439011')
        .set('Authorization', 'Bearer not.a.valid.jwt');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_TOKEN');
    });
  });
});

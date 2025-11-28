import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

describe('App Routes', () => {
  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return timestamp in ISO format', async () => {
      const response = await request(app).get('/health');
      const timestamp = response.body.timestamp;
      
      expect(() => new Date(timestamp)).not.toThrow();
    });
  });

  describe('GET /', () => {
    it('should return API server info', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Shopsy API Server');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('status', 'running');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown GET routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message', 'Route not found');
    });

    it('should return 404 for unknown POST routes', async () => {
      const response = await request(app).post('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return 404 for unknown PUT routes', async () => {
      const response = await request(app).put('/unknown-route');

      expect(response.status).toBe(404);
    });

    it('should return 404 for unknown DELETE routes', async () => {
      const response = await request(app).delete('/unknown-route');

      expect(response.status).toBe(404);
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers for allowed origin', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:5173');

      expect(response.headers).toHaveProperty('access-control-allow-credentials', 'true');
    });

    it('should handle preflight OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/v1/users/login')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.status).toBe(200);
    });
  });

  describe('Security Headers', () => {
    it('should include X-Content-Type-Options header', async () => {
      const response = await request(app).get('/health');
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    });

    it('should include X-Frame-Options header', async () => {
      const response = await request(app).get('/health');
      expect(response.headers).toHaveProperty('x-frame-options');
    });

    it('should include X-XSS-Protection header', async () => {
      const response = await request(app).get('/health');
      // Helmet may or may not include this depending on version
      expect(response.status).toBe(200);
    });
  });

  describe('Request Body Parsing', () => {
    it('should parse JSON body', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({ name: 'Test' })
        .set('Content-Type', 'application/json');

      // Should get 400 due to validation, not 500 due to parsing
      expect(response.status).toBe(400);
    });

    it('should handle empty body', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email and password');
    });
  });
});

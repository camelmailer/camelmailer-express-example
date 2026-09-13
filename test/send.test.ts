import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.hoisted(() => vi.fn());

vi.mock('@camelmailer/sdk', () => ({
  CamelMailer: class {
    emails = { send };
  },
}));

const { app } = await import('../src/app.js');

describe('POST /send', () => {
  beforeEach(() => send.mockReset());

  it('sends an email and returns the message id', async () => {
    send.mockResolvedValue({ data: { message_id: 42 }, error: null });

    const res = await request(app)
      .post('/send')
      .send({ to: 'ada@example.com', subject: 'Hi', text: 'Hello!' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message_id: 42 });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'ada@example.com', subject: 'Hi' }));
  });

  it('rejects incomplete payloads without calling the SDK', async () => {
    const res = await request(app).post('/send').send({ subject: 'Hi' });

    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('maps SDK errors to the response', async () => {
    send.mockResolvedValue({
      data: null,
      error: { code: 'ValidationError', message: 'from address not allowed', statusCode: 422 },
    });

    const res = await request(app)
      .post('/send')
      .send({ to: 'ada@example.com', subject: 'Hi', text: 'Hello!' });

    expect(res.status).toBe(422);
    expect(res.body.error).toBe('ValidationError');
  });
});

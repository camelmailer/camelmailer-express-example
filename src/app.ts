import express from 'express';
import { CamelMailer } from '@camelmailer/sdk';

// Reads CAMELMAILER_API_KEY (and optionally CAMELMAILER_BASE_URL for
// self-hosted instances) from the environment.
const camelmailer = new CamelMailer();

export const app = express();
app.use(express.json());

app.post('/send', async (req, res) => {
  const { to, subject, html, text } = req.body ?? {};

  if (!to || !subject || (!html && !text)) {
    res.status(400).json({ error: 'to, subject and html or text are required' });
    return;
  }

  const { data, error } = await camelmailer.emails.send({
    from: process.env.CAMELMAILER_FROM ?? 'you@yourdomain.com',
    to,
    subject,
    html_body: html,
    text_body: text,
  });

  if (error) {
    res.status(error.statusCode ?? 502).json({ error: error.code, message: error.message });
    return;
  }

  res.json({ message_id: data?.message_id });
});

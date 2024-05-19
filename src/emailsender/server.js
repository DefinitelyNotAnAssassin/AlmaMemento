import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jvcasas83@gmail.com',
    pass: 'malunjaofamily'
  }
});

app.post('/send-email', async (req, res) => {
  const { email, code } = req.body;

  const mailOptions = {
    from: 'jvcasas83@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ success: false, error: 'Error sending email' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

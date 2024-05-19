import { functions } from 'firebase-functions';
import { db } from '../firebase/index.js';

const admin = require('firebase-admin');
admin.initializeApp();

exports.sendVerificationEmail = functions.firestore
  .document('verificationEmails/{emailId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    const email = data.email;
    const code = data.code;

    const mailOptions = {
      from: 'jvcasas83@example.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    };

    try {
      await admin
        .firestore()
        .collection('mail')
        .add(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });

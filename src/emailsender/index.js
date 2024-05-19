const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

const sendVerificationEmail = async (email, code) => {
  const msg = {
    to: email,
    from: 'jvcasas83@gmail.com',
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendVerificationEmail };

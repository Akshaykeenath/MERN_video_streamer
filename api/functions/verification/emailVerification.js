const nodemailer = require("nodemailer");
const { generateToken } = require("../encrypt");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.APP_MAIL_ID,
    pass: process.env.APP_PASS_KEY,
  },
});

async function sendEmail(e) {
  const mailOptions = {
    from: e.from,
    to: e.to,
    subject: e.subject,
    html: e.body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const response = {
      status: 200,
      message: `Email sent successfully.`,
      messageId: info.messageId,
    };
    return response;
  } catch (error) {
    const response = {
      status: 500,
      message: "Email not sent.",
    };
    return response;
  }
}

async function generateIdentifierUrl(baseUrl, user, type) {
  const token = await generateToken(user);
  const IdUrl = `${baseUrl}authentication/verify?type=${type}&token=${token}`;
  return IdUrl;
}

async function generatePasswordResetUrl(baseUrl, user, type) {
  const token = generateToken(user);
  const IdUrl = `${baseUrl}authentication/reset-password?type=${type}&token=${token}`;
  return IdUrl;
}

async function sendVerificationMail(user, frontendUrl) {
  const IdUrl = await generateIdentifierUrl(frontendUrl, user, "email");
  const mailOptions = {
    from: process.env.APP_MAIL_ID,
    to: user.email,
    subject: "Email Verification",
    body: `Hi ${user.fname},<br>To verify your mail id please click <a href="${IdUrl}">here</a>`,
  };

  // Continue with sending the email
  const response = await sendEmail(mailOptions);
  return response;
}

async function sendResetPasswordMail(user, frontendUrl) {
  const IdUrl = await generatePasswordResetUrl(frontendUrl, user, "email");
  const mailOptions = {
    from: process.env.APP_MAIL_ID,
    to: user.email,
    subject: "Password Reset",
    body: `Hi ${user.fname},<br>To reset your password please click <a href="${IdUrl}">here</a>`,
  };

  // Continue with sending the email
  const response = await sendEmail(mailOptions);
  return response;
}

module.exports = {
  sendEmail,
  generateIdentifierUrl,
  sendVerificationMail,
  sendResetPasswordMail,
};

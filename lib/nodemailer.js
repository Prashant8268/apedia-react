// lib/nodemailer.js
const { ConnectionStates } = require("mongoose");
const nodemailer = require("nodemailer");
const { parentPort, workerData } = require("worker_threads");

const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
  });

  const mailData = {
    from: {
      name: "Apedia",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: "Password Reset Request",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; text-align: center; font-size: 24px; font-weight: 600; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 20px;">Hi there,</p>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 20px;">We received a request to reset your password. Please click the button below to set a new password.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.HOST_ADD}/reset-password?token=${resetToken}" 
                 style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                 Reset Password
              </a>
            </div>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 20px;">Please do not share this mail with anyone.</p>
            <hr style="border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; font-size: 14px; text-align: center;">Regards,<br>Apedia</p>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailData);
};

(async () => {
  const { email, resetToken } = workerData; // Destructure email and resetToken from workerData

  try {
    await sendResetEmail(email, resetToken); // Call the function to send the email
    parentPort.postMessage({ success: true }); // Notify success
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message }); // Notify error
  }
})();

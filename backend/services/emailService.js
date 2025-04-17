const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

// Initialize MailerSend with your API key
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  // Create sender
  const sender = new Sender(
    process.env.MAILERSEND_FROM_EMAIL || "noreply@inkwell.com", 
    process.env.MAILERSEND_FROM_NAME || "Inkwell Books"
  );
  
  // Create recipient
  const recipients = [
    new Recipient(email, email.split('@')[0])
  ];
  
  // Email HTML content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${process.env.FRONTEND_URL}/images/weblogo.png" alt="Inkwell Bookstore" style="max-width: 150px;">
      </div>
      
      <h2 style="color: #8B4513; margin-bottom: 20px;">Reset Your Password</h2>
      
      <p>Hello,</p>
      
      <p>You recently requested to reset your password for your Inkwell account.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #CD7F32; color: #FFF; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Your Password</a>
      </div>
      
      <p>This link will expire in 1 hour.</p>
      
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      
      <p>Best regards,<br>The Inkwell Team</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EEE; font-size: 12px; color: #777; text-align: center;">
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  `;
  
  // Plain text version
  const textContent = `
    Hello,
    
    You recently requested to reset your password for your Inkwell account.
    
    Please use the following link to reset your password:
    ${resetLink}
    
    This link will expire in 1 hour.
    
    If you did not request a password reset, please ignore this email or contact support if you have concerns.
    
    Best regards,
    The Inkwell Team
  `;
  
  // Create email params
  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(recipients)
    .setSubject("Reset Your Inkwell Password")
    .setHtml(htmlContent)
    .setText(textContent);
  
  try {
    // Send the email
    await mailerSend.email.send(emailParams);
    console.log(`Password reset email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // Log the reset link as fallback
    console.log(`Failed to send email. Reset link for ${email}: ${resetLink}`);
    return false;
  }
};

module.exports = { sendPasswordResetEmail };
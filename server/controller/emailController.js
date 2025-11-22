import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { User, Medication } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration with better error handling
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Motivational messages database
const motivationalMessages = [
  "Remember, taking your medication consistently is a powerful step towards better health. You're doing great! 💊",
  "Your health journey matters! Taking your meds today brings you closer to your wellness goals. 🌟",
  "Every dose you take is an act of self-care. Keep up the amazing work! Your future self thanks you. 💫",
  "Consistency is key! By taking your medication on time, you're building a foundation for long-term health. 🏗️",
  "You're not just taking pills - you're taking control of your health. That's something to be proud of! 💪",
  "Small steps lead to big changes. Remembering your medication is a victory worth celebrating! 🎉",
  "Your commitment to your health is inspiring. Keep going strong with your medication routine! 🌈",
  "Think of your medication as your daily health investment. The returns are priceless! 💰",
  "You've got this! Taking your meds is a simple but powerful way to show yourself love today. ❤️",
  "Every time you take your medication, you're writing a success story for your health. Keep writing! 📖"
];

const healthTips = [
  "Tip: Stay hydrated throughout the day to help your body process medications effectively.",
  "Tip: Combine medication time with a daily routine (like brushing teeth) to build consistency.",
  "Tip: Keep a small water bottle by your medications to make taking them easier.",
  "Tip: Regular light exercise can complement your medication's effectiveness.",
  "Tip: Maintain a balanced diet to support your treatment plan.",
  "Tip: Get adequate rest - sleep helps your body heal and respond better to treatment.",
  "Tip: Don't hesitate to reach out to your healthcare provider with any concerns.",
  "Tip: Track your symptoms daily to monitor your progress effectively.",
  "Tip: Practice deep breathing exercises to manage stress alongside your treatment.",
  "Tip: Celebrate small victories in your health journey - they all matter!"
];

function getRandomMessage() {
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
  return `${randomMessage}\n\n${randomTip}`;
}

export async function sendMedicationReminder(user, medication) {
  try {
    const message = getRandomMessage();
    
    const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: `💊 Medication Reminder: Time for ${medication.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: #f8fafc;
          margin: 0;
          padding: 20px;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
          color: white;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 400;
        }
        
        .content {
          padding: 40px;
        }
        
        .greeting {
          font-size: 18px;
          color: #4b5563;
          margin-bottom: 24px;
          font-weight: 500;
        }
        
        .reminder-text {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 20px;
        }
        
        .medication-card {
          background: linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%);
          border: 1px solid #e0e7ff;
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
          position: relative;
          overflow: hidden;
        }
        
        .medication-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .medication-name {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .medication-name::before {
          content: '💊';
          font-size: 20px;
        }
        
        .medication-detail {
          display: flex;
          align-items: center;
          margin: 8px 0;
          font-size: 15px;
          color: #4b5563;
        }
        
        .medication-detail strong {
          color: #374151;
          min-width: 80px;
          font-weight: 600;
        }
        
        .custom-message {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          font-style: italic;
          color: #92400e;
        }
        
        .footer {
          background: #f8fafc;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.5;
        }
        
        .urgency-badge {
          display: inline-block;
          background: #fee2e2;
          color: #dc2626;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 12px;
        }
        
        @media (max-width: 600px) {
          .content {
            padding: 24px;
          }
          
          .header {
            padding: 24px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .medication-name {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💊 Medication Reminder</h1>
          <p>Time to take your scheduled medication</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${user.name},
          </div>
          
          <p class="reminder-text">
            This is a friendly reminder to take your medication as scheduled:
          </p>
          
          <div class="medication-card">
            <div class="medication-name">
              ${medication.name}
              <span class="urgency-badge">NOW</span>
            </div>
            
            <div class="medication-detail">
              <strong>Dosage:</strong>
              <span>${medication.dosage}</span>
            </div>
            
            <div class="medication-detail">
              <strong>Frequency:</strong>
              <span>${medication.frequency}</span>
            </div>
            
            ${medication.instructions ? `
            <div class="medication-detail">
              <strong>Instructions:</strong>
              <span>${medication.instructions}</span>
            </div>
            ` : ''}
          </div>
          
          ${message ? `
          <div class="custom-message">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          ` : ''}
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
            Please take your medication as prescribed and don't hesitate to contact your healthcare provider if you have any questions.
          </p>
        </div>
        
        <div class="footer">
          <p class="footer-text">
            This is an automated reminder from your Health Management System.<br>
            Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
};

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder sent to ${user.email} for ${medication.name} at ${new Date().toLocaleTimeString()}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

// Test function to manually trigger reminders
export async function testEmailReminders() {
  try {
    console.log('🧪 Testing email reminders...');
    const medications = await Medication.findAll({
      where: { isActive: true },
      include: [User]
    });

    if (medications.length === 0) {
      console.log('ℹ️ No active medications found for testing');
      return;
    }

    console.log(`📧 Found ${medications.length} active medications for testing`);
    
    for (const medication of medications) {
      console.log(`📤 Sending test email for: ${medication.name} to ${medication.User.email}`);
      await sendMedicationReminder(medication.User, medication);
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
  }
}

export function scheduleEmailJobs() {
  console.log('⏰ Starting email scheduler...');
  
  // Schedule every 5 minutes - cron format: "*/3 * * * *"
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      console.log(`🔍 Cron job running at ${currentTime} - Checking for medication reminders...`);
      
      const medications = await Medication.findAll({
        where: { isActive: true },
        include: [User]
      });

      console.log(`📋 Found ${medications.length} active medications in database`);

      if (medications.length === 0) {
        console.log('ℹ️ No active medications found in database');
        return;
      }

      let remindersSent = 0;
      
      for (const medication of medications) {
        try {
          // Parse reminder time
          const [reminderHours, reminderMinutes] = medication.reminderTime.split(':').map(Number);
          
          // Calculate time difference in minutes
          const currentTotalMinutes = currentHours * 60 + currentMinutes;
          const reminderTotalMinutes = reminderHours * 60 + reminderMinutes;
          const timeDifference = Math.abs(currentTotalMinutes - reminderTotalMinutes);
          
          // Send reminder if within 3 minutes of scheduled time
          if (timeDifference <= 3) {
            console.log(`⏰ Time match found: ${medication.reminderTime} for ${medication.name}`);
            const success = await sendMedicationReminder(medication.User, medication);
            if (success) remindersSent++;
          } else {
            console.log(`⏳ Not time yet: ${medication.reminderTime} (current: ${currentTime}, diff: ${timeDifference}min)`);
          }
        } catch (medError) {
          console.error(`❌ Error processing medication ${medication.name}:`, medError);
        }
      }
      
      console.log(`📬 Cron job completed. Sent ${remindersSent} reminders at ${new Date().toLocaleTimeString()}`);
      
    } catch (error) {
      console.error('❌ Error in email scheduling:', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC" // You can change this to your local timezone
  });

  console.log('✅ Email scheduler started - running every 3 minutes');
  
  // Test email system on startup
  setTimeout(() => {
    testEmailReminders();
  }, 5000);
}
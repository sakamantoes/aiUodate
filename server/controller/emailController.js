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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; ">
          <h2 style="color: #2563eb;">Medication Reminder</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h3>Hello ${user.name},</h3>
            <p>It's time to take your medication:</p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <strong>${medication.name}</strong><br/>
              Dosage: ${medication.dosage}<br/>
              Frequency: ${medication.frequency}
            </div>
            <p style="color: #666; font-style: italic;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This is an automated reminder from your Health Management System.
          </p>
        </div>
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
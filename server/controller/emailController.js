// ============================================
// RESEND EMAIL + SCHEDULER (Updated Version)
// ============================================

import { Resend } from 'resend';
import { User, Medication } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Test API Key on startup
(async () => {
  try {
    await resend.domains.list();
    console.log("📧 Resend is connected and ready to send emails.");
  } catch (err) {
    console.log("❌ Resend configuration error:", err);
  }
})();

// ===============================
// Motivational messages + tips
// ===============================

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

// Generate random message
function getRandomMessage() {
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
  return `${randomMessage}\n\n${randomTip}`;
}

// =====================================
// SEND EMAIL USING RESEND
// =====================================

export async function sendMedicationReminder(user, medication) {
  try {
    const message = getRandomMessage();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial; background:#f8fafc; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden;">
    
    <div style="background:#667eea; padding:25px; color:white; text-align:center;">
      <h1 style="margin:0;">💊 Medication Reminder</h1>
      <p>Time to take your scheduled medication</p>
    </div>

    <div style="padding:30px;">
      <p style="font-size:18px;">Hello ${user.name},</p>
      <p>This is a friendly reminder to take your medication:</p>

      <div style="background:#f0f4ff; padding:20px; border-radius:10px; border-left:6px solid #667eea;">
        <h2 style="margin:0 0 10px 0;">${medication.name} <span style="background:#fee2e2; padding:4px 10px; border-radius:12px; color:#b91c1c; font-size:12px;">NOW</span></h2>

        <p><strong>Dosage:</strong> ${medication.dosage}</p>
        <p><strong>Frequency:</strong> ${medication.frequency}</p>

        ${medication.instructions ? `<p><strong>Instructions:</strong> ${medication.instructions}</p>` : ""}
      </div>

      <div style="background:#fff7ed; border:1px solid #fed7aa; padding:15px; margin-top:20px; border-radius:8px; font-style:italic;">
        ${message.replace(/\n/g, "<br>")}
      </div>

      <p style="font-size:14px; color:#6b7280; margin-top:25px;">
        Please take your medication as prescribed.  
      </p>
    </div>

    <div style="background:#f8fafc; padding:20px; text-align:center; font-size:12px; color:#9ca3af;">
      This is an automated reminder from your AI Health Management System.
    </div>

  </div>
</body>
</html>
`;

    await resend.emails.send({
      from: "AI Health System <onboarding@resend.dev>",
      to: user.email,
      subject: `💊 Medication Reminder: Time for ${medication.name}`,
      html: htmlContent
    });

    console.log(`✅ Reminder sent to ${user.email} for ${medication.name}`);
    return true;

  } catch (error) {
    console.error("❌ Error sending Resend email:", error);
    return false;
  }
}

// =====================================
// MANUAL TEST EMAIL FUNCTION
// =====================================

export async function testEmailReminders() {
  try {
    console.log("🧪 Testing Resend emails…");

    const medications = await Medication.findAll({
      where: { isActive: true },
      include: [User]
    });

    if (medications.length === 0) {
      console.log("ℹ️ No active medications for testing");
      return;
    }

    for (const med of medications) {
      console.log(`📤 Test email → ${med.User.email}`);
      await sendMedicationReminder(med.User, med);
    }

  } catch (error) {
    console.error("❌ Test email error:", error);
  }
}

// =====================================
// EMAIL SCHEDULER (setInterval)
// =====================================

export function initEmailScheduler() {
  console.log("⏰ Email reminder interval started...");

  setInterval(async () => {
    try {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      console.log(`🔍 Checking reminders @ ${currentTime}`);

      const meds = await Medication.findAll({
        where: { isActive: true },
        include: [User],
      });

      for (const med of meds) {
        const [h, m] = med.reminderTime.split(":").map(Number);

        const currentTotal = now.getHours() * 60 + now.getMinutes();
        const reminderTotal = h * 60 + m;

        const diff = Math.abs(currentTotal - reminderTotal);

        if (diff <= 3) {
          console.log(`⏰ Reminder match → ${med.name}`);
          await sendMedicationReminder(med.User, med);
        }
      }

    } catch (err) {
      console.error("❌ Scheduler error:", err);
    }
  }, 5 * 60 * 1000);
}

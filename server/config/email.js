import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const useSMTP = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const useEmailJS = !!(
  process.env.EMAILJS_SERVICE_ID &&
  process.env.EMAILJS_TEMPLATE_ID &&
  process.env.EMAILJS_PUBLIC_KEY &&
  process.env.EMAILJS_PRIVATE_KEY
);

let transporter = null;

if (useEmailJS) {
  console.log('Email System: Configured EmailJS REST API transport.');
} else if (useSMTP) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT) === 465, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log(`Email System: Configured SMTP at ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
} else {
  console.log('Email System: SMTP/EmailJS credentials missing. Running in development MOCK mode (emails logged to console).');
}

export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || 'admissions@amanindraclasses.com';
  
  if (useEmailJS) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY,
          template_params: {
            to_email: to,
            subject: subject,
            message_html: html || text,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EmailJS Response: ${response.status} - ${errorText}`);
      }

      console.log(`Email Sent: via EmailJS REST API to ${to}`);
      return { emailJSSent: true };
    } catch (error) {
      console.error(`EmailJS Error: Failed to send email to ${to}:`, error);
      throw error;
    }
  } else if (useSMTP && transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log(`Email Sent: MessageId: ${info.messageId} to ${to}`);
      return info;
    } catch (error) {
      console.error(`Email Error: Failed to send email to ${to}:`, error);
      throw error;
    }
  } else {
    console.log('--- MOCK EMAIL OUTBOX ---');
    console.log(`From:    ${from}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:    ${text || html}`);
    console.log('-------------------------');
    return { mockSent: true };
  }
};

// 1. Admin Email Notification on New Inquiry
export const sendLeadEnquiryAdminEmail = async (lead) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@amanindraclasses.com';
  const subject = `[New CRM Lead] Inquiry from ${lead.studentName} (${lead.class})`;
  
  const text = `
    Hello Admin,
    
    A new student enquiry has been received via the website:
    - Student Name: ${lead.studentName}
    - Parent Name: ${lead.parentName}
    - Phone: ${lead.phone}
    - Email: ${lead.email || 'Not Provided'}
    - Class/Target: ${lead.class}
    - Course: ${lead.course}
    - Current School: ${lead.schoolName || 'Not Provided'}
    - Message: ${lead.message || 'No additional message'}
    - Date: ${new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    
    Please log in to the Admin Dashboard (http://localhost:5173/admin) to manage this lead.
    
    Best regards,
    AIC Portal Mailer
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px;">
      <h2 style="color: #042F1A; border-bottom: 2px solid #FACC15; padding-bottom: 10px;">New Website Enquiry</h2>
      <p>A new student enquiry has been received via the portal:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 150px;">Student Name:</td>
          <td style="padding: 8px 0;">${lead.studentName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Parent Name:</td>
          <td style="padding: 8px 0;">${lead.parentName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${lead.phone}">${lead.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;">${lead.email ? `<a href="mailto:${lead.email}">${lead.email}</a>` : 'Not Provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Class/Target:</td>
          <td style="padding: 8px 0;">${lead.class}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Program:</td>
          <td style="padding: 8px 0;">${lead.course}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Current School:</td>
          <td style="padding: 8px 0;">${lead.schoolName || 'Not Provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Message:</td>
          <td style="padding: 8px 0; font-style: italic; color: #555;">${lead.message || 'No additional message'}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; text-align: center;">
        <a href="http://localhost:5173/admin" style="background-color: #042F1A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Open CRM Pipeline</a>
      </div>
      <p style="font-size: 10px; color: #aaa; margin-top: 30px; text-align: center;">Aman Indra Classes (Kanpur) Portal Automatic Notification</p>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, text, html });
};

// 2. Customer Email Confirmation on Enquiry Submission
export const sendLeadEnquiryCustomerEmail = async (lead) => {
  if (!lead.email || lead.email.trim() === '') return;

  const subject = `Enquiry Received - Aman Indra Classes (AIC)`;
  
  const text = `
    Dear ${lead.studentName},
    
    Thank you for contacting Aman Indra Classes (AIC), Kanpur.
    
    We have received your enquiry details for the ${lead.course} course.
    Our academic counselor coordinator will call you back on your registered mobile number (${lead.phone}) within 24 hours to guide you on syllabus details, batch timings, and coordinate your free counseling sessions.
    
    Summary of your submission:
    - Class level: ${lead.class}
    - Contact Phone: ${lead.phone}
    
    If you have any urgent queries, feel free to call our helpdesk.
    
    Best regards,
    Admissions Desk
    Aman Indra Classes, Govind Nagar, Kanpur
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px; color: #333;">
      <div style="background-color: #042F1A; padding: 15px; border-radius: 8px; text-align: center;">
        <h2 style="color: #FACC15; margin: 0;">Aman Indra Classes</h2>
        <p style="color: white; margin: 5px 0 0 0; font-size: 12px; font-weight: bold;">Transforming Potential Into Results</p>
      </div>
      <p style="margin-top: 20px;">Dear <strong>${lead.studentName}</strong>,</p>
      <p>Thank you for reaching out to Aman Indra Classes (AIC), Kanpur.</p>
      <p>We have successfully received your course query submission. Here are your registration details:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <table style="width: 100%;">
          <tr>
            <td style="font-weight: bold; width: 120px;">Interest:</td>
            <td>${lead.course}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Target Class:</td>
            <td>${lead.class}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Contact Phone:</td>
            <td>${lead.phone}</td>
          </tr>
        </table>
      </div>
      <p>Our admission coordinator will call you back on your phone number within the next 24 hours to schedule your free guidance counseling session.</p>
      <p style="margin-top: 20px;">Should you need immediate assistance, please reply to this email or call us directly.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
      <p style="font-size: 11px; color: #777; text-align: center;">
        <strong>Aman Indra Classes</strong><br>
        123/456, Block C, Govind Nagar, Kanpur, Uttar Pradesh - 208006
      </p>
    </div>
  `;

  return sendEmail({ to: lead.email, subject, text, html });
};

// 3. Customer Email Notification on Status Update/CRM action
export const sendLeadStatusUpdateCustomerEmail = async (lead) => {
  if (!lead.email || lead.email.trim() === '') return;

  const subject = `Update on your Enquiry Status - Aman Indra Classes (AIC)`;
  
  let statusMessage = '';
  switch (lead.status) {
    case 'Contacted':
      statusMessage = 'Our counselor has logged that we successfully contacted you. We hope your preliminary questions were answered!';
      break;
    case 'Follow Up':
      statusMessage = 'Your inquiry status has been moved to Follow Up. We will reach out to you again shortly with further updates.';
      break;
    case 'Interested':
      statusMessage = 'Great! Your enquiry profile has been marked as "Interested". We look forward to welcoming you to the classrooms. Our counselors will share details on batch schedule options next.';
      break;
    case 'Converted':
      statusMessage = 'Welcome to Aman Indra Classes! Your admission inquiry is now marked as Converted. You are officially enrolled.';
      break;
    default:
      return; 
  }

  const text = `
    Dear ${lead.studentName},
    
    This is an update regarding your enquiry at Aman Indra Classes (AIC), Kanpur.
    
    Status Update: ${lead.status}
    
    ${statusMessage}
    
    If you have any questions, please feel free to reach out.
    
    Best regards,
    Admissions Desk
    Aman Indra Classes, Kanpur
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px; color: #333;">
      <div style="background-color: #042F1A; padding: 15px; border-radius: 8px; text-align: center;">
        <h2 style="color: #FACC15; margin: 0;">Aman Indra Classes</h2>
        <p style="color: white; margin: 5px 0 0 0; font-size: 12px; font-weight: bold;">Enquiry Progress Update</p>
      </div>
      <p style="margin-top: 20px;">Dear <strong>${lead.studentName}</strong>,</p>
      <p>This is an automated status update on your admissions inquiry:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FACC15;">
        <p style="margin: 0; font-size: 14px;"><strong>Current CRM Status:</strong> <span style="color: #042F1A; font-weight: bold;">${lead.status}</span></p>
        <p style="margin: 10px 0 0 0; font-style: italic; color: #555;">${statusMessage}</p>
      </div>
      <p>Our counseling desks are open if you need to coordinate timing charts, subject combinations, or fees options.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
      <p style="font-size: 11px; color: #777; text-align: center;">
        <strong>Aman Indra Classes (AIC)</strong><br>
        Govind Nagar, Kanpur, UP
      </p>
    </div>
  `;

  return sendEmail({ to: lead.email, subject, text, html });
};

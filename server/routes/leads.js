import express from 'express';
import Lead from '../models/Lead.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { sendLeadEnquiryAdminEmail, sendLeadEnquiryCustomerEmail, sendLeadStatusUpdateCustomerEmail } from '../config/email.js';
import xlsx from 'xlsx';

const router = express.Router();

// POST /api/leads - Create a new Lead or Submit a Follow-up (Public: Enquiry and Scholarship forms)
router.post('/', async (req, res) => {
  const { studentName, parentName, phone, email, class: studentClass, schoolName, course, message, type, purpose } = req.body;

  if (!studentName || !parentName || !phone || !studentClass || !course) {
    return res.status(400).json({ message: 'Missing required fields: studentName, parentName, phone, class, and course.' });
  }

  // Simple validation for phone (at least 10 digits)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ message: 'Invalid phone number. Must be at least 10 digits.' });
  }

  try {
    const checkEmail = email ? email.trim().toLowerCase() : '';
    const cleanStudentName = studentName.trim();

    if (purpose === 'Follow-up') {
      if (!checkEmail) {
        return res.status(400).json({ message: 'Email address is required for follow-up requests.' });
      }

      // Find existing lead with same email and studentName (case-insensitive)
      const existingLead = await Lead.findOne({
        email: checkEmail,
        studentName: { $regex: new RegExp(`^${cleanStudentName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
      });

      if (!existingLead) {
        return res.status(404).json({ message: `No existing enquiry found for student "${studentName}" with email "${email}".` });
      }

      // Check frequency of follow-ups for this email in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const relatedLeads = await Lead.find({ email: checkEmail });
      let followupCount = 0;
      for (const l of relatedLeads) {
        const notes = l.notes || [];
        for (const note of notes) {
          if (note.text.startsWith('[Web Follow-up]') && new Date(note.date) >= thirtyDaysAgo) {
            followupCount++;
          }
        }
      }

      if (followupCount >= 3) {
        return res.status(400).json({ message: 'Maximum follow-up frequency of 3 times per month for this email address has been reached.' });
      }

      // Update existing lead status and add a follow-up note
      const oldStatus = existingLead.status;
      existingLead.status = 'Follow Up';
      existingLead.purpose = 'Follow-up';
      existingLead.notes.push({
        text: `[Web Follow-up]: ${message || 'Follow-up requested via website form.'}`,
        author: 'Web User',
        date: new Date()
      });

      await existingLead.save();

      // Log database notification for admin dashboard
      try {
        const notification = new Notification({
          title: `Follow-up: ${existingLead.studentName}`,
          message: `${existingLead.studentName} (${existingLead.class}) requested a follow-up.`,
          type: 'status_update',
          relatedId: existingLead._id
        });
        await notification.save();
      } catch (notifErr) {
        console.error('Failed to log follow-up notification in database:', notifErr);
      }

      // Trigger email alerts asynchronously
      sendLeadEnquiryAdminEmail(existingLead, true).catch(err => console.error("Admin email alert failed:", err));
      if (oldStatus !== 'Follow Up') {
        sendLeadStatusUpdateCustomerEmail(existingLead).catch(err => console.error("Status update email failed:", err));
      }

      console.log(`FOLLOW-UP REQUEST SUBMITTED: ${existingLead.studentName} - Course: ${existingLead.course} - Phone: ${existingLead.phone}`);

      return res.status(200).json({ message: 'Follow-up request submitted successfully!', lead: existingLead });
    }

    // Enquiry path (either purpose is 'Enquiry' or not set)
    if (checkEmail) {
      // Find if student under same email has already made an enquiry/registration
      const existingLead = await Lead.findOne({
        email: checkEmail,
        studentName: { $regex: new RegExp(`^${cleanStudentName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
      });
      if (existingLead) {
        return res.status(400).json({ message: `An enquiry for student "${studentName}" with this email address has already been submitted.` });
      }
    }

    const lead = new Lead({
      studentName,
      parentName,
      phone,
      email: email || '',
      class: studentClass,
      schoolName: schoolName || '',
      course,
      message: message || '',
      type: type || 'Enquiry',
      purpose: purpose || 'Enquiry',
      notes: [],
    });

    await lead.save();

    // Log a database notification for admin dashboard
    try {
      const notification = new Notification({
        title: `New Lead: ${studentName}`,
        message: `${studentName} (${studentClass}) submitted a new ${type || 'Enquiry'} for ${course}.`,
        type: 'enquiry',
        relatedId: lead._id
      });
      await notification.save();
    } catch (notifErr) {
      console.error('Failed to log lead notification in database:', notifErr);
    }

    // Trigger email alerts asynchronously
    sendLeadEnquiryAdminEmail(lead).catch(err => console.error("Admin email alert failed:", err));
    sendLeadEnquiryCustomerEmail(lead).catch(err => console.error("Customer email confirmation failed:", err));

    console.log(`NEW LEAD SUBMITTED: ${studentName} - Course: ${course} - Phone: ${phone}`);

    res.status(201).json({ message: 'Lead submitted successfully!', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error saving lead submission.', error: error.message });
  }
});

// GET /api/leads - Query/Filter Leads (Protected)
router.get('/', auth, async (req, res) => {
  const { search, status, type, course, class: studentClass, sort = '-createdAt' } = req.query;

  const query = {};

  // Status Filter
  if (status) {
    query.status = status;
  }

  // Lead Type Filter (Enquiry/Scholarship)
  if (type) {
    query.type = type;
  }

  // Course Filter
  if (course) {
    query.course = course;
  }

  // Class Filter
  if (studentClass) {
    query.class = studentClass;
  }

  // Search Filter (Matches student name, parent name, school name, phone or email)
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { studentName: searchRegex },
      { parentName: searchRegex },
      { schoolName: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
    ];
  }

  try {
    const leads = await Lead.find(query).sort(sort);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving leads.', error: error.message });
  }
});

// PUT /api/leads/:id - Update Lead Status & Add CRM Notes (Protected)
router.put('/:id', auth, async (req, res) => {
  const { status, noteText, noteAuthor } = req.body;

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    const oldStatus = lead.status;
    let statusChanged = false;
    let noteAdded = false;

    if (status && status !== oldStatus) {
      lead.status = status;
      statusChanged = true;
    }

    if (noteText) {
      lead.notes.push({
        text: noteText,
        author: noteAuthor || 'Admin',
        date: new Date()
      });
      noteAdded = true;
    }

    await lead.save();

    // Create system notification inside DB for admin dashboard
    if (statusChanged) {
      try {
        const notification = new Notification({
          title: `Lead Status Updated`,
          message: `Status of ${lead.studentName} updated from "${oldStatus}" to "${lead.status}".`,
          type: 'status_update',
          relatedId: lead._id
        });
        await notification.save();
      } catch (notifErr) {
        console.error('Failed to save status update notification:', notifErr);
      }

      // Email customer the status update
      sendLeadStatusUpdateCustomerEmail(lead).catch(err => console.error("Status update email failed:", err));
    }

    if (noteAdded) {
      try {
        const summaryText = noteText.length > 50 ? `${noteText.substring(0, 50)}...` : noteText;
        const notification = new Notification({
          title: `Note Logged: ${lead.studentName}`,
          message: `Admin logged new CRM notes: "${summaryText}"`,
          type: 'note_added',
          relatedId: lead._id
        });
        await notification.save();
      } catch (notifErr) {
        console.error('Failed to save note added notification:', notifErr);
      }
    }

    res.json({ message: 'Lead updated successfully.', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lead.', error: error.message });
  }
});

// GET /api/leads/export/xlsx - Generate Excel Report (Protected)
router.get('/export/xlsx', auth, async (req, res) => {
  const { filterType, course, studentClass } = req.query;
  const query = {};

  // Apply filters based on request
  if (course) query.course = course;
  if (studentClass) query.class = studentClass;

  // Date range filters
  const now = new Date();
  if (filterType === 'daily') {
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    query.createdAt = { $gte: startOfToday };
  } else if (filterType === 'weekly') {
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    query.createdAt = { $gte: lastWeek };
  } else if (filterType === 'monthly') {
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    query.createdAt = { $gte: lastMonth };
  }

  try {
    const leads = await Lead.find(query).sort('-createdAt');

    // Transform leads into plain rows for spreadsheet consumption
    const dataRows = leads.map(l => ({
      'ID': l._id.toString(),
      'Submission Date': l.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Student Name': l.studentName,
      'Parent Name': l.parentName,
      'Phone': l.phone,
      'Email': l.email || 'N/A',
      'Class': l.class,
      'School': l.schoolName || 'N/A',
      'Course/Program': l.course,
      'Lead Type': l.type,
      'Purpose of Contact': l.purpose || 'Enquiry',
      'CRM Status': l.status,
      'Message': l.message || '',
      'Notes count': l.notes.length,
      'Latest Admin Notes': l.notes.length > 0 ? l.notes[l.notes.length - 1].text : ''
    }));

    // Create workbook
    const ws = xlsx.utils.json_to_sheet(dataRows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'AIC Leads Report');

    // Buffer output
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=AIC_Leads_Report_${filterType || 'all'}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Error generating excel report.', error: error.message });
  }
});

// GET /api/leads/export/csv - Generate CSV Report (Protected)
router.get('/export/csv', auth, async (req, res) => {
  const { filterType, course, studentClass } = req.query;
  const query = {};

  if (course) query.course = course;
  if (studentClass) query.class = studentClass;

  const now = new Date();
  if (filterType === 'daily') {
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    query.createdAt = { $gte: startOfToday };
  } else if (filterType === 'weekly') {
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    query.createdAt = { $gte: lastWeek };
  } else if (filterType === 'monthly') {
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    query.createdAt = { $gte: lastMonth };
  }

  try {
    const leads = await Lead.find(query).sort('-createdAt');

    // Escape fields containing commas/newlines
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      'Date', 'Student Name', 'Parent Name', 'Phone', 'Email', 
      'Class', 'School', 'Course', 'Type', 'Purpose of Contact', 'Status', 'Message', 'Notes'
    ];

    const rows = leads.map(l => [
      l.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      l.studentName,
      l.parentName,
      l.phone,
      l.email || 'N/A',
      l.class,
      l.schoolName || 'N/A',
      l.course,
      l.type,
      l.purpose || 'Enquiry',
      l.status,
      l.message || '',
      l.notes.map(n => `[${n.author}]: ${n.text}`).join(' | ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(escapeCsv).join(','))
    ].join('\n');

    res.setHeader('Content-Disposition', `attachment; filename=AIC_Leads_Report_${filterType || 'all'}.csv`);
    res.setHeader('Content-Type', 'text/csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Error generating CSV report.', error: error.message });
  }
});

// DELETE /api/leads/:id - Delete a lead (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    res.json({ message: 'Lead deleted successfully from CRM.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead.', error: error.message });
  }
});

export default router;

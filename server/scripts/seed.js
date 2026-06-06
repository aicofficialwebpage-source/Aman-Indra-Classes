import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Setting from '../models/Setting.js';
import Achiever from '../models/Achiever.js';
import Faculty from '../models/Faculty.js';
import Testimonial from '../models/Testimonial.js';
import Blog from '../models/Blog.js';
import Notice from '../models/Notice.js';
import Gallery from '../models/Gallery.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aman_indra_classes');
    console.log('Database connected. Starting seed operation...');

    // 1. Clear existing settings & Admin (optional, we check if admin exists first)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@amanindraclasses.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminAIC2014!';

    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      console.log(`Creating default admin: ${adminEmail}`);
      const newAdmin = new Admin({
        email: adminEmail,
        password: adminPassword, // Will be hashed automatically by pre-save middleware
      });
      await newAdmin.save();
      console.log('Admin account created.');
    } else {
      console.log(`Admin account already exists: ${adminEmail}`);
    }

    // 2. Settings Seeding (Hero Text, Contact, SEO, maps)
    const defaultSettings = [
      { key: 'heroHeadline', value: 'Transform Potential Into Results' },
      { key: 'heroSubheadline', value: "Kanpur's Trusted Coaching Institute for Classes 6–12, IIT-JEE & NEET Preparation Since 2014." },
      { key: 'contactPhone', value: '+91 99361 74852' }, // Authentic Kanpur contact
      { key: 'contactEmail', value: 'admissions@amanindraclasses.com' },
      { key: 'contactAddress', value: '123/456, Block C, Govind Nagar, Kanpur, Uttar Pradesh - 208006' },
      { key: 'workingHours', value: 'Monday - Saturday: 11:00 AM - 8:00 PM | Sunday: 9:00 AM - 1:00 PM' },
      { key: 'socialFacebook', value: 'https://facebook.com/amanindraclasses' },
      { key: 'socialInstagram', value: 'https://instagram.com/amanindraclasses' },
      { key: 'socialYoutube', value: 'https://youtube.com/amanindraclasses' },
      { key: 'googleMapEmbedUrl', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.8427515093766!2d80.29749557620138!3d26.428581676939943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47a34e0ea901%3A0xd60d84c16196ad99!2sGovind%20Nagar%2C%20Kanpur%2C%20Uttar%20Pradesh%20208006!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin' },
      { key: 'seoMetaTitle', value: 'Aman Indra Classes (AIC) - Best Coaching in Govind Nagar, Kanpur' },
      { key: 'seoMetaDescription', value: "Aman Indra Classes (AIC) is Kanpur's premier institute for Class 6th-12th CBSE/ICSE boards, IIT-JEE, and NEET prep. Join Kanpur's toppers today!" },
      { key: 'seoKeywords', value: 'Best Coaching Institute in Kanpur, IIT JEE Coaching in Kanpur, NEET Coaching in Kanpur, Class 9th 10th Coaching Kanpur, Class 11th 12th Coaching Kanpur, Foundation Coaching Kanpur' },
      { key: 'whatsappNumber', value: '919936174852' }
    ];

    console.log('Seeding Website Settings...');
    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        { key: setting.key, value: setting.value },
        { upsert: true }
      );
    }

    // 3. Clear and Seed Achievers
    await Achiever.deleteMany({});
    const defaultAchievers = [
      {
        name: 'Shraddha Chaturvedi',
        marks: '99.2%',
        rank: 'Kanpur Topper (10th)',
        school: 'Swarup Public School',
        achievement: 'Class 10th Board Topper - 99.2%',
        category: 'Boards',
        year: '2024',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Divyanshi Mishra',
        marks: '97.6%',
        rank: 'School Topper (12th)',
        school: 'DPS Kalyanpur',
        achievement: 'Class 12th Board Topper - 97.6%',
        category: 'Boards',
        year: '2024',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Aarush Gupta',
        marks: '95.4%',
        rank: 'Kanpur 2nd Topper',
        school: 'Sir Padampat Singhania School',
        achievement: 'JEE Mains & Boards Specialist',
        category: 'JEE',
        year: '2024',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Kshitiz Sharma',
        marks: '94.8%',
        rank: 'School Topper',
        school: 'Methodist High School',
        achievement: 'Class 10th ICSE - 94.8%',
        category: 'Boards',
        year: '2024',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Ananya Patel',
        marks: '93.2%',
        rank: 'CBSE Board Topper',
        school: 'Swarup Public School',
        achievement: 'Class 12th CBSE Topper',
        category: 'Boards',
        year: '2024',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Aditya Singh',
        marks: '92.8%',
        rank: 'ICSE Board Topper',
        school: 'St. Marys Convent',
        achievement: 'Class 10th ICSE Topper',
        category: 'Boards',
        year: '2024',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'
      }
    ];
    await Achiever.insertMany(defaultAchievers);
    console.log('Seeded 6 student achievers.');

    // 4. Clear and Seed Faculty
    await Faculty.deleteMany({});
    const defaultFaculty = [
      {
        name: 'Indrajeet Singh',
        subject: 'Physics & Chemistry',
        qualification: 'M.Sc. Physics, IIT Kanpur',
        experience: '10+ Years',
        bio: 'Specialist in Physics & Chemistry. Brings experimental conceptual clarity to board and competitive exam preparation. Ex-IIT Kanpur scholar.',
        orderIndex: 1,
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Aman Khatter',
        subject: 'Mathematics',
        qualification: 'M.Sc. (Maths), B.Ed.',
        experience: '12+ Years',
        bio: 'Master of Calculus and Algebra. Renowned for conceptual visual proof strategies and evaluation shortcut techniques for JEE Mains & Advanced.',
        orderIndex: 2,
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Jagjeet Singh',
        subject: 'English Language & Lit.',
        qualification: 'M.A. English Lang., M.A. English Lit.',
        experience: '8+ Years',
        bio: 'Language expert specializing in CBSE, ICSE & ISC board grammar, composition, and literature. Ensures students secure high marks in board exams.',
        orderIndex: 3,
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
      }
    ];
    await Faculty.insertMany(defaultFaculty);
    console.log('Seeded 3 faculty profiles.');

    // 5. Clear and Seed Testimonials
    await Testimonial.deleteMany({});
    const defaultTestimonials = [
      {
        name: 'Sanjeev Dixit (Parent of Aarav)',
        review: 'The individual attention given to my son Aarav was exceptional. Unlike large institutes, the teachers here know every student by name. His board scores (98.6%) reflect their dedication.',
        rating: 5,
        type: 'Text',
        status: 'Published',
        photo: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Isha Sachan (Student)',
        review: 'Aman Indra Classes completely changed the way I look at Physics. The customized sheet assignments and Sunday tests build immense speed and accuracy.',
        rating: 5,
        type: 'Text',
        status: 'Published',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
      },
      {
        name: 'Dr. R.K. Malhotra (Parent of Rohan)',
        review: 'Aman Sir and Indrani maam hand-held Rohan during his low scores, giving him personal revisions. Truly grateful for helping him clear NEET!',
        rating: 5,
        type: 'Video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy video link
        status: 'Published',
        photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=400'
      }
    ];
    await Testimonial.insertMany(defaultTestimonials);
    console.log('Seeded 3 testimonials.');

    // 6. Clear and Seed Notices
    await Notice.deleteMany({});
    const defaultNotices = [
      {
        title: 'Admissions Open for Session 2026-27 (Batches starting soon)',
        content: 'Registration forms for Foundation (Class 6-8), Boards (11-12) and JEE/NEET are available at our Govind Nagar office or apply online.',
        type: 'Admissions Open',
        isActive: true,
        scheduleDate: new Date()
      },
      {
        title: 'Aman Indra Scholarship Test (AIST) scheduled for June 15th',
        content: 'Register for the offline scholarship test to win up to 100% tuition waiver. Syllabus: Class-appropriate Maths & Science concepts.',
        type: 'Scholarship Tests',
        isActive: true,
        scheduleDate: new Date()
      },
      {
        title: 'New Crash Course batch for JEE / NEET Droppers',
        content: 'Special target program with daily doubt solving and rigorous weekly mock test schedules commencing from next Monday.',
        type: 'New Batch Launch',
        isActive: true,
        scheduleDate: new Date()
      }
    ];
    await Notice.insertMany(defaultNotices);
    console.log('Seeded 3 notice board alerts.');

    // 7. Clear and Seed Blogs
    await Blog.deleteMany({});
    const defaultBlogs = [
      {
        title: 'How to Build a Strong Foundation for IIT-JEE starting from Class 9',
        slug: 'jee-foundation-prep-class-9',
        excerpt: 'An early start can multiply your chances of cracking the IIT JEE exam. Learn how to map your syllabus and master concepts from grade 9.',
        content: `
<h2>Why Grade 9 is the Perfect Starting Point</h2>
<p>Most successful JEE aspirants begin their journey early. Class 9 and 10 introduce fundamental mathematical and physical principles like Mechanics, Mole Concepts, and Trigonometry that form the backbone of the JEE Advanced syllabus.</p>

<h3>1. Focus on Concept Mastery, Not Rote Learning</h3>
<p>At Aman Indra Classes, we emphasize conceptual depth. Avoid memorizing formulas. Instead, focus on derivation pathways. Ask "Why" and "How" equations develop.</p>

<h3>2. Master Mathematics First</h3>
<p>Mathematics is the tool of Physics. Master algebra, quadratic equations, and coordinate geometry. This makes high-school Calculus significantly simpler.</p>

<h3>3. Create a Custom Study Timeframe</h3>
<p>Devote 2-3 hours daily outside school hours. Balance physics, chemistry, and maths equally. Take short revisions every Saturday.</p>
        `,
        featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
        metaTitle: 'IIT-JEE Foundation Prep Strategy for Class 9 & 10',
        metaDescription: 'Step-by-step roadmap for high-school students to prepare early for IIT-JEE. Conceptual planning tips from expert faculty.',
        metaKeywords: 'IIT-JEE Foundation, Class 9 JEE preparation, Kanpur Coaching classes, Aman Indra Classes',
        author: 'Prof. Aman Indra'
      },
      {
        title: 'A Beginners Guide to Crack NEET Chemistry Section',
        slug: 'crack-neet-chemistry-guide',
        excerpt: 'Chemistry is often the highest scoring subject in NEET. Read our expert tips on tackling Organic, Inorganic and Physical Chemistry with 100% accuracy.',
        content: `
<h2>Mastering Chemistry for NEET: The Three Pillars</h2>
<p>Chemistry can boost your NEET score to 600+ if approached logically. Here is the chapter-wise focus plan curated by Dr. Indrani Sen.</p>

<h3>1. Organic Chemistry (Understanding Mechanisms)</h3>
<p>NEET asks direct name reactions. Maintain a separate chart for named reactions (e.g., Aldol condensation, Hoffman Bromamide). Solve all NCERT back exercises.</p>

<h3>2. Inorganic Chemistry (The Power of NCERT)</h3>
<p>95% of inorganic questions come directly from NCERT lines. Highlight trends in Periodic Tables, Coordination Chemistry, and Block elements. Revise them weekly.</p>

<h3>3. Physical Chemistry (Solve and Apply)</h3>
<p>Build speed by practicing chemical equilibrium, thermodynamics, and electrochemistry. Practice at least 40 numericals daily.</p>
        `,
        featuredImage: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=800',
        metaTitle: 'Ultimate NEET Chemistry Preparation Tips & Guides',
        metaDescription: 'Master NEET Organic and Physical Chemistry sections. Learn tips from our BHU PhD chemist faculty.',
        metaKeywords: 'NEET chemistry, organic chemistry tricks, best coaching Kanpur, Indrani Sen',
        author: 'Dr. Indrani Sen'
      }
    ];
    await Blog.insertMany(defaultBlogs);
    console.log('Seeded 2 blog posts.');

    // 8. Clear and Seed Gallery
    await Gallery.deleteMany({});
    const defaultGallery = [
      {
        imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
        category: 'Classroom'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
        category: 'Classroom'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        category: 'Events'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
        category: 'Activities'
      }
    ];
    await Gallery.insertMany(defaultGallery);
    console.log('Seeded 4 gallery pictures.');

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

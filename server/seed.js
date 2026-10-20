// Creates a demo account with sample applications for Rolevo.
// Run with: npm run seed   (safe to run again, it resets only Narasimha's demo data)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Application = require('./models/Application');

const DEMO_NAME = 'Narasimha';
const DEMO_EMAIL = 'narasimhatanmaikumar@gmail.com';
const DEMO_PASSWORD = 'rolevo123';

// A date "daysAgo" days before today, at midnight UTC (same format a date input saves)
function dateAgo(daysAgo) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

// [company, role, location, salary, appliedDaysAgo, history [[status, daysAgo]], notes, interviewInDays, isStarred]
const SAMPLES = [
  ['Google', 'Software Engineer I', 'Bengaluru', '28 LPA', 22, [['Applied', 22], ['Interview', 10], ['Offer', 2]], 'Dream company! Offer letter received. Preparing acceptance.', 0, true],
  ['Microsoft', 'Software Development Engineer (SDE-1)', 'Hyderabad', '22 LPA', 19, [['Applied', 19], ['Interview', 8]], 'Technical rounds cleared! Final architectural review round pending.', 2, true],
  ['Amazon', 'SDE Intern / Full Time', 'Bengaluru', '20 LPA', 16, [['Applied', 16], ['Interview', 5]], 'DSA round cleared. System design discussion scheduled.', 4, true],
  ['Zoho', 'Product Developer', 'Chennai', '8.5 LPA', 14, [['Applied', 14]], 'Applied with senior referral. Awaiting round 1 response.', null, true],
  ['Infosys', 'Specialist Programmer', 'Bengaluru', '9.5 LPA', 11, [['Applied', 11]], 'InfyTQ assessment cleared with distinction.', null, false],
  ['Freshworks', 'Frontend Engineer (React)', 'Remote', '12 LPA', 9, [['Applied', 9], ['Interview', 3]], 'Take-home assignment submitted with custom UI components.', 5, false],
  ['TCS', 'Digital Software Engineer', 'Hyderabad', '7.5 LPA', 15, [['Applied', 15], ['Rejected', 6]], 'Cleared aptitude and coding; rejected in HR budget constraints.', null, false],
  ['Accenture', 'Advanced Application Engineering Analyst', 'Pune', '6.5 LPA', 3, [['Applied', 3]], 'Applied via campus placement drive.', null, false],
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (user) {
    await Application.deleteMany({ user: user._id }); // start fresh
  } else {
    const password = await bcrypt.hash(DEMO_PASSWORD, 10);
    user = await User.create({ name: DEMO_NAME, email: DEMO_EMAIL, password });
  }

  for (const [company, role, location, salaryExpectation, appliedAgo, history, notes, interviewIn, isStarred] of SAMPLES) {
    await Application.create({
      user: user._id,
      company,
      role,
      location,
      salaryExpectation,
      notes,
      isStarred: Boolean(isStarred),
      jobLink: `https://careers.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      appliedDate: dateAgo(appliedAgo),
      interviewDate: interviewIn === null ? null : dateAgo(-interviewIn),
      status: history[history.length - 1][0], // current status = last history entry
      statusHistory: history.map(([status, daysAgo]) => ({
        status,
        changedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      })),
    });
  }

  console.log(`Demo data ready for Rolevo! Log in with: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});

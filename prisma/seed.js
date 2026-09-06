import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const USER_EMAIL = process.env.SEED_USER_EMAIL;

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  console.log('🌱 Starting SQL seed...\n');
  console.log('DATABASE:', process.env.DATABASE_URL);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure user
    let userRes;
    if (USER_EMAIL) {
      userRes = await client.query('SELECT id, email FROM users WHERE email = $1', [USER_EMAIL]);
    } else {
      userRes = await client.query('SELECT id, email FROM users ORDER BY id LIMIT 1');
    }

    let user;
    if (userRes.rows.length > 0) {
      user = userRes.rows[0];
    } else {
      const seedEmail = USER_EMAIL ?? 'seed@example.com';
      const passwordHash = bcrypt.hashSync('password', 8);
      const ins = await client.query(
        'INSERT INTO users (email, "passwordHash", "updatedAt") VALUES ($1, $2, now()) RETURNING id, email',
        [seedEmail, passwordHash]
      );
      user = ins.rows[0];
      console.log('Created seed user:', user.email);
    }

    console.log('👤 Using user:', user.email);

    const borrowersData = [
      { name: 'Rahul Sharma', email: 'rahul.seed@example.com', phone: '9876500001', street: '', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      { name: 'Amit Verma', email: 'amit.seed@example.com', phone: '9876500002', street: '', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
      { name: 'Priya Singh', email: 'priya.seed@example.com', phone: '9876500003', street: '', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010' },
      { name: 'Rohit Kumar', email: 'rohit.seed@example.com', phone: '9876500004', street: '', city: 'Jaipur', state: 'Rajasthan', pincode: '302021' },
      { name: 'Neha Gupta', email: 'neha.seed@example.com', phone: '9876500005', street: '', city: 'Gurgaon', state: 'Haryana', pincode: '122001' },
      { name: 'Vikas Yadav', email: 'vikas.seed@example.com', phone: '9876500006', street: '', city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001' },
      { name: 'Anjali Mehta', email: 'anjali.seed@example.com', phone: '9876500007', street: '', city: 'Mumbai', state: 'Maharashtra', pincode: '400069' },
      { name: 'Sandeep Mishra', email: 'sandeep.seed@example.com', phone: '9876500008', street: '', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462016' },
      { name: 'Pooja Patel', email: 'pooja.seed@example.com', phone: '9876500009', street: '', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009' },
      { name: 'Karan Malhotra', email: 'karan.seed@example.com', phone: '9876500010', street: '', city: 'Chandigarh', state: 'Chandigarh', pincode: '160022' },
    ];

    const borrowers = [];
    for (const b of borrowersData) {
      const res = await client.query(
        `INSERT INTO borrowers ("userId", name, email, phone, notes, street, city, state, pincode, "isDeleted", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, now())
         ON CONFLICT ("userId", email) DO UPDATE SET name=EXCLUDED.name, phone=EXCLUDED.phone, city=EXCLUDED.city, state=EXCLUDED.state, pincode=EXCLUDED.pincode, "isDeleted"=EXCLUDED."isDeleted", "updatedAt"=now() RETURNING *`,
        [user.id, b.name, b.email, b.phone, null, b.street, b.city, b.state, b.pincode, false]
      );
      borrowers.push(res.rows[0]);
    }

    console.log(`👥 ${borrowers.length} borrowers ready`);

    const loanConfigs = [
      [0, 50000, 15000, 15],
      [1, 80000, 20000, 10],
      [2, 35000, 35000, -5],
      [3, 100000, 30000, -12],
      [4, 45000, 5000, 7],
      [5, 70000, 10000, -8],
      [6, 25000, 0, 30],
      [7, 60000, 25000, 45],
      [8, 90000, 40000, 60],
      [9, 120000, 0, 90],
    ];

    const loans = [];
    for (let i = 0; i < loanConfigs.length; i++) {
      const [borrowerIndex, amount, paid, dueDays] = loanConfigs[i];
      const borrower = borrowers[borrowerIndex];
      const dueDate = daysFromNow(dueDays);

      let status;
      if (paid >= amount) status = 'PAID';
      else if (dueDays < 0) status = 'OVERDUE';
      else if (paid > 0) status = 'PARTIALLY_PAID';
      else status = 'ACTIVE';

      const res = await client.query(
        `INSERT INTO loans ("userId","borrowerId", amount, "interestRate", "interestType", "remainingAmount", "totalPaid", "lentDate", "dueDate", status, notes, "isDeleted", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now()) RETURNING *`,
        [user.id, borrower.id, amount, 10, 'SIMPLE', amount - paid, paid, daysAgo(120), dueDate, status, 'Seed data for AI cash flow forecasting', false]
      );
      loans.push(res.rows[0]);
    }

    console.log(`💰 ${loans.length} loans created`);

    const paymentPatterns = [
      [ [28,5000],[21,5000],[14,5000] ],
      [ [26,5000],[18,7000],[9,8000] ],
      [ [25,10000],[17,12000],[8,13000] ],
      [ [27,8000],[20,7000],[12,6000],[5,9000] ],
      [ [23,2500],[11,2500] ],
      [ [24,4000],[15,3000],[6,3000] ],
      [],
      [ [29,8000],[19,9000],[10,8000] ],
      [ [22,10000],[13,15000],[4,15000] ],
      []
    ];

    let paymentCount = 0;
    for (let i = 0; i < paymentPatterns.length; i++) {
      const loan = loans[i];
      for (let j = 0; j < paymentPatterns[i].length; j++) {
        const [days, amt] = paymentPatterns[i][j];
        await client.query(
          `INSERT INTO loan_payments ("loanId","userId", amount, "paymentDate", "paymentMethod", "referenceNumber", notes, "updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7, now())`,
          [loan.id, user.id, amt, daysAgo(days), (j%3===0? 'UPI' : j%3===1 ? 'CASH' : 'BANK_TRANSFER'), `SEED-${i+1}-${j+1}`, 'Historical payment for AI forecast testing']
        );
        paymentCount++;
      }
    }

    console.log(`💳 ${paymentCount} historical payments created`);

    await client.query('COMMIT');

    console.log('\n================================');
    console.log('🎉 SEED COMPLETED');
    console.log('================================');
    console.log(`Borrowers : ${borrowers.length}`);
    console.log(`Loans     : ${loans.length}`);
    console.log(`Payments  : ${paymentCount}`);
    console.log('================================\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seed failed:');
    console.error(err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();

const KEY = 'ak_qZdW-mWJXvEVzANkPfWttFn_Cnarjx0nG9PJVqBJ7tk';
const BASE = 'https://lerty.ai/api/v1';
const H = { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' };

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method, headers: H,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!text) return null;
  const json = JSON.parse(text);
  if (!res.ok) throw new Error(`${method} ${path} → ${JSON.stringify(json)}`);
  return json.data ?? json;
}

const createDB = (name) => api('POST', '/databases', { name });
const createTable = (dbId, name) => api('POST', `/databases/${dbId}/tables`, { name });
const getFields = async (tableId) => { const t = await api('GET', `/tables/${tableId}`); return t.fields || []; };
const rename = (id, name) => api('PATCH', `/fields/${id}`, { name });
const del = (id) => api('DELETE', `/fields/${id}`);
const add = (tableId, field) => api('POST', `/tables/${tableId}/fields`, field);

async function resetTable(tableId, entryName, dateName, keepBoolean, booleanName) {
  const fields = await getFields(tableId);
  const get = (name) => fields.find(f => f.name === name);
  await rename(get('Entry').id, entryName);
  if (dateName) await rename(get('Date').id, dateName);
  else await del(get('Date').id);
  await del(get('Status').id);
  if (keepBoolean && booleanName) await rename(get('Boolean').id, booleanName);
  else await del(get('Boolean').id);
}

// ════════════════════════════════════════════════════
// 1. DENTAL PRACTICE MANAGER
// ════════════════════════════════════════════════════
async function buildDentalPractice() {
  console.log('\nBuilding Dental Practice Manager...');
  const db = await createDB('Dental Practice Manager');
  const [patients, appointments, followups, recalls, tasks] = await Promise.all([
    createTable(db.id, 'Patients'),
    createTable(db.id, 'Appointments'),
    createTable(db.id, 'Follow-Ups'),
    createTable(db.id, 'Recall List'),
    createTable(db.id, 'Tasks'),
  ]);

  // Patients
  await resetTable(patients.id, 'Patient Name', 'Last Visit', false);
  await add(patients.id, { name: 'Phone', type: 'text' });
  await add(patients.id, { name: 'Email', type: 'text' });
  await add(patients.id, { name: 'Insurance', type: 'text' });
  await add(patients.id, { name: 'Next Appointment', type: 'date' });
  await add(patients.id, { name: 'Treatment Plan', type: 'text' });
  await add(patients.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Active', color: 'green' },
    { label: 'Inactive', color: 'gray' },
    { label: 'New Patient', color: 'blue' },
    { label: 'High Value', color: 'purple' },
  ]}});
  await add(patients.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Patients');

  // Appointments
  await resetTable(appointments.id, 'Patient Name', 'Appointment Date', false);
  await add(appointments.id, { name: 'Procedure', type: 'text' });
  await add(appointments.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Scheduled', color: 'blue' },
    { label: 'Confirmed', color: 'green' },
    { label: 'Completed', color: 'gray' },
    { label: 'No Show', color: 'red' },
    { label: 'Cancelled', color: 'red' },
  ]}});
  await add(appointments.id, { name: 'Duration (min)', type: 'number' });
  await add(appointments.id, { name: 'Provider', type: 'text' });
  await add(appointments.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Appointments');

  // Follow-Ups
  await resetTable(followups.id, 'Patient Name', 'Follow-Up Date', false);
  await add(followups.id, { name: 'Reason', type: 'text' });
  await add(followups.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Pending', color: 'yellow' },
    { label: 'Contacted', color: 'blue' },
    { label: 'Booked', color: 'green' },
    { label: 'No Response', color: 'red' },
  ]}});
  await add(followups.id, { name: 'Priority', type: 'select', config: { options: [
    { label: 'High', color: 'red' },
    { label: 'Medium', color: 'yellow' },
    { label: 'Low', color: 'green' },
  ]}});
  console.log('  ✓ Follow-Ups');

  // Recall List
  await resetTable(recalls.id, 'Patient Name', 'Recall Due Date', false);
  await add(recalls.id, { name: 'Recall Type', type: 'select', config: { options: [
    { label: '6-Month Cleaning', color: 'blue' },
    { label: 'Annual X-Ray', color: 'purple' },
    { label: 'Treatment Follow-Up', color: 'orange' },
    { label: 'Ortho Check', color: 'green' },
  ]}});
  await add(recalls.id, { name: 'Contact Status', type: 'select', config: { options: [
    { label: 'Not Contacted', color: 'gray' },
    { label: 'Reminder Sent', color: 'blue' },
    { label: 'Booked', color: 'green' },
    { label: 'Declined', color: 'red' },
  ]}});
  await add(recalls.id, { name: 'Phone', type: 'text' });
  console.log('  ✓ Recall List');

  // Tasks
  await resetTable(tasks.id, 'Task', 'Due Date', false);
  await add(tasks.id, { name: 'Priority', type: 'select', config: { options: [
    { label: 'High', color: 'red' },
    { label: 'Medium', color: 'yellow' },
    { label: 'Low', color: 'green' },
  ]}});
  await add(tasks.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'To Do', color: 'gray' },
    { label: 'In Progress', color: 'blue' },
    { label: 'Done', color: 'green' },
  ]}});
  console.log('  ✓ Tasks');
  console.log('  DENTAL PRACTICE MANAGER DONE ✓');
}

// ════════════════════════════════════════════════════
// 2. MED SPA CLIENT MANAGER
// ════════════════════════════════════════════════════
async function buildMedSpa() {
  console.log('\nBuilding Med Spa Client Manager...');
  const db = await createDB('Med Spa Client Manager');
  const [clients, treatments, consents, revenue, tasks] = await Promise.all([
    createTable(db.id, 'Clients'),
    createTable(db.id, 'Treatment History'),
    createTable(db.id, 'Consent Tracking'),
    createTable(db.id, 'Revenue'),
    createTable(db.id, 'Rebooking Queue'),
  ]);

  // Clients
  await resetTable(clients.id, 'Client Name', 'Last Visit', false);
  await add(clients.id, { name: 'Phone', type: 'text' });
  await add(clients.id, { name: 'Email', type: 'text' });
  await add(clients.id, { name: 'Date of Birth', type: 'date' });
  await add(clients.id, { name: 'Skin Type', type: 'text' });
  await add(clients.id, { name: 'Allergies', type: 'text' });
  await add(clients.id, { name: 'Total Spend', type: 'number' });
  await add(clients.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Active', color: 'green' },
    { label: 'VIP', color: 'purple' },
    { label: 'At Risk', color: 'red' },
    { label: 'Inactive', color: 'gray' },
  ]}});
  await add(clients.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Clients');

  // Treatment History
  await resetTable(treatments.id, 'Client Name', 'Treatment Date', false);
  await add(treatments.id, { name: 'Treatment', type: 'select', config: { options: [
    { label: 'Botox', color: 'blue' },
    { label: 'Filler', color: 'purple' },
    { label: 'Laser', color: 'orange' },
    { label: 'Chemical Peel', color: 'green' },
    { label: 'Microneedling', color: 'yellow' },
    { label: 'Hydrafacial', color: 'blue' },
    { label: 'Other', color: 'gray' },
  ]}});
  await add(treatments.id, { name: 'Provider', type: 'text' });
  await add(treatments.id, { name: 'Units / Amount', type: 'text' });
  await add(treatments.id, { name: 'Price', type: 'number' });
  await add(treatments.id, { name: 'Next Treatment Due', type: 'date' });
  await add(treatments.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Treatment History');

  // Consent Tracking
  await resetTable(consents.id, 'Client Name', 'Expiry Date', false);
  await add(consents.id, { name: 'Consent Type', type: 'text' });
  await add(consents.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Valid', color: 'green' },
    { label: 'Expiring Soon', color: 'yellow' },
    { label: 'Expired', color: 'red' },
    { label: 'Needs Renewal', color: 'orange' },
  ]}});
  await add(consents.id, { name: 'Signed Date', type: 'date' });
  console.log('  ✓ Consent Tracking');

  // Revenue
  await resetTable(revenue.id, 'Description', 'Date', false);
  await add(revenue.id, { name: 'Amount', type: 'number' });
  await add(revenue.id, { name: 'Category', type: 'select', config: { options: [
    { label: 'Injectables', color: 'blue' },
    { label: 'Laser', color: 'orange' },
    { label: 'Facials', color: 'green' },
    { label: 'Retail', color: 'purple' },
    { label: 'Memberships', color: 'yellow' },
  ]}});
  await add(revenue.id, { name: 'Payment Method', type: 'select', config: { options: [
    { label: 'Card', color: 'blue' },
    { label: 'Cash', color: 'green' },
    { label: 'Financing', color: 'purple' },
  ]}});
  console.log('  ✓ Revenue');

  // Rebooking Queue
  await resetTable(revenue.id, 'Client Name', 'Rebook By', false);
  await add(clients.id, { name: 'Last Treatment', type: 'text' });
  await add(clients.id, { name: 'Rebook Status', type: 'select', config: { options: [
    { label: 'Needs Contact', color: 'red' },
    { label: 'Reminder Sent', color: 'yellow' },
    { label: 'Booked', color: 'green' },
    { label: 'Not Interested', color: 'gray' },
  ]}});
  console.log('  ✓ Rebooking Queue');
  console.log('  MED SPA CLIENT MANAGER DONE ✓');
}

// ════════════════════════════════════════════════════
// 3. LAW FIRM CLIENT INTAKE
// ════════════════════════════════════════════════════
async function buildLawFirm() {
  console.log('\nBuilding Law Firm Client Intake...');
  const db = await createDB('Law Firm Client Intake');
  const [prospects, matters, deadlines, billing, tasks] = await Promise.all([
    createTable(db.id, 'Prospects'),
    createTable(db.id, 'Active Matters'),
    createTable(db.id, 'Deadlines'),
    createTable(db.id, 'Billing'),
    createTable(db.id, 'Tasks'),
  ]);

  // Prospects
  await resetTable(prospects.id, 'Prospect Name', 'Inquiry Date', false);
  await add(prospects.id, { name: 'Phone', type: 'text' });
  await add(prospects.id, { name: 'Email', type: 'text' });
  await add(prospects.id, { name: 'Matter Type', type: 'select', config: { options: [
    { label: 'Personal Injury', color: 'red' },
    { label: 'Family Law', color: 'blue' },
    { label: 'Criminal Defense', color: 'orange' },
    { label: 'Real Estate', color: 'green' },
    { label: 'Business Law', color: 'purple' },
    { label: 'Estate Planning', color: 'gray' },
    { label: 'Other', color: 'gray' },
  ]}});
  await add(prospects.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'New Inquiry', color: 'blue' },
    { label: 'Conflict Check', color: 'yellow' },
    { label: 'Consultation Scheduled', color: 'purple' },
    { label: 'Retained', color: 'green' },
    { label: 'Declined', color: 'red' },
    { label: 'Referred Out', color: 'gray' },
  ]}});
  await add(prospects.id, { name: 'Consultation Date', type: 'date' });
  await add(prospects.id, { name: 'Referred By', type: 'text' });
  await add(prospects.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Prospects');

  // Active Matters
  await resetTable(matters.id, 'Matter Name', 'Open Date', false);
  await add(matters.id, { name: 'Client Name', type: 'text' });
  await add(matters.id, { name: 'Attorney', type: 'text' });
  await add(matters.id, { name: 'Matter Type', type: 'text' });
  await add(matters.id, { name: 'Stage', type: 'select', config: { options: [
    { label: 'Active', color: 'green' },
    { label: 'Discovery', color: 'blue' },
    { label: 'Negotiation', color: 'yellow' },
    { label: 'Trial Prep', color: 'orange' },
    { label: 'Closed', color: 'gray' },
  ]}});
  await add(matters.id, { name: 'Hours Billed', type: 'number' });
  await add(matters.id, { name: 'Total Fees', type: 'number' });
  await add(matters.id, { name: 'Retainer Balance', type: 'number' });
  await add(matters.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Active Matters');

  // Deadlines
  await resetTable(deadlines.id, 'Deadline', 'Due Date', false);
  await add(deadlines.id, { name: 'Matter', type: 'text' });
  await add(deadlines.id, { name: 'Type', type: 'select', config: { options: [
    { label: 'Court Date', color: 'red' },
    { label: 'Filing', color: 'orange' },
    { label: 'Response Due', color: 'yellow' },
    { label: 'Discovery', color: 'blue' },
    { label: 'Statute of Limitations', color: 'red' },
  ]}});
  await add(deadlines.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Upcoming', color: 'blue' },
    { label: 'Urgent', color: 'red' },
    { label: 'Completed', color: 'green' },
    { label: 'Extended', color: 'gray' },
  ]}});
  await add(deadlines.id, { name: 'Attorney', type: 'text' });
  console.log('  ✓ Deadlines');

  // Billing
  await resetTable(billing.id, 'Description', 'Invoice Date', false);
  await add(billing.id, { name: 'Client', type: 'text' });
  await add(billing.id, { name: 'Amount', type: 'number' });
  await add(billing.id, { name: 'Hours', type: 'number' });
  await add(billing.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Draft', color: 'gray' },
    { label: 'Sent', color: 'blue' },
    { label: 'Paid', color: 'green' },
    { label: 'Overdue', color: 'red' },
  ]}});
  await add(billing.id, { name: 'Due Date', type: 'date' });
  console.log('  ✓ Billing');

  // Tasks
  await resetTable(tasks.id, 'Task', 'Due Date', false);
  await add(tasks.id, { name: 'Priority', type: 'select', config: { options: [
    { label: 'Urgent', color: 'red' },
    { label: 'High', color: 'orange' },
    { label: 'Normal', color: 'blue' },
  ]}});
  await add(tasks.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'To Do', color: 'gray' },
    { label: 'In Progress', color: 'blue' },
    { label: 'Done', color: 'green' },
  ]}});
  await add(tasks.id, { name: 'Assigned To', type: 'text' });
  console.log('  ✓ Tasks');
  console.log('  LAW FIRM CLIENT INTAKE DONE ✓');
}

// ════════════════════════════════════════════════════
// 4. RENTAL PROPERTY OPERATIONS
// ════════════════════════════════════════════════════
async function buildRentalProperty() {
  console.log('\nBuilding Rental Property Operations Hub...');
  const db = await createDB('Rental Property Operations');
  const [properties, tenants, maintenance, leases, finances] = await Promise.all([
    createTable(db.id, 'Properties'),
    createTable(db.id, 'Tenants'),
    createTable(db.id, 'Maintenance Requests'),
    createTable(db.id, 'Leases'),
    createTable(db.id, 'Finances'),
  ]);

  // Properties
  await resetTable(properties.id, 'Property Address', null, false);
  await add(properties.id, { name: 'Type', type: 'select', config: { options: [
    { label: 'Single Family', color: 'blue' },
    { label: 'Multi-Family', color: 'purple' },
    { label: 'Condo', color: 'green' },
    { label: 'Commercial', color: 'orange' },
  ]}});
  await add(properties.id, { name: 'Units', type: 'number' });
  await add(properties.id, { name: 'Monthly Rent', type: 'number' });
  await add(properties.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Occupied', color: 'green' },
    { label: 'Vacant', color: 'red' },
    { label: 'Partial', color: 'yellow' },
  ]}});
  await add(properties.id, { name: 'Purchase Price', type: 'number' });
  await add(properties.id, { name: 'Monthly Expenses', type: 'number' });
  await add(properties.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Properties');

  // Tenants
  await resetTable(tenants.id, 'Tenant Name', 'Move-In Date', false);
  await add(tenants.id, { name: 'Phone', type: 'text' });
  await add(tenants.id, { name: 'Email', type: 'text' });
  await add(tenants.id, { name: 'Unit', type: 'text' });
  await add(tenants.id, { name: 'Monthly Rent', type: 'number' });
  await add(tenants.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Current', color: 'green' },
    { label: 'Late', color: 'red' },
    { label: 'Notice Given', color: 'orange' },
    { label: 'Vacated', color: 'gray' },
  ]}});
  await add(tenants.id, { name: 'Lease End Date', type: 'date' });
  await add(tenants.id, { name: 'Security Deposit', type: 'number' });
  await add(tenants.id, { name: 'Notes', type: 'text' });
  console.log('  ✓ Tenants');

  // Maintenance
  await resetTable(maintenance.id, 'Issue', 'Date Reported', false);
  await add(maintenance.id, { name: 'Property / Unit', type: 'text' });
  await add(maintenance.id, { name: 'Category', type: 'select', config: { options: [
    { label: 'Plumbing', color: 'blue' },
    { label: 'Electrical', color: 'yellow' },
    { label: 'HVAC', color: 'orange' },
    { label: 'Appliance', color: 'purple' },
    { label: 'Structural', color: 'red' },
    { label: 'Other', color: 'gray' },
  ]}});
  await add(maintenance.id, { name: 'Priority', type: 'select', config: { options: [
    { label: 'Emergency', color: 'red' },
    { label: 'High', color: 'orange' },
    { label: 'Normal', color: 'blue' },
    { label: 'Low', color: 'green' },
  ]}});
  await add(maintenance.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Open', color: 'red' },
    { label: 'Vendor Assigned', color: 'yellow' },
    { label: 'In Progress', color: 'blue' },
    { label: 'Completed', color: 'green' },
  ]}});
  await add(maintenance.id, { name: 'Vendor', type: 'text' });
  await add(maintenance.id, { name: 'Cost', type: 'number' });
  await add(maintenance.id, { name: 'Completed Date', type: 'date' });
  console.log('  ✓ Maintenance Requests');

  // Leases
  await resetTable(leases.id, 'Tenant Name', 'Lease Start', false);
  await add(leases.id, { name: 'Unit', type: 'text' });
  await add(leases.id, { name: 'Lease End', type: 'date' });
  await add(leases.id, { name: 'Monthly Rent', type: 'number' });
  await add(leases.id, { name: 'Status', type: 'select', config: { options: [
    { label: 'Active', color: 'green' },
    { label: 'Month-to-Month', color: 'blue' },
    { label: 'Expiring Soon', color: 'yellow' },
    { label: 'Expired', color: 'red' },
    { label: 'Renewed', color: 'purple' },
  ]}});
  await add(leases.id, { name: 'Renewal Offered', type: 'checkbox' });
  await add(leases.id, { name: 'New Rent Amount', type: 'number' });
  console.log('  ✓ Leases');

  // Finances
  await resetTable(finances.id, 'Description', 'Date', false);
  await add(finances.id, { name: 'Property', type: 'text' });
  await add(finances.id, { name: 'Type', type: 'select', config: { options: [
    { label: 'Rent Received', color: 'green' },
    { label: 'Maintenance', color: 'red' },
    { label: 'Insurance', color: 'orange' },
    { label: 'Tax', color: 'purple' },
    { label: 'Mortgage', color: 'blue' },
    { label: 'Other Expense', color: 'gray' },
  ]}});
  await add(finances.id, { name: 'Amount', type: 'number' });
  await add(finances.id, { name: 'Month', type: 'text' });
  console.log('  ✓ Finances');
  console.log('  RENTAL PROPERTY OPERATIONS DONE ✓');
}

async function main() {
  console.log('\nBuilding 4 new systems on Lerty...');
  await buildDentalPractice();
  await buildMedSpa();
  await buildLawFirm();
  await buildRentalProperty();
  console.log('\n\nALL 4 SYSTEMS BUILT SUCCESSFULLY!');
  console.log('Go to lerty.ai → Databases to see all of them.\n');
  console.log('You now have 5 sellable systems:');
  console.log('  1. Real Estate Pipeline — $500/mo');
  console.log('  2. Dental Practice Manager — $500/mo');
  console.log('  3. Med Spa Client Manager — $750/mo');
  console.log('  4. Law Firm Client Intake — $1,000/mo');
  console.log('  5. Rental Property Operations — $1,000/mo');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });

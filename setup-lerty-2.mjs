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

const rename = (id, name) => api('PATCH', `/fields/${id}`, { name });
const del = (id) => api('DELETE', `/fields/${id}`);
const add = (tableId, field) => api('POST', `/tables/${tableId}/fields`, field);

async function main() {
  console.log('\nFinishing Real Estate Pipeline setup...\n');

  // ── LEADS (tb_F6whxiFHEgc) ─────────────────────────────────────
  // Name ✓  Next Follow Up ✓  Boolean → delete  Status already gone
  console.log('Leads...');
  await del('fd_tTl1hFjf1Aw');
  await add('tb_F6whxiFHEgc', { name: 'Phone', type: 'text' });
  await add('tb_F6whxiFHEgc', { name: 'Email', type: 'text' });
  await add('tb_F6whxiFHEgc', { name: 'Status', type: 'select', config: { options: [
    { label: 'New', color: 'blue' },
    { label: 'Contacted', color: 'yellow' },
    { label: 'Qualified', color: 'orange' },
    { label: 'Meeting Set', color: 'purple' },
    { label: 'Not Interested', color: 'gray' },
  ]}});
  await add('tb_F6whxiFHEgc', { name: 'Source', type: 'select', config: { options: [
    { label: 'Cold Call', color: 'blue' },
    { label: 'Referral', color: 'green' },
    { label: 'Website', color: 'purple' },
    { label: 'Open House', color: 'orange' },
    { label: 'Social Media', color: 'pink' },
  ]}});
  await add('tb_F6whxiFHEgc', { name: 'Lead Type', type: 'select', config: { options: [
    { label: 'Buyer', color: 'blue' },
    { label: 'Seller', color: 'green' },
    { label: 'Both', color: 'purple' },
  ]}});
  await add('tb_F6whxiFHEgc', { name: 'Budget', type: 'number' });
  await add('tb_F6whxiFHEgc', { name: 'Property Interest', type: 'text' });
  await add('tb_F6whxiFHEgc', { name: 'Notes', type: 'text' });
  console.log('  ✓ Leads done');

  // ── DEALS (tb_Rv2DorlSRGo) ────────────────────────────────────
  console.log('Deals...');
  await rename('fd_UJOqxFqpSuw', 'Property Address');
  await rename('fd_mocub46AzcI', 'Closing Date');
  await rename('fd_kKOvzENqGMA', 'Urgent');
  await del('fd_93ZcPnbORRM');
  await add('tb_Rv2DorlSRGo', { name: 'Stage', type: 'select', config: { options: [
    { label: 'New Lead', color: 'gray' },
    { label: 'Active', color: 'blue' },
    { label: 'Under Contract', color: 'yellow' },
    { label: 'Inspection', color: 'orange' },
    { label: 'Appraisal', color: 'purple' },
    { label: 'Clear to Close', color: 'green' },
    { label: 'Closed', color: 'green' },
    { label: 'Fallen Through', color: 'red' },
  ]}});
  await add('tb_Rv2DorlSRGo', { name: 'Deal Type', type: 'select', config: { options: [
    { label: 'Buy Side', color: 'blue' },
    { label: 'Sell Side', color: 'green' },
    { label: 'Dual Agency', color: 'purple' },
  ]}});
  await add('tb_Rv2DorlSRGo', { name: 'Sale Price', type: 'number' });
  await add('tb_Rv2DorlSRGo', { name: 'Commission %', type: 'number' });
  await add('tb_Rv2DorlSRGo', { name: 'Commission $', type: 'number' });
  await add('tb_Rv2DorlSRGo', { name: 'Notes', type: 'text' });
  console.log('  ✓ Deals done');

  // ── CLIENTS (tb_lNc4GYN_5no) ──────────────────────────────────
  console.log('Clients...');
  await rename('fd_T4kwqZ-DUs8', 'Name');
  await rename('fd_jEtQXhVcsHM', 'Last Transaction Date');
  await del('fd_mtoJ7FTWW18');
  await del('fd_7BI79fEtdRs');
  await add('tb_lNc4GYN_5no', { name: 'Phone', type: 'text' });
  await add('tb_lNc4GYN_5no', { name: 'Email', type: 'text' });
  await add('tb_lNc4GYN_5no', { name: 'Client Type', type: 'select', config: { options: [
    { label: 'Buyer', color: 'blue' },
    { label: 'Seller', color: 'green' },
    { label: 'Both', color: 'purple' },
  ]}});
  await add('tb_lNc4GYN_5no', { name: 'Status', type: 'select', config: { options: [
    { label: 'Active', color: 'green' },
    { label: 'Past Client', color: 'gray' },
    { label: 'Referral Source', color: 'purple' },
  ]}});
  await add('tb_lNc4GYN_5no', { name: 'Total Commission Earned', type: 'number' });
  await add('tb_lNc4GYN_5no', { name: 'Referral Source', type: 'text' });
  await add('tb_lNc4GYN_5no', { name: 'Notes', type: 'text' });
  console.log('  ✓ Clients done');

  // ── COMMISSIONS (tb_TAwfqP0gQow) ──────────────────────────────
  console.log('Commissions...');
  await rename('fd_MtJbG80QDTs', 'Property');
  await rename('fd_Du91Av26fk8', 'Closing Date');
  await del('fd__E8DzihnuWQ');
  await del('fd_Eb3jpKLO3F4');
  await add('tb_TAwfqP0gQow', { name: 'Payment Status', type: 'select', config: { options: [
    { label: 'Projected', color: 'gray' },
    { label: 'Pending', color: 'yellow' },
    { label: 'Received', color: 'green' },
  ]}});
  await add('tb_TAwfqP0gQow', { name: 'Sale Price', type: 'number' });
  await add('tb_TAwfqP0gQow', { name: 'Commission %', type: 'number' });
  await add('tb_TAwfqP0gQow', { name: 'Gross Commission', type: 'number' });
  await add('tb_TAwfqP0gQow', { name: 'Split %', type: 'number' });
  await add('tb_TAwfqP0gQow', { name: 'Net Commission', type: 'number' });
  await add('tb_TAwfqP0gQow', { name: 'Month', type: 'text' });
  console.log('  ✓ Commissions done');

  // ── TASKS (tb_P6RqmuGl8fQ) ────────────────────────────────────
  console.log('Tasks...');
  await rename('fd_5NbwyhKGYRk', 'Task');
  await rename('fd_ayEEursvE38', 'Due Date');
  await del('fd_ZQooTDH48GE');
  await add('tb_P6RqmuGl8fQ', { name: 'Priority', type: 'select', config: { options: [
    { label: 'High', color: 'red' },
    { label: 'Medium', color: 'yellow' },
    { label: 'Low', color: 'green' },
  ]}});
  await add('tb_P6RqmuGl8fQ', { name: 'Task Type', type: 'select', config: { options: [
    { label: 'Follow Up', color: 'blue' },
    { label: 'Call', color: 'green' },
    { label: 'Email', color: 'purple' },
    { label: 'Meeting', color: 'orange' },
    { label: 'Document', color: 'gray' },
  ]}});
  await add('tb_P6RqmuGl8fQ', { name: 'Related To', type: 'text' });
  console.log('  ✓ Tasks done');

  console.log('\nDONE! Real Estate Pipeline is fully built on Lerty.');
  console.log('Go to lerty.ai → Databases → Real Estate Pipeline\n');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });

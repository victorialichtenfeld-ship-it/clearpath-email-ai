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

async function getFields(tableId) {
  const t = await api('GET', `/tables/${tableId}`);
  return t.fields || [];
}

async function renameField(fieldId, name) {
  return api('PATCH', `/fields/${fieldId}`, { name });
}

async function deleteField(fieldId) {
  return api('DELETE', `/fields/${fieldId}`);
}

async function addField(tableId, field) {
  return api('POST', `/tables/${tableId}/fields`, field);
}

async function setupLeads(tableId) {
  const fields = await getFields(tableId);
  const get = (name) => fields.find(f => f.name === name);

  await renameField(get('Entry').id, 'Name');
  await renameField(get('Date').id, 'Next Follow Up');
  await deleteField(get('Status').id);
  await deleteField(get('Boolean').id);

  await addField(tableId, { name: 'Phone', type: 'text' });
  await addField(tableId, { name: 'Email', type: 'text' });
  await addField(tableId, { name: 'Status', type: 'select', config: { options: [
    { label: 'New', color: 'blue' },
    { label: 'Contacted', color: 'yellow' },
    { label: 'Qualified', color: 'orange' },
    { label: 'Meeting Set', color: 'purple' },
    { label: 'Not Interested', color: 'gray' },
  ]}});
  await addField(tableId, { name: 'Source', type: 'select', config: { options: [
    { label: 'Cold Call', color: 'blue' },
    { label: 'Referral', color: 'green' },
    { label: 'Website', color: 'purple' },
    { label: 'Open House', color: 'orange' },
    { label: 'Social Media', color: 'pink' },
  ]}});
  await addField(tableId, { name: 'Lead Type', type: 'select', config: { options: [
    { label: 'Buyer', color: 'blue' },
    { label: 'Seller', color: 'green' },
    { label: 'Both', color: 'purple' },
  ]}});
  await addField(tableId, { name: 'Budget', type: 'number' });
  await addField(tableId, { name: 'Property Interest', type: 'text' });
  await addField(tableId, { name: 'Notes', type: 'text' });
  console.log('  ✓ Leads');
}

async function setupDeals(tableId) {
  const fields = await getFields(tableId);
  const get = (name) => fields.find(f => f.name === name);

  await renameField(get('Entry').id, 'Property Address');
  await renameField(get('Date').id, 'Closing Date');
  await renameField(get('Boolean').id, 'Urgent');
  await deleteField(get('Status').id);

  await addField(tableId, { name: 'Stage', type: 'select', config: { options: [
    { label: 'New Lead', color: 'gray' },
    { label: 'Active', color: 'blue' },
    { label: 'Under Contract', color: 'yellow' },
    { label: 'Inspection', color: 'orange' },
    { label: 'Appraisal', color: 'purple' },
    { label: 'Clear to Close', color: 'green' },
    { label: 'Closed', color: 'green' },
    { label: 'Fallen Through', color: 'red' },
  ]}});
  await addField(tableId, { name: 'Deal Type', type: 'select', config: { options: [
    { label: 'Buy Side', color: 'blue' },
    { label: 'Sell Side', color: 'green' },
    { label: 'Dual Agency', color: 'purple' },
  ]}});
  await addField(tableId, { name: 'Sale Price', type: 'number' });
  await addField(tableId, { name: 'Commission %', type: 'number' });
  await addField(tableId, { name: 'Commission $', type: 'number' });
  await addField(tableId, { name: 'Notes', type: 'text' });
  console.log('  ✓ Deals');
}

async function setupClients(tableId) {
  const fields = await getFields(tableId);
  const get = (name) => fields.find(f => f.name === name);

  await renameField(get('Entry').id, 'Name');
  await renameField(get('Date').id, 'Last Transaction Date');
  await deleteField(get('Status').id);
  await deleteField(get('Boolean').id);

  await addField(tableId, { name: 'Phone', type: 'text' });
  await addField(tableId, { name: 'Email', type: 'text' });
  await addField(tableId, { name: 'Client Type', type: 'select', config: { options: [
    { label: 'Buyer', color: 'blue' },
    { label: 'Seller', color: 'green' },
    { label: 'Both', color: 'purple' },
  ]}});
  await addField(tableId, { name: 'Status', type: 'select', config: { options: [
    { label: 'Active', color: 'green' },
    { label: 'Past Client', color: 'gray' },
    { label: 'Referral Source', color: 'purple' },
  ]}});
  await addField(tableId, { name: 'Total Commission Earned', type: 'number' });
  await addField(tableId, { name: 'Referral Source', type: 'text' });
  await addField(tableId, { name: 'Notes', type: 'text' });
  console.log('  ✓ Clients');
}

async function setupCommissions(tableId) {
  const fields = await getFields(tableId);
  const get = (name) => fields.find(f => f.name === name);

  await renameField(get('Entry').id, 'Property');
  await renameField(get('Date').id, 'Closing Date');
  await deleteField(get('Status').id);
  await deleteField(get('Boolean').id);

  await addField(tableId, { name: 'Payment Status', type: 'select', config: { options: [
    { label: 'Projected', color: 'gray' },
    { label: 'Pending', color: 'yellow' },
    { label: 'Received', color: 'green' },
  ]}});
  await addField(tableId, { name: 'Sale Price', type: 'number' });
  await addField(tableId, { name: 'Commission %', type: 'number' });
  await addField(tableId, { name: 'Gross Commission', type: 'number' });
  await addField(tableId, { name: 'Split %', type: 'number' });
  await addField(tableId, { name: 'Net Commission', type: 'number' });
  await addField(tableId, { name: 'Month', type: 'text' });
  console.log('  ✓ Commissions');
}

async function setupTasks(tableId) {
  const fields = await getFields(tableId);
  const get = (name) => fields.find(f => f.name === name);

  await renameField(get('Entry').id, 'Task');
  await renameField(get('Date').id, 'Due Date');
  await deleteField(get('Boolean').id);

  await addField(tableId, { name: 'Priority', type: 'select', config: { options: [
    { label: 'High', color: 'red' },
    { label: 'Medium', color: 'yellow' },
    { label: 'Low', color: 'green' },
  ]}});
  await addField(tableId, { name: 'Task Type', type: 'select', config: { options: [
    { label: 'Follow Up', color: 'blue' },
    { label: 'Call', color: 'green' },
    { label: 'Email', color: 'purple' },
    { label: 'Meeting', color: 'orange' },
    { label: 'Document', color: 'gray' },
  ]}});
  await addField(tableId, { name: 'Related To', type: 'text' });
  console.log('  ✓ Tasks');
}

async function main() {
  console.log('\nBuilding Real Estate Pipeline on Lerty...\n');

  const dbId = 'db_68csXyIl5Fs';
  console.log('Using existing database:', dbId);
  const db = { id: dbId };

  const leads      = { id: 'tb_F6whxiFHEgc' };
  const deals      = { id: 'tb_Rv2DorlSRGo' };
  const clients    = { id: 'tb_lNc4GYN_5no' };
  const commissions = { id: 'tb_TAwfqP0gQow' };
  const tasks      = { id: 'tb_P6RqmuGl8fQ' };
  console.log('Using existing tables.');

  console.log('Setting up fields...');
  await setupLeads(leads.id);
  await setupDeals(deals.id);
  await setupClients(clients.id);
  await setupCommissions(commissions.id);
  await setupTasks(tasks.id);

  console.log('\nDONE! Your Real Estate Pipeline is live on Lerty.');
  console.log('Go to lerty.ai and click Databases to see it.\n');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });

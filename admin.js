const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadOrders() {
  const { data } = await supabase
    .from('orders')
    .select('id,status,total,created_at')
    .order('created_at', { ascending: false });

  const rows = document.getElementById('rows');
  rows.innerHTML = '';

  data.forEach(o => {
    rows.innerHTML += `
      <tr class="border-t">
        <td class="p-2 font-mono">${o.id}</td>
        <td class="p-2">${o.status}</td>
        <td class="p-2">${o.total}</td>
        <td class="p-2">${new Date(o.created_at).toLocaleString()}</td>
      </tr>`;
  });
}

document.getElementById('exportBtn').onclick = async () => {
  const { data } = await supabase.from('orders').select('*');
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(o => Object.values(o).join(','))
  ].join('\n');

  const blob = new Blob([csv]);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'orders.csv';
  a.click();
};

loadOrders();

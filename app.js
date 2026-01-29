const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const el = id => document.getElementById(id);

function recalc() {
  const qty = Number(el('qty').value || 0);
  const subtotal = qty * PRICE;
  el('subtotal').innerText = subtotal;
  el('total').innerText = subtotal + SHIPPING_FEE;
}
el('qty').oninput = recalc;

el('buyBtn').onclick = async () => {
  const color = el('color').value;
  const size  = el('size').value;
  const qty   = Number(el('qty').value);

  if (!color || !size) {
    alert('กรุณาเลือกสีและไซส์');
    return;
  }

  const product_id = PRODUCT_MAP[color][size];

  el('buyBtn').disabled = true;
  el('msg').innerText = 'กำลังจอง...';

  const { data, error } = await supabase.rpc(
    'create_order_and_reserve',
    {
      p_customer_id: crypto.randomUUID(),
      p_address_id: crypto.randomUUID(),
      p_items: [{ product_id, qty }],
      p_shipping_fee: SHIPPING_FEE
    }
  );

  if (error) {
    el('msg').innerText = '❌ ของหมดหรือจำนวนเกิน';
    el('buyBtn').disabled = false;
  } else {
    window.location = `success.html?order=${data}`;
  }
};

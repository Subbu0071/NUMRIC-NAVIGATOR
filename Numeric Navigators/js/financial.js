// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// EMI Calculation
function calculateEMI() {
  const p = parseFloat(document.getElementById('emi-amount').value);
  const r = parseFloat(document.getElementById('emi-rate').value) / 12 / 100;
  const n = parseFloat(document.getElementById('emi-months').value);
  if (isNaN(p) || isNaN(r) || isNaN(n) || n <= 0) {
    document.getElementById('emi-result').textContent = 'Invalid';
    return;
  }
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  document.getElementById('emi-result').textContent = emi.toFixed(2);
}

// Simple Interest
function calculateSI() {
  const p = parseFloat(document.getElementById('si-principal').value);
  const r = parseFloat(document.getElementById('si-rate').value);
  const t = parseFloat(document.getElementById('si-time').value);
  if (isNaN(p) || isNaN(r) || isNaN(t)) return;
  const si = (p * r * t) / 100;
  document.getElementById('si-result').textContent = si.toFixed(2);
}

// Compound Interest
function calculateCI() {
  const p = parseFloat(document.getElementById('ci-principal').value);
  const r = parseFloat(document.getElementById('ci-rate').value) / 100;
  const t = parseFloat(document.getElementById('ci-time').value);
  const n = parseInt(document.getElementById('ci-frequency').value);
  if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) return;
  const amount = p * Math.pow((1 + r / n), n * t);
  const ci = amount - p;
  document.getElementById('ci-result').textContent = ci.toFixed(2);
}

// GST
function calculateGST() {
  const amount = parseFloat(document.getElementById('gst-amount').value);
  const rate = parseFloat(document.getElementById('gst-rate').value);
  if (isNaN(amount) || isNaN(rate)) return;
  const gst = (amount * rate) / 100;
  const total = amount + gst;
  document.getElementById('gst-result').textContent = gst.toFixed(2);
  document.getElementById('gst-total').textContent = total.toFixed(2);
}

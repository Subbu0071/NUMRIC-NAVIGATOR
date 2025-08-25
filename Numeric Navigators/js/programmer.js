(() => {
  const dec = document.getElementById('dec');
  const bin = document.getElementById('bin');
  const oct = document.getElementById('oct');
  const hex = document.getElementById('hex');

  const inputs = { dec, bin, oct, hex };

  // Convert and update all fields based on decimal value
  function updateFromDecimal(value) {
    if (isNaN(value)) return;
    inputs.dec.value = value;
    inputs.bin.value = parseInt(value).toString(2);
    inputs.oct.value = parseInt(value).toString(8);
    inputs.hex.value = parseInt(value).toString(16).toUpperCase();
  }

  // Event listeners for each input
  dec.addEventListener('input', () => updateFromDecimal(parseInt(dec.value || 0)));
  bin.addEventListener('input', () => updateFromDecimal(parseInt(bin.value || 0, 2)));
  oct.addEventListener('input', () => updateFromDecimal(parseInt(oct.value || 0, 8)));
  hex.addEventListener('input', () => updateFromDecimal(parseInt(hex.value || 0, 16)));

  // Bitwise operations
  const bitResult = document.getElementById('bit-result');
  document.querySelectorAll('.bitwise-grid .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const op = btn.dataset.op;
      const a = parseInt(document.getElementById('bit-input1').value || 0);
      const b = parseInt(document.getElementById('bit-input2').value || 0);
      let result;

      switch (op) {
        case 'AND': result = a & b; break;
        case 'OR': result = a | b; break;
        case 'XOR': result = a ^ b; break;
        case 'NOT': result = ~a; break;
        case 'LSHIFT': result = a << b; break;
        case 'RSHIFT': result = a >> b; break;
      }
      bitResult.textContent = result;
    });
  });
})();

const display = document.getElementById('display');
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    if (val === 'C') display.value = '';
    else if (val === 'back') display.value = display.value.slice(0, -1);
    else if (val === '=') {
      try { display.value = eval(display.value); }
      catch { display.value = 'Error'; }
    }
    else display.value += val;
  });
});



(() => {
  const display = document.getElementById('display');

  // Handle button clicks
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => handleInput(btn.dataset.value));
  });

  function handleInput(val) {
    if (val === 'C') display.value = '';
    else if (val === '⌫') display.value = display.value.slice(0, -1);
    else if (val === '=') {
      try { display.value = eval(display.value); }
      catch { display.value = 'Error'; }
    } else {
      display.value += val;
    }
  }

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
      display.value += e.key;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      try { display.value = eval(display.value); }
      catch { display.value = 'Error'; }
    } else if (e.key === 'Backspace') {
      display.value = display.value.slice(0, -1);
    } else if (e.key === 'Escape') {
      display.value = '';
    }
  });
})();

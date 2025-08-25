(() => {
  const sciDisplay = document.getElementById('sci-display');

  // Handle button clicks for numbers/operators
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => handleSciInput(btn.dataset.value));
  });

  // Handle scientific function buttons
  document.querySelectorAll('.btn-func').forEach(btn => {
    btn.addEventListener('click', () => applyFunction(btn.dataset.func));
  });

  function handleSciInput(val) {
    if (val === 'C') sciDisplay.value = '';
    else if (val === '⌫') sciDisplay.value = sciDisplay.value.slice(0, -1);
    else if (val === '=') {
      try { sciDisplay.value = eval(sciDisplay.value); }
      catch { sciDisplay.value = 'Error'; }
    } else {
      sciDisplay.value += val;
    }
  }

  function applyFunction(func) {
    const x = parseFloat(sciDisplay.value);
    if (!isNaN(x)) {
      let result;
      switch (func) {
        case 'sin': result = Math.sin(x * Math.PI / 180); break;
        case 'cos': result = Math.cos(x * Math.PI / 180); break;
        case 'tan': result = Math.tan(x * Math.PI / 180); break;
        case 'log': result = Math.log10(x); break;
        case 'ln': result = Math.log(x); break;
        case 'sqrt': result = Math.sqrt(x); break;
      }
      sciDisplay.value = result;
    }
  }

  // ✅ Keyboard support
  document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
      sciDisplay.value += e.key;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      try { sciDisplay.value = eval(sciDisplay.value); }
      catch { sciDisplay.value = 'Error'; }
    } else if (e.key === 'Backspace') {
      sciDisplay.value = sciDisplay.value.slice(0, -1);
    } else if (e.key === 'Escape') {
      sciDisplay.value = '';
    }

    // ✅ Scientific function shortcuts
    else if (e.key === 's') applyFunction('sin');
    else if (e.key === 'c') applyFunction('cos');
    else if (e.key === 't') applyFunction('tan');
    else if (e.key === 'l') applyFunction('log');
    else if (e.key === 'n') applyFunction('ln');
    else if (e.key === 'r') applyFunction('sqrt');
  });
})();

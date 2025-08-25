(() => {
  // DOM
  const categorySel = document.getElementById('category');
  const fromVal = document.getElementById('from-value');
  const toVal = document.getElementById('to-value');
  const fromUnit = document.getElementById('from-unit');
  const toUnit = document.getElementById('to-unit');
  const swapBtn = document.getElementById('swap');
  const copyBtn = document.getElementById('copy-result');
  const clearBtn = document.getElementById('clear-input');
  const precisionInput = document.getElementById('precision');
  const quickGrid = document.getElementById('quick-grid');

  // Categories & units (multiplicative factors to base) -----------------------
  // Base units:
  // length: meter; weight: kilogram; speed: m/s; area: m^2; volume: liter; time: second;
  // energy: joule; digital: byte (careful: we also allow bits); temperature is special.
  const UNITS = {
    length: {
      base: 'm',
      units: {
        km: 1000,
        m: 1,
        cm: 0.01,
        mm: 0.001,
        inch: 0.0254,
        ft: 0.3048,
        yard: 0.9144,
        mile: 1609.344
      },
      quick: [['m','cm'],['km','m'],['inch','cm'],['ft','m'],['mile','km'],['yard','m']]
    },
    weight: {
      base: 'kg',
      units: {
        t: 1000,
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.45359237,
        oz: 0.028349523125
      },
      quick: [['kg','g'],['lb','kg'],['oz','g'],['t','kg'],['kg','lb'],['g','oz']]
    },
    speed: {
      base: 'm/s',
      units: {
        'm/s': 1,
        'km/h': 1000/3600,
        mph: 1609.344/3600,
        knot: 1852/3600
      },
      quick: [['m/s','km/h'],['mph','km/h'],['knot','m/s']]
    },
    area: {
      base: 'm²',
      units: {
        'm²': 1,
        'cm²': 0.0001,
        'mm²': 0.000001,
        'km²': 1_000_000,
        acre: 4046.8564224,
        hectare: 10000
      },
      quick: [['m²','cm²'],['km²','m²'],['acre','m²'],['hectare','m²']]
    },
    volume: {
      base: 'L',
      units: {
        m: 1000,
        L: 1,
        mL: 0.001,
        gallon: 3.785411784,   // US gallon
        quart: 0.946352946,    // US quart
        pint: 0.473176473,     // US pint
        cup: 0.2365882365      // US cup
      },
      quick: [['L','mL'],['m³','L'],['gallon','L'],['cup','mL']]
    },
    time: {
      base: 's',
      units: {
        day: 86400,
        hr: 3600,
        min: 60,
        s: 1,
        ms: 0.001
      },
      quick: [['hr','min'],['min','s'],['day','hr'],['s','ms']]
    },
    energy: {
      base: 'J',
      units: {
        kWh: 3_600_000,
        MJ: 1_000_000,
        kJ: 1_000,
        J: 1,
        cal: 4.184,        // small calorie
        kcal: 4184
      },
      quick: [['kWh','MJ'],['kJ','J'],['kcal','kJ'],['cal','J']]
    },
    digital: {
      base: 'byte',
      units: {
        bit: 1/8,
        byte: 1,
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
        TB: 1024 ** 4
      },
      quick: [['KB','MB'],['MB','GB'],['GB','TB'],['bit','byte']]
    },
    // Temperature is non-linear; use special converters
    temperature: {
      base: 'C',
      units: { C: 1, F: 1, K: 1 },
      quick: [['C','F'],['C','K'],['F','C'],['K','C']]
    }
  };

  // Temperature helpers -------------------------------------------------------
  const tempToC = (v, u) => {
    const x = Number(v);
    if (Number.isNaN(x)) return NaN;
    if (u === 'C') return x;
    if (u === 'F') return (x - 32) * (5/9);
    if (u === 'K') return x - 273.15;
    return NaN;
  };
  const cToTemp = (c, u) => {
    if (u === 'C') return c;
    if (u === 'F') return c * 9/5 + 32;
    if (u === 'K') return c + 273.15;
    return NaN;
  };

  // Populate unit selects based on category -----------------------------------
  function populateUnits(cat) {
    const cfg = UNITS[cat];
    const unitKeys = Object.keys(cfg.units);
    fromUnit.innerHTML = unitKeys.map(u => `<option value="${u}">${u}</option>`).join('');
    toUnit.innerHTML   = unitKeys.map(u => `<option value="${u}">${u}</option>`).join('');

    // Sensible defaults
    if (cat === 'length') { fromUnit.value = 'm'; toUnit.value = 'cm'; }
    else if (cat === 'weight') { fromUnit.value = 'kg'; toUnit.value = 'g'; }
    else if (cat === 'temperature') { fromUnit.value = 'C'; toUnit.value = 'F'; }
    else if (cat === 'digital') { fromUnit.value = 'MB'; toUnit.value = 'GB'; }
    else { fromUnit.value = unitKeys[0]; toUnit.value = unitKeys[1] || unitKeys[0]; }

    buildQuickGrid(cat);
    compute();
  }

  // Build quick-pair buttons ---------------------------------------------------
  function buildQuickGrid(cat) {
    const cfg = UNITS[cat];
    quickGrid.innerHTML = '';
    (cfg.quick || []).forEach(([a,b]) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = `${a} → ${b}`;
      btn.addEventListener('click', () => {
        fromUnit.value = a;
        toUnit.value = b;
        compute();
      });
      quickGrid.appendChild(btn);
    });
  }

  // Core compute ---------------------------------------------------------------
  function compute() {
    const cat = categorySel.value;
    const prec = clampPrecision();
    const raw = fromVal.value.trim();

    if (raw === '' || raw === '.' || raw === '-' || raw === '-.') {
      toVal.value = '';
      return;
    }

    const cfg = UNITS[cat];

    // Temperature (special)
    if (cat === 'temperature') {
      const c = tempToC(raw, fromUnit.value);
      const out = cToTemp(c, toUnit.value);
      toVal.value = formatNum(out, prec);
      return;
    }

    // Multiplicative categories
    const a = Number(raw);
    if (Number.isNaN(a)) { toVal.value = 'Error'; return; }

    const fBase = cfg.units[fromUnit.value];   // factor to base
    const tBase = cfg.units[toUnit.value];
    const baseVal = a * fBase;                 // to base
    const result = baseVal / tBase;            // from base
    toVal.value = formatNum(result, prec);
  }

  // Helpers --------------------------------------------------------------------
  function clampPrecision() {
    let p = parseInt(precisionInput.value || '6', 10);
    if (Number.isNaN(p)) p = 6;
    return Math.max(0, Math.min(12, p));
  }
  function formatNum(n, prec) {
    if (!Number.isFinite(n)) return 'Error';
    // keep integers clean, others to fixed then trim
    if (Math.abs(n - Math.round(n)) < 1e-12) return String(Math.round(n));
    const s = n.toFixed(prec);
    return s.replace(/\.?0+$/, ''); // trim trailing zeros
  }

  // Events ---------------------------------------------------------------------
  fromVal.addEventListener('input', compute);
  fromUnit.addEventListener('change', compute);
  toUnit.addEventListener('change', compute);
  precisionInput.addEventListener('input', compute);

  swapBtn.addEventListener('click', () => {
    const u1 = fromUnit.value, u2 = toUnit.value;
    toUnit.value = u1; fromUnit.value = u2;
    // also move result back into input to chain conversions
    if (toVal.value !== '' && toVal.value !== 'Error') {
      fromVal.value = toVal.value;
    }
    compute();
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(toVal.value || '');
      flashHint('Copied result ✅');
    } catch {
      flashHint('Copy failed ❌');
    }
  });

  clearBtn.addEventListener('click', () => {
    fromVal.value = '';
    toVal.value = '';
    fromVal.focus();
  });

  // Keyboard niceties: Enter = compute, Ctrl/Cmd+C on result to copy
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') compute();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && document.activeElement === toVal) {
      navigator.clipboard.writeText(toVal.value || '');
    }
  });

  // UI feedback
  const hint = document.getElementById('conv-hint');
  let hintTimer;
  function flashHint(msg) {
    if (!hint) return;
    hint.textContent = msg;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => (hint.textContent = 'Tip: type a number and pick units. Use Tab to jump.'), 1500);
  }

  // Init
  populateUnits(categorySel.value);
  categorySel.addEventListener('change', () => populateUnits(categorySel.value));
})();




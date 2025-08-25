(() => {
  const modeSelect = document.getElementById('mode');
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const daysInput = document.getElementById('days');
  const groupEnd = document.getElementById('group-end');
  const groupDays = document.getElementById('group-days');
  const resultBox = document.getElementById('date-result');

  const btnToday = document.getElementById('btn-today');
  const btnClear = document.getElementById('btn-clear');
  const btnCalc = document.getElementById('btn-calc');

  // Mode switch logic
  modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'diff') {
      groupEnd.classList.remove('hidden');
      groupDays.classList.add('hidden');
    } else {
      groupEnd.classList.add('hidden');
      groupDays.classList.remove('hidden');
    }
    resultBox.value = '';
  });

  // Today button
  btnToday.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    startDate.value = today;
    if (modeSelect.value === 'diff') endDate.value = today;
  });

  // Clear button
  btnClear.addEventListener('click', () => {
    startDate.value = '';
    endDate.value = '';
    daysInput.value = '';
    resultBox.value = '';
  });

  // Calculate
  btnCalc.addEventListener('click', () => {
    const mode = modeSelect.value;
    const sDate = startDate.value ? new Date(startDate.value) : null;
    const eDate = endDate.value ? new Date(endDate.value) : null;
    const days = parseInt(daysInput.value, 10);

    if (mode === 'diff') {
      if (!sDate || !eDate) {
        resultBox.value = 'Please select both dates.';
        return;
      }
      const diffMs = Math.abs(eDate - sDate);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffWeeks = (diffDays / 7).toFixed(2);
      const diffMonths = (diffDays / 30.44).toFixed(2);
      const diffYears = (diffDays / 365.25).toFixed(2);
      resultBox.value = `Difference:\n${diffDays} days\n${diffWeeks} weeks\n${diffMonths} months\n${diffYears} years`;
    }

    else if (mode === 'add') {
      if (!sDate || isNaN(days)) {
        resultBox.value = 'Please select a date and enter days.';
        return;
      }
      sDate.setDate(sDate.getDate() + days);
      resultBox.value = `New Date: ${sDate.toDateString()}`;
    }

    else if (mode === 'sub') {
      if (!sDate || isNaN(days)) {
        resultBox.value = 'Please select a date and enter days.';
        return;
      }
      sDate.setDate(sDate.getDate() - days);
      resultBox.value = `New Date: ${sDate.toDateString()}`;
    }
  });
})();

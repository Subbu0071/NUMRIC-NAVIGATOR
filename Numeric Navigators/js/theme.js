const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') body.classList.add('dark-theme');

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});

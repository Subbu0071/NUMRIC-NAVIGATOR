// Switch between modes
const navButtons = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.mode-section');

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const mode = button.getAttribute('data-mode');
    sections.forEach(section => {
      section.classList.remove('active');
      if (section.id === mode) {
        section.classList.add('active');
      }
    });
  });
});

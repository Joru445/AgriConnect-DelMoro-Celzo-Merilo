const buttons = document.querySelectorAll('.navigation button');
const pages = document.querySelectorAll('.page');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
    const targetPage = document.getElementById(btn.dataset.target);
    if (targetPage) {targetPage.classList.add('active');
    }
  })
})

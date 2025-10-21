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

// LOGIN REDIRECT CODE
const loginButtons = document.querySelectorAll('button[data-link]');

loginButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const link = btn.dataset.link;
    if (link) {
      window.location.href = link; // redirect to login page
    }
  });
});

const categoryButtons = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.getAttribute('data-category');

    productCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

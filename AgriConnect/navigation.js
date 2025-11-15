const buttons = document.querySelectorAll('.navigation button');
const pages = document.querySelectorAll('.page');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
    const targetPage = document.getElementById(btn.dataset.target);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  })
})


document.querySelectorAll('.chevron-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest(".sidebar");
    container.classList.toggle('expanded');

    const icon = btn.querySelector('.chevron');
    icon.classList.toggle('right')
    icon.classList.toggle('left');
  })
});


const toggleDark = document.querySelector('#dark-toggle');

toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


const loginButtons = document.querySelectorAll('button[data-link]');

loginButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const link = btn.dataset.link;
    if (link) {
      window.location.href = link;
    }
  });
});

//PRODUCT'S CATEGORY BUTTONS FOR NAVIGATION
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    const category = btn.getAttribute('data-category');
    filterProducts(category);
  });
});
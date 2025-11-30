// Toggle dropdown menu
function toggleMenu(button) {
  const menu = button.nextElementSibling;

  // Close other menus
  document.querySelectorAll('.dropdown-menu').forEach(m => {
    if (m !== menu) m.classList.remove('active');
  });

  menu.classList.toggle('active');
}

// Close menus on click outside
document.addEventListener('click', e => {
  if (!e.target.closest('.menu-btn') && !e.target.closest('.dropdown-menu')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
  }
});

// Example Edit/Delete functionality
document.querySelectorAll('.dropdown-item.edit').forEach(btn => {
  btn.addEventListener('click', () => alert('Edit clicked!'));
});
document.querySelectorAll('.dropdown-item.delete').forEach(btn => {
  btn.addEventListener('click', () => alert('Delete clicked!'));
});

// Add Product placeholder
document.querySelector('.add-product').addEventListener('click', () => {
  alert('Add Product clicked!');
});

// Example for Edit Profile button
document.querySelector('.edit-btn').addEventListener('click', () => {
  alert('Edit Profile clicked!');
});
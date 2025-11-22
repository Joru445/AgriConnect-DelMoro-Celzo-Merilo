function initSettingsPage() {
  const toggleDark = document.querySelector('#dark-toggle');
  if (toggleDark) {
    toggleDark.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }
}
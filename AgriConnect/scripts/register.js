const params = new URLSearchParams(window.location.search);
const role = params.get("role") || "user";

document.getElementById("RegisterRole").textContent =
  role.charAt(0).toUpperCase() + role.slice(1);
document.getElementById("roleInput").value = role;

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(loginForm);

  try {
    const res = await fetch('backend/register.php', {
      method: 'POST',
      body: formData
    });

    const data = await res.text();
    console.log(data);
    alert(data);
    window.location.href = 'login.html';
  } catch (err) {
    console.error(err);
  }
});

const provinceSelect = document.getElementById('province');
const citySelect = document.getElementById('city');
const barangaySelect = document.getElementById('barangay');

async function loadProvinces() {
  const res = await fetch('https://psgc.cloud/api/v2/provinces');
  const provincesData = await res.json();
  const provinceArray = Object.values(provincesData.data);
  let options = '<option value="">Select Province (optional)</option>';
  provinceArray.forEach(p => {
    options += `<option value="${p.name}">${p.name}</option>`;
    console.log(p.name);
  });

  provinceSelect.innerHTML = options;
}

provinceSelect.addEventListener('change', async () => {
  const prov = provinceSelect.value;

  citySelect.innerHTML = '<option value="">Select City/Municipality (optional)</option>';
  barangaySelect.innerHTML = '<option value="">Select Barangay (optional)</option>';

  if (!prov) return;

  const res = await fetch(`https://psgc.cloud/api/v2/provinces/${encodeURIComponent(prov)}/cities-municipalities`);
  const citiesData = await res.json();
  const citiesArray = Object.values(citiesData.data);

  let options = '<option value="">Select City/Municipality (optional)</option>';
  citiesArray.forEach(c => {
    options += `<option value="${c.name}">${c.name}</option>`;
  });

  citySelect.innerHTML = options;
});

citySelect.addEventListener('change', async () => {
  const city = citySelect.value;

  barangaySelect.innerHTML = '<option value="">Select Barangay (optional)</option>';
  if (!city) return;

  const res = await fetch(`https://psgc.cloud/api/v2/cities-municipalities/${encodeURIComponent(city)}/barangays`);
  const barangaysData = await res.json();
  const barangaysArray = Object.values(barangaysData.data);

  let options = '<option value="">Select Barangay (optional)</option>';
  barangaysArray.forEach(b => {
    options += `<option value="${b.name}">${b.name}</option>`;
  });

  barangaySelect.innerHTML = options;
});

loadProvinces();

fetch('backend/get_products.php')
  .then(response => response.json())
  .then(data => console.log(data))
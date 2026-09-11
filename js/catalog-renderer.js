(function () {
  function getLanguage() {
    return document.documentElement.lang === "ka" ? "ka" : "en";
  }

  function categoryLabel(category, language) {
    return language === "ka" ? category.nameKa : category.nameEn;
  }

  function productName(product, language) {
    return language === "ka" ? product.nameKa || product.nameEn : product.nameEn || product.nameKa;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createProductCard(product, category, language) {
    const card = document.createElement("div");
    card.className = "product-card";

    const image = escapeHtml(product.image || "./photo/141.png");
    const name = escapeHtml(productName(product, language));
    const categoryName = escapeHtml(categoryLabel(category, language));
    const price = escapeHtml(product.price || "");

    card.innerHTML = `
      <div class="product-image">
        <img src="${image}" alt="${name}" />
      </div>
      <div class="product-info">
        <h3>${name}</h3>
        <p class="product-category">${categoryName}</p>
        <div class="product-price">
          <span class="price">${price}</span>
        </div>
      </div>
    `;

    return card;
  }

  async function renderCatalog() {
    if (!window.CatalogStore) return;

    let products = [];
    try {
      products = await window.CatalogStore.fetchProducts();
    } catch (error) {
      if (!window.CatalogStore.hasSavedProducts()) return;
      products = window.CatalogStore.readProducts();
    }

    if (!products.length) return;

    const language = getLanguage();

    window.CatalogStore.categories.forEach((category) => {
      const section = document.getElementById(category.id);
      if (!section) return;

      const grid = section.querySelector(".products-grid");
      if (!grid) return;

      const categoryProducts = products.filter((product) => product.category === category.id);
      if (!categoryProducts.length) return;

      grid.innerHTML = "";
      categoryProducts.forEach((product) => {
        grid.appendChild(createProductCard(product, category, language));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", renderCatalog);
})();

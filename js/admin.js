(function () {
  const state = {
    products: [],
    editingId: null,
    authenticated: false,
  };

  const loginPanel = document.querySelector("[data-login-panel]");
  const adminPanel = document.querySelector("[data-admin-panel]");
  const loginForm = document.querySelector("[data-login-form]");
  const form = document.querySelector("[data-product-form]");
  const list = document.querySelector("[data-products-list]");
  const empty = document.querySelector("[data-empty-state]");
  const categoryInput = document.querySelector("#category");
  const statusText = document.querySelector("[data-status]");
  const saveButton = document.querySelector("[data-save-button]");
  const cancelButton = document.querySelector("[data-cancel-edit]");
  const exportButton = document.querySelector("[data-export]");
  const importInput = document.querySelector("[data-import]");
  const resetButton = document.querySelector("[data-reset]");
  const logoutButton = document.querySelector("[data-logout]");
  const imageUpload = document.querySelector("[data-image-upload]");

  function uid() {
    return `product-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function setStatus(message) {
    statusText.textContent = message;
  }

  function apiUrl(action) {
    return `api/products.php?action=${encodeURIComponent(action)}`;
  }

  async function apiRequest(action, body) {
    const response = await fetch(apiUrl(action), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {}),
    });
    const payload = await response.json().catch(() => ({ ok: false }));

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "Request failed");
    }

    return payload;
  }

  async function uploadImage(file) {
    const data = new FormData();
    data.append("image", file);

    const response = await fetch("api/upload.php", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });
    const payload = await response.json().catch(() => ({ ok: false }));

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "Upload failed");
    }

    return payload.path;
  }

  async function checkStatus() {
    const response = await fetch(apiUrl("status"), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const payload = await response.json();
    state.authenticated = Boolean(payload.authenticated);
  }

  async function loadProducts() {
    const products = await window.CatalogStore.fetchProducts();
    state.products = products.length ? products : window.CatalogStore.defaultProducts;
    renderList();
  }

  function showAuthenticatedView() {
    loginPanel.hidden = true;
    adminPanel.hidden = false;
    logoutButton.hidden = false;
    setStatus("ცვლილებები ინახება სერვერზე");
  }

  function showLoginView() {
    loginPanel.hidden = false;
    adminPanel.hidden = true;
    logoutButton.hidden = true;
    setStatus("Admin-ში შესვლა საჭიროა");
  }

  function categoryName(categoryId) {
    const category = window.CatalogStore.categories.find((item) => item.id === categoryId);
    return category ? category.nameKa : categoryId;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function fillCategories() {
    categoryInput.innerHTML = window.CatalogStore.categories
      .map((category) => `<option value="${category.id}">${category.nameKa}</option>`)
      .join("");
  }

  function readForm() {
    const data = new FormData(form);
    return {
      id: state.editingId || uid(),
      category: data.get("category"),
      nameKa: data.get("nameKa").trim(),
      nameEn: data.get("nameEn").trim(),
      price: data.get("price").trim(),
      image: data.get("image").trim(),
    };
  }

  function writeForm(product) {
    form.elements.category.value = product.category;
    form.elements.nameKa.value = product.nameKa || "";
    form.elements.nameEn.value = product.nameEn || "";
    form.elements.price.value = product.price || "";
    form.elements.image.value = product.image || "";
  }

  function clearForm() {
    state.editingId = null;
    form.reset();
    saveButton.textContent = "პროდუქტის დამატება";
    cancelButton.hidden = true;
  }

  async function saveState(message) {
    const payload = await apiRequest("save", { products: state.products });
    state.products = payload.products;
    window.CatalogStore.saveProducts(state.products);
    renderList();
    setStatus(message);
  }

  function renderList() {
    list.innerHTML = "";
    empty.hidden = state.products.length > 0;

    state.products.forEach((product) => {
      const item = document.createElement("article");
      item.className = "admin-product";
      const name = escapeHtml(product.nameKa || product.nameEn);
      const category = escapeHtml(categoryName(product.category));
      const price = escapeHtml(product.price || "ფასი არ არის მითითებული");
      const image = escapeHtml(product.image || "./photo/141.png");
      const imageLabel = escapeHtml(product.image || "ფოტო არ არის მითითებული");
      const id = escapeHtml(product.id);

      item.innerHTML = `
        <img src="${image}" alt="${name}" />
        <div>
          <h3>${name}</h3>
          <p>${category} · ${price}</p>
          <small>${imageLabel}</small>
        </div>
        <div class="admin-product-actions">
          <button type="button" class="admin-icon-button" data-edit="${id}" aria-label="რედაქტირება">
            <i class="fas fa-pen"></i>
          </button>
          <button type="button" class="admin-icon-button danger" data-delete="${id}" aria-label="წაშლა">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      list.appendChild(item);
    });
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);

    try {
      await apiRequest("login", {
        username: data.get("username"),
        password: data.get("password"),
      });
      state.authenticated = true;
      loginForm.reset();
      showAuthenticatedView();
      await loadProducts();
    } catch (error) {
      setStatus("მომხმარებელი ან პაროლი არასწორია");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const product = readForm();

    if (state.editingId) {
      state.products = state.products.map((item) => (item.id === state.editingId ? product : item));
    } else {
      state.products.unshift(product);
    }

    try {
      await saveState(state.editingId ? "პროდუქტი განახლდა" : "პროდუქტი დაემატა");
      clearForm();
    } catch (error) {
      setStatus("შენახვა ვერ მოხერხდა");
    }
  });

  list.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");

    if (editButton) {
      const product = state.products.find((item) => item.id === editButton.dataset.edit);
      if (!product) return;
      state.editingId = product.id;
      writeForm(product);
      saveButton.textContent = "ცვლილების შენახვა";
      cancelButton.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (deleteButton) {
      const product = state.products.find((item) => item.id === deleteButton.dataset.delete);
      if (!product) return;
      const confirmed = window.confirm(`წავშალო "${product.nameKa || product.nameEn}"?`);
      if (!confirmed) return;
      state.products = state.products.filter((item) => item.id !== product.id);

      try {
        await saveState("პროდუქტი წაიშალა");
        clearForm();
      } catch (error) {
        setStatus("წაშლა ვერ მოხერხდა");
      }
    }
  });

  cancelButton.addEventListener("click", clearForm);

  exportButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("JSON ფაილი ჩამოიტვირთა");
  });

  importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!Array.isArray(imported)) throw new Error("Invalid catalog");
        state.products = imported;
        await saveState("JSON ფაილი ჩაიტვირთა");
        clearForm();
      } catch (error) {
        setStatus("JSON ფაილის წაკითხვა ვერ მოხერხდა");
      }
    });
    reader.readAsText(file);
  });

  imageUpload.addEventListener("change", async () => {
    const file = imageUpload.files[0];
    if (!file) return;

    try {
      setStatus("ფოტო იტვირთება...");
      form.elements.image.value = await uploadImage(file);
      setStatus("ფოტო აიტვირთა");
    } catch (error) {
      setStatus("ფოტოს ატვირთვა ვერ მოხერხდა");
    } finally {
      imageUpload.value = "";
    }
  });

  resetButton.addEventListener("click", async () => {
    const confirmed = window.confirm("წავშალო სერვერზე შენახული პროდუქტები და დავაბრუნო საწყისი სია Admin-ში?");
    if (!confirmed) return;

    try {
      const payload = await apiRequest("reset");
      state.products = payload.products.length ? payload.products : window.CatalogStore.defaultProducts;
      renderList();
      clearForm();
      setStatus("კატალოგი დაბრუნდა საწყის მდგომარეობაში");
    } catch (error) {
      setStatus("Reset ვერ მოხერხდა");
    }
  });

  logoutButton.addEventListener("click", async () => {
    try {
      await apiRequest("logout");
    } finally {
      state.authenticated = false;
      showLoginView();
    }
  });

  async function init() {
    fillCategories();

    try {
      await checkStatus();
      if (state.authenticated) {
        showAuthenticatedView();
        await loadProducts();
      } else {
        showLoginView();
      }
    } catch (error) {
      showLoginView();
      setStatus("API ვერ ჩაიტვირთა. შეამოწმეთ PHP ჰოსტინგი.");
    }
  }

  init();
})();

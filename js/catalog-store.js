(function () {
  const STORAGE_KEY = "mobel.catalog.v1";

  const categories = [
    { id: "living-room", nameKa: "საცხოვრებელი ოთახი", nameEn: "Living Room" },
    { id: "bedroom", nameKa: "საძინებელი", nameEn: "Bedroom" },
    { id: "dining-room", nameKa: "სასადილო ოთახი", nameEn: "Dining Room" },
    { id: "office", nameKa: "ოფისი", nameEn: "Office" },
  ];

  const defaultProducts = [
    { id: "living-sofa", category: "living-room", nameKa: "ტყავის დივანი", nameEn: "Leather Sofa", price: "₾00,0", image: "./photo/10.jpg" },
    { id: "living-chair", category: "living-room", nameKa: "სკამი", nameEn: "Chair", price: "₾00,0", image: "./photo/living 2.jpg" },
    { id: "living-couch", category: "living-room", nameKa: "დივანი", nameEn: "Sofa", price: "₾00,0", image: "./photo/living 1.jpg" },
    { id: "living-table", category: "living-room", nameKa: "დივანის მაგიდა", nameEn: "Coffee Table", price: "₾00,0", image: "./photo/office 5.jpg" },
    { id: "living-armchair", category: "living-room", nameKa: "სავარძელი", nameEn: "Armchair", price: "₾00,0", image: "./photo/armchair.jpg" },
    { id: "living-dining-set", category: "living-room", nameKa: "მაგიდა სკამით", nameEn: "Table With Chair", price: "₾00,0", image: "./photo/living 4.jpg" },
    { id: "bed-modern", category: "bedroom", nameKa: "თანამედროვე საწოლი", nameEn: "Modern Bed", price: "₾00,0", image: "./photo/badroom 1.jpg" },
    { id: "bed-wardrobe", category: "bedroom", nameKa: "გარდერობი", nameEn: "Wardrobe", price: "₾00,0", image: "./photo/8.jpg" },
    { id: "bed-nightstand", category: "bedroom", nameKa: "ტუმბო", nameEn: "Nightstand", price: "₾00,0", image: "./photo/nightstand.jpg" },
    { id: "bed-frame", category: "bedroom", nameKa: "საწოლის ჩარჩო", nameEn: "Bed Frame", price: "₾00,0", image: "./photo/bed frame.jpg" },
    { id: "dining-table", category: "dining-room", nameKa: "სასადილო მაგიდა", nameEn: "Dining Table", price: "₾00,0", image: "./photo/diningroom 1.jpg" },
    { id: "dining-set", category: "dining-room", nameKa: "სასადილო კომპლექტი", nameEn: "Dining Set", price: "₾00,0", image: "./photo/diningroom 2.jpg" },
    { id: "dining-cabinet", category: "dining-room", nameKa: "კარადა", nameEn: "Cabinet", price: "₾00,0", image: "./photo/diningroom 4.jpg" },
    { id: "office-desk", category: "office", nameKa: "საოფისე მაგიდა", nameEn: "Office Desk", price: "₾00,0", image: "./photo/office 1.jpg" },
    { id: "office-chair", category: "office", nameKa: "საოფისე სკამი", nameEn: "Office Chair", price: "₾00,0", image: "./photo/office 3.jpg" },
    { id: "office-storage", category: "office", nameKa: "საოფისე კარადა", nameEn: "Office Storage", price: "₾00,0", image: "./photo/office 4.jpg" },
  ];

  function readProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProducts;
    } catch (error) {
      console.warn("Could not read catalog data", error);
      return defaultProducts;
    }
  }

  function hasSavedProducts() {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  }

  function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products, null, 2));
  }

  async function fetchProducts() {
    const response = await fetch("api/products.php?action=list", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Could not load products");
    }

    const payload = await response.json();
    if (!payload.ok || !Array.isArray(payload.products)) {
      throw new Error("Invalid products response");
    }

    return payload.products;
  }

  function resetProducts() {
    saveProducts(defaultProducts);
    return defaultProducts;
  }

  window.CatalogStore = {
    STORAGE_KEY,
    categories,
    defaultProducts,
    hasSavedProducts,
    readProducts,
    fetchProducts,
    saveProducts,
    resetProducts,
  };
})();

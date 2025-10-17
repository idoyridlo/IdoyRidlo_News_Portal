const apiKey = "pub_99d48530a3a54e0ab494ae528ed41e6b";
const newsContainer = document.getElementById("news-container");
const themeToggle = document.getElementById("theme-toggle");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const loader = document.getElementById("loader");

async function getNews(category = "", query = "") {
  loader.classList.remove("d-none");
  newsContainer.classList.remove("fade-in");
  newsContainer.classList.add("fade-out");

  setTimeout(async () => {
    newsContainer.innerHTML = "";

    let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=id&language=id`;
    if (category) url += `&category=${category}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        newsContainer.innerHTML = "<p class='text-center text-danger'>Berita tidak ditemukan.</p>";
        loader.classList.add("d-none");
        return;
      }

      newsContainer.innerHTML = data.results.map(news => {
        const title = news.title || "Tanpa Judul";
        const desc = news.description || "Tidak ada deskripsi.";
        const link = news.link || "#";
        const source = news.source_id || "Tidak diketahui";
        const date = news.pubDate ? new Date(news.pubDate).toLocaleDateString("id-ID") : "Tidak diketahui";
        const image = news.image_url ? news.image_url : "https://via.placeholder.com/400x200?text=No+Image";

        return `
          <div class="col-md-4">
            <div class="card h-100">
              <img src="${image}" class="card-img-top" alt="Gambar Berita">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${title}</h5>
                <p class="card-text text-muted">${desc.slice(0, 120)}...</p>
                <small class="text-secondary mb-2"><i class="bi bi-calendar-event me-1"></i>${date} • <i class="bi bi-newspaper me-1"></i>${source}</small>
                <a href="${link}" target="_blank" class="btn btn-primary mt-auto">Baca Selengkapnya</a>
              </div>
            </div>
          </div>`;
      }).join("");

      newsContainer.classList.remove("fade-out");
      newsContainer.classList.add("fade-in");

    } catch (error) {
      newsContainer.innerHTML = `<p class='text-center text-danger'>Gagal memuat berita.</p>`;
    } finally {
      loader.classList.add("d-none");
    }
  }, 300);
}

// Tombol kategori & Tautan Cepat
document.querySelectorAll(".category").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    let category = btn.dataset.category || ""; // "" = Umum / Beranda
    getNews(category);
  });
});

// Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.replace("bi-moon-fill", "bi-brightness-high-fill");
    themeToggle.innerHTML = `<i class="bi bi-brightness-high-fill"></i> Mode Terang`;
  } else {
    icon.classList.replace("bi-brightness-high-fill", "bi-moon-fill");
    themeToggle.innerHTML = `<i class="bi bi-moon-fill"></i> Mode Gelap`;
  }
});

// Search form
searchForm.addEventListener("submit", e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) getNews("", query);
});

// Load berita umum pertama kali
getNews();

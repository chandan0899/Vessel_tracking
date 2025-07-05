document.addEventListener('DOMContentLoaded', () => {
  const itemsPerPage = 25;
  let currentPage = 1;
  let lighthouseData = [];

  const tableBody = document.getElementById("lighthouse-table-body");
  const pagination = document.getElementById("pagination");
  const countDisplay = document.getElementById("lighthouse-count");
  const searchInput = document.getElementById("search");
  const filterBtn = document.getElementById("filter-btn");

  let filteredData = [];

  fetch(lighthousesJsonUrl)
    .then(res => res.json())
    .then(data => {
      lighthouseData = data;
      filteredData = data;
      countDisplay.textContent = filteredData.length;
      renderTablePage(currentPage);
      renderPagination();
    });

  function renderTablePage(page) {
    tableBody.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = filteredData.slice(start, end);

    currentItems.forEach(lh => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="flag-cell">
          <img src="${flagPath}${lh.flag}" class="flag" alt="${lh.country}" />
        </td>
        <td>
          <strong>${lh.name}</strong><br>
          <span class="country-name">${lh.country}</span>
        </td>
        <td>${lh.status}</td>
        <td>${lh.height_m || "—"}</td>
        <td>${lh.range_nmi || "—"}</td>
        <td>
          <button class="live-map-btn"
            onclick="window.location.href='/?lat=${lh.lat}&lon=${lh.lng}&lighthouse=${encodeURIComponent(lh.name)}'">
            Live Map
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderTablePage(currentPage);
        renderPagination();
      }
    };
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === currentPage) pageBtn.classList.add("active-page");
      pageBtn.onclick = () => {
        currentPage = i;
        renderTablePage(currentPage);
        renderPagination();
      };
      pagination.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTablePage(currentPage);
        renderPagination();
      }
    };
    pagination.appendChild(nextBtn);
  }

  filterBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    filteredData = lighthouseData.filter(lh =>
      lh.name.toLowerCase().includes(query)
    );
    currentPage = 1;
    countDisplay.textContent = filteredData.length;
    renderTablePage(currentPage);
    renderPagination();
  });
});

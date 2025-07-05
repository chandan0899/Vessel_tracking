document.addEventListener('DOMContentLoaded', () => {
  const itemsPerPage = 25;
  let currentPage = 1;
  let vesselData = [];

  const tableBody = document.getElementById("vessel-table-body");
  const pagination = document.getElementById("pagination");
  const countDisplay = document.getElementById("vessel-count");
  const searchInput = document.getElementById("search");
  const filterBtn = document.getElementById("filter-btn");

  let filteredData = [];

  // Helper to format numbers
  function format(n) {
    return (typeof n === "number") ? n.toLocaleString() : "—";
  }

  // 🔄 Fetch vessel data
  fetch(vesselsJsonUrl)
    .then(res => res.json())
    .then(data => {
      vesselData = data;
      filteredData = data;
      countDisplay.textContent = filteredData.length;
      renderTablePage(currentPage);
      renderPagination();
    });

  // 📄 Render table
  function renderTablePage(page) {
    tableBody.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = filteredData.slice(start, end);

    currentItems.forEach(vessel => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="flag-cell">
          <img src="${flagPath}${vessel.flag}" class="flag" alt="${vessel.country}" />
        </td>
        <td>
          <strong>${vessel.name}</strong><br>
          <span class="country-name">${vessel.country}</span>
        </td>
        <td>${vessel.built ?? "—"}</td>
        <td>${vessel.type ?? "—"}</td>
        <td>${format(vessel.GT)}</td>
        <td>${format(vessel.DWT)}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // 🔢 Pagination
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

  // 🔍 Search functionality
  filterBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    filteredData = vesselData.filter(v =>
      v.name.toLowerCase().includes(query)
    );
    currentPage = 1;
    countDisplay.textContent = filteredData.length;
    renderTablePage(currentPage);
    renderPagination();
  });
});

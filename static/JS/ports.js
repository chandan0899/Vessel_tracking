// ports.js - already optimized with pagination
document.addEventListener('DOMContentLoaded', () => {
  const portsPerPage = 25;
  let currentPage = 1;
  let portsData = [];

  const tableBody = document.getElementById("port-table-body");
  const pagination = document.getElementById("pagination");
  const countDisplay = document.getElementById("port-count");

  fetch(portsJsonUrl)
    .then(res => res.json())
    .then(data => {
      portsData = data;
      countDisplay.textContent = portsData.length;
      renderTablePage(currentPage);
      renderPagination();
    });

  function renderTablePage(page) {
    tableBody.innerHTML = "";
    const start = (page - 1) * portsPerPage;
    const end = start + portsPerPage;
    const currentPorts = portsData.slice(start, end);

    currentPorts.forEach(port => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="flag-cell">
        <img src="${flagPath}${port.flag}" class="flag" width="28" height="50" alt="${port.country}" />
        </td>
        <td>
          <strong>${port.name}</strong><br>
          <span class="country-name">${port.country}</span>
        </td>
          <td>Port</td>
          <td>${port.unlocode || "—"}</td>
            <td>
             <button class="live-map-btn"
              onclick="window.location.href='/?lat=${port.lat}&lon=${port.lng}&port=${encodeURIComponent(port.name)}'">
              Live Map
            </button>
          </td>`;

      tableBody.appendChild(row);
    });
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(portsData.length / portsPerPage);

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
});

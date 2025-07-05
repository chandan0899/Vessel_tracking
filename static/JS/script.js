const listItems = document.querySelectorAll(".sidebar-list li");

// Only listen to the .title div, not the entire li
listItems.forEach((item) => {
  const title = item.querySelector('.title'); // Only header clickable

  if (title) {
    title.addEventListener("click", (e) => {
      e.stopPropagation(); // Don’t let it bubble up
      let isActive = item.classList.contains("active");

      // Collapse others if open
      listItems.forEach((el) => {
        if (el !== item && el.classList.contains("dropdown")) {
          el.classList.remove("active");
        }
      });

  // Prevent submenu click from closing the dropdown
const submenus = document.querySelectorAll('.submenu');

submenus.forEach(sub => {
  sub.addEventListener('click', (e) => {
    e.stopPropagation(); // So parent li doesn’t toggle
  });
});

      // Toggle this one
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  }
});


const toggleSidebar = document.querySelector(".toggle-sidebar");
const logo = document.querySelector(".logo-box");
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector('.toggle-sidebar');


logo.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('close');
});
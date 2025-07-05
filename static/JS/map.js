// -------------------- Basemap Setup --------------------
const lightMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});
const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; CARTO'
});
const satelliteMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  attribution: '&copy; Google Maps'
});

const map = L.map('map', {
  center: [20.5937, 78.9629],
  zoom: 5,
  zoomControl: false
});
lightMap.addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

// -------------------- Zoom to Port from URL --------------------
const params = new URLSearchParams(window.location.search);
const lat = parseFloat(params.get('lat'));
const lon = parseFloat(params.get('lon'));
const portName = params.get('port');


if (!isNaN(lat) && !isNaN(lon) && portName) {
  const portIcon = L.icon({
    iconUrl: "/static/vessels/icons/port.png",
    iconSize: [32, 32]
  });

  const marker = L.marker([lat, lon], { icon: portIcon })
    .addTo(map)
    .bindPopup(`<b>${portName || "Port"}</b>`)
    .openPopup();

  map.setView([lat, lon], 8);
}

// -------------------- Zoom to lighthouse from URL --------------------
const lighthouseName = params.get('lighthouse');
if (!isNaN(lat) && !isNaN(lon) && lighthouseName) {
  const lighthouseIcon = L.icon({
    iconUrl: "/static/vessels/icons/lighthouse.png",
    iconSize: [32, 32]
  });

  const marker = L.marker([lat, lon], { icon: lighthouseIcon })
    .addTo(map)
    .bindPopup(`<b>${portName || "lighthouse"}</b>`)
    .openPopup();

  map.setView([lat, lon], 8);
}
// -------------------- Vessel Markers --------------------
let portLayer = L.layerGroup().addTo(map);
let vesselLayers = {};
const vesselMarkers = {};
const openPopups = {};

if (typeof geojsonUrl !== 'undefined') {
  fetch(geojsonUrl)
    .then(res => res.json())
    .then(data => {
      data.features.forEach(feature => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        const vesselType = (props.class || "default").toLowerCase();
        const iconPath = `/static/vessels/icons/${vesselType}.png`;

        const icon = L.icon({ iconUrl: iconPath, iconSize: [32, 32] });
        const latlng = [coords[1], coords[0]];

        const popupContent = `
          <div class="vessel-popup">
            <div style="background: #1e3d8f; color: white; padding: 8px; font-weight: bold; font-size: 16px;">
              ${props.name || "Unnamed Vessel"}
            </div>
            <div style="padding: 8px;">
              <div style="font-size: 14px; color: #444;">${props.class || "Unknown Type"}</div>
              ${props.image ? `<img src="/static/images/${props.image}" style="width: 100%; height: 100px; object-fit: cover; margin: 6px 0;" onerror="this.style.display='none'">` : ''}
              <div><b>Destination:</b> ${props.destination || "N/A"}</div>
              <div><b>ETA:</b> ${props.eta || "N/A"}</div>
              <div><b>Speed:</b> ${props.speed || "N/A"}</div>
              <div><b>Course:</b> ${props.course || "N/A"}</div>
              <div><b>Draught:</b> ${props.draught || "N/A"}</div>
              <div><b>Status:</b> ${props.status || "N/A"}</div>
              <div><b>Last Report:</b> ${props.last_report || "N/A"}</div>
              <div><b>Last Port:</b> ${props.last_port || "N/A"}</div>
              <hr>
              <div><b>Gross Tonnage:</b> ${props.gross_tonnage ?? "N/A"}</div>
              <div><b>Built:</b> ${props.built ?? "N/A"}</div>
              <div><b>IMO:</b> ${props.imo || "N/A"}</div>
              <div><b>MMSI:</b> ${props.mmsi || "N/A"}</div>
              <hr>
              <div><b>Vessel ID:</b> ${props.id || "N/A"}</div>
              <div><b>Latitude:</b> ${latlng[0].toFixed(5)}</div>
              <div><b>Longitude:</b> ${latlng[1].toFixed(5)}</div>
            </div>
          </div>`;

        const marker = L.marker(latlng, { icon })
          .bindPopup(popupContent)
          .on('click', () => openPopups[props.id] = true)
          .on('popupclose', () => openPopups[props.id] = false);

        if (!vesselLayers[vesselType]) {
          vesselLayers[vesselType] = L.layerGroup().addTo(map);
        }
        vesselLayers[vesselType].addLayer(marker);
        vesselMarkers[props.id] = { marker, type: vesselType, feature };
      });

      setInterval(() => {
        Object.values(vesselMarkers).forEach(v => {
          const marker = v.marker;
          const oldLatLng = marker.getLatLng();
          const newLat = oldLatLng.lat + (Math.random() - 0.5) * 0.3;
          const newLng = oldLatLng.lng + (Math.random() - 0.5) * 0.3;
          if (Math.abs(newLat) > 85 || Math.abs(newLng) > 180) return;
          marker.setLatLng([newLat, newLng]);
          if (openPopups[v.feature.properties.id]) marker.openPopup();
        });
      }, 5000);
    });
}

// -------------------- Port List Table + Markers --------------------
document.addEventListener('DOMContentLoaded', () => {
  if (typeof portsJsonUrl === 'undefined') return;

  fetch(portsJsonUrl)
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById("port-table-body");
      const countDisplay = document.getElementById("port-count");
      if (!tableBody) return;

      let count = 0;
      data.forEach(port => {
        const marker = L.marker([port.lat, port.lng], {
          icon: L.icon({
            iconUrl: '/static/vessels/icons/port.png',
            iconSize: [20, 20]
          })
        }).bindPopup(`
          <b>${port.name}</b><br>${port.country}<br>UN/LOCODE: ${port.unlocode || 'N/A'}`);
        portLayer.addLayer(marker);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${port.flag}" class="flag" width="28" height="20" alt="${port.country}" /></td>
          <td><strong>${port.name}</strong><br><span class="country-name">${port.country}</span></td>
          <td>Port</td>
          <td>${port.unlocode || "—"}</td>
          <td>
            <a class="live-map-btn" href="/?lat=${port.lat}&lon=${port.lon}&port=${encodeURIComponent(port.name)}">
              Live Map
            </a>
          </td>`;
        tableBody.appendChild(row);
        count++;
      });
      if (countDisplay) countDisplay.textContent = count;
    });
});

// -------------------- Map Type Switcher --------------------
function switchMap(type) {
  [lightMap, darkMap, satelliteMap].forEach(layer => map.removeLayer(layer));
  if (type === 'light') lightMap.addTo(map);
  else if (type === 'dark') darkMap.addTo(map);
  else if (type === 'satellite') satelliteMap.addTo(map);
}

// -------------------- Vessel Type Toggle --------------------
function toggleVesselType(event, type) {
  event.preventDefault();
  const layer = vesselLayers[type];
  const link = event.target.closest('.link');
  if (!layer) return false;
  if (map.hasLayer(layer)) {
    map.removeLayer(layer);
    link.classList.remove('active-filter');
  } else {
    map.addLayer(layer);
    link.classList.add('active-filter');
  }
  return false;
}

// -------------------- Weather Layers --------------------
const weatherLayers = {
  wind: L.tileLayer('https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=1c656e368c4c808591a51c49fe046934'),
  temperature: L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=1c656e368c4c808591a51c49fe046934'),
  rain: L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=1c656e368c4c808591a51c49fe046934'),
  clouds: L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=1c656e368c4c808591a51c49fe046934')
};

document.querySelectorAll('.weather-toggle').forEach(item => {
  item.addEventListener('click', () => {
    const layerName = item.dataset.layer;
    if (!map.hasLayer(weatherLayers[layerName])) {
      map.addLayer(weatherLayers[layerName]);
      item.classList.add('active');
    } else {
      map.removeLayer(weatherLayers[layerName]);
      item.classList.remove('active');
    }
  });
});

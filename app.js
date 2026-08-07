(() => {
  const DATA = window.TRIP_DATA;
  const STORAGE_KEY = "ireland-2027-static-choices";
  const TOTAL_TRAVELERS = 11;
  const GROUP_COSTS = { lodging: 11466, suv: 2301, driving: 1794 };
  const GROUP_POOL = GROUP_COSTS.lodging + GROUP_COSTS.suv + GROUP_COSTS.driving;
  const PER_TRAVELER = {
    lodging: GROUP_COSTS.lodging / TOTAL_TRAVELERS,
    suv: GROUP_COSTS.suv / TOTAL_TRAVELERS,
    driving: GROUP_COSTS.driving / TOTAL_TRAVELERS,
    pool: GROUP_POOL / TOTAL_TRAVELERS
  };
  const defaultState = { activities: {}, travelerCount: 1, airfare: 900, food: 497, airport: 0, insurance: false, name: "" };
  let state = loadState();
  let galleryStay = null;
  let galleryIndex = 0;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return { ...defaultState, ...saved, activities: saved.activities || {} };
    } catch {
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateBudget();
    updateSummary();
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  }

  function choiceButtons(kind, id) {
    const selected = state[kind][id] || "";
    return `<div class="choice-row" role="group" aria-label="Choose yes, maybe or no">${["yes", "maybe", "no"].map(choice => `<button data-kind="${kind}" data-id="${id}" data-choice="${choice}" class="${selected === choice ? "selected" : ""}">${choice}</button>`).join("")}</div>`;
  }

  function renderLodging() {
    document.querySelector("#lodgingList").innerHTML = DATA.stays.map(stay => `<article class="lodging-card"><div class="lodging-copy"><p class="eyebrow">${stay.area}</p><h3>${stay.name}</h3><div class="stay-date"><span>Exact stay dates</span><strong>${stay.dateLabel}</strong><small>${stay.address}</small></div><span class="candidate-pill">${stay.status}</span><p>${stay.roomPlan}</p><p class="photo-source">${stay.sourceNote}</p><div class="date-search-links">${stay.dateLinks.map(item => `<a href="${item.url}" target="_blank" rel="noreferrer">${item.label} availability ↗</a>`).join("")}</div><div class="lodging-actions"><button class="button primary gallery-open" data-stay="${stay.id}">View all ${stay.photos.length} photos</button></div></div><div class="lodging-preview">${stay.photos.slice(0, 6).map((photo, index) => `<button class="gallery-photo" data-stay="${stay.id}" data-index="${index}" aria-label="Open ${stay.name} photo ${index + 1}"><img src="${photo}" loading="lazy" alt="${stay.name} listing preview ${index + 1}"></button>`).join("")}</div></article>`).join("");
  }

  function renderAlternates() {
    const list = document.querySelector("#alternateList");
    if (!list) return;
    list.innerHTML = DATA.alternates.map(stay => `<article class="alternate-card"><div class="alternate-photos">${stay.photos.map((photo, index) => `<img src="${photo}" loading="lazy" alt="${stay.name} public listing preview ${index + 1}">`).join("")}</div><div class="alternate-copy"><p class="eyebrow">${stay.area}</p><h3>${stay.name}</h3><strong class="alternate-dates">${stay.dates}</strong><span class="alternate-facts">${stay.facts}</span><p>${stay.note}</p><a class="button primary" href="${stay.link}" target="_blank" rel="noreferrer">See all photos and live listing ↗</a></div></article>`).join("");
  }

  function initializeRouteMap() {
    const mapElement = document.querySelector("#tripMap");
    if (!mapElement) return;
    if (!window.L) {
      mapElement.innerHTML = '<div class="map-fallback"><strong>The interactive map could not load.</strong><span>Use the Google Maps route link beside it.</span></div>';
      return;
    }
    mapElement.innerHTML = "";
    const stops = [
      { label: "1 & 4", name: "Staycity Dublin City Centre", dates: "June 1–3 and June 9–10", coords: [53.3483945, -6.2699439] },
      { label: "2", name: "Shangri-La, Killarney", dates: "June 3–7", coords: [52.0620199, -9.5159066] },
      { label: "3", name: "Atlantic View Cottages, Doolin", dates: "June 7–9", coords: [53.0114089, -9.3573707] }
    ];
    const route = [stops[0].coords, stops[1].coords, stops[2].coords, stops[0].coords];
    const map = L.map(mapElement, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    stops.forEach(stop => {
      const icon = L.divIcon({ className: "route-marker-shell", html: `<span class="route-marker">${stop.label}</span>`, iconSize: [44, 44], iconAnchor: [22, 22] });
      L.marker(stop.coords, { icon }).addTo(map).bindPopup(`<strong>${stop.name}</strong><br>${stop.dates}, 2027`);
    });
    const line = L.polyline(route, { color: "#0e6651", weight: 4, opacity: 0.8, dashArray: "8 8" }).addTo(map);
    map.fitBounds(line.getBounds(), { padding: [34, 34] });
  }

  function renderActivities() {
    const areas = [...new Set(DATA.activities.map(activity => activity.area))];
    document.querySelector("#activityGroups").innerHTML = areas.map(area => {
      const cards = DATA.activities.filter(activity => activity.area === area).map(activity => `<article class="activity-card"><div class="activity-top"><span class="day-pill">${activity.day}</span><span class="cost-pill">${activity.cost ? `${money(activity.cost)} / traveler` : "Free / traveler"}</span></div><h3>${activity.title}</h3><p class="activity-meta">${activity.distance} · ${activity.duration}</p><p>${activity.note}</p>${choiceButtons("activities", activity.id)}<a href="${activity.link}" target="_blank" rel="noreferrer">See official details ↗</a></article>`).join("");
      return `<section class="area-block"><div class="area-title"><h3>${area}</h3><span>From the ${area === "Dublin" ? "Dublin stay" : area === "Killarney" ? "Killarney base" : "Doolin / Clare base"}</span></div><div class="activity-grid">${cards}</div></section>`;
    }).join("");
  }

  function bindChoiceButtons() {
    document.addEventListener("click", event => {
      const button = event.target.closest("button[data-kind][data-choice]");
      if (!button) return;
      const { kind, id, choice } = button.dataset;
      state[kind][id] = choice;
      document.querySelectorAll(`button[data-kind="${kind}"][data-id="${id}"]`).forEach(item => item.classList.toggle("selected", item.dataset.choice === choice));
      saveState();
    });
  }

  function updateBudget() {
    const travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    const activityCost = DATA.activities.reduce((sum, activity) => sum + (state.activities[activity.id] === "yes" ? activity.cost : 0), 0);
    const insurance = state.insurance ? 192 : 0;
    const perTravelerTotal = Number(state.airfare) + PER_TRAVELER.pool + Number(state.food) + insurance + activityCost;
    const total = perTravelerTotal * travelerCount + Number(state.airport || 0);
    document.querySelector("#budgetTotalLabel").textContent = `Total for ${travelerCount} ${travelerCount === 1 ? "traveler" : "travelers"}`;
    document.querySelector("#personalTotal").textContent = money(total);
    document.querySelector("#budgetScope").textContent = `${money(perTravelerTotal)} per traveler × ${travelerCount}, plus ${money(Number(state.airport || 0))} household DFW cost counted once`;
    const multiplier = travelerCount > 1 ? ` × ${travelerCount}` : "";
    const lines = [[`Airfare (${money(Number(state.airfare))}${multiplier})`, Number(state.airfare) * travelerCount], [`Lodging placeholder (${money(PER_TRAVELER.lodging)}${multiplier})`, PER_TRAVELER.lodging * travelerCount], [`SUV rental (${money(PER_TRAVELER.suv)}${multiplier})`, PER_TRAVELER.suv * travelerCount], [`Driving fund (${money(PER_TRAVELER.driving)}${multiplier})`, PER_TRAVELER.driving * travelerCount], [`Food (${money(Number(state.food))}${multiplier})`, Number(state.food) * travelerCount], [`Yes activities (${money(activityCost)}${multiplier})`, activityCost * travelerCount], ["Household DFW cost · once", state.airport || 0], [`Insurance (${money(insurance)}${multiplier})`, insurance * travelerCount]];
    document.querySelector("#budgetBreakdown").innerHTML = lines.map(([label, value]) => `<div class="breakdown-line"><span>${label}</span><strong>${money(Number(value))}</strong></div>`).join("");
  }

  function buildSummary() {
    const name = state.name || "Name not selected";
    const activityLines = DATA.activities.filter(activity => state.activities[activity.id]).map(activity => `- ${activity.title}: ${formatChoice(state.activities[activity.id])}`);
    const activityCost = DATA.activities.reduce((sum, activity) => sum + (state.activities[activity.id] === "yes" ? activity.cost : 0), 0);
    const travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    const perTravelerTotal = Number(state.airfare) + PER_TRAVELER.pool + Number(state.food) + (state.insurance ? 192 : 0) + activityCost;
    const total = perTravelerTotal * travelerCount + Number(state.airport || 0);
    return [`IRELAND 2027 — ${name}`, "", `PAYING FOR: ${travelerCount} ${travelerCount === 1 ? "TRAVELER" : "TRAVELERS"}`, "", "ACTIVITIES", ...(activityLines.length ? activityLines : ["- No activity choices yet"]), "", `Per-traveler cost before household DFW amount: ${money(perTravelerTotal)}`, `Combined total for ${travelerCount} ${travelerCount === 1 ? "traveler" : "travelers"}: ${money(total)}`, "", `Airfare per traveler: ${money(Number(state.airfare))}`, `Working trip pool per traveler: about ${money(PER_TRAVELER.pool)}`, `- Lodging placeholder per traveler: about ${money(PER_TRAVELER.lodging)}`, `- Three-SUV rental per traveler: about ${money(PER_TRAVELER.suv)}`, `- Ireland driving fund per traveler: about ${money(PER_TRAVELER.driving)}`, "  (includes about $62 per traveler for fuel; about $685 group fuel total)", "Lodging must be repriced after the 11-person property is selected.", `Food per traveler: ${money(Number(state.food))}`, `Household DFW parking/ride counted once: ${money(Number(state.airport || 0))}`, `Insurance allowance per traveler shown: ${state.insurance ? "Yes" : "No"}`, "", "Selected activity costs are multiplied by the number of travelers shown above.", "Car-seat questions and any special room needs will be handled directly with the organizer."].join("\n");
  }

  function formatChoice(value) {
    return value ? value[0].toUpperCase() + value.slice(1) : "Not answered";
  }

  function updateSummary() {
    const summary = buildSummary();
    document.querySelector("#choiceSummary").value = summary;
    document.querySelector("#textChoices").href = `sms:?&body=${encodeURIComponent(summary)}`;
  }

  function openGallery(stayId, index = 0) {
    galleryStay = DATA.stays.find(stay => stay.id === stayId);
    if (!galleryStay) return;
    galleryIndex = index;
    const lightbox = document.querySelector("#lightbox");
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.querySelector("#lightboxTitle").textContent = galleryStay.name;
    document.querySelector("#lightboxLink").href = galleryStay.link;
    document.querySelector("#lightboxStrip").innerHTML = galleryStay.photos.map((photo, photoIndex) => `<button data-photo-index="${photoIndex}" aria-label="Open photo ${photoIndex + 1}"><img src="${photo}" loading="lazy" alt="${galleryStay.name} thumbnail ${photoIndex + 1}"></button>`).join("");
    updateGallery();
    document.querySelector("#closeLightbox").focus();
  }

  function updateGallery() {
    const image = document.querySelector("#lightboxImage");
    image.src = galleryStay.photos[galleryIndex];
    image.alt = `${galleryStay.name} listing photo ${galleryIndex + 1}`;
    document.querySelector("#lightboxCounter").textContent = `Public listing photo ${galleryIndex + 1} of ${galleryStay.photos.length}`;
    document.querySelectorAll("#lightboxStrip button").forEach((button, index) => button.classList.toggle("active", index === galleryIndex));
    const active = document.querySelector(`#lightboxStrip button[data-photo-index="${galleryIndex}"]`);
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function closeGallery() {
    document.querySelector("#lightbox").hidden = true;
    document.body.style.overflow = "";
  }

  function bindGallery() {
    document.addEventListener("click", event => {
      const opener = event.target.closest(".gallery-open, .gallery-photo");
      if (opener) openGallery(opener.dataset.stay, Number(opener.dataset.index || 0));
      const thumb = event.target.closest("#lightboxStrip button[data-photo-index]");
      if (thumb) { galleryIndex = Number(thumb.dataset.photoIndex); updateGallery(); }
    });
    document.querySelector("#closeLightbox").addEventListener("click", closeGallery);
    document.querySelector("#previousPhoto").addEventListener("click", () => { galleryIndex = (galleryIndex - 1 + galleryStay.photos.length) % galleryStay.photos.length; updateGallery(); });
    document.querySelector("#nextPhoto").addEventListener("click", () => { galleryIndex = (galleryIndex + 1) % galleryStay.photos.length; updateGallery(); });
    document.addEventListener("keydown", event => {
      if (document.querySelector("#lightbox").hidden) return;
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") document.querySelector("#previousPhoto").click();
      if (event.key === "ArrowRight") document.querySelector("#nextPhoto").click();
    });
  }

  function bindControls() {
    const travelerCount = document.querySelector("#travelerCount");
    const airfare = document.querySelector("#airfare");
    const food = document.querySelector("#food");
    const airport = document.querySelector("#airport");
    const insurance = document.querySelector("#insurance");
    const travelerName = document.querySelector("#travelerName");
    state.travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    if (!DATA.travelers.includes(state.name)) state.name = "";
    travelerCount.value = String(state.travelerCount); airfare.value = String(state.airfare); food.value = String(state.food); airport.value = String(state.airport || 0); insurance.checked = Boolean(state.insurance);
    travelerName.innerHTML = `<option value="">Choose your name</option>${DATA.travelers.map(name => `<option value="${name}">${name}</option>`).join("")}`;
    travelerName.value = state.name;
    travelerCount.addEventListener("change", () => { state.travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(travelerCount.value) || 1)); saveState(); });
    airfare.addEventListener("change", () => { state.airfare = Number(airfare.value); saveState(); });
    food.addEventListener("change", () => { state.food = Number(food.value); saveState(); });
    airport.addEventListener("input", () => { state.airport = Math.max(0, Number(airport.value) || 0); saveState(); });
    insurance.addEventListener("change", () => { state.insurance = insurance.checked; saveState(); });
    travelerName.addEventListener("change", () => { state.name = travelerName.value; saveState(); });
    document.querySelector("#copyChoices").addEventListener("click", async () => {
      const summary = buildSummary();
      try { await navigator.clipboard.writeText(summary); document.querySelector("#copyStatus").textContent = "Choices copied. Paste them into the family text thread."; }
      catch { document.querySelector("#choiceSummary").select(); document.execCommand("copy"); document.querySelector("#copyStatus").textContent = "Choices copied."; }
    });
    document.querySelector("#clearChoices").addEventListener("click", () => {
      if (!window.confirm("Clear the choices and calculator saved on this device?")) return;
      localStorage.removeItem(STORAGE_KEY); state = { ...defaultState, activities: {} }; location.reload();
    });
  }

  function bindNavigation() {
    const menuButton = document.querySelector("#menuButton");
    const nav = document.querySelector("#siteNav");
    menuButton.addEventListener("click", () => { const open = nav.classList.toggle("open"); menuButton.setAttribute("aria-expanded", String(open)); });
    nav.addEventListener("click", event => { if (event.target.matches("a")) { nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); } });
    const links = [...nav.querySelectorAll("a")];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)); }), { rootMargin: "-35% 0px -58%", threshold: 0 });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
  }

  renderLodging(); renderAlternates(); renderActivities(); initializeRouteMap(); bindChoiceButtons(); bindGallery(); bindControls(); bindNavigation(); updateBudget(); updateSummary();
})();

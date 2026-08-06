(() => {
  const DATA = window.TRIP_DATA;
  const STORAGE_KEY = "ireland-2027-static-choices";
  const defaultState = { dates: {}, activities: {}, airfare: 900, food: 497, airport: 0, insurance: false, name: "" };
  let state = loadState();
  let galleryStay = null;
  let galleryIndex = 0;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return { ...defaultState, ...saved, dates: saved.dates || {}, activities: saved.activities || {} };
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

  function renderDates() {
    document.querySelector("#dateCards").innerHTML = DATA.dates.map(option => `<article class="date-card"><div class="activity-top"><span class="day-pill">${option.badge}</span></div><h3>${option.title}</h3><ul>${option.lines.map(line => `<li>${line}</li>`).join("")}</ul><p>${option.note}</p>${choiceButtons("dates", option.id)}</article>`).join("");
  }

  function renderLodging() {
    document.querySelector("#lodgingList").innerHTML = DATA.stays.map(stay => `<article class="lodging-card"><div class="lodging-copy"><p class="eyebrow">${stay.area}</p><h3>${stay.name}</h3><span class="candidate-pill">${stay.status}</span><p>${stay.roomPlan}</p><p class="photo-source">${stay.sourceNote}</p><div class="lodging-actions"><button class="button primary gallery-open" data-stay="${stay.id}">View all ${stay.photos.length} photos</button><a href="${stay.link}" target="_blank" rel="noreferrer">Open live listing ↗</a></div></div><div class="lodging-preview">${stay.photos.slice(0, 6).map((photo, index) => `<button class="gallery-photo" data-stay="${stay.id}" data-index="${index}" aria-label="Open ${stay.name} photo ${index + 1}"><img src="${photo}" loading="lazy" alt="${stay.name} listing preview ${index + 1}"></button>`).join("")}</div></article>`).join("");
  }

  function renderActivities() {
    const areas = [...new Set(DATA.activities.map(activity => activity.area))];
    document.querySelector("#activityGroups").innerHTML = areas.map(area => {
      const cards = DATA.activities.filter(activity => activity.area === area).map(activity => `<article class="activity-card"><div class="activity-top"><span class="day-pill">${activity.day}</span><span class="cost-pill">${activity.cost ? money(activity.cost) : "Free"}</span></div><h3>${activity.title}</h3><p class="activity-meta">${activity.distance} · ${activity.duration}</p><p>${activity.note}</p>${choiceButtons("activities", activity.id)}<a href="${activity.link}" target="_blank" rel="noreferrer">See official details ↗</a></article>`).join("");
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
    const activityCost = DATA.activities.reduce((sum, activity) => sum + (state.activities[activity.id] === "yes" ? activity.cost : 0), 0);
    const insurance = state.insurance ? 192 : 0;
    const total = Number(state.airfare) + 1197 + Number(state.food) + Number(state.airport || 0) + insurance + activityCost;
    document.querySelector("#personalTotal").textContent = money(total);
    const lines = [["Airfare", state.airfare], ["Lodging pool", 882], ["Three-SUV rental", 177], ["Ireland driving fund", 138], ["Food", state.food], ["Yes activities", activityCost], ["DFW parking / ride", state.airport || 0], ["Insurance allowance", insurance]];
    document.querySelector("#budgetBreakdown").innerHTML = lines.map(([label, value]) => `<div class="breakdown-line"><span>${label}</span><strong>${money(Number(value))}</strong></div>`).join("");
  }

  function buildSummary() {
    const name = state.name || "Name not selected";
    const dateLines = DATA.dates.map(option => `- ${option.title}: ${formatChoice(state.dates[option.id])}`);
    const activityLines = DATA.activities.filter(activity => state.activities[activity.id]).map(activity => `- ${activity.title}: ${formatChoice(state.activities[activity.id])}`);
    const activityCost = DATA.activities.reduce((sum, activity) => sum + (state.activities[activity.id] === "yes" ? activity.cost : 0), 0);
    const total = Number(state.airfare) + 1197 + Number(state.food) + Number(state.airport || 0) + (state.insurance ? 192 : 0) + activityCost;
    return [`IRELAND 2027 — ${name}`, "", "DATE CHOICES", ...dateLines, "", "ACTIVITIES", ...(activityLines.length ? activityLines : ["- No activity choices yet"]), "", `My working cost: ${money(total)}`, `Airfare target: ${money(Number(state.airfare))}`, "Required trip pool: $1,197", "- Lodging: $882", "- Three-SUV rental: $177", "- Ireland driving fund: $138", "  (includes about $53/person for fuel)", `Food plan: ${money(Number(state.food))}`, `DFW parking/ride: ${money(Number(state.airport || 0))}`, `Insurance allowance shown: ${state.insurance ? "Yes" : "No"}`, "", "Car-seat questions and any special room needs will be handled directly with the organizer."].join("\n");
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
    const airfare = document.querySelector("#airfare");
    const food = document.querySelector("#food");
    const airport = document.querySelector("#airport");
    const insurance = document.querySelector("#insurance");
    const travelerName = document.querySelector("#travelerName");
    airfare.value = String(state.airfare); food.value = String(state.food); airport.value = String(state.airport || 0); insurance.checked = Boolean(state.insurance);
    travelerName.innerHTML = `<option value="">Choose your name</option>${DATA.travelers.map(name => `<option value="${name}">${name}</option>`).join("")}`;
    travelerName.value = state.name;
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
      localStorage.removeItem(STORAGE_KEY); state = { ...defaultState, dates: {}, activities: {} }; location.reload();
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

  renderDates(); renderLodging(); renderActivities(); bindChoiceButtons(); bindGallery(); bindControls(); bindNavigation(); updateBudget(); updateSummary();
})();

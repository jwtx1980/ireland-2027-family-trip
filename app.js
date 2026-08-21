(() => {
  const DATA = window.TRIP_DATA;
  const STORAGE_KEY = "ireland-2027-static-choices";
  const TOTAL_TRAVELERS = 10;
  const KNOWN_LAND_PER_TRAVELER = DATA.costs.perTravelerKnown;
  const defaultState = { activities: {}, travelerCount: 1, airfare: 1000, food: 850, airport: 0, insurance: false, name: "" };
  let state = loadState();
  let galleryStay = null;
  let galleryIndex = 0;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const merged = { ...defaultState, ...saved, activities: saved.activities || {} };
      if (merged.airfare === 900) merged.airfare = 1000;
      if ([456, 497, 538].includes(merged.food)) merged.food = 850;
      return merged;
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

  function moneyExact(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  function choiceButtons(kind, id) {
    const selected = state[kind][id] || "";
    const labels = kind === "activities" ? { yes: "Plan it", maybe: "Interested", no: "Skip" } : { yes: "Yes", maybe: "Maybe", no: "No" };
    return `<div class="choice-row" role="group" aria-label="Choose plan it, interested or skip">${["yes", "maybe", "no"].map(choice => `<button data-kind="${kind}" data-id="${id}" data-choice="${choice}" class="${selected === choice ? "selected" : ""}">${labels[choice]}</button>`).join("")}</div>`;
  }

  function activityCard(activity) {
    return `<article class="activity-card"><div class="activity-top"><span class="day-pill">${activity.day}</span><span class="cost-pill">${activity.cost ? `Adds ${money(activity.cost)} / traveler` : "Adds $0 / traveler"}</span></div><h3>${activity.title}</h3><p class="activity-meta">${activity.distance} · ${activity.duration}</p><p>${activity.note}</p><div class="activity-impact" data-activity-impact="${activity.id}">${activity.cost ? `${money(activity.cost)} for 1 traveler if selected` : "Free activity—selecting it adds no admission cost"}</div>${choiceButtons("activities", activity.id)}<a href="${activity.link}" target="_blank" rel="noreferrer">${activity.linkLabel || "See official details ↗"}</a></article>`;
  }

  function renderTripChapters() {
    const container = document.querySelector("#tripChapters");
    if (!container) return;
    const chapters = [
      { area: "Dublin", stay: DATA.stays[0], number: "01", title: "Ease into Dublin", intro: "Land, recover and explore the city at a pace that works for each vehicle-free group." },
      { area: "Killarney", stay: DATA.stays[1], number: "02", title: "Settle into Kerry", intro: "Three nights in one confirmed house for national-park scenery, Dingle and a flexible rest day." },
      { area: "Clare", stay: DATA.stays[2], number: "03", title: "Finish on the Atlantic coast", intro: "Lahinch puts golf, the Cliffs, the Burren and an optional sheepdog demonstration within reach." }
    ];
    container.innerHTML = chapters.map(chapter => {
      const stay = chapter.stay;
      const activities = DATA.activities.filter(activity => activity.area === chapter.area).map(activityCard).join("");
      const dining = DATA.dining.filter(item => item.area === chapter.area).map(item => `<article class="dining-card"><span>${item.label}</span><h4>${item.title}</h4><p>${item.note}</p><a href="${item.link}" target="_blank" rel="noreferrer">See menu or details ↗</a></article>`).join("");
      const missingNote = stay.statusType === "missing" ? `<aside class="chapter-alert"><strong>Dublin lodging is not booked yet.</strong><p>Staycity is the working candidate, not a reservation. Keep June 1–3 and June 9–10 together when comparing replacements.</p></aside>` : "";
      return `<section class="trip-chapter" aria-labelledby="chapter-${stay.id}"><div class="chapter-heading"><span>${chapter.number}</span><div><p class="eyebrow">${stay.area}</p><h2 id="chapter-${stay.id}">${chapter.title}</h2><p>${chapter.intro}</p></div></div><div class="chapter-layout"><article class="chapter-stay status-${stay.statusType}"><div class="chapter-photos">${stay.photos.slice(0, 2).map((photo, index) => `<button class="gallery-photo" data-stay="${stay.id}" data-index="${index}" aria-label="Open ${stay.name} photo ${index + 1}"><img src="${photo}" loading="lazy" alt="${stay.name} listing preview ${index + 1}"></button>`).join("")}</div><div class="chapter-stay-copy"><span class="chapter-status ${stay.statusType}">${stay.status}</span><h3>${stay.name}</h3><div class="stay-date"><span>Exact stay dates</span><strong>${stay.dateLabel}</strong><small>${stay.address}</small></div>${missingNote}<p>${stay.roomPlan}</p><p class="photo-source">${stay.sourceNote}</p><div class="chapter-actions"><button class="button primary gallery-open" data-stay="${stay.id}">View preview photos</button>${stay.dateLinks.map(item => `<a class="button quiet" href="${item.url}" target="_blank" rel="noreferrer">${item.label} ↗</a>`).join("")}</div></div></article><div class="chapter-possibilities"><div class="possibilities-heading"><p class="eyebrow">Choose what sounds good</p><h3>Things we could do from this base</h3><p>“Plan it” adds the displayed amount to your calculator. “Interested” remembers the idea without charging it yet.</p></div><div class="activity-grid chapter-activity-grid">${activities}</div><div class="dining-board"><div class="dining-heading"><p class="eyebrow">Meals near this stay</p><h3>Dinner ideas, including a night at home</h3><p>These are already covered by whichever food reserve you choose later, so they are not added twice.</p></div><div class="dining-grid">${dining}</div></div></div></div></section>`;
    }).join("");
  }

  function renderBookings() {
    const summary = document.querySelector("#bookingSummary");
    const list = document.querySelector("#bookingList");
    const ledger = document.querySelector("#contributionTable");
    if (!summary || !list || !ledger) return;
    summary.innerHTML = [
      ["Estimated airfare for 10", money(DATA.costs.airfareEstimatedAll), "Justin exact · other 7 assumed"],
      ["Confirmed shared land", money(DATA.costs.confirmedShared), "Two SUVs + Killarney + Lahinch"],
      ["Future Lahinch installment", money(DATA.costs.lahinchRemainingUsd), `€${DATA.costs.lahinchRemainingEur.toLocaleString("en-US", { minimumFractionDigits: 2 })} due Apr 27, 2027`],
      ["Known airfare + shared land", money(DATA.costs.overallKnown), `${money(DATA.costs.perTravelerOverallKnown)} per traveler`]
    ].map(([label, value, note]) => `<article><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join("");

    list.innerHTML = DATA.bookings.map(item => `<article class="booking-item"><div class="booking-icon">${item.category.slice(0, 1)}</div><div class="booking-copy"><div class="booking-top"><span>${item.category} · ${item.family}</span><span class="status-chip ${item.status}">${item.statusLabel}</span></div><h3>${item.title}</h3><p>${item.detail}</p></div><div class="booking-amount">${item.amount == null ? "<strong>Cost needed</strong>" : `<strong>${moneyExact(item.amount)}</strong>${item.original ? `<small>${item.original}</small>` : ""}`}</div></article>`).join("");

    ledger.innerHTML = `<div class="contribution-table"><div class="contribution-head"><span>Family</span><span>Travelers</span><span>Flight reference</span><span>Confirmed / assigned land</span><span>Land not booked</span><span>Equal land share*</span></div>${DATA.families.map(family => {
      const share = family.travelers * (DATA.costs.knownShared / TOTAL_TRAVELERS);
      const contribution = family.sharedConfirmed + family.pending;
      const position = contribution - share;
      return `<article><div class="family-cell"><strong>${family.name}</strong><small>${family.members}</small><p>${family.items}</p></div><span class="ledger-cell"><small>Travelers</small><strong>${family.travelers}</strong></span><span class="ledger-cell airfare-neutral"><small>Flight reference</small><strong>${moneyExact(family.airfare)}</strong><small>${family.airfareBasis} · excluded from pot</small></span><span class="ledger-cell"><small>Confirmed / assigned land</small><strong>${moneyExact(family.sharedConfirmed)}</strong></span><span class="ledger-cell"><small>Land not booked</small><strong>${moneyExact(family.pending)}</strong></span><span class="ledger-cell"><small>Equal land share</small><strong>${money(share)}</strong><small class="${position >= 0 ? "ahead" : "behind"}">${position >= 0 ? `${money(position)} ahead` : `${money(Math.abs(position))} due to pot`}</small></span></article>`;
    }).join("")}</div><p class="ledger-footnote">*Airfare cancels out of this calculation. The equal land share divides the current ${money(DATA.costs.knownShared)} of confirmed vehicle and lodging commitments by all 10 travelers. “Confirmed land” is the value assigned to that family; a future vendor installment may still be due.</p>`;
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
      { label: "2", name: "Knockmanagh Holiday Home", dates: "June 3–6", coords: [52.108, -9.47] },
      { label: "3", name: "Lahinch Golf Home", dates: "June 6–9", coords: [52.935, -9.346] }
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
    const perTravelerTotal = Number(state.airfare) + KNOWN_LAND_PER_TRAVELER + Number(state.food) + insurance + activityCost;
    const total = perTravelerTotal * travelerCount + Number(state.airport || 0);
    document.querySelector("#budgetTotalLabel").textContent = `Total for ${travelerCount} ${travelerCount === 1 ? "traveler" : "travelers"}`;
    document.querySelector("#personalTotal").textContent = money(total);
    document.querySelector("#budgetScope").textContent = `${money(perTravelerTotal)} per traveler × ${travelerCount}, plus ${money(Number(state.airport || 0))} household DFW cost counted once`;
    const multiplier = travelerCount > 1 ? ` × ${travelerCount}` : "";
    const lines = [[`Flight amount (${money(Number(state.airfare))}${multiplier})`, Number(state.airfare) * travelerCount], [`Current known land share (${money(KNOWN_LAND_PER_TRAVELER)}${multiplier})`, KNOWN_LAND_PER_TRAVELER * travelerCount], [`Food reserve (${money(Number(state.food))}${multiplier})`, Number(state.food) * travelerCount], [`Planned activities (${money(activityCost)}${multiplier})`, activityCost * travelerCount], ["Household DFW cost · once", state.airport || 0], [`Insurance (${money(insurance)}${multiplier})`, insurance * travelerCount]];
    document.querySelector("#budgetBreakdown").innerHTML = lines.map(([label, value]) => `<div class="breakdown-line"><span>${label}</span><strong>${money(Number(value))}</strong></div>`).join("");
    const activityRunningTotal = document.querySelector("#activityRunningTotal");
    if (activityRunningTotal) activityRunningTotal.textContent = `${money(activityCost)} per traveler · ${money(activityCost * travelerCount)} for ${travelerCount}`;
    DATA.activities.forEach(activity => {
      const impact = document.querySelector(`[data-activity-impact="${activity.id}"]`);
      if (!impact) return;
      impact.textContent = activity.cost ? `${money(activity.cost)} per traveler · ${money(activity.cost * travelerCount)} for ${travelerCount} if selected` : "Free activity—selecting it adds no admission cost";
    });
  }

  function buildSummary() {
    const name = state.name || "Name not selected";
    const activityLines = DATA.activities.filter(activity => state.activities[activity.id]).map(activity => `- ${activity.title}: ${formatChoice(state.activities[activity.id])}`);
    const activityCost = DATA.activities.reduce((sum, activity) => sum + (state.activities[activity.id] === "yes" ? activity.cost : 0), 0);
    const travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    const perTravelerTotal = Number(state.airfare) + KNOWN_LAND_PER_TRAVELER + Number(state.food) + (state.insurance ? 192 : 0) + activityCost;
    const total = perTravelerTotal * travelerCount + Number(state.airport || 0);
    return [`IRELAND 2027 — ${name}`, "", `PAYING FOR: ${travelerCount} ${travelerCount === 1 ? "TRAVELER" : "TRAVELERS"}`, "", "ACTIVITIES", ...(activityLines.length ? activityLines : ["- No activity choices yet"]), "", `Current subtotal per traveler: ${money(perTravelerTotal)}`, `Combined current subtotal for ${travelerCount} ${travelerCount === 1 ? "traveler" : "travelers"}: ${money(total)}`, "", `Flight amount per traveler: ${money(Number(state.airfare))}`, `Known shared land commitments per traveler: about ${money(KNOWN_LAND_PER_TRAVELER)}`, "  (two SUVs + confirmed Killarney + confirmed Lahinch)", `Comfortable food reserve per traveler: ${money(Number(state.food))}`, "  (paid during the trip; not part of the shared pot)", `Household DFW parking/ride counted once: ${money(Number(state.airport || 0))}`, `Insurance allowance per traveler shown: ${state.insurance ? "Yes" : "No"}`, "", "NOT YET INCLUDED: Dublin lodging, fuel, extra rental mileage, tolls and Ireland parking.", "Selected activity costs are multiplied by the number of travelers shown above.", "Alcohol, personal shopping, car-seat questions and special room needs remain separate."].join("\n");
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

  renderTripChapters(); renderBookings(); renderAlternates(); initializeRouteMap(); bindChoiceButtons(); bindGallery(); bindControls(); bindNavigation(); updateBudget(); updateSummary();
})();

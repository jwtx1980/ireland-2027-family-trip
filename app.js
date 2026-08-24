(() => {
  const DATA = window.TRIP_DATA;
  const STORAGE_KEY = "ireland-2027-static-choices";
  const TOTAL_TRAVELERS = 10;
  const KNOWN_LAND_PER_TRAVELER = DATA.costs.perTravelerKnown;
  const defaultState = { activities: {}, travelerCount: 1, airfare: 1000, food: 750, airport: 0, name: "" };
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

  function roomPlanBoard(stay) {
    if (!stay.roomOptions?.length) return "";
    return `<section class="room-plan-board" aria-label="Suggested room arrangements for ${stay.name}"><div class="room-plan-heading"><span>Suggested room arrangements</span><small>Working plan · confirm before arrival</small></div>${stay.roomOptions.map(option => `<article class="room-option"><div><span>${option.label}</span><strong>${option.title}</strong></div><ul>${option.rooms.map(room => `<li>${room}</li>`).join("")}</ul><p>${option.note}</p></article>`).join("")}</section>`;
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
      return `<section class="trip-chapter" aria-labelledby="chapter-${stay.id}"><div class="chapter-heading"><span>${chapter.number}</span><div><p class="eyebrow">${stay.area}</p><h2 id="chapter-${stay.id}">${chapter.title}</h2><p>${chapter.intro}</p></div></div><div class="chapter-layout"><article class="chapter-stay status-${stay.statusType}"><div class="chapter-photos">${stay.photos.slice(0, 2).map((photo, index) => `<button class="gallery-photo" data-stay="${stay.id}" data-index="${index}" aria-label="Open ${stay.name} photo ${index + 1}"><img src="${photo}" loading="lazy" alt="${stay.name} listing preview ${index + 1}"></button>`).join("")}</div><div class="chapter-stay-copy"><span class="chapter-status ${stay.statusType}">${stay.status}</span><h3>${stay.name}</h3><div class="stay-date"><span>Exact stay dates</span><strong>${stay.dateLabel}</strong><small>${stay.address}</small></div>${missingNote}<p>${stay.roomPlan}</p>${roomPlanBoard(stay)}<p class="photo-source">${stay.sourceNote}</p><div class="chapter-actions"><button class="button primary gallery-open" data-stay="${stay.id}">View preview photos</button>${stay.dateLinks.map(item => `<a class="button quiet" href="${item.url}" target="_blank" rel="noreferrer">${item.label} ↗</a>`).join("")}</div></div></article><div class="chapter-possibilities"><div class="possibilities-heading"><p class="eyebrow">Choose what sounds good</p><h3>Things we could do from this base</h3><p>“Plan it” adds the displayed amount to your calculator. “Interested” remembers the idea without charging it yet.</p></div><div class="activity-grid chapter-activity-grid">${activities}</div><div class="dining-board"><div class="dining-heading"><p class="eyebrow">Meals near this stay</p><h3>Dinner ideas, including a night at home</h3><p>These are already covered by whichever food reserve you choose later, so they are not added twice.</p></div><div class="dining-grid">${dining}</div></div></div></div></section>`;
    }).join("");
  }

  function renderBookings() {
    const summary = document.querySelector("#bookingSummary");
    const list = document.querySelector("#bookingList");
    const ledger = document.querySelector("#contributionTable");
    if (!summary || !list || !ledger) return;
    summary.innerHTML = [
      ["Booked lodging pool", moneyExact(DATA.costs.lodgingBooked), "Killarney + Lahinch"],
      ["Lodging per paying adult", moneyExact(DATA.costs.lodgingPerPayer), "Booked lodging divided by 7"],
      ["Two confirmed SUVs", moneyExact(DATA.costs.carsConfirmed), "Tracked separately from lodging"],
      ["Future Lahinch installment", money(DATA.costs.lahinchRemainingUsd), `€${DATA.costs.lahinchRemainingEur.toLocaleString("en-US", { minimumFractionDigits: 2 })} due Apr 27, 2027`]
    ].map(([label, value, note]) => `<article><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join("");

    list.innerHTML = DATA.bookings.map(item => `<article class="booking-item"><div class="booking-icon">${item.category.slice(0, 1)}</div><div class="booking-copy"><div class="booking-top"><span>${item.category} · ${item.family}</span><span class="status-chip ${item.status}">${item.statusLabel}</span></div><h3>${item.title}</h3><p>${item.detail}</p></div><div class="booking-amount">${item.amount == null ? "<strong>Cost needed</strong>" : `<strong>${moneyExact(item.amount)}</strong>${item.original ? `<small>${item.original}</small>` : ""}`}</div></article>`).join("");

    const williamsFamily = DATA.families.find(family => family.name === "Williams family");
    const williamsCurrentDue = (williamsFamily.lodgingPayers * DATA.costs.lodgingPerPayer) - williamsFamily.lodgingBooked;
    const dublinCatchUpAmount = williamsCurrentDue / (1 - (williamsFamily.lodgingPayers / DATA.costs.lodgingPayers));
    const dublinAllowance = DATA.projection.items.find(item => item.label === "Dublin lodging").amount;
    const williamsDueAfterDublin = williamsCurrentDue - (dublinAllowance * (1 - (williamsFamily.lodgingPayers / DATA.costs.lodgingPayers)));
    ledger.innerHTML = `<div class="pool-callout"><div><span>Booked lodging to split</span><strong>${moneyExact(DATA.costs.lodgingBooked)}</strong><small>Knockmanagh ${moneyExact(DATA.costs.killarneyConfirmed)} + Lahinch ${moneyExact(2921)}</small></div><div><span>Split among</span><strong>${DATA.costs.lodgingPayers} paying adults</strong><small>Children are not counted in this pool split</small></div><div><span>Approximate adult share</span><strong>${moneyExact(DATA.costs.lodgingPerPayer)}</strong><small>Family totals below absorb the 3-cent rounding difference</small></div></div><div class="contribution-table lodging-ledger"><div class="contribution-head"><span>Family</span><span>Paying adults</span><span>Family lodging share</span><span>Lodging booked by family</span><span>Current pool position</span></div>${DATA.families.map(family => {
      const share = family.lodgingPayers * DATA.costs.lodgingPerPayer;
      const position = family.lodgingBooked - share;
      return `<article><div class="family-cell"><strong>${family.name}</strong><small>${family.members}</small><p>${family.items}</p></div><span class="ledger-cell"><small>Paying adults</small><strong>${family.lodgingPayers}</strong><small>${family.lodgingPayerNames}</small></span><span class="ledger-cell"><small>Family lodging share</small><strong>${moneyExact(share)}</strong></span><span class="ledger-cell"><small>Lodging booked by family</small><strong>${moneyExact(family.lodgingBooked)}</strong></span><span class="ledger-cell"><small>Current pool position</small><strong class="${position >= 0 ? "ahead" : "behind"}">${position >= 0 ? `${moneyExact(position)} ahead` : `${moneyExact(Math.abs(position))} due`}</strong></span></article>`;
    }).join("")}</div><div class="settlement-note"><strong>How the Dublin booking can catch Williams family up</strong><p>Williams family currently has ${moneyExact(williamsCurrentDue)} left in its lodging share. If that family books all of the group’s Dublin rooms, the full booking receives family credit and the new combined lodging pool is still divided among seven adults. At the family’s current ${moneyExact(dublinAllowance)} Dublin estimate, Williams family would have about ${moneyExact(Math.max(0, williamsDueAfterDublin))} left to contribute. A Dublin total of about ${moneyExact(dublinCatchUpAmount)} would put the family approximately even.</p><p>Either approved Dublin setup can stay in the pool: three family rooms with William, Mary and Misti together, or four rooms with a separate room for Misti.</p></div><p class="ledger-footnote">This ledger covers only the two homes already booked. It excludes airfare, both SUVs, Dublin lodging, fuel, mileage, tolls, parking, food and activities. “Booked by family” is the obligation assigned to that family, not proof that every vendor installment has already posted.</p>`;
  }

  function renderTotalPicture() {
    const container = document.querySelector("#totalPicture");
    if (!container) return;
    const projection = DATA.projection;
    const committed = projection.items.filter(item => item.stage === "committed").reduce((sum, item) => sum + item.amount, 0);
    const projected = projection.items.reduce((sum, item) => sum + item.amount, 0);
    const remaining = projected - committed;
    const projectedPerTraveler = projected / projection.travelers;
    const goalDifference = projected - projection.goalGroup;
    const contingency = projection.items.find(item => item.label === "Trip contingency")?.amount || 0;
    const committedPercent = Math.min(100, (committed / projected) * 100);
    const goalPercent = Math.min(100, (projection.goalGroup / projected) * 100);

    container.innerHTML = `<div class="total-compare"><article><span>Original budget starting point</span><strong>${money(projection.goalGroup)}</strong><small>${projection.travelers} travelers × ${money(projection.goalPerTraveler)} each</small></article><article><span>Booked or issued value so far</span><strong>${moneyExact(committed)}</strong><small>${money(committed / projection.travelers)} per traveler equivalent</small></article><article class="projected"><span>Projected all-in budget</span><strong>${money(projected)}</strong><small>${money(projectedPerTraveler)} per traveler · meals included</small></article></div><div class="budget-meter" aria-label="Committed costs compared with the projected trip total"><div class="meter-labels"><span>${moneyExact(committed)} committed</span><span>${moneyExact(remaining)} still planned</span></div><div class="meter-track"><span class="meter-fill" style="width:${committedPercent}%"></span><i class="goal-marker" style="left:${goalPercent}%"><b>${projection.travelers} × ${money(projection.goalPerTraveler)} starting goal</b></i></div></div><div class="projection-table"><div class="projection-head"><span>Trip component</span><span>Amount</span><span>Current status</span><span>What the number means</span></div>${projection.items.map(item => `<article><div><strong>${item.label}</strong><small>${item.stage === "committed" ? "Included in booked/issued value" : "Included in future allowance"}</small></div><span class="projection-amount">${moneyExact(item.amount)}</span><span><b class="projection-status ${item.stage}">${item.status}</b></span><p>${item.note}</p></article>`).join("")}</div><div class="goal-result ${goalDifference > 0 ? "over" : "under"}"><div><span>Compared with the ${projection.travelers} × ${money(projection.goalPerTraveler)} starting point</span><strong>${goalDifference > 0 ? `${money(goalDifference)} over for the group` : `${money(Math.abs(goalDifference))} under for the group`}</strong><small>${goalDifference > 0 ? `${money(goalDifference / projection.travelers)} over` : `${money(Math.abs(goalDifference) / projection.travelers)} under`} per traveler</small></div><p>The current working projection is about ${money(projected)} total, or ${money(projectedPerTraveler)} each. It includes meals and a ${money(contingency)} contingency. The difference below ${money(projection.goalGroup)} remains available if an unbooked item costs more than its allowance.</p></div><p class="projection-footnote"><strong>Transparency note:</strong> “Booked or issued value” is not the same as cash already posted. It includes estimated airfare for seven travelers, points used for both SUVs and the full value of booked lodging even when a later installment remains due. Planning allowances are not quotes and are shown separately.</p>`;
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
    const perTravelerTotal = Number(state.airfare) + KNOWN_LAND_PER_TRAVELER + Number(state.food) + activityCost;
    const total = perTravelerTotal * travelerCount + Number(state.airport || 0);
    document.querySelector("#budgetTotalLabel").textContent = `Total for ${travelerCount} ${travelerCount === 1 ? "traveler" : "travelers"}`;
    document.querySelector("#personalTotal").textContent = money(total);
    document.querySelector("#budgetScope").textContent = `${money(perTravelerTotal)} per traveler × ${travelerCount}, plus ${money(Number(state.airport || 0))} household DFW cost counted once`;
    const multiplier = travelerCount > 1 ? ` × ${travelerCount}` : "";
    const lines = [[`Flight amount (${money(Number(state.airfare))}${multiplier})`, Number(state.airfare) * travelerCount], [`Current known land share (${money(KNOWN_LAND_PER_TRAVELER)}${multiplier})`, KNOWN_LAND_PER_TRAVELER * travelerCount], [`Food reserve (${money(Number(state.food))}${multiplier})`, Number(state.food) * travelerCount], [`Planned activities (${money(activityCost)}${multiplier})`, activityCost * travelerCount], ["Household DFW cost · once", state.airport || 0]];
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
    const perTravelerTotal = Number(state.airfare) + KNOWN_LAND_PER_TRAVELER + Number(state.food) + activityCost;
    const total = perTravelerTotal * travelerCount + Number(state.airport || 0);
    return [`IRELAND 2027 — ${name}`, "", `PAYING FOR: ${travelerCount} ${travelerCount === 1 ? "TRAVELER" : "TRAVELERS"}`, "", "ACTIVITIES", ...(activityLines.length ? activityLines : ["- No activity choices yet"]), "", `Current subtotal per traveler: ${money(perTravelerTotal)}`, `Combined current subtotal for ${travelerCount} ${travelerCount === 1 ? "traveler" : "travelers"}: ${money(total)}`, "", `Flight amount per traveler: ${money(Number(state.airfare))}`, `Known shared land commitments per traveler: about ${money(KNOWN_LAND_PER_TRAVELER)}`, "  (two SUVs + confirmed Killarney + confirmed Lahinch)", `Food reserve per traveler: ${money(Number(state.food))}`, "  (paid during the trip; not part of the shared pot)", `Household DFW parking/ride counted once: ${money(Number(state.airport || 0))}`, "", "NOT YET INCLUDED: Dublin lodging, fuel, extra rental mileage, tolls and Ireland parking.", "Selected activity costs are multiplied by the number of travelers shown above.", "Alcohol, personal shopping, car-seat questions and special room needs remain separate."].join("\n");
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
    const travelerName = document.querySelector("#travelerName");
    state.travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    if (!DATA.travelers.includes(state.name)) state.name = "";
    travelerCount.value = String(state.travelerCount); airfare.value = String(state.airfare); food.value = String(state.food); airport.value = String(state.airport || 0);
    travelerName.innerHTML = `<option value="">Choose your name</option>${DATA.travelers.map(name => `<option value="${name}">${name}</option>`).join("")}`;
    travelerName.value = state.name;
    travelerCount.addEventListener("change", () => { state.travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(travelerCount.value) || 1)); saveState(); });
    airfare.addEventListener("change", () => { state.airfare = Number(airfare.value); saveState(); });
    food.addEventListener("change", () => { state.food = Number(food.value); saveState(); });
    airport.addEventListener("input", () => { state.airport = Math.max(0, Number(airport.value) || 0); saveState(); });
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

  renderTripChapters(); renderBookings(); renderTotalPicture(); renderAlternates(); initializeRouteMap(); bindChoiceButtons(); bindGallery(); bindControls(); bindNavigation(); updateBudget(); updateSummary();
})();

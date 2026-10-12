(() => {
  const DATA = window.TRIP_DATA;
  const STORAGE_KEY = "ireland-2027-static-choices";
  const TOTAL_TRAVELERS = 10;
  const defaultState = { activities: {}, participants: {}, travelerCount: 1, airfare: 1000, food: 750, airport: 0, name: "" };
  let state = loadState();
  let galleryStay = null;
  let galleryIndex = 0;
  let galleryTrigger = null;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const merged = { ...defaultState, ...saved, activities: saved.activities || {}, participants: saved.participants || {} };
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
    const labels = { yes: "Add to my day", maybe: "Interested", no: "Skip" };
    return '<div class="choice-row" role="group" aria-label="Choose an activity">' +
      ["yes", "maybe", "no"].map(choice => '<button data-kind="' + kind + '" data-id="' + id + '" data-choice="' + choice +
        '" aria-pressed="' + (selected === choice) + '" class="' + (selected === choice ? "selected" : "") + '">' + labels[choice] + '</button>').join("") + '</div>';
  }
  function activityCard(activity) {
    const selected = state.activities[activity.id] === "yes";
    return '<article class="activity-card" id="activity-' + activity.id + '"><div class="activity-top"><span class="day-pill">' + activity.day +
      '</span><span class="cost-pill">' + (activity.cost ? money(activity.cost) + ' / person estimate' : 'Free to explore') +
      '</span></div><h3>' + activity.title + '</h3><p class="activity-meta">' + activity.distance + '</p><p class="activity-duration">' + activity.duration +
      '</p><details class="activity-detail"><summary>What to expect</summary><p>' + activity.note +
      '</p></details>' + choiceButtons("activities", activity.id) +
      '<label class="activity-party" data-party-for="' + activity.id + '"' + (selected ? '' : ' hidden') +
      '>How many of your travelers?<select data-participants="' + activity.id + '" aria-label="Number joining ' + activity.title + '"></select></label>' +
      '<div class="activity-impact" data-activity-impact="' + activity.id + '"></div><a href="' + activity.link +
      '" target="_blank" rel="noreferrer">' + (activity.linkLabel || "Official details & current prices ↗") + '</a></article>';
  }
  function roomPlanBoard(stay) {
    if (!stay.roomOptions?.length) return "";
    return `<section class="room-plan-board" aria-label="Suggested room arrangements for ${stay.name}"><div class="room-plan-heading"><span>Suggested room arrangements</span><small>Working plan · confirm before arrival</small></div>${stay.roomOptions.map(option => `<article class="room-option"><div><span>${option.label}</span><strong>${option.title}</strong></div><ul>${option.rooms.map(room => `<li>${room}</li>`).join("")}</ul><p>${option.note}</p></article>`).join("")}</section>`;
  }

  function renderTripChapters() {
    const container = document.querySelector("#tripChapters");
    const chapters = [
      { area: "Dublin", id: "july-capel-street", number: "01", title: "Hello, Dublin.", intro: "Drop the bags. Find a café. Meet Ireland on foot, one easy block at a time.",
        vibe: "City life on the doorstep", plan: [["Jun 1 · Tuesday", "Land & settle in", "Arrive at 9:45 AM. Transfer to The July, allow for luggage storage before check-in, and keep the afternoon flexible."], ["Jun 2 · Wednesday", "Make the city your own", "Try the sightseeing bus, castle grounds and a daytime Temple Bar wander. Meet back up for dinner near Capel Street."], ["Jun 3 · Thursday", "On to Kerry", "Drivers collect the SUVs at 10 AM on Baggot Street. Load up, stop for lunch, and aim for the house’s 5–7 PM check-in."]] },
      { area: "Killarney", id: "knockmanagh", number: "02", title: "Lakes, mountains & a home together.", intro: "Our countryside base for slow breakfasts, lake views and a good dinner around the table.",
        vibe: "Three nights in the Kerry countryside", plan: [["Jun 3 · Thursday", "Make ourselves at home", "Arrive, unpack and pick up groceries. An easy dinner is enough after the drive."], ["Jun 4 · Friday", "A national park kind of day", "Pair Muckross with lake views or Ross Castle. Choose short walks and café breaks to suit everyone."], ["Jun 5 · Saturday", "Choose the pace", "One SUV could head for Dingle; the other could stay local. This is our second full day, so choose Dingle or a Ring of Kerry day, not both."]] },
      { area: "Clare", id: "lahinch-golf", number: "03", title: "A few days by the Atlantic.", intro: "Cliff views, sheepdogs, seaside dinners—and perhaps a round of golf while the others explore.",
        vibe: "A golf-course home near the coast", plan: [["Jun 6 · Sunday", "The road to Lahinch", "Knockmanagh checkout is 10 AM; Lahinch check-in is from 2 PM. Leave room for lunch and breaks. Add Bunratty only if the group wants a longer transfer day."], ["Jun 7 · Monday", "Cliffs or the Burren", "Pick a weather-friendly time for the Cliffs. Sheepdogs at Caherconnell are an opt-in alternative or a separate half-day. June 7 is Ireland’s public holiday."], ["Jun 8 · Tuesday", "Two SUVs, two good days", "Golfers can consider the Castle Course; everyone else can enjoy Lahinch, the Burren or another coastal stop. Dinner together is the easy meeting point."]] },
      { area: "Dublin Airport", id: "clayton-airport", number: "04", title: "One last dinner. An easier morning.", intro: "Laney has the final hotel arranged, close to the airport for our flight home.",
        vibe: "Booked · June 9–10 · covered by Laney", plan: [["Jun 9 · Wednesday", "Return the cars & settle in", "Leave Lahinch with time for stops and the 4 PM Hertz returns on Baggot Street. Allow a separate transfer from the city to Clayton."], ["That evening", "Dinner, bags & a breather", "Keep dinner at the hotel simple. Pack, check flight details and agree on the morning meeting time."], ["Jun 10 · Thursday", "Airport shuttle & home", "AA 133 departs at 11:45 AM. Aim to be at the terminal around 8:30 AM, allowing extra time for the shuttle and US preclearance. Recheck airline guidance before travel."]] }
    ];
    container.innerHTML = chapters.map(chapter => {
      const stay = DATA.stays.find(item => item.id === chapter.id);
      const local = DATA.activities.filter(item => item.area === chapter.area);
      const main = local.filter(item => !item.optional).map(activityCard).join("");
      const other = local.filter(item => item.optional).map(activityCard).join("");
      const dining = DATA.dining.filter(item => item.area === chapter.area).map(item =>
        '<article class="dining-card"><span>' + item.label + '</span><h4>' + item.title + '</h4><p>' + item.note +
        '</p><a href="' + item.link + '" target="_blank" rel="noreferrer">Menu & details ↗</a></article>').join("");
      const rooms = stay.roomOptions?.length ? '<details class="stay-details"><summary>See our suggested room arrangement</summary>' +
        roomPlanBoard(stay) + '</details>' : '<p class="room-pending">Room types and sleeping arrangements will be added when the hotel details arrive.</p>';
      const shuttle = chapter.id === "clayton-airport" ? '<div class="shuttle-note"><strong>Complimentary airport shuttle</strong><p>Currently runs 24/7, every 20–25 minutes; about 10 minutes to the airport. Allow walking time to the terminal. Recheck before departure.</p><a href="https://www.claytonhotels.com/dublin-airport/airport-parking/shuttle-bus/" target="_blank" rel="noreferrer">Clayton shuttle details ↗</a></div>' : '';
      return '<section class="trip-chapter" aria-labelledby="chapter-' + stay.id + '"><div class="chapter-heading"><span>' + chapter.number +
        '</span><div><p class="eyebrow">' + stay.dateLabel + '</p><h2 id="chapter-' + stay.id + '">' + chapter.title + '</h2><p>' + chapter.intro +
        '</p></div></div><article class="chapter-stay status-' + stay.statusType + '"><div class="chapter-photos ' + (stay.photos.length === 1 ? "single-photo" : "") + '">' +
        stay.photos.slice(0, 2).map((photo, index) => '<button class="gallery-photo" data-stay="' + stay.id + '" data-index="' + index +
          '" aria-label="Open ' + stay.name + ' photo ' + (index + 1) + '"><img src="' + photo + '" loading="lazy" alt="' + stay.name + ' ' +
          (stay.photoLabel || "property preview") + '"></button>').join("") + '</div><div class="chapter-stay-copy"><span class="chapter-status ' +
        stay.statusType + '">' + stay.status + '</span><h3>' + stay.name + '</h3><p class="stay-vibe">' + chapter.vibe +
        '</p><div class="stay-date"><strong>' + stay.dateLabel + '</strong><small>' + stay.address + '</small></div>' + rooms + shuttle +
        '<details class="stay-details"><summary>Reservation notes & source</summary><p>' + stay.roomPlan + '</p><p>' + stay.sourceNote +
        '</p></details><div class="chapter-actions"><button class="button quiet gallery-open" data-stay="' + stay.id +
        '">Photos</button><a class="button primary" href="' + stay.link + '" target="_blank" rel="noreferrer">Explore the property ↗</a><a class="directions-link" href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(stay.name + ' ' + stay.address) + '" target="_blank" rel="noreferrer">Find it on the map ↗</a></div></div></article>' +
        '<div class="day-sketch"><p class="eyebrow">How these days could feel · flexible suggestions</p><div>' + chapter.plan.map(day =>
          '<article><span>' + day[0] + '</span><h3>' + day[1] + '</h3><p>' + day[2] + '</p></article>').join("") + '</div></div>' +
        (main ? '<div class="chapter-possibilities"><div class="possibilities-heading"><h3>What sounds like your kind of day?</h3><p>Distances are approximate, one-way from this base. Costs are USD planning allowances per participant, not live quotes. See official links before booking.</p></div><div class="activity-grid chapter-activity-grid">' + main +
          '</div>' + (other ? '<details class="more-ideas"><summary>One more indoor idea, if interests change</summary><div class="activity-grid">' + other + '</div></details>' : '') +
          (dining ? '<details class="dining-board"><summary>Dinner ideas for this stop</summary><p>Included in your food allowance below; selecting activities does not add these meals again. Earlier menu references are estimates—check current menus.</p><div class="dining-grid">' + dining + '</div></details>' : '') + '</div>' : '') + '</section>';
    }).join("");
  }
  function renderBookings() {
    const summary = document.querySelector("#bookingSummary");
    const list = document.querySelector("#bookingList");
    const ledger = document.querySelector("#contributionTable");
    if (!summary || !list || !ledger) return;
    summary.innerHTML = [
      ["Two booked homes · full value", moneyExact(DATA.costs.lodgingBooked), "Killarney + Lahinch"],
      ["Dublin hotel totals", "Receipts to add", "William: The July · Laney: Clayton"],
      ["Two confirmed SUVs", moneyExact(DATA.costs.carsConfirmed), "Paid with points; dollar value shown"],
      ["Future Lahinch installment", money(DATA.costs.lahinchRemainingUsd), `€${DATA.costs.lahinchRemainingEur.toLocaleString("en-US", { minimumFractionDigits: 2 })} due Apr 27, 2027`]
    ].map(([label, value, note]) => `<article><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join("");

    list.innerHTML = DATA.bookings.map(item => `<article class="booking-item"><div class="booking-icon">${item.category.slice(0, 1)}</div><div class="booking-copy"><div class="booking-top"><span>${item.category} · ${item.family}</span><span class="status-chip ${item.status}">${item.statusLabel}</span></div><h3>${item.title}</h3><p>${item.detail}</p></div><div class="booking-amount">${item.amount == null ? "<strong>Cost needed</strong>" : `<strong>${moneyExact(item.amount)}</strong>${item.original ? `<small>${item.original}</small>` : ""}`}</div></article>`).join("");

    ledger.innerHTML = `<div class="pool-callout"><div><span>Two-home value in prior split</span><strong>${moneyExact(DATA.costs.lodgingBooked)}</strong><small>Knockmanagh ${moneyExact(DATA.costs.killarneyConfirmed)} + Lahinch ${moneyExact(2921)}</small></div><div><span>Split among</span><strong>${DATA.costs.lodgingPayers} paying adults</strong><small>Children are not counted in this pool split</small></div><div><span>Approximate adult share</span><strong>${moneyExact(DATA.costs.lodgingPerPayer)}</strong><small>Displayed shares may differ by a cent due to rounding</small></div></div><div class="contribution-table lodging-ledger"><div class="contribution-head"><span>Family</span><span>Paying adults</span><span>Family lodging share</span><span>Home value assigned</span><span>Home-only comparison</span></div>${DATA.families.map(family => {
      const share = family.lodgingPayers * DATA.costs.lodgingPerPayer;
      const position = family.lodgingBooked - share;
      return `<article><div class="family-cell"><strong>${family.name}</strong><small>${family.members}</small><p>${family.items}</p></div><span class="ledger-cell"><small>Paying adults</small><strong>${family.lodgingPayers}</strong><small>${family.lodgingPayerNames}</small></span><span class="ledger-cell"><small>Family lodging share</small><strong>${moneyExact(share)}</strong></span><span class="ledger-cell"><small>Home value assigned</small><strong>${moneyExact(family.lodgingBooked)}</strong></span><span class="ledger-cell"><small>Home-only comparison</small><strong class="${position >= 0 ? "ahead" : "behind"}">${position >= 0 ? `${moneyExact(position)} above share` : `${moneyExact(Math.abs(position))} below share`}</strong></span></article>`;
    }).join("")}</div><div class="settlement-note"><strong>Dublin coverage is now assigned separately</strong><p>William is covering The July for June 1–3; booking confirmation and price are still needed. Laney booked and is covering Clayton for June 9–10; its price and payment status are still needed. Neither stay has a verified amount to credit here.</p><p>The prior seven-adult split above is a comparison for the two homes only. Confirm how the family wants to reconcile these covered stays before treating any difference as a payment request.</p></div><p class="ledger-footnote">Assigned reservation values do not establish payments to vendors or reimbursements between families. Lahinch still has €1,668.75 due April 27, 2027; Killarney’s payment posting is unverified. This model excludes both Dublin stays, airfare, vehicles and daily spending. Fuel, food and attractions are paid as we go.</p>`;
  }

  function renderTotalPicture() {
    const container = document.querySelector("#totalPicture");
    if (!container) return;
    const projection = DATA.projection;
    const committed = projection.items.filter(item => item.stage === "committed").reduce((sum, item) => sum + item.amount, 0);
    const projected = projection.items.reduce((sum, item) => sum + item.amount, 0);
    const remaining = projected - committed;
    const dublinAllowance = projection.items.find(item => item.label === "Dublin lodging").amount;
    const projectedPerTraveler = projected / projection.travelers;
    const goalDifference = projected - projection.goalGroup;
    const contingency = projection.items.find(item => item.label === "Trip contingency")?.amount || 0;
    const committedPercent = committed / Math.max(projected, projection.goalGroup) * 100;
    const meterMax = Math.max(projected, projection.goalGroup);
    const goalPercent = projection.goalGroup / meterMax * 100;

    container.innerHTML = `<div class="total-compare"><article><span>Original budget starting point</span><strong>${money(projection.goalGroup)}</strong><small>${projection.travelers} travelers × ${money(projection.goalPerTraveler)} each</small></article><article><span>Base value · includes estimates</span><strong>${moneyExact(committed)}</strong><small>${money(committed / projection.travelers)} per traveler equivalent</small></article><article class="projected"><span>Projected all-in budget</span><strong>${money(projected)}</strong><small>${money(projectedPerTraveler)} per traveler · meals included</small></article></div><div class="budget-meter" aria-label="Base value and allowances in the projected trip total"><div class="meter-labels"><span>${moneyExact(committed)} base value</span><span>${moneyExact(remaining)} in allowances</span></div><div class="meter-track"><span class="meter-fill" style="width:${committedPercent}%"></span><i class="goal-marker" style="left:${goalPercent}%"><b>${projection.travelers} × ${money(projection.goalPerTraveler)} starting goal</b></i></div></div><div class="projection-table"><div class="projection-head"><span>Trip component</span><span>Amount</span><span>Current status</span><span>What the number means</span></div>${projection.items.map(item => `<article><div><strong>${item.label}</strong><small>${item.stage === "committed" ? "Included in base value; see status" : "Included as a planning allowance"}</small></div><span class="projection-amount">${moneyExact(item.amount)}</span><span><b class="projection-status ${item.stage}">${item.status}</b></span><p>${item.note}</p></article>`).join("")}</div><div class="goal-result ${goalDifference > 0 ? "over" : "under"}"><div><span>Compared with the ${projection.travelers} × ${money(projection.goalPerTraveler)} starting point</span><strong>${goalDifference > 0 ? `${money(goalDifference)} over for the group` : `${money(Math.abs(goalDifference))} under for the group`}</strong><small>${goalDifference > 0 ? `${money(goalDifference / projection.travelers)} over` : `${money(Math.abs(goalDifference) / projection.travelers)} under`} per traveler</small></div><p>The current working projection is about ${money(projected)} total, or ${money(projectedPerTraveler)} each. It includes meals and a ${money(contingency)} contingency. The difference below ${money(projection.goalGroup)} remains available if an unbooked item costs more than its allowance.</p></div><p class="projection-footnote"><strong>What is included:</strong> ${moneyExact(committed)} combines $9,999.27 airfare (only Justin family’s $2,999.78 is exact), $4,231.68 for the two homes and $1,452.80 of vehicle value paid with points. Adding the single ${moneyExact(dublinAllowance)} Dublin estimate gives ${moneyExact(committed + dublinAllowance)} before daily spending and other allowances. These are reservation values and estimates, not a paid total. Dublin’s actual prices will replace that allowance. Vendor balances remain due and Killarney’s payment posting is unverified.</p><p class="projection-footnote"><strong>Still to clarify:</strong> Laney mentioned “everyone around $2,100–$2,200,” but the scope and what it includes are unresolved. It is not used as the trip total or as an amount owed. Fuel, food and attractions are paid as we go; their allowances above are budget placeholders.</p>`;
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
      { label: "1", stayId: "july-capel-street", coords: [53.3464837, -6.2686354] },
      { label: "2", stayId: "knockmanagh", coords: [52.108, -9.47] },
      { label: "3", stayId: "lahinch-golf", coords: [52.935, -9.346] },
      { label: "4", stayId: "clayton-airport", coords: [53.4117188, -6.2181764] }
    ].map(stop => ({ ...stop, stay: DATA.stays.find(stay => stay.id === stop.stayId) }));
    const route = stops.map(stop => stop.coords);
    const map = L.map(mapElement, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    stops.forEach(stop => {
      const icon = L.divIcon({ className: "route-marker-shell", html: `<span class="route-marker">${stop.label}</span>`, iconSize: [44, 44], iconAnchor: [22, 22] });
      L.marker(stop.coords, { icon }).addTo(map).bindPopup(`<strong>${stop.stay.name}</strong><br>${stop.stay.dateLabel}<br>${stop.stay.status}`);
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
      document.querySelectorAll(`button[data-kind="${kind}"][data-id="${id}"]`).forEach(item => { item.classList.toggle("selected", item.dataset.choice === choice); item.setAttribute("aria-pressed", String(item.dataset.choice === choice)); });
      saveState();
    });
    document.addEventListener("change", event => {
      const input = event.target.closest("[data-participants]");
      if (!input) return;
      state.participants[input.dataset.participants] = Number(input.value);
      saveState();
    });
  }

  function updateBudget() {
    const budget = calculateBudget();
    document.querySelector("#travelerCount").value = String(budget.count);
    document.querySelector("#activityGroupSize").value = String(budget.count);
    document.querySelector("#budgetTotalLabel").textContent = "Estimated total expense · " + budget.count + (budget.count === 1 ? " traveler" : " travelers");
    document.querySelector("#personalTotal").textContent = money(budget.total);
    document.querySelector("#budgetScope").textContent = money(budget.total / budget.count) + " per traveler equivalent · includes earlier purchases and future spending";
    const lines = [
      ["Airfare · already purchased / assumed equal", budget.flight],
      ["Two homes · full reservation value", budget.homes],
      ["Dublin hotels · allowance, receipts needed", budget.dublin],
      ["Two SUVs · value of points used", budget.cars],
      ["Food · pay as we go", budget.food],
      ["Fuel · pay as we go", budget.fuel],
      ["Other ground travel · allowance", budget.ground],
      ["My chosen activities · pay as we go", budget.activities],
      ["Household DFW parking / rides · counted once", budget.airport],
      ["Unspent cushion", budget.cushion]
    ];
    document.querySelector("#budgetBreakdown").innerHTML = lines.map(([label, value]) => '<div class="breakdown-line"><span>' + label +
      '</span><strong>' + money(value) + '</strong></div>').join("");
    document.querySelector("#activityRunningTotal").textContent = money(budget.activities) + " for your selected participants";
    DATA.activities.forEach(activity => {
      const participants = participantCount(activity.id);
      const selected = state.activities[activity.id] === "yes";
      const input = document.querySelector('[data-participants="' + activity.id + '"]');
      input.innerHTML = Array.from({ length: budget.count }, (_, index) => '<option value="' + (index + 1) + '">' + (index + 1) +
        ((index + 1) === 1 ? ' traveler' : ' travelers') + '</option>').join("");
      input.value = String(participants);
      document.querySelector('[data-party-for="' + activity.id + '"]').hidden = !selected;
      document.querySelector('[data-activity-impact="' + activity.id + '"]').textContent = selected ?
        money(activity.cost * participants) + " added for " + participants + (participants === 1 ? " participant" : " participants") :
        (state.activities[activity.id] === "maybe" ? "Saved as an idea · no cost added" : "Optional · no cost added yet");
    });
  }

  function participantCount(id) {
    const count = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    return Math.min(count, Math.max(1, Number(state.participants?.[id]) || count));
  }

  function calculateBudget() {
    const count = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    const budget = {
      count, flight: Number(state.airfare) * count, homes: DATA.costs.lodgingBooked / TOTAL_TRAVELERS * count,
      dublin: DATA.projection.items.find(item => item.label === "Dublin lodging").amount / TOTAL_TRAVELERS * count, cars: DATA.costs.carsConfirmed / TOTAL_TRAVELERS * count,
      food: Number(state.food) * count, fuel: 50 * count, ground: 70 * count, cushion: 75 * count,
      airport: Number(state.airport || 0),
      activities: DATA.activities.reduce((sum, activity) => sum + (state.activities[activity.id] === "yes" ? activity.cost * participantCount(activity.id) : 0), 0)
    };
    budget.total = budget.flight + budget.homes + budget.dublin + budget.cars + budget.food + budget.fuel +
      budget.ground + budget.cushion + budget.airport + budget.activities;
    return budget;
  }

  function renderCoverage() {
    const coverage = [
      { name: "Justin family", people: "Justin, Jamie & Kara", stays: "Lahinch golf home · June 6–9", car: "Justin’s Hertz SUV · June 3–9", value: "$3,647.40", note: "$2,921 lodging + $726.40 SUV value. Includes the future Lahinch installment; this is not a cash-paid total." },
      { name: "Cameron family", people: "Cameron, Laney, Liam & Arlo", stays: "Knockmanagh · June 3–6 + Clayton · June 9–10", car: "Cameron’s Hertz SUV · June 3–9", value: "$2,037.08 + Clayton", note: "$1,310.68 house + $726.40 SUV value. Laney has booked and is covering Clayton; its total will be added from the receipt." },
      { name: "Williams family", people: "William, Mary & Misti", stays: "The July · June 1–3", car: "William is covering the arrival stay", value: "Hotel total to add", note: "The July is selected. We still need its booking confirmation and price before calculating the final family balance." }
    ];
    document.querySelector("#familyCoverage").innerHTML = coverage.map(family => '<article><span class="eyebrow">' + family.people +
      '</span><h3>' + family.name + '</h3><p>' + family.stays + '</p><p>' + family.car +
      '</p><div><small>Reservation value being covered</small><strong>' + family.value + '</strong></div><p class="coverage-detail">' +
      family.note + '</p></article>').join("");
  }
  function buildSummary() {
    const budget = calculateBudget();
    const activityLines = DATA.activities.filter(activity => state.activities[activity.id]).map(activity =>
      "- " + activity.title + ": " + formatChoice(state.activities[activity.id]) +
      (state.activities[activity.id] === "yes" ? " · " + participantCount(activity.id) + (participantCount(activity.id) === 1 ? " person · " : " people · ") + money(activity.cost * participantCount(activity.id)) : ""));
    return [
      "IRELAND 2027 — " + (state.name || "My trip ideas"), "",
      "BUDGET FOR: " + budget.count + " traveler(s)", "",
      "ACTIVITY IDEAS", ...(activityLines.length ? activityLines : ["- No activity choices yet"]), "",
      "Estimated full trip expense: " + money(budget.total),
      "Per traveler equivalent: " + money(budget.total / budget.count),
      "Includes flights already purchased/assumed, full lodging and SUV values, Dublin allowance, food, selected activities, ground travel, DFW amount and a cushion.",
      "Not an amount owed to the pool. Family reservation coverage is tracked separately.", "",
      "Airfare: " + money(budget.flight),
      "Two homes: " + money(budget.homes),
      "Dublin hotel allowance: " + money(budget.dublin),
      "SUVs (points dollar value): " + money(budget.cars),
      "Food: " + money(budget.food),
      "Fuel: " + money(budget.fuel),
      "Other ground travel: " + money(budget.ground),
      "Chosen activities: " + money(budget.activities),
      "DFW parking/rides for household: " + money(budget.airport),
      "Unspent cushion: " + money(budget.cushion), "",
      "William covers The July; Laney covers Clayton. Actual hotel totals will replace the Dublin allowance.",
      "Fuel, food and attractions: pay as we go. These are my ideas, not a group booking or vote.",
      "Alcohol, shopping and any child-seat hire are separate."
    ].join("\n");
  }
  function formatChoice(value) {
    return ({ yes: "Added to my day", maybe: "Interested", no: "Skip" })[value] || "Not selected";
  }
  function updateSummary() {
    const summary = buildSummary();
    document.querySelector("#choiceSummary").value = summary;
    document.querySelector("#textChoices").href = `sms:?&body=${encodeURIComponent(summary)}`;
  }

  function openGallery(stayId, index = 0) {
    galleryTrigger = document.activeElement;
    galleryStay = DATA.stays.find(stay => stay.id === stayId);
    if (!galleryStay?.photos.length) return;
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
    image.alt = `${galleryStay.name} ${galleryStay.photoLabel || "listing photo"} ${galleryIndex + 1}`;
    document.querySelector("#lightboxCounter").textContent = `${galleryStay.photoLabel || "Public listing photo"} ${galleryIndex + 1} of ${galleryStay.photos.length}`;
    document.querySelectorAll("#lightboxStrip button").forEach((button, index) => button.classList.toggle("active", index === galleryIndex));
    const active = document.querySelector(`#lightboxStrip button[data-photo-index="${galleryIndex}"]`);
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function closeGallery() {
    document.querySelector("#lightbox").hidden = true;
    document.body.style.overflow = "";
    galleryTrigger?.focus();
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
      if (event.key === "Tab") {
        const controls = [...document.querySelectorAll('#lightbox button, #lightbox a[href]')];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
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
    const activityGroupSize = document.querySelector("#activityGroupSize");
    activityGroupSize.innerHTML = travelerCount.innerHTML;
    state.travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(state.travelerCount) || 1));
    if (!DATA.travelers.includes(state.name)) state.name = "";
    travelerCount.value = String(state.travelerCount); airfare.value = String(state.airfare); food.value = String(state.food); airport.value = String(state.airport || 0);
    travelerName.innerHTML = `<option value="">Choose your name</option>${DATA.travelers.map(name => `<option value="${name}">${name}</option>`).join("")}`;
    travelerName.value = state.name;
    travelerCount.addEventListener("change", () => { state.travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(travelerCount.value) || 1)); saveState(); });
    activityGroupSize.addEventListener("change", () => { state.travelerCount = Math.min(TOTAL_TRAVELERS, Math.max(1, Number(activityGroupSize.value) || 1)); saveState(); });
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

  renderTripChapters(); renderCoverage(); renderBookings(); renderTotalPicture(); renderAlternates(); initializeRouteMap(); bindChoiceButtons(); bindGallery(); bindControls(); bindNavigation(); updateBudget(); updateSummary();
})();

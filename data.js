window.TRIP_DATA = {
  updated: "August 24, 2026",
  fx: { date: "August 20, 2026", eurUsd: 1.1681, source: "European Central Bank" },
  costs: {
    airfareExactJustin: 2999.78,
    airfarePerTraveler: 999.93,
    airfareEstimatedAll: 9999.27,
    confirmedShared: 5684.48,
    pendingShared: 0,
    knownShared: 5684.48,
    perTravelerKnown: 568.45,
    overallConfirmedEstimated: 15683.75,
    overallKnown: 15683.75,
    perTravelerOverallKnown: 1568.38,
    carsConfirmed: 1452.80,
    killarneyConfirmed: 1310.68,
    lodgingBooked: 4231.68,
    lodgingPayers: 7,
    lodgingPerPayer: 604.5257142857,
    lahinchTotalEur: 2502.28,
    lahinchRemainingEur: 1668.75,
    lahinchRemainingUsd: 1949.27
  },
  projection: {
    travelers: 10,
    goalGroup: 32000,
    goalPerTraveler: 3200,
    items: [
      { label: "Airfare for 10", amount: 9999.27, stage: "committed", status: "Issued / estimated", note: "Justin family receipt is exact; the other seven tickets use the same $999.93 average until receipts are supplied." },
      { label: "Two booked homes", amount: 4231.68, stage: "committed", status: "Booked", note: "Killarney and Lahinch. This is the full reservation value, although vendor installments remain." },
      { label: "Two Hertz SUVs", amount: 1452.80, stage: "committed", status: "Booked with points", note: "Points count at their stated dollar value so each family receives contribution credit." },
      { label: "Dublin lodging", amount: 2700, stage: "future", status: "Family estimate", note: "Not booked. The family expects the three-room or apartment arrangement to land near this amount; a fourth private room may increase it." },
      { label: "Meals, groceries and snacks", amount: 7500, stage: "future", status: "Balanced allowance", note: "$750 per traveler, including groceries, meals cooked at the houses, casual meals and two nicer dinners. Alcohol is separate." },
      { label: "Activities and admissions", amount: 1200, stage: "future", status: "Flexible allowance", note: "Assumes the group will select rather than do every activity. Golf and other high-cost choices remain visible separately." },
      { label: "Ireland driving costs", amount: 1200, stage: "future", status: "Planning allowance", note: "Fuel, possible extra mileage, tolls and parking. Final rental coverage and mileage terms still need verification." },
      { label: "DFW parking or rides", amount: 300, stage: "future", status: "Household allowance", note: "Assumes coordinated drop-offs, shared rides or reduced-cost parking." },
      { label: "Trip contingency", amount: 750, stage: "future", status: "Unspent reserve", note: "A modest cushion for exchange-rate movement, price changes and small items not yet captured." }
    ]
  },
  stays: [
    {
      id: "staycity",
      name: "Staycity Aparthotels Dublin City Centre",
      area: "Dublin · first 2 nights and final night",
      dateLabel: "June 1–3 and June 9–10, 2027 · 3 nights total",
      statusType: "missing",
      address: "Little Mary Street, Dublin, D07 PKW5",
      link: "https://www.booking.com/hotel/ie/staycity-aparthotels-dublin-city-centre.html?checkin=2027-06-01&checkout=2027-06-03&group_adults=7&group_children=3&age=14&age=8&age=5&no_rooms=6&selected_currency=EUR",
      dateLinks: [
        { label: "Check June 1–3", url: "https://www.booking.com/hotel/ie/staycity-aparthotels-dublin-city-centre.html?checkin=2027-06-01&checkout=2027-06-03&group_adults=7&group_children=3&age=14&age=8&age=5&no_rooms=6&selected_currency=EUR" },
        { label: "Check June 9–10", url: "https://www.booking.com/hotel/ie/staycity-aparthotels-dublin-city-centre.html?checkin=2027-06-09&checkout=2027-06-10&group_adults=7&group_children=3&age=14&age=8&age=5&no_rooms=6&selected_currency=EUR" }
      ],
      status: "Not booked · current Dublin candidate only",
      roomPlan: "Three Dublin nights remain to be reserved: two nights on arrival and the final night. Compare a three-room family arrangement with a four-room arrangement that gives Misti her own room. This candidate advertises fully equipped kitchens in its studios and apartments.",
      roomOptions: [
        { label: "Lower-cost option", title: "Three approved family rooms or apartments", rooms: ["Cameron, Laney, Liam and Arlo · room for 4", "Justin, Jamie and Kara · room for 3", "William, Mary and Misti · room for 3"], note: "Book only room types whose official occupancy allows 4, 3 and 3 guests. A standard double room may not qualify." },
        { label: "Privacy option", title: "Four rooms, including one for Misti", rooms: ["Cameron, Laney, Liam and Arlo · room for 4", "Justin, Jamie and Kara · room for 3", "William and Mary · room for 2", "Misti · room for 1"], note: "This costs more but gives Misti a private room. It can still remain in the seven-adult lodging pool if the group accepts the booked total." }
      ],
      sourceNote: "Public Booking.com listing. Price and exact June 2027 availability must be rechecked before booking.",
      photos: ["assets/staycity-1.jpg", "assets/staycity-2.jpg"]
    },
    {
      id: "knockmanagh",
      name: "Knockmanagh Holiday Home",
      area: "Killarney area · confirmed",
      dateLabel: "June 3–6, 2027 · 3 nights",
      statusType: "confirmed",
      address: "Knockmanagh, Kilcummin, County Kerry · about 11 km from Killarney",
      link: "https://www.tridentholidayhomes.ie/property/kerry/killarney/knockmanagh-holiday-home/373616/",
      dateLinks: [
        { label: "Open official property", url: "https://www.tridentholidayhomes.ie/property/kerry/killarney/knockmanagh-holiday-home/373616/" },
        { label: "See the public Vrbo listing", url: "https://www.vrbo.com/10978632ha?dateless=true" }
      ],
      status: "Confirmed reservation · booked by Cameron family",
      roomPlan: "Verified layout: one ground-floor double; upstairs are one ensuite double, one additional double and two twin bedrooms with two single beds each. The house sleeps 10, but the three children cannot all occupy one twin bedroom without an owner-approved additional bed.",
      roomOptions: [
        { label: "Works with listed beds", title: "No extra bed required", rooms: ["Ground-floor double · William and Mary", "Ensuite double · Cameron and Laney", "Double · Justin and Jamie", "Twin · Liam and Arlo", "Twin · Misti and Kara"], note: "This uses every listed bed and keeps the ground-floor bedroom available to a senior couple." },
        { label: "Preferred if approved", title: "Misti solo and the children together", rooms: ["Ground-floor double · William and Mary", "Ensuite double · Cameron and Laney", "Double · Justin and Jamie", "Twin · Misti", "Other twin · Kara, Liam and Arlo"], note: "The last room has only two listed single beds. Use this plan only if Trident confirms an additional approved bed or another safe sleeping arrangement in writing." }
      ],
      sourceNote: "Confirmed total €1,122.06 (about $1,311 at €1 = $1.1681). The joined Vrbo trip also shows the stay as booked by Laney for 7 adults and 3 children; only Laney can change or cancel it. The original email says a €112.21 confirmation charge will be made, so verify the posted charge and remaining balance with Laney. A refundable €200 security hold is separate. Check-in is 5–7 PM and checkout is 10 AM.",
      photos: ["assets/knockmanagh-1.jpg", "assets/knockmanagh-2.jpg"]
    },
    {
      id: "lahinch-golf",
      name: "Luxury 7-Bed Golf Home",
      area: "Lahinch · confirmed",
      dateLabel: "June 6–9, 2027 · 3 nights",
      statusType: "confirmed",
      address: "On Lahinch Golf Course · walkable to golf club, promenade and town",
      link: "https://www.vrbo.com/4365078",
      dateLinks: [
        { label: "Open live Vrbo listing", url: "https://www.vrbo.com/4365078" }
      ],
      status: "Booked · confirmed in Vrbo",
      roomPlan: "Sleeps 17 across 7 bedrooms and 8 beds: 6 double beds and 2 twin beds. The listing states 6 full bathrooms plus 2 half bathrooms, a kitchen and washing machine.",
      roomOptions: [
        { label: "Working arrangement", title: "Six groups with one flex bedroom", rooms: ["Cameron and Laney", "Justin and Jamie", "William and Mary", "Liam and Arlo", "Kara", "Misti", "One bedroom left flexible or spare"], note: "The seven-bedroom capacity supports this arrangement. Confirm the precise bed location in each bedroom before assigning names." }
      ],
      sourceNote: "Vrbo now shows this stay as booked for 7 adults and 3 children. Exact total: €2,502.28; the family’s working USD amount remains $2,921. Payment 2 of 2 is €1,668.75 (about $1,949 at the planning exchange rate) and is due April 27, 2027. Check-in is 2 PM and checkout is 10:30 AM. The public listing’s two reviews give an 8/10 overall score, with one June 2026 review flagging cleanliness.",
      photos: ["assets/lahinch-golf-home-1.jpg", "assets/lahinch-golf-home-2.jpg"]
    }
  ],
  dining: [
    { area: "Dublin", title: "The Woollen Mills", label: "First- or final-night dinner · roughly $35–$55 per adult", note: "A lively modern-Irish option across from Ha’penny Bridge. Current mains run about €23–€38, plus a 12.5% service charge. Reserve for a group this size after the Dublin lodging is fixed.", link: "https://www.thewoollenmills.com/menus.htm" },
    { area: "Dublin", title: "Aparthotel pantry meal", label: "Lower-cost arrival option · inside the food reserve", note: "If Staycity remains the choice, its kitchen makes a grocery breakfast or simple first-night meal possible. Keep this flexible until the Dublin rooms are actually booked.", link: "https://www.staycity.com/dublin/city-centre" },
    { area: "Killarney", title: "Cronin’s Restaurant", label: "Casual Irish dinner · roughly $30–$50 per adult", note: "A family-run Killarney option for fish and chips, shepherd’s pie, burgers and local dishes. Current mains are mostly €18.95–€33; booking is recommended.", link: "https://croninsrestaurant.com/our-menu/" },
    { area: "Killarney", title: "Dinner at Knockmanagh", label: "Cook together · already covered by the $700–$850 food reserve", note: "The confirmed house has a kitchen and utility room. A grocery stop can cover breakfast, packed snacks and one or two relaxed dinners without another drive into town.", link: "https://www.tridentholidayhomes.ie/property/kerry/killarney/knockmanagh-holiday-home/373616/" },
    { area: "Clare", title: "The Edge, Lahinch", label: "Relaxed seafront meal · roughly $30–$50 per adult", note: "A flexible choice for burgers, fish, curry and salads. Current larger dishes are commonly €16–€27, with options suitable for children and mixed appetites.", link: "https://www.theedgelahinch.ie/lunchedge" },
    { area: "Clare", title: "Vaughan’s Anchor Inn", label: "Nicer seafood dinner · roughly $45–$75 per adult", note: "A strong candidate for one memorable group dinner. Current dinner mains range from about €20 for a burger to €49 for fillet of beef; reserve early for ten.", link: "https://vaughans.ie/" },
    { area: "Clare", title: "Dinner at the golf-course home", label: "Cook together · already covered by the $700–$850 food reserve", note: "The confirmed Vrbo lists a kitchen, making this a good base for an easy dinner on the golf or Cliffs day while the second vehicle goes elsewhere if needed.", link: "https://www.vrbo.com/4365078" }
  ],
  alternates: [],
  bookings: [
    { category: "Flight", title: "American Airlines nonstop · Justin family", family: "Justin family", status: "confirmed", statusLabel: "Purchased · exact receipt", amount: 2999.78, detail: "3 travelers · AA 132 departs DFW May 31 at 7:00 PM and arrives Dublin June 1 at 9:45 AM · AA 133 departs Dublin June 10 at 11:45 AM and arrives DFW at 3:30 PM. Economy (B). Total includes $164.09 in selected-seat fees. First checked bag is free; a second is $100. One personal item and one carry-on are allowed." },
    { category: "Flight", title: "Airfare estimate · Cameron family", family: "Cameron family", status: "assumed", statusLabel: "Estimated from Justin receipt", amount: 3999.71, detail: "4 travelers × the Justin family’s exact $999.93 per-traveler average. Tickets were reported purchased, but this is an estimate until the Cameron family receipt is provided." },
    { category: "Flight", title: "Airfare estimate · Williams family", family: "Williams family", status: "assumed", statusLabel: "Estimated from Justin receipt", amount: 2999.78, detail: "3 travelers × the Justin family’s exact $999.93 per-traveler average. Confirm that all three tickets are issued and provide the receipt to replace this estimate." },
    { category: "Vehicle", title: "Hertz · Skoda Kodiaq or similar", family: "Cameron family", status: "confirmed", statusLabel: "Confirmed · paid with points", amount: 726.40, detail: "June 3 at 10:00 AM through June 9 at 4:00 PM · Dublin Baggot Street · driver Cameron · 72,640 Chase points · free cancellation through May 31, 2027. Two vehicles should give 10 travelers more luggage room, but confirm seat count and that the earlier 900-km allowance applies to this booked rate." },
    { category: "Vehicle", title: "Hertz · Skoda Kodiaq or similar", family: "Justin family", status: "confirmed", statusLabel: "Confirmed · paid with points", amount: 726.40, detail: "June 3 at 10:00 AM through June 9 at 4:00 PM · Dublin Baggot Street · driver Justin · 63,722 Chase points · free cancellation through May 31, 2027. Confirm seat count, luggage capacity and that the earlier 900-km allowance applies to this booked rate." },
    { category: "Lodging", title: "Knockmanagh Holiday Home", family: "Cameron family", status: "confirmed", statusLabel: "Confirmed", amount: 1310.68, original: "€1,122.06", detail: "June 3–6 · 3 nights · 7 adults + 3 children. Includes booking fee and fixed electricity charge. Refundable €200 security hold is not counted as trip expense." },
    { category: "Lodging", title: "Lahinch 7-bedroom golf home", family: "Justin family", status: "confirmed", statusLabel: "Booked · Vrbo confirmed", amount: 2921, original: "€2,502.28", detail: "June 6–9 · 3 nights · 7 adults + 3 children. Vrbo shows the reservation as booked. Payment 2 of 2 is €1,668.75 and is due April 27, 2027; the displayed USD amount is the family’s working total." },
    { category: "Lodging", title: "Dublin arrival + final night", family: "Unassigned", status: "missing", statusLabel: "Not booked", amount: null, detail: "Still need June 1–3 and June 9–10 for all 10 travelers." }
  ],
  families: [
    { name: "Justin family", members: "Justin, Jamie, Kara", travelers: 3, lodgingPayers: 2, lodgingPayerNames: "Justin and Jamie", lodgingBooked: 2921, airfare: 2999.78, airfareBasis: "Exact receipt", sharedConfirmed: 3647.40, pending: 0, items: "Lahinch is assigned to this family. Its remaining vendor installment is due April 27, 2027." },
    { name: "Cameron family", members: "Cameron, Laney, Liam, Arlo", travelers: 4, lodgingPayers: 2, lodgingPayerNames: "Cameron and Laney", lodgingBooked: 1310.68, airfare: 3999.71, airfareBasis: "Estimated", sharedConfirmed: 2037.08, pending: 0, items: "Knockmanagh is assigned to this family." },
    { name: "Williams family", members: "William, Mary, Misti", travelers: 3, lodgingPayers: 3, lodgingPayerNames: "William, Mary and Misti", lodgingBooked: 0, airfare: 2999.78, airfareBasis: "Estimated", sharedConfirmed: 0, pending: 0, items: "No booked lodging has yet been assigned to this family." }
  ],
  activities: [
    { id: "dodublin", area: "Dublin", day: "Dublin day", title: "DoDublin hop-on / hop-off", distance: "0.5 mi · 10-minute walk", duration: "2–6 hours", cost: 29, note: "Flexible sightseeing with an easy return to the hotel.", link: "https://dodublin.ie/city-sightseeing-tours/hop-on-hop-off-24-hour" },
    { id: "epic", area: "Dublin", day: "Dublin day", title: "EPIC Museum", distance: "1.1 mi · 22-minute walk", duration: "about 2 hours", cost: 20, note: "Indoor, weather-friendly and suitable for a slower day.", link: "https://epicchq.com/visit/" },
    { id: "dublin-castle", area: "Dublin", day: "Dublin day", title: "Dublin Castle grounds", distance: "0.6 mi · 12-minute walk", duration: "1–2 hours", cost: 0, note: "The grounds are free; paid interior tours can be decided later.", link: "https://www.dublincastle.ie/visit/" },
    { id: "muckross", area: "Killarney", day: "Park day", title: "Muckross House + Farms", distance: "About 16 mi · roughly 25-minute drive", duration: "3–4 hours", cost: 16, note: "Farms have some uneven surfaces; the group can split by walking level.", link: "https://muckross-house.ie/plan-your-visit/" },
    { id: "killarney-park", area: "Killarney", day: "Park day", title: "Killarney National Park", distance: "About 11 mi · roughly 18-minute drive", duration: "2–4 hours", cost: 0, note: "Free and easy to tailor to different walking levels.", link: "https://www.killarneynationalpark.ie/" },
    { id: "ross-castle", area: "Killarney", day: "Park day", title: "Ross Castle", distance: "About 13 mi · roughly 22-minute drive", duration: "1–2 hours", cost: 6, note: "Upper levels have spiral stairs; the grounds remain an easier alternative.", link: "https://heritageireland.ie/places-to-visit/ross-castle/" },
    { id: "dingle", area: "Killarney", day: "Longer day", title: "Dingle + Oceanworld", distance: "About 49 mi · roughly 1 hr 25 min each way", duration: "7–8 hour day", cost: 20, note: "A longer day with Oceanworld as a low-walking anchor.", link: "https://dingle-oceanworld.ie/plan-your-visit/" },
    { id: "ring-of-kerry", area: "Killarney", day: "Scenic day", title: "Ring of Kerry", distance: "Route depends on stops", duration: "6–8 hour day", cost: 0, note: "Fuel is not yet in the current known-cost total; stops can be chosen later.", link: "https://www.discoverireland.ie/kerry/ring-of-kerry" },
    { id: "lahinch-castle-golf", area: "Clare", day: "Tuesday, June 8 · best practical golf choice", title: "Lahinch Castle Course golf", distance: "At the Lahinch lodging base · walkable or a very short drive", duration: "Allow about 5 hours including check-in and an 18-hole walking round", cost: 160, note: "Recommended starting point while we are still deciding. The live June 8, 2027 tee sheet currently shows many visitor times at €60 (about $70) per golfer. The calculator uses a generous $160 per golfer working total: $70 green fee plus about $88 for advance-booked rental clubs. Bring clubs and the expected cost drops to about $70, plus an optional $6 pull trolley or $35 battery trolley. The club describes this as a mix of agreeable and challenging holes; it is still a full walking course with no carts. Select this only for the golfers in your traveler count.", link: "https://www.brsgolf.com/lahinch/visitor_day.php?course_id1=3&d_date=2027-06-08", linkLabel: "See live June 8 Castle tee times ↗" },
    { id: "lahinch-old-golf", area: "Clare", day: "Tuesday, June 8 · premium bucket-list option", title: "Lahinch Old Course golf", distance: "At the Lahinch lodging base · walkable or a very short drive", duration: "Allow about 5½ hours; the live visitor time is 4:30 PM", cost: 800, note: "The live June 8, 2027 tee sheet currently shows one 4:30 PM visitor time at €500 (about $584) per golfer. The calculator sets aside a conservative $800 per golfer for the green fee, mandatory caddie arrangement and rental clubs; the actual total depends on golfer count and caddie setup. This is the championship links and the more demanding, expensive choice. Maximum Handicap Index is 24 for men and 36 for women, certificates may be requested, and the course is walking only with no carts. Booking requires full payment; even cancellations 60+ days ahead receive only a 50% refund. Select this only for the golfers in your traveler count.", link: "https://www.brsgolf.com/lahinch/visitor_day.php?course_id1=1&d_date=2027-06-08", linkLabel: "See live June 8 Old Course tee time ↗" },
    { id: "caherconnell", area: "Clare", day: "Clare / Burren day", title: "Caherconnell sheepdog demonstration", distance: "About 25 mi from Lahinch · roughly 45 minutes", duration: "Allow 2–3 hours with the drive and café stop", cost: 18, note: "Best fit: take one vehicle and pair the covered demonstration with the Burren or nearby Poulnabrone Dolmen. The current published schedule is 11:10 AM and 2:10 PM daily from March to early November; reconfirm the June 2027 session before paying. Official 2026 pricing plus online fees is about $173 for all 10, so the calculator rounds up to $18 per traveler. Accessible parking, level viewing, seating, toilets and a café make this a strong multigenerational option.", link: "https://caherconnell.digitickets.co.uk/event-tickets/38103?catID=38168&navItem=974175" },
    { id: "bunratty", area: "Clare", day: "Transfer or Clare day", title: "Bunratty Castle + Folk Park", distance: "About 31 mi from Lahinch · roughly 45 minutes", duration: "3–4 hours", cost: 18, note: "Castle stairs are narrow; the folk park is the easier alternative.", link: "https://www.bunrattycastle.ie/" },
    { id: "cliffs", area: "Clare", day: "Clare day", title: "Cliffs of Moher", distance: "About 8 mi · roughly 15-minute drive", duration: "2–3 hours", cost: 13, note: "A short drive from the Lahinch house; pre-booking can reduce the admission price.", link: "https://www.cliffsofmoher.ie/" },
    { id: "burren", area: "Clare", day: "Clare day", title: "Burren National Park", distance: "About 23 mi · roughly 40-minute drive", duration: "3–5 hours", cost: 0, note: "Free; route and walking level can be adapted by vehicle.", link: "https://www.nationalparks.ie/burren/" },
    { id: "galway", area: "Clare", day: "Longer day", title: "Galway day", distance: "About 47 mi · roughly 1 hr 15 min each way", duration: "6–8 hour day", cost: 0, note: "Free to explore before meals or shopping; a longer driving commitment.", link: "https://www.google.com/maps/dir/Lahinch,+Co.+Clare,+Ireland/Galway,+Ireland/" }
  ],
  travelers: ["Cameron", "Laney", "Justin", "Jamie", "Kara", "William", "Mary", "Misti"]
};

window.TRIP_DATA = {
  updated: "October 13, 2026",
  fx: { date: "August 20, 2026", eurUsd: 1.1681, source: "European Central Bank" },
  costs: {
    airfareExactJustin: 2999.78,
    airfarePerTraveler: 999.93,
    airfareEstimatedAll: 9999.27,
    confirmedShared: 7932.48,
    pendingShared: 0,
    knownShared: 7932.48,
    perTravelerKnown: 793.25,
    overallConfirmedEstimated: 17931.75,
    overallKnown: 17931.75,
    perTravelerOverallKnown: 1793.18,
    carsConfirmed: 1452.80,
    killarneyConfirmed: 1310.68,
    homesBooked: 4231.68,
    julyConfirmed: 2248,
    claytonAllowance: 452,
    lodgingBooked: 6479.68,
    lodgingPayers: 7,
    lodgingPerPayer: 925.6685714286,
    lahinchTotalEur: 2502.28,
    lahinchRemainingEur: 1668.75,
    lahinchRemainingUsd: 1949.27
  },
  projection: {
    travelers: 10,
    goalGroup: 32000,
    goalPerTraveler: 3200,
    items: [
      { label: "Airfare for 10", amount: 9999.27, stage: "committed", status: "Receipt + estimates", note: "All 10 flights are booked, confirmed by the family October 13. Only the Justin family receipt ($2,999.78) is exact; the other seven fares use the same per-traveler amount. Airfare stays outside the shared balance." },
      { label: "Two booked homes", amount: 4231.68, stage: "committed", status: "Booked", note: "Killarney and Lahinch. This is the full reservation value, although vendor installments remain." },
      { label: "Two Hertz SUVs", amount: 1452.80, stage: "committed", status: "Booked with points", note: "The stated dollar value of points used for both vehicles, tracked separately from lodging. This is not a cash payment." },
      { label: "The July · Dublin arrival", amount: 2248, stage: "committed", status: "Booked · family-reported total", note: "June 1–3, two nights. William family covers the $2,248 reservation total reported by Laney. Check-in 3 PM; checkout 11 AM. This is the full stay total, not per room or per person; payment timing and room details are still needed." },
      { label: "Clayton · Dublin final night", amount: 452, stage: "future", status: "Booked · price still needed", note: "June 9–10, covered by Laney. $452 is only the remainder of the earlier combined $2,700 Dublin allowance after assigning $2,248 to The July. It is not a hotel quote or confirmed price; replace it with the actual receipt." },
      { label: "Meals, groceries and snacks", amount: 7500, stage: "future", status: "Balanced allowance", note: "$750 per traveler, including groceries, meals cooked at the houses, casual meals and two nicer dinners. Paid as we go; this is an allowance, not a payment. Alcohol is separate." },
      { label: "Activities and admissions", amount: 1200, stage: "future", status: "Flexible allowance", note: "Paid as we go. Assumes the group will select rather than do every activity. Golf and other high-cost choices remain visible separately." },
      { label: "Fuel & ground travel", amount: 1200, stage: "future", status: "Pay-as-you-go allowance", note: "Group estimates: $500 fuel for both SUVs, $250 extra-mileage reserve, $200 tolls/parking and $250 airport/city transfers. Total $120 per traveler. These are allowances, not quotes; confirm mileage terms and transfer vehicle capacity." },
      { label: "DFW parking or rides", amount: 300, stage: "future", status: "Household allowance", note: "Assumes coordinated drop-offs, shared rides or reduced-cost parking." },
      { label: "Trip contingency", amount: 750, stage: "future", status: "Unspent reserve", note: "A modest cushion for exchange-rate movement, price changes and small items not yet captured." }
    ]
  },
  stays: [
    {
      id: "july-capel-street",
      name: "The July – Capel Street",
      area: "Dublin city centre – arrival stay",
      dateLabel: "June 1–3, 2027 · 2 nights",
      statusType: "confirmed",
      address: "33–36 Strand Street Little, Dublin 7, D07 F861",
      link: "https://www.thejuly.com/properties/dublin-capel-street",
      dateLinks: [
        { label: "Open official property", url: "https://www.thejuly.com/properties/dublin-capel-street" }
      ],
      status: "Booked · $2,248 total · William covering",
      roomPlan: "William is covering the confirmed June 1–3 arrival stay. The $2,248 is the total reservation value for these two nights. The screenshot is cropped at the apartment details, so room types, bed layouts and guest allocations remain to be added.",
      sourceNote: "Booked, confirmed by the family and the shared Hotels.com itinerary on October 13, 2026. Total reported by Laney: $2,248 USD. Check-in Tuesday June 1 at 3 PM; checkout Thursday June 3 at 11 AM (local time). Payment schedule and cancellation terms have not been supplied. Exterior image is an official rendering.",
      photos: ["assets/july-capel-street.webp"],
      photoLabel: "Official exterior rendering"
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
      roomPlan: "Verified layout: three separate double bedrooms plus two twin bedrooms with two single beds each. The workable plan uses all 10 listed sleeping places without relying on an extra bed.",
      roomOptions: [
        { label: "Working assignment", title: "Fits the advertised beds exactly", rooms: ["Ground-floor double · William and Mary", "Ensuite double · Cameron and Laney", "Double · Justin and Jamie", "Twin · Liam and Arlo", "Twin · Misti and Kara"], note: "This uses all three double bedrooms and all four single beds. Kara sharing with Misti avoids assuming that either twin room can sleep three people." }
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
    },
    {
      id: "clayton-airport",
      name: "Clayton Hotel Dublin Airport",
      area: "Dublin Airport – final night",
      dateLabel: "June 9–10, 2027 · 1 night",
      statusType: "confirmed",
      address: "Stockhole Lane, Clonshagh, Swords, Co. Dublin, K67 X3H5",
      link: "https://www.claytonhotels.com/dublin-airport/",
      dateLinks: [
        { label: "Official hotel and airport directions", url: "https://www.claytonhotels.com/dublin-airport/location/" }
      ],
      status: "Booked by Laney · Laney covering",
      roomPlan: "The itinerary confirms June 9–10, with check-in at 2 PM and checkout at 11 AM. The price, room count, room types, guest allocation and cancellation terms have not been supplied.",
      sourceNote: "Booking status and times come from the shared itinerary; paid status is unverified. Plan an earlier departure for the June 10 flight at 11:45 AM—hotel checkout time is not the airport departure plan. Official exterior photo and address: Clayton Hotels.",
      photos: ["assets/clayton-airport.jpg"],
      photoLabel: "Official exterior photo"
    }
  ],
  dining: [
    { area: "Dublin", title: "The Woollen Mills", label: "Arrival-stay dinner · roughly $35–$55 per adult", note: "A lively modern-Irish option across from Ha’penny Bridge. Earlier menu prices were about €23–€38, plus a 12.5% service charge. Reserve for a group this size after the arrival lodging is confirmed.", link: "https://www.thewoollenmills.com/menus.htm" },
    { area: "Dublin", title: "Follow your appetite on Capel Street", label: "An easy first evening · within the food allowance", note: "A café lunch, a relaxed restaurant dinner and an early night are plenty after the flight. Dublin meals are planned out; no need to build the visit around cooking.", link: "https://www.thejuly.com/properties/dublin-capel-street" },
    { area: "Killarney", title: "Cronin’s Restaurant", label: "Casual Irish dinner · roughly $30–$50 per adult", note: "A family-run Killarney option for fish and chips, shepherd’s pie, burgers and local dishes. Earlier menu prices were mostly €18.95–€33; booking is recommended.", link: "https://croninsrestaurant.com/our-menu/" },
    { area: "Killarney", title: "Dinner at Knockmanagh", label: "Cook together · already covered by the $700–$850 food reserve", note: "The confirmed house has a kitchen and utility room. A grocery stop can cover breakfast, packed snacks and one or two relaxed dinners without another drive into town.", link: "https://www.tridentholidayhomes.ie/property/kerry/killarney/knockmanagh-holiday-home/373616/" },
    { area: "Clare", title: "The Edge, Lahinch", label: "Relaxed seafront meal · roughly $30–$50 per adult", note: "A flexible choice for burgers, fish, curry and salads. Earlier menu prices for larger dishes were €16–€27, with options suitable for children and mixed appetites.", link: "https://www.theedgelahinch.ie/lunchedge" },
    { area: "Clare", title: "Vaughan’s Anchor Inn", label: "Nicer seafood dinner · roughly $45–$75 per adult", note: "A strong candidate for one memorable group dinner. Earlier dinner mains ranged from about €20 for a burger to €49 for fillet of beef; reserve early for ten.", link: "https://vaughans.ie/" },
    { area: "Clare", title: "Dinner at the golf-course home", label: "Cook together · already covered by the $700–$850 food reserve", note: "The confirmed Vrbo lists a kitchen, making this a good base for an easy dinner on the golf or Cliffs day while the second vehicle goes elsewhere if needed.", link: "https://www.vrbo.com/4365078" }
  ],
  alternates: [],
  bookings: [
    { category: "Flight", title: "American Airlines nonstop · Justin family", family: "Justin family", status: "confirmed", statusLabel: "Purchased · exact receipt", amount: 2999.78, detail: "3 travelers · AA 132 departs DFW May 31 at 7:00 PM and arrives Dublin June 1 at 9:45 AM · AA 133 departs Dublin June 10 at 11:45 AM and arrives DFW at 3:30 PM. Economy (B). Total includes $164.09 in selected-seat fees. First checked bag is free; a second is $100. One personal item and one carry-on are allowed." },
    { category: "Flight", title: "Airfare estimate · Cameron family", family: "Cameron family", status: "confirmed", statusLabel: "Booked · fare amount estimated", amount: 3999.71, detail: "4 travelers × the Justin family’s exact $999.93 per-traveler average. Family confirms all flights booked as of October 13. The dollar amount is estimated from the Justin-family average; replace it when the receipt is available." },
    { category: "Flight", title: "Airfare estimate · Williams family", family: "Williams family", status: "confirmed", statusLabel: "Booked · fare amount estimated", amount: 2999.78, detail: "3 travelers × the Justin family’s exact $999.93 per-traveler average. Family confirms all three flights booked as of October 13. The dollar amount is estimated from the Justin-family average; replace it when the receipt is available." },
    { category: "Vehicle", title: "Hertz · Skoda Kodiaq or similar", family: "Cameron family", status: "confirmed", statusLabel: "Confirmed · paid with points", amount: 726.40, detail: "June 3 at 10:00 AM through June 9 at 4:00 PM · Dublin Baggot Street · driver Cameron · 72,640 Chase points · free cancellation through May 31, 2027. Two vehicles should give 10 travelers more luggage room, but confirm seat count and that the earlier 900-km allowance applies to this booked rate." },
    { category: "Vehicle", title: "Hertz · Skoda Kodiaq or similar", family: "Justin family", status: "confirmed", statusLabel: "Confirmed · paid with points", amount: 726.40, detail: "June 3 at 10:00 AM through June 9 at 4:00 PM · Dublin Baggot Street · driver Justin · 63,722 Chase points · free cancellation through May 31, 2027. Confirm seat count, luggage capacity and that the earlier 900-km allowance applies to this booked rate." },
    { category: "Lodging", title: "Knockmanagh Holiday Home", family: "Cameron family", status: "confirmed", statusLabel: "Booked · payment posting unverified", amount: 1310.68, original: "€1,122.06", detail: "June 3–6 · 3 nights · 7 adults + 3 children. Includes booking fee and fixed electricity charge. Verify the confirmation charge posting and remaining balance with Laney. Refundable €200 security hold is not counted as trip expense." },
    { category: "Lodging", title: "Lahinch 7-bedroom golf home", family: "Justin family", status: "confirmed", statusLabel: "Booked · Vrbo confirmed", amount: 2921, original: "€2,502.28", detail: "June 6–9 · 3 nights · 7 adults + 3 children. Vrbo shows the reservation as booked. Payment 2 of 2 is €1,668.75 and is due April 27, 2027; the displayed USD amount is the family’s working total." },
    { category: "Lodging", title: "The July – Capel Street", family: "Williams family", status: "confirmed", statusLabel: "Booked · $2,248 total reported", amount: 2248, detail: "June 1–3 · 2 nights. William is covering the stay. Hotels.com itinerary confirms check-in June 1 at 3 PM and checkout June 3 at 11 AM. Laney reports $2,248 total for the reservation, not per room or person. Room details, cancellation terms and payment schedule are still needed." },
    { category: "Lodging", title: "Clayton Hotel Dublin Airport", family: "Laney covering", status: "confirmed", statusLabel: "Booked by Laney · payment unverified", amount: null, detail: "June 9–10 · 1 night. Check-in 2 PM; checkout 11 AM. Price, room count, room types, guest allocation and cancellation terms have not been supplied. The actual Clayton price will be credited to Cameron family when supplied; the $452 projection remainder is not a receipt." }
  ],
  families: [
    { name: "Justin family", members: "Justin, Jamie, Kara", travelers: 3, lodgingPayers: 2, lodgingPayerNames: "Justin and Jamie", lodgingBooked: 2921, airfare: 2999.78, airfareBasis: "Exact receipt", sharedConfirmed: 3647.40, pending: 0, items: "Lahinch is assigned to this family. Its remaining vendor installment is due April 27, 2027." },
    { name: "Cameron family", members: "Cameron, Laney, Liam, Arlo", travelers: 4, lodgingPayers: 2, lodgingPayerNames: "Cameron and Laney", lodgingBooked: 1310.68, airfare: 3999.71, airfareBasis: "Estimated", sharedConfirmed: 2037.08, pending: 0, items: "Knockmanagh is assigned to this family; payment posting needs verification. Laney also covers the booked Clayton stay, whose price is not yet in this table." },
    { name: "Williams family", members: "William, Mary, Misti", travelers: 3, lodgingPayers: 3, lodgingPayerNames: "William, Mary and Misti", lodgingBooked: 2248, airfare: 2999.78, airfareBasis: "Estimated", sharedConfirmed: 2248, pending: 0, items: "William covers the confirmed The July arrival stay. Its $2,248 total is credited here as assigned reservation value; payment timing is not yet documented." }
  ],
  activities: [
    { id: "dodublin", area: "Dublin", day: "Dublin day", title: "DoDublin hop-on / hop-off", distance: "0.5 mi · 10-minute walk", duration: "2–6 hours", cost: 29, note: "Flexible sightseeing with an easy return to the hotel.", link: "https://dodublin.ie/city-sightseeing-tours/hop-on-hop-off-24-hour" },
    { id: "temple-bar", area: "Dublin", day: "Easy city wander", title: "River, Ha’penny Bridge & Temple Bar", distance: "About 0.4 mi · 8–12 minutes to Temple Bar", duration: "1–2 hours at your own pace", cost: 0, note: "Cross the Liffey for colorful streets, music and a look around the famous pub district. A daytime visit suits our mixed-age group; cobbles can be uneven. Food and drinks are extra.", link: "https://www.visitdublin.com/guides/things-to-do-temple-bar" },
    { id: "epic", area: "Dublin", day: "Only if interests change", title: "EPIC Irish Emigration Museum", distance: "About 1.1 mi · 22–30-minute walk", duration: "about 2 hours", cost: 26, optional: true, note: "Interactive Irish migration history, not an aquarium. Currently off our main plan; keep it as an optional indoor idea. $26 is a planning allowance, not a 2027 quote.", link: "https://epicchq.com/visit/" },
    { id: "dublin-castle", area: "Dublin", day: "Dublin day", title: "Dublin Castle grounds", distance: "0.6 mi · 12-minute walk", duration: "1–2 hours", cost: 0, note: "The grounds are free; paid interior tours can be decided later.", link: "https://www.dublincastle.ie/visit/" },
    { id: "muckross", area: "Killarney", day: "Park day", title: "Muckross House + Farms", distance: "About 16 mi · roughly 25-minute drive", duration: "3–4 hours", cost: 16, note: "Farms have some uneven surfaces; the group can split by walking level.", link: "https://muckross-house.ie/plan-your-visit/" },
    { id: "killarney-park", area: "Killarney", day: "Park day", title: "Killarney National Park", distance: "About 11 mi · roughly 18-minute drive", duration: "2–4 hours", cost: 0, note: "Free and easy to tailor to different walking levels.", link: "https://www.killarneynationalpark.ie/" },
    { id: "ross-castle", area: "Killarney", day: "Park day", title: "Ross Castle", distance: "About 13 mi · roughly 22-minute drive", duration: "1–2 hours", cost: 6, note: "Upper levels have spiral stairs; the grounds remain an easier alternative.", link: "https://heritageireland.ie/places-to-visit/ross-castle/" },
    { id: "dingle", area: "Killarney", day: "Longer day", title: "Dingle + Oceanworld", distance: "About 49 mi · roughly 1 hr 25 min each way", duration: "7–8 hour day", cost: 20, note: "A longer day with Oceanworld as a low-walking anchor.", link: "https://dingle-oceanworld.ie/plan-your-visit/" },
    { id: "ring-of-kerry", area: "Killarney", day: "Scenic day", title: "Ring of Kerry", distance: "Route depends on stops", duration: "6–8 hour day", cost: 0, note: "Fuel is not yet in the current known-cost total; stops can be chosen later.", link: "https://www.discoverireland.ie/kerry/ring-of-kerry" },
    { id: "lahinch-castle-golf", area: "Clare", day: "Tuesday, June 8 · best practical golf choice", title: "Lahinch Castle Course golf", distance: "At the Lahinch lodging base · walkable or a very short drive", duration: "Allow about 5 hours including check-in and an 18-hole walking round", cost: 160, note: "Recommended starting point while we are still deciding. The earlier August 2026 check found a €60 (about $70) visitor green fee for June 8, 2027. Availability and prices have not been rechecked for this update. The calculator uses a generous $160 per golfer working total: $70 green fee plus about $88 for advance-booked rental clubs. Bring clubs and the expected cost drops to about $70, plus an optional $6 pull trolley or $35 battery trolley. The club describes this as a mix of agreeable and challenging holes; it is still a full walking course with no carts. Use the participant selector for just the golfers.", link: "https://www.brsgolf.com/lahinch/visitor_day.php?course_id1=3&d_date=2027-06-08", linkLabel: "Check June 8 Castle tee times ↗" },
    { id: "lahinch-old-golf", area: "Clare", day: "Tuesday, June 8 · premium bucket-list option", title: "Lahinch Old Course golf", distance: "At the Lahinch lodging base · walkable or a very short drive", duration: "Allow about 5½ hours; tee time to be confirmed", cost: 800, note: "The earlier August 2026 check found a €500 (about $584) visitor green fee for June 8, 2027. The previous 4:30 PM opening is not confirmed now. The calculator sets aside a conservative $800 per golfer for the green fee, mandatory caddie arrangement and rental clubs; the actual total depends on golfer count and caddie setup. This is the championship links and the more demanding, expensive choice. Maximum Handicap Index is 24 for men and 36 for women, certificates may be requested, and the course is walking only with no carts. Booking requires full payment; even cancellations 60+ days ahead receive only a 50% refund. Use the participant selector for just the golfers.", link: "https://www.brsgolf.com/lahinch/visitor_day.php?course_id1=1&d_date=2027-06-08", linkLabel: "Check June 8 Old Course tee times ↗" },
    { id: "caherconnell", area: "Clare", day: "Clare / Burren day", title: "Caherconnell sheepdog demonstration", distance: "About 25 mi from Lahinch · roughly 45 minutes", duration: "Allow 2–3 hours with the drive and café stop", cost: 18, note: "Best fit: take one vehicle and pair the covered demonstration with the Burren or nearby Poulnabrone Dolmen. The previously researched schedule is 11:10 AM and 2:10 PM daily from March to early November; reconfirm the June 2027 session before paying. Official 2026 pricing plus online fees is about $173 for all 10, so the calculator rounds up to $18 per traveler. Accessible parking, level viewing, seating, toilets and a café make this a strong multigenerational option.", link: "https://caherconnell.digitickets.co.uk/event-tickets/38103?catID=38168&navItem=974175" },
    { id: "bunratty", area: "Clare", day: "Transfer or Clare day", title: "Bunratty Castle + Folk Park", distance: "About 31 mi from Lahinch · roughly 45 minutes", duration: "3–4 hours", cost: 18, note: "Castle stairs are narrow; the folk park is the easier alternative.", link: "https://www.bunrattycastle.ie/" },
    { id: "cliffs", area: "Clare", day: "Clare day", title: "Cliffs of Moher", distance: "About 8 mi · roughly 15-minute drive", duration: "2–3 hours", cost: 13, note: "A short drive from the Lahinch house; pre-booking can reduce the admission price.", link: "https://www.cliffsofmoher.ie/" },
    { id: "burren", area: "Clare", day: "Clare day", title: "Burren National Park", distance: "About 23 mi · roughly 40-minute drive", duration: "3–5 hours", cost: 0, note: "Free; route and walking level can be adapted by vehicle.", link: "https://www.nationalparks.ie/burren/" },
    { id: "galway", area: "Clare", day: "Longer day", title: "Galway day", distance: "About 47 mi · roughly 1 hr 15 min each way", duration: "6–8 hour day", cost: 0, note: "Free to explore before meals or shopping; a longer driving commitment.", link: "https://www.google.com/maps/dir/Lahinch,+Co.+Clare,+Ireland/Galway,+Ireland/" }
  ],
  travelers: ["Cameron", "Laney", "Justin", "Jamie", "Kara", "William", "Mary", "Misti"]
};

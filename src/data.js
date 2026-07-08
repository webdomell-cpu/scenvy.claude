// Updated seed data with locationId for proper routing

export const TENANTS = [
  { id:"t1", name:"The Marina Group",  plan:"enterprise", locs:4, reels:28, mrr:299, status:"active", since:"2025-11" },
  { id:"t2", name:"Rooftop Bar 21",    plan:"pro",        locs:1, reels:12, mrr:29,  status:"active", since:"2025-12" },
  { id:"t3", name:"Souk Street Food",  plan:"pro",        locs:3, reels:19, mrr:29,  status:"active", since:"2026-01" },
  { id:"t4", name:"DIFC Lounge & Co.", plan:"starter",    locs:1, reels:4,  mrr:0,   status:"trial",  since:"2026-06" },
  { id:"t5", name:"The Palm Events",   plan:"enterprise", locs:6, reels:41, mrr:299, status:"active", since:"2025-10" },
];

export const LOCATIONS_SEED = [
  { id:"l1", name:"Marina Walk",      city:"Dubai Marina", scans:1247, wr:94, active:true  },
  { id:"l2", name:"JBR Terrace",      city:"JBR Beach",    scans:893,  wr:78, active:true  },
  { id:"l3", name:"DIFC Branch",      city:"DIFC",         scans:614,  wr:88, active:true  },
  { id:"l4", name:"Mall of Emirates", city:"Al Barsha",    scans:329,  wr:61, active:false },
];

export const REELS_SEED = [
  { id:"r1", title:"Happy Hour Special", type:"offer",   status:"live",      views:3241, ctr:18.4, loc:"Marina Walk",  locationId:"l1", color:"#7C3AED", emoji:"🍹", cta:"Order Now",  ctaUrl:"https://order.marinagroup.com", ctaAction:"url", ago:"2 days ago" },
  { id:"r2", title:"Weekend Brunch",     type:"event",   status:"live",      views:2108, ctr:24.1, loc:"JBR Terrace",  locationId:"l2", color:"#FF2D8D", emoji:"🥂", cta:"Reserve",    ctaUrl:"https://reserve.marinagroup.com", ctaAction:"reserve", ago:"5 days ago" },
  { id:"r3", title:"Chef's Special",     type:"menu",    status:"live",      views:1872, ctr:15.7, loc:"DIFC Branch",  locationId:"l3", color:"#00D4FF", emoji:"🍽️", cta:"View Menu",  ctaUrl:"https://menu.marinagroup.com", ctaAction:"menu", ago:"1 week ago" },
  { id:"r4", title:"Ladies Night Thu",   type:"event",   status:"scheduled", views:0,    ctr:0,    loc:"Marina Walk",  locationId:"l1", color:"#FF9500", emoji:"✨", cta:"RSVP",       ctaUrl:"", ctaAction:"url", ago:"Today" },
  { id:"r5", title:"Sunset Cocktails",   type:"offer",   status:"live",      views:4156, ctr:31.2, loc:"JBR Terrace",  locationId:"l2", color:"#7C3AED", emoji:"🌅", cta:"Book Now",   ctaUrl:"https://book.marinagroup.com", ctaAction:"reserve", ago:"3 days ago" },
  { id:"r6", title:"New: Wagyu Burger",  type:"menu",    status:"draft",     views:0,    ctr:0,    loc:"DIFC Branch",  locationId:"l3", color:"#00E676", emoji:"🍔", cta:"Order",      ctaUrl:"", ctaAction:"order", ago:"Today" },
];

export const CHART_DATA = [
  { day:"Mon", scans:142, views:310, ctr:18 },
  { day:"Tue", scans:189, views:421, ctr:22 },
  { day:"Wed", scans:201, views:498, ctr:19 },
  { day:"Thu", scans:287, views:694, ctr:31 },
  { day:"Fri", scans:412, views:988, ctr:38 },
  { day:"Sat", scans:489, views:1203,ctr:41 },
  { day:"Sun", scans:318, views:776, ctr:35 },
];

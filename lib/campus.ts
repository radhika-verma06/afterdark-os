export type Point = { x: number; y: number };
export type CampusPath = { id: string; name: string; lengthM: number; footfallWeight: number; baselineCoverage: number; points: Point[] };

// Aster Campus is fictional. The plan is a deliberately simplified schematic, not a survey map.
export const pathways: CampusPath[] = [
  { id:"P01", name:"Willow Walk", lengthM:184, footfallWeight:1.0, baselineCoverage:.72, points:[{x:125,y:140},{x:380,y:140},{x:650,y:140},{x:870,y:140}] },
  { id:"P02", name:"Library Approach", lengthM:126, footfallWeight:.95, baselineCoverage:.58, points:[{x:380,y:140},{x:380,y:280},{x:380,y:455}] },
  { id:"P03", name:"Founders Lane", lengthM:212, footfallWeight:.82, baselineCoverage:.66, points:[{x:125,y:255},{x:330,y:255},{x:535,y:255},{x:760,y:255},{x:870,y:255}] },
  { id:"P04", name:"North Quad Path", lengthM:152, footfallWeight:.74, baselineCoverage:.43, points:[{x:250,y:140},{x:250,y:255},{x:250,y:360}] },
  { id:"P05", name:"East Quad Path", lengthM:138, footfallWeight:.78, baselineCoverage:.51, points:[{x:650,y:140},{x:650,y:255},{x:650,y:360}] },
  { id:"P06", name:"Science Spine", lengthM:196, footfallWeight:.9, baselineCoverage:.62, points:[{x:125,y:360},{x:330,y:360},{x:535,y:360},{x:760,y:360},{x:870,y:360}] },
  { id:"P07", name:"Garden Link", lengthM:115, footfallWeight:.55, baselineCoverage:.35, points:[{x:250,y:360},{x:330,y:430},{x:440,y:480}] },
  { id:"P08", name:"South Commons Walk", lengthM:163, footfallWeight:.8, baselineCoverage:.61, points:[{x:125,y:485},{x:330,y:485},{x:535,y:485},{x:760,y:485},{x:870,y:485}] },
  { id:"P09", name:"Residence Way", lengthM:177, footfallWeight:1.0, baselineCoverage:.48, points:[{x:760,y:255},{x:760,y:360},{x:760,y:485},{x:760,y:555}] },
  { id:"P10", name:"West Gate Walk", lengthM:142, footfallWeight:.68, baselineCoverage:.7, points:[{x:125,y:140},{x:125,y:255},{x:125,y:360},{x:125,y:485}] },
  { id:"P11", name:"Arts Promenade", lengthM:121, footfallWeight:.72, baselineCoverage:.56, points:[{x:535,y:255},{x:535,y:360},{x:535,y:485}] },
  { id:"P12", name:"Health Centre Link", lengthM:108, footfallWeight:.86, baselineCoverage:.4, points:[{x:870,y:140},{x:870,y:255},{x:870,y:360}] },
  { id:"P13", name:"Orchard Cut-through", lengthM:97, footfallWeight:.47, baselineCoverage:.32, points:[{x:250,y:360},{x:250,y:485}] },
  { id:"P14", name:"Creekside Route", lengthM:205, footfallWeight:.64, baselineCoverage:.52, points:[{x:330,y:255},{x:420,y:320},{x:535,y:360},{x:650,y:430},{x:760,y:485}] },
  { id:"P15", name:"Student Union Loop", lengthM:132, footfallWeight:.96, baselineCoverage:.74, points:[{x:380,y:280},{x:470,y:290},{x:535,y:360},{x:470,y:430},{x:380,y:455}] },
  { id:"P16", name:"Auditorium Steps", lengthM:88, footfallWeight:.58, baselineCoverage:.57, points:[{x:535,y:255},{x:600,y:205},{x:650,y:140}] },
  { id:"P17", name:"West Residence Link", lengthM:117, footfallWeight:.93, baselineCoverage:.46, points:[{x:125,y:485},{x:200,y:555},{x:330,y:555},{x:380,y:455}] },
  { id:"P18", name:"East Residence Link", lengthM:123, footfallWeight:.98, baselineCoverage:.38, points:[{x:760,y:485},{x:650,y:555},{x:535,y:555},{x:470,y:430}] },
  { id:"P19", name:"Botanic Walk", lengthM:146, footfallWeight:.43, baselineCoverage:.69, points:[{x:250,y:360},{x:330,y:320},{x:380,y:280}] },
  { id:"P20", name:"South Gate Approach", lengthM:159, footfallWeight:.88, baselineCoverage:.6, points:[{x:330,y:555},{x:470,y:555},{x:535,y:555},{x:650,y:555}] },
];

export const buildings = [
  { name:"Aster Library", x:315,y:186,w:130,h:66,kind:"learning" }, { name:"North Hall",x:180,y:176,w:58,h:55,kind:"residence" },
  { name:"West Lecture Theatre",x:145,y:290,w:88,h:50,kind:"learning" }, { name:"Science & Engineering",x:295,y:285,w:158,h:60,kind:"learning" },
  { name:"Arts House",x:475,y:278,w:116,h:57,kind:"learning" }, { name:"Founders Hall",x:590,y:177,w:112,h:64,kind:"residence" },
  { name:"Health Centre",x:820,y:277,w:78,h:61,kind:"service" }, { name:"Student Union",x:337,y:389,w:88,h:55,kind:"service" },
  { name:"South Commons",x:463,y:385,w:106,h:54,kind:"service" }, { name:"East Residence",x:785,y:385,w:92,h:62,kind:"residence" },
  { name:"West Residence",x:155,y:405,w:88,h:57,kind:"residence" }, { name:"Performing Arts",x:590,y:280,w:112,h:56,kind:"learning" },
];

export const lights = [
  {id:"L01",name:"Willow 01",x:125,y:140,pathwayId:"P01"},{id:"L02",name:"Willow 02",x:250,y:140,pathwayId:"P01"},{id:"L03",name:"Willow 03",x:380,y:140,pathwayId:"P01"},{id:"L04",name:"Willow 04",x:650,y:140,pathwayId:"P01"},{id:"L05",name:"Willow 05",x:870,y:140,pathwayId:"P01"},
  {id:"L06",name:"Quad North",x:250,y:255,pathwayId:"P04"},{id:"L07",name:"Founders East",x:535,y:255,pathwayId:"P03"},{id:"L08",name:"Health Link",x:870,y:255,pathwayId:"P12"},{id:"L09",name:"Science West",x:125,y:360,pathwayId:"P10"},{id:"L10",name:"Science Central",x:380,y:360,pathwayId:"P06"},
  {id:"L11",name:"Arts Spine",x:535,y:360,pathwayId:"P11"},{id:"L12",name:"Quad East",x:650,y:360,pathwayId:"P05"},{id:"L13",name:"Residence East",x:760,y:360,pathwayId:"P09"},{id:"L14",name:"Orchard",x:250,y:485,pathwayId:"P13"},{id:"L15",name:"Commons West",x:380,y:485,pathwayId:"P08"},
  {id:"L16",name:"Commons East",x:650,y:485,pathwayId:"P08"},{id:"L17",name:"Residence South",x:760,y:485,pathwayId:"P09"},{id:"L18",name:"Creek Crossing",x:535,y:555,pathwayId:"P18"},{id:"L19",name:"South Gate",x:330,y:555,pathwayId:"P20"},{id:"L20",name:"Union Loop",x:470,y:430,pathwayId:"P15"},
];

export const seedIssues = [
  {id:"I01",title:"Light not illuminating",description:"Lamp cycles but the walkway remains dark.",category:"Streetlight",status:"ASSESSED",locationLabel:"North Quad, Willow Walk",streetlightId:"L02",pathwayId:"P04",cost:2200,improvements:{P04:.30,P05:.08}},
  {id:"I02",title:"Lamp outage",description:"Pole is intact; luminaire is out after dusk.",category:"Streetlight",status:"REPORTED",locationLabel:"Library approach",streetlightId:"L03",pathwayId:"P02",cost:1600,improvements:{P02:.31}},
  {id:"I03",title:"Two lamps out",description:"Dark section between the quad and residences.",category:"Streetlight",status:"ASSESSED",locationLabel:"Residence Way",streetlightId:"L13",pathwayId:"P09",cost:2800,improvements:{P09:.32,P18:.12}},
  {id:"I04",title:"Flickering light",description:"Intermittent output has been reported this week.",category:"Streetlight",status:"REPORTED",locationLabel:"Founders Lane",streetlightId:"L07",pathwayId:"P03",cost:1200,improvements:{P03:.19,P11:.05}},
  {id:"I05",title:"Broken light fitting",description:"Fitting is damaged near the southern crossing.",category:"Streetlight",status:"SCHEDULED",locationLabel:"Arts Promenade",streetlightId:"L11",pathwayId:"P11",cost:2400,improvements:{P11:.34,P14:.14}},
  {id:"I06",title:"Light out near gate",description:"Approach has one functioning light in this stretch.",category:"Streetlight",status:"REPORTED",locationLabel:"West Gate Walk",streetlightId:"L09",pathwayId:"P10",cost:1800,improvements:{P10:.24,P03:.06}},
  {id:"I07",title:"Dark walkway",description:"Several fixtures need service along the creek route.",category:"Pathway lighting",status:"ASSESSED",locationLabel:"Creekside Route",streetlightId:"L18",pathwayId:"P14",cost:3500,improvements:{P14:.31,P18:.22,P20:.08}},
  {id:"I08",title:"Lamp outage",description:"Lighting gap beside the science buildings.",category:"Streetlight",status:"REPORTED",locationLabel:"Science Spine",streetlightId:"L10",pathwayId:"P06",cost:1500,improvements:{P06:.25,P07:.07}},
  {id:"I09",title:"Low light level",description:"End-of-route light output appears reduced.",category:"Streetlight",status:"REPORTED",locationLabel:"East Residence Link",streetlightId:"L17",pathwayId:"P18",cost:2900,improvements:{P18:.31,P09:.11}},
  {id:"I10",title:"Intermittent power",description:"Light drops out during evening hours.",category:"Streetlight",status:"REPORTED",locationLabel:"South Commons Walk",streetlightId:"L16",pathwayId:"P08",cost:2000,improvements:{P08:.26,P20:.08}},
  {id:"I11",title:"Fixture damaged",description:"Cover needs replacement and electrical check.",category:"Streetlight",status:"REPORTED",locationLabel:"Orchard Cut-through",streetlightId:"L14",pathwayId:"P13",cost:1000,improvements:{P13:.23,P07:.08}},
  {id:"I12",title:"Dark corner",description:"Low coverage at the south-east path junction.",category:"Pathway lighting",status:"ASSESSED",locationLabel:"South Gate Approach",streetlightId:"L19",pathwayId:"P20",cost:2500,improvements:{P20:.28,P17:.12}},
];

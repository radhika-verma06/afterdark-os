import { PrismaClient } from "@prisma/client";
import { pathways, lights, seedIssues } from "../lib/campus";
const db = new PrismaClient();

export async function seedCampus(client: PrismaClient) {
  await client.issueHistory.deleteMany(); await client.repairImpact.deleteMany(); await client.issue.deleteMany(); await client.streetlight.deleteMany(); await client.scenario.deleteMany(); await client.pathway.deleteMany();
  for (const p of pathways) await client.pathway.create({ data: { id:p.id,name:p.name,lengthM:p.lengthM,footfallWeight:p.footfallWeight,baselineCoverage:p.baselineCoverage } });
  const affectedLights = new Set(seedIssues.map(i=>i.streetlightId));
  for (const l of lights) await client.streetlight.create({ data: { ...l, condition: !affectedLights.has(l.id) ? "WORKING" : seedIssues.find(i=>i.streetlightId===l.id)?.status === "SCHEDULED" ? "DIM" : "OUT", estimatedCost:1600 } });
  for (const issue of seedIssues) {
    const { improvements,cost,...fields } = issue;
    const light = lights.find(l=>l.id===issue.streetlightId)!;
    await client.issue.create({ data:{ ...fields,x:light.x,y:light.y,estimatedCost:cost,impacts:{create:Object.entries(improvements).map(([pathwayId,improvement])=>({pathwayId,improvement}))},history:{create:{status:issue.status,note:"Seeded synthetic demo record. No real campus report."}} } });
  }
}

if (process.argv[1]?.endsWith("seed.ts")) seedCampus(db).then(()=>console.log(`Seeded Aster Campus: ${pathways.length} pathways, ${lights.length} lights, ${seedIssues.length} issues.`)).finally(()=>db.$disconnect());

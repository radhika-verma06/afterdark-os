import { db } from "@/lib/db";

export async function getCampusSnapshot() {
  const [pathways, lights, issues, scenarios] = await Promise.all([
    db.pathway.findMany({ orderBy:{id:"asc"} }),
    db.streetlight.findMany({ orderBy:{id:"asc"} }),
    db.issue.findMany({ include:{ pathway:true,streetlight:true,history:{orderBy:{createdAt:"desc"}} ,impacts:{include:{pathway:true}} },orderBy:{createdAt:"desc"} }),
    db.scenario.findMany({orderBy:{createdAt:"desc"},take:5}),
  ]);
  const totalLength = pathways.reduce((n,p)=>n+p.lengthM,0);
  const coverage = pathways.reduce((n,p)=>n+p.lengthM*p.baselineCoverage,0)/Math.max(1,totalLength)*100;
  const open = issues.filter(i=>!(["REPAIRED","FIELD_CHECKED"].includes(i.status))).length;
  const candidates=issues.filter(i=>!(["REPAIRED","FIELD_CHECKED"].includes(i.status))&&["Streetlight","Pathway lighting"].includes(i.category));
  const cost = candidates.reduce((n,i)=>n+i.estimatedCost,0);
  return { pathways,lights,issues,scenarios,metrics:{openIssues:open,coverage,repairCost:cost,repairCandidates:candidates.length} };
}

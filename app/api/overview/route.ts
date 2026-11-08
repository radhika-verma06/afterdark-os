import { NextResponse } from "next/server";
import { getCampusSnapshot } from "@/lib/queries";
import { buildings, pathways as campusPaths } from "@/lib/campus";
import { optimiseRepairs } from "@/lib/optimizer";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await getCampusSnapshot();
    const geometry = campusPaths.map(p=>({id:p.id,points:p.points}));
    const candidates=data.issues.filter(i=>!["REPAIRED","FIELD_CHECKED"].includes(i.status)&&["Streetlight","Pathway lighting"].includes(i.category)).map(i=>({id:i.id,title:i.title,cost:i.estimatedCost,improvements:Object.fromEntries(i.impacts.map(x=>[x.pathwayId,x.improvement]))}));
    const priorities=candidates.map(c=>({id:c.id,title:c.title,cost:c.cost,gain:optimiseRepairs(data.pathways,candidates.filter(x=>x.id===c.id),15000).weightedGain})).sort((a,b)=>b.gain/Math.max(1,b.cost)-a.gain/Math.max(1,a.cost)).slice(0,3);
    return NextResponse.json({...data,buildings,geometry,priorities,synthetic:true});
  } catch { return NextResponse.json({error:"Campus database is not ready. Run npm run setup."},{status:503}); }
}

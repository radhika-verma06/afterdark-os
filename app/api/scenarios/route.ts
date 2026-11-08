import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { optimiseRepairs } from "@/lib/optimizer";
const input=z.object({budget:z.number().int().min(1000).max(15000),save:z.boolean().default(false),name:z.string().trim().min(2).max(60).optional()});

export async function GET(){return NextResponse.json({scenarios:await db.scenario.findMany({orderBy:{createdAt:"desc"},take:10})});}
export async function POST(request:NextRequest){
  const parsed=input.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message??"Invalid budget."},{status:400});
  const [pathways,issues]=await Promise.all([db.pathway.findMany(),db.issue.findMany({where:{status:{notIn:["REPAIRED","FIELD_CHECKED"]},category:{in:["Streetlight","Pathway lighting"]}},include:{impacts:true}})]);
  if(issues.length>20)return NextResponse.json({error:"The exact demo optimiser is bounded to 20 open lighting candidates. Close or reset reports before adding more candidates."},{status:422});
  const result=optimiseRepairs(pathways,issues.map(i=>({id:i.id,title:i.title,cost:i.estimatedCost,improvements:Object.fromEntries(i.impacts.map(x=>[x.pathwayId,x.improvement]))})),parsed.data.budget);
  let saved=null;if(parsed.data.save)saved=await db.scenario.create({data:{name:parsed.data.name??`₹${parsed.data.budget.toLocaleString("en-IN")} plan`,budget:parsed.data.budget,issueIds:JSON.stringify(result.selected.map(i=>i.id)),pathCoverage:JSON.stringify(result.pathCoverage),projectedPercent:result.projectedCoverage,weightedGain:result.weightedGain}});
  return NextResponse.json({...result,saved,synthetic:true});
}

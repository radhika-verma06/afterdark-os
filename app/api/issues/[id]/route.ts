import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
const updateSchema=z.object({status:z.enum(["ASSESSED","SCHEDULED","REPAIRED","FIELD_CHECKED"]),note:z.string().trim().min(8,"Add a short maintenance note.").max(500)});
const sequence=["REPORTED","ASSESSED","SCHEDULED","REPAIRED","FIELD_CHECKED"];

export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){
  const {id}=await params; const parsed=updateSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message??"Invalid update."},{status:400});
  const issue=await db.issue.findUnique({where:{id},include:{impacts:true}}); if(!issue)return NextResponse.json({error:"Issue not found."},{status:404});
  if(sequence.indexOf(parsed.data.status)!==sequence.indexOf(issue.status)+1)return NextResponse.json({error:`Move this issue one step at a time. Current state: ${issue.status.replaceAll("_"," ")}.`},{status:409});
  try{
    const result=await db.$transaction(async tx=>{
      const claim=await tx.issue.updateMany({where:{id,status:issue.status},data:{status:parsed.data.status}});
      if(claim.count!==1)throw new Error("STALE_ISSUE_STATE");
      if(parsed.data.status==="FIELD_CHECKED"){
        for(const impact of issue.impacts){const p=await tx.pathway.findUniqueOrThrow({where:{id:impact.pathwayId}});await tx.pathway.update({where:{id:p.id},data:{baselineCoverage:Math.min(1,p.baselineCoverage+impact.improvement)}});}
        if(issue.streetlightId)await tx.streetlight.update({where:{id:issue.streetlightId},data:{condition:"WORKING"}});
      }
      await tx.issueHistory.create({data:{issueId:id,status:parsed.data.status,note:parsed.data.note}});
      return tx.issue.findUniqueOrThrow({where:{id},include:{pathway:true,history:{orderBy:{createdAt:"desc"}},impacts:{include:{pathway:true}}}});
    });
    return NextResponse.json({issue:result,coverageAccepted:parsed.data.status==="FIELD_CHECKED"});
  }catch(error){if(error instanceof Error&&error.message==="STALE_ISSUE_STATE")return NextResponse.json({error:"This issue changed while you were editing it. Refresh and review its current stage."},{status:409});console.error("issue-update",error);return NextResponse.json({error:"Could not save the issue update."},{status:500});}
}

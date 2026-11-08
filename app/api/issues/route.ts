import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { mkdir,writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
const reportSchema=z.object({title:z.string().trim().min(4).max(90),description:z.string().trim().min(8).max(800),category:z.enum(["Streetlight","Pathway lighting","Obstruction","Other"]),pathwayId:z.string().regex(/^P\d{2}$/),x:z.coerce.number().min(80).max(920),y:z.coerce.number().min(90).max(590),locationLabel:z.string().trim().min(3).max(100),photoName:z.string().max(150).optional()});

export async function POST(request:NextRequest){
  try{
    const form=await request.formData(); const raw=Object.fromEntries([...form.entries()].filter(([k])=>k!=="photo"));
    let photoName:string|undefined;
    const photo=form.get("photo");
    if(photo instanceof File && photo.size){
      if(photo.size>4*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(photo.type)) return NextResponse.json({error:"Upload a JPG, PNG or WebP image under 4 MB."},{status:400});
      const ext=photo.type==="image/png"?"png":photo.type==="image/webp"?"webp":"jpg"; const bytes=Buffer.from(await photo.arrayBuffer());
      const valid=ext==="png"?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):ext==="webp"?bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP":bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
      if(!valid)return NextResponse.json({error:"The upload does not match its declared image type."},{status:400});
      photoName=`${randomUUID()}.${ext}`;const dir=path.join(process.cwd(),"public","uploads");await mkdir(dir,{recursive:true});await writeFile(path.join(dir,photoName),bytes);
    }
    const parsed=reportSchema.safeParse({...raw,photoName}); if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message??"Check the report details."},{status:400});
    const data=parsed.data; const pathway=await db.pathway.findUnique({where:{id:data.pathwayId}}); if(!pathway)return NextResponse.json({error:"Choose a pathway on Aster Campus."},{status:400});
    const isLighting=["Streetlight","Pathway lighting"].includes(data.category);
    if(isLighting&&await db.issue.count({where:{status:{notIn:["REPAIRED","FIELD_CHECKED"]},category:{in:["Streetlight","Pathway lighting"]}}})>=20)return NextResponse.json({error:"The exact repair optimiser supports up to 20 open lighting candidates. Close a report or reset the demo first."},{status:409});
    const issue=await db.issue.create({data:{id:`R${randomUUID().slice(0,8).toUpperCase()}`,title:data.title,description:data.description,category:data.category,status:"REPORTED",locationLabel:data.locationLabel,x:data.x,y:data.y,estimatedCost:isLighting?1800:0,photoName:data.photoName,pathwayId:data.pathwayId,impacts:isLighting?{create:{pathwayId:data.pathwayId,improvement:.12}}:undefined,history:{create:{status:"REPORTED",note:"Report submitted for assessment. No institutional approval implied."}}},include:{pathway:true,history:true}});
    return NextResponse.json({issue},{status:201});
  }catch(error){console.error("issue-create",error);return NextResponse.json({error:"Could not save this report. Check the database setup and try again."},{status:500});}
}

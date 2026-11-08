import { existsSync,writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
const root=process.cwd();
if(!existsSync(path.join(root,".env")))writeFileSync(path.join(root,".env"),'DATABASE_URL="file:./dev.db"\nGEMINI_API_KEY=""\n');
const envText=await import("node:fs/promises").then(fs=>fs.readFile(path.join(root,".env"),"utf8"));
const databaseUrl=process.env.DATABASE_URL??envText.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m)?.[1]??"file:./dev.db";
for(const args of [["prisma","db","push"],["tsx","prisma/seed.ts"]]){
  const bin=path.join(root,"node_modules",".bin",args[0]);
  const result=spawnSync(bin,args.slice(1),{cwd:root,stdio:"inherit",env:{...process.env,DATABASE_URL:databaseUrl}});
  if(result.status!==0)process.exit(result.status??1);
}

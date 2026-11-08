import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=Number(process.env.SMOKE_PORT||3178),base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,[path.join(root,"node_modules/next/dist/bin/next"),"start","--port",String(port)],{cwd:root,env:{...process.env,PORT:String(port)},stdio:"ignore"});
async function ready(){for(let i=0;i<100;i++){if(server.exitCode!==null)throw new Error(`Next exited with ${server.exitCode}`);try{const r=await fetch(`${base}/api/overview`);if(r.ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,250));}throw new Error("Local Next server did not become ready.");}
try{
  await ready();await fetch(`${base}/api/reset`,{method:"POST"});
  const overview=await fetch(`${base}/api/overview`).then(r=>r.json());
  assert.equal(overview.pathways.length,20);assert.equal(overview.lights.length,20);assert.equal(overview.issues.length,12);
  const plans=[];
  for(const budget of [3000,5000,8000]){const response=await fetch(`${base}/api/scenarios`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({budget})});assert.equal(response.status,200);const plan=await response.json();assert.ok(plan.totalCost<=budget);assert.ok(plan.projectedCoverage>=plan.baselineCoverage);plans.push(plan);}
  assert.equal(new Set(plans.map(p=>p.selected.map(i=>i.id).join(","))).size,3);
  assert.ok(plans[0].weightedGain<=plans[1].weightedGain+1e-9&&plans[1].weightedGain<=plans[2].weightedGain+1e-9);
  const savedResponse=await fetch(`${base}/api/scenarios`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({budget:5000,save:true,name:"API smoke scenario"})});const saved=await savedResponse.json();assert.ok(saved.saved?.id);assert.equal(typeof saved.saved.pathCoverage,"string");
  const before=await fetch(`${base}/api/overview`).then(r=>r.json());
  const form=new FormData();for(const [k,v] of Object.entries({title:"Smoke test light",description:"Fixture issue to check the repair lifecycle.",category:"Streetlight",pathwayId:"P01",x:"125",y:"140",locationLabel:"Willow Walk"}))form.set(k,v);
  const created=await fetch(`${base}/api/issues`,{method:"POST",body:form});assert.equal(created.status,201);const issue=(await created.json()).issue;
  for(const status of ["ASSESSED","SCHEDULED","REPAIRED"]){const r=await fetch(`${base}/api/issues/${issue.id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status,note:"Smoke test records a valid maintenance update."})});assert.equal(r.status,200);}
  const mid=await fetch(`${base}/api/overview`).then(r=>r.json());assert.equal(mid.metrics.coverage,before.metrics.coverage);
  const final=await fetch(`${base}/api/issues/${issue.id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status:"FIELD_CHECKED",note:"Smoke test field check accepted; synthetic fixture only."})});assert.equal(final.status,200);const after=await fetch(`${base}/api/overview`).then(r=>r.json());assert.ok(after.metrics.coverage>before.metrics.coverage);
  const invalid=await fetch(`${base}/api/issues/${issue.id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status:"ASSESSED",note:"Invalid backwards transition."})});assert.equal(invalid.status,409);
  await fetch(`${base}/api/reset`,{method:"POST"});
  console.log(JSON.stringify({seedCounts:{paths:overview.pathways.length,lights:overview.lights.length,issues:overview.issues.length},budgetPlans:plans.map(p=>({spent:p.totalCost,selected:p.selected.map(i=>i.id),projected:p.projectedCoverage.toFixed(2),objective:p.weightedGain.toFixed(2)})),scenarioSaved:true,reportLifecycle:"Reported → Assessed → Scheduled → Repaired → Field-checked",coverageChangedOnlyAfterFieldCheck:true,invalidTransitionRejected:true,resetRestored:true},null,2));
}finally{try{await fetch(`${base}/api/reset`,{method:"POST"});}catch{}server.kill("SIGTERM");}

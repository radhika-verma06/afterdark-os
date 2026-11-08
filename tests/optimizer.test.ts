import test from "node:test";
import assert from "node:assert/strict";
import { optimiseRepairs,type RepairInput } from "../lib/optimizer";
import { pathways,seedIssues } from "../lib/campus";

const repairs:RepairInput[]=seedIssues.map(i=>({id:i.id,title:i.title,cost:i.cost,improvements:Object.fromEntries(Object.entries(i.improvements).filter((entry):entry is [string,number]=>typeof entry[1]==="number"))}));
test("repair plan is deterministic for the same campus and budget",()=>{
  const a=optimiseRepairs(pathways,repairs,5000),b=optimiseRepairs(pathways,repairs,5000);
  assert.deepEqual(a.selected.map(x=>x.id),b.selected.map(x=>x.id));assert.equal(a.totalCost,b.totalCost);assert.equal(a.projectedCoverage,b.projectedCoverage);
});
test("every chosen combination obeys the budget and yields a real improvement",()=>{
  for(const budget of [3000,5000,8000]){const result=optimiseRepairs(pathways,repairs,budget);assert.ok(result.totalCost<=budget);assert.ok(result.projectedCoverage>=result.baselineCoverage);assert.ok(result.weightedGain>=0);}
});
test("higher budgets never reduce the exact optimal objective",()=>{
  const scores=[3000,5000,8000,15000].map(b=>optimiseRepairs(pathways,repairs,b).weightedGain);
  assert.ok(scores.every((v,i)=>i===0||v+1e-9>=scores[i-1]));
});
test("overlapping improvements are capped at complete coverage",()=>{
  const paths=[{id:"p",lengthM:100,footfallWeight:1,baselineCoverage:.8}];
  const result=optimiseRepairs(paths,[{id:"a",title:"A",cost:1,improvements:{p:.5}},{id:"b",title:"B",cost:1,improvements:{p:.5}}],2);
  assert.equal(result.pathCoverage.p,1);assert.equal(result.projectedCoverage,100);
});
test("repairs over budget are not selected",()=>{const result=optimiseRepairs(pathways,repairs,1000);assert.equal(result.totalCost,1000);assert.ok(result.selected.every(x=>x.cost<=1000));});

test("the judging-demo budgets lead to visibly different feasible plans",()=>{
  const plans=[3000,5000,8000].map(b=>optimiseRepairs(pathways,repairs,b).selected.map(x=>x.id).join(","));
  assert.equal(new Set(plans).size,3);
});
test("Aster route geometry is a connected network with the required demo inventory",()=>{
  assert.equal(pathways.length,20);assert.equal(seedIssues.length,12);
  const points=pathways.map(p=>new Set(p.points.map(x=>`${x.x},${x.y}`)));
  const seen=new Set([0]),queue=[0];
  while(queue.length){const i=queue.shift()!;for(let j=0;j<pathways.length;j++)if(!seen.has(j)&&[...points[i]].some(point=>points[j].has(point))){seen.add(j);queue.push(j);}}
  assert.equal(seen.size,pathways.length,"every pathway must connect to the campus walking graph");
});

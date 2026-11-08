export type PathInput = { id: string; name?: string; lengthM: number; footfallWeight: number; baselineCoverage: number };
export type RepairInput = { id: string; title: string; cost: number; improvements: Record<string, number> };
export type OptimisationResult = { selected: RepairInput[]; totalCost: number; baselineCoverage: number; projectedCoverage: number; weightedGain: number; pathCoverage: Record<string, number> };

function coverageScore(paths: PathInput[], repairs: RepairInput[]) {
  const applied: Record<string, number> = {};
  for (const repair of repairs) for (const [pathId, delta] of Object.entries(repair.improvements)) applied[pathId] = (applied[pathId] ?? 0) + delta;
  let denominator = 0, before = 0, after = 0, weightedGain = 0;
  const pathCoverage: Record<string, number> = {};
  for (const path of paths) {
    denominator += path.lengthM;
    before += path.lengthM * path.baselineCoverage;
    const next = Math.min(1, path.baselineCoverage + (applied[path.id] ?? 0));
    pathCoverage[path.id] = next;
    after += path.lengthM * next;
    weightedGain += path.lengthM * path.footfallWeight * (next - path.baselineCoverage);
  }
  return { baselineCoverage: before / denominator * 100, projectedCoverage: after / denominator * 100, weightedGain, pathCoverage };
}

/** Exact deterministic subset search for the bounded campus candidate set (<=20). */
export function optimiseRepairs(paths: PathInput[], candidates: RepairInput[], budget: number): OptimisationResult {
  if (!Number.isFinite(budget) || budget < 0) throw new Error("Budget must be a non-negative number.");
  if (candidates.length > 20) throw new Error("Exact demo optimiser supports at most 20 repair candidates.");
  if (!paths.length || paths.some(p=>!Number.isFinite(p.lengthM)||p.lengthM<=0||!Number.isFinite(p.footfallWeight)||p.footfallWeight<0||!Number.isFinite(p.baselineCoverage)||p.baselineCoverage<0||p.baselineCoverage>1)) throw new Error("Pathway length, footfall and baseline coverage must be valid.");
  if(new Set(paths.map(p=>p.id)).size!==paths.length||new Set(candidates.map(r=>r.id)).size!==candidates.length)throw new Error("Pathway and repair IDs must be unique.");
  const pathIds=new Set(paths.map(p=>p.id));
  if(candidates.some(r=>!Number.isFinite(r.cost)||r.cost<0||Object.entries(r.improvements).some(([id,value])=>!pathIds.has(id)||!Number.isFinite(value)||value<0))) throw new Error("Repair costs and pathway improvements must be valid and refer to known paths.");
  const sorted = [...candidates].sort((a,b) => a.id.localeCompare(b.id));
  let best: RepairInput[] = [];
  let bestCost = 0;
  let bestScore = coverageScore(paths, []).weightedGain;
  const total = 1 << sorted.length;
  for (let mask = 1; mask < total; mask++) {
    let cost = 0; const picked: RepairInput[] = [];
    for (let i = 0; i < sorted.length; i++) if (mask & (1 << i)) { cost += sorted[i].cost; if (cost > budget) break; picked.push(sorted[i]); }
    if (cost > budget) continue;
    const score = coverageScore(paths, picked).weightedGain;
    if (score > bestScore + 1e-9 || (Math.abs(score - bestScore) <= 1e-9 && (cost < bestCost || (cost === bestCost && picked.map(x=>x.id).join(",") < best.map(x=>x.id).join(","))))) {
      best = picked; bestCost = cost; bestScore = score;
    }
  }
  return { selected: best, totalCost: bestCost, ...coverageScore(paths, best) };
}

export function marginalExplanation(paths: PathInput[], selected: RepairInput[], repair: RepairInput) {
  const base = coverageScore(paths, selected).weightedGain;
  const withRepair = coverageScore(paths, [...selected, repair]).weightedGain;
  const points = ((withRepair - base) / Math.max(1, paths.reduce((n,p)=>n+p.lengthM*p.footfallWeight,0))) * 100;
  const affected = Object.keys(repair.improvements).map(id => paths.find(p=>p.id===id)?.name).filter(Boolean);
  return `Adds about ${points.toFixed(1)} weighted coverage points across ${affected.join(" and ")}, after overlap is capped.`;
}

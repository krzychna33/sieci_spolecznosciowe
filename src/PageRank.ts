import { DirectedGraph, NodeId } from './DirectedGraph';

export interface PageRankResult {
  ranks: Map<NodeId, number>;
  iterations: number;
  conv: boolean;
}

export interface PageRankOptions {
  maxIterations: number;
  epsilon: number;
  dampingFactor?: number;
}

export class PageRank {
  constructor(private graph: DirectedGraph) {}

  private initRanks(): Map<NodeId, number> {
    const nodes = this.graph.getAllNodes();
    const ranks = new Map<NodeId, number>();
    nodes.forEach(node => ranks.set(node, 1 / nodes.length));
    return ranks;
  }

  private calcDiff(newRanks: Map<NodeId, number>, oldRanks: Map<NodeId, number>): number {
    let totalDifference = 0;
    
    for (const [node, newRank] of newRanks) {
      const oldRank = oldRanks.get(node) || 0;
      const nodeDifference = Math.abs(newRank - oldRank);
      totalDifference += nodeDifference;
    }
    
    return totalDifference;
  }

  // Wariant 1: PageRank bez tłumienia
  calculateBasic(options: PageRankOptions): PageRankResult {
    const { maxIterations, epsilon } = options;
    const nodes = this.graph.getAllNodes();
    let ranks = this.initRanks();

    for (let i = 0; i < maxIterations; i++) {
      const newRanks = new Map<NodeId, number>();
      nodes.forEach(n => newRanks.set(n, 0));

      for (const node of nodes) {
        const out = this.graph.getOutNeighbors(node);
        if (out.length > 0) {
          const share = ranks.get(node)! / out.length;
          out.forEach(neighbor => newRanks.set(neighbor, newRanks.get(neighbor)! + share));
        }
      }

      if (this.calcDiff(newRanks, ranks) < epsilon) {
        return { ranks: newRanks, iterations: i + 1, conv: true };
      }
      ranks = newRanks;
    }
    return { ranks, iterations: maxIterations, conv: false };
  }

  // Wariant 2: PageRank z dampingiem
  calculateDamped(options: PageRankOptions): PageRankResult {
    const { maxIterations, epsilon, dampingFactor = 0.85 } = options;
    const nodes = this.graph.getAllNodes();
    const n = nodes.length;
    const base = (1 - dampingFactor) / n;
    let ranks = this.initRanks();

    for (let i = 0; i < maxIterations; i++) {
      const newRanks = new Map<NodeId, number>();
      
      nodes.forEach(node => newRanks.set(node, base));

      for (const node of nodes) {
        const out = this.graph.getOutNeighbors(node);
        if (out.length > 0) {
          const share = (dampingFactor * ranks.get(node)!) / out.length;
          out.forEach(neighbor => newRanks.set(neighbor, newRanks.get(neighbor)! + share));
        }
      }

      if (this.calcDiff(newRanks, ranks) < epsilon) {
        return { ranks: newRanks, iterations: i + 1, conv: true };
      }
      ranks = newRanks;
    }
    return { ranks, iterations: maxIterations, conv: false };
  }

  static printRanking(result: PageRankResult, title: string): void {
    console.log(`\n${title}`);
    const sorted = [...result.ranks.entries()].sort((a, b) => b[1] - a[1]);
    sorted.forEach(([node, rank], i) => 
      console.log(`  ${i + 1}. ${node}: ${(rank * 100).toFixed(2)}%`)
    );
    console.log(`  Iteracje: ${result.iterations}, Zbieżność: ${result.conv ? 'TAK' : 'NIE'}`);
  }
}

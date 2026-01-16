import { DirectedGraph, NodeId } from './DirectedGraph';


export class HITS {
  private graph: DirectedGraph;
  
  constructor(graph: DirectedGraph) {
    this.graph = graph;
  }

  compute(iterations: number = 10): Map<NodeId, {authority: number, hub: number}> {
    const nodes = this.graph.getAllNodes();
    
    //Każda strona startuje z wartością 1.0
    const auth = new Map<NodeId, number>();
    const hub = new Map<NodeId, number>();
    
    for (const node of nodes) {
      auth.set(node, 1.0);
      hub.set(node, 1.0);
    }

    for (let i = 0; i < iterations; i++) {
      const newAuth = new Map<NodeId, number>();
      const newHub = new Map<NodeId, number>();

      // Authority = suma Hub'ów stron linkujących do mnie
      for (const node of nodes) {
        let score = 0;
        for (const other of nodes) {
          if (this.graph.getOutNeighbors(other).includes(node)) {
            score += hub.get(other) || 0;
          }
        }
        newAuth.set(node, score);
      }

      //Hub = suma Authority stron, do których linkuję
      for (const node of nodes) {
        let score = 0;
        for (const target of this.graph.getOutNeighbors(node)) {
          score += newAuth.get(target) || 0;
        }
        newHub.set(node, score);
      }

      this.normalize(newAuth);
      this.normalize(newHub);

      for (const node of nodes) {
        auth.set(node, newAuth.get(node) || 0);
        hub.set(node, newHub.get(node) || 0);
      }
    }

    const results = new Map<NodeId, {authority: number, hub: number}>();
    for (const node of nodes) {
      results.set(node, {
        authority: auth.get(node) || 0,
        hub: hub.get(node) || 0
      });
    }
    return results;
  }

  private normalize(values: Map<NodeId, number>): void {
    let sum = 0;
    for (const val of values.values()) sum += val * val;
    
    const norm = Math.sqrt(sum);
    if (norm > 0) {
      for (const [node, val] of values) {
        values.set(node, val / norm);
      }
    }
  }

  getTopAuthorities(scores: Map<NodeId, {authority: number, hub: number}>, n: number = 10) {
    return Array.from(scores.entries())
      .map(([node, s]) => ({ node, score: s.authority }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }

  getTopHubs(scores: Map<NodeId, {authority: number, hub: number}>, n: number = 10) {
    return Array.from(scores.entries())
      .map(([node, s]) => ({ node, score: s.hub }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }
}

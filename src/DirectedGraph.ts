export type NodeId = string;

export class DirectedGraph {
  private outEdges: Map<NodeId, Set<NodeId>> = new Map();
  private inEdges: Map<NodeId, Set<NodeId>> = new Map();

  addNode(node: NodeId): void {
    if (!this.outEdges.has(node)) this.outEdges.set(node, new Set());
    if (!this.inEdges.has(node)) this.inEdges.set(node, new Set());
  }

  addEdge(from: NodeId, to: NodeId): void {
    this.addNode(from);
    this.addNode(to);
    this.outEdges.get(from)!.add(to);
    this.inEdges.get(to)!.add(from);
  }

  getOutNeighbors(node: NodeId): NodeId[] {
    return Array.from(this.outEdges.get(node) || []);
  }

  getOutDegree(node: NodeId): number {
    return this.outEdges.get(node)?.size ?? 0;
  }

  getAllNodes(): NodeId[] {
    return Array.from(this.outEdges.keys());
  }
}

export type NodeId = string;

export class UndirectedGraph {
  private adjacencyList: Map<NodeId, Set<NodeId>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node: NodeId): void {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Set());
    }
  }

  addEdge(node1: NodeId, node2: NodeId): void {
    this.addNode(node1);
    this.addNode(node2);

    this.adjacencyList.get(node1)!.add(node2);
    this.adjacencyList.get(node2)!.add(node1);
  }

  hasEdge(node1: NodeId, node2: NodeId): boolean {
    return this.adjacencyList.get(node1)?.has(node2) ?? false;
  }

  getNeighbors(node: NodeId): NodeId[] {
    return Array.from(this.adjacencyList.get(node) || []);
  }

  getAllNodes(): NodeId[] {
    return Array.from(this.adjacencyList.keys());
  }
}

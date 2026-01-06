export type NodeId = string;

/**
 * Typ etykiety krawędzi: Plus (+) lub Minus (-)
 */
export enum EdgeLabel {
  Plus = '+',
  Minus = '-'
}

/**
 * Typ reprezentujący krawędź z etykietą
 */
type LabeledEdge = {
  target: NodeId;
  label: EdgeLabel;
};

/**
 * Klasa reprezentująca graf nieskierowany z krawędziami oznaczonymi jako + lub -
 */
export class LabeledGraph {
  // Mapa przechowująca wierzchołki i zbiór ich sąsiadów z etykietami krawędzi
  private adjacencyList: Map<NodeId, Map<NodeId, EdgeLabel>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  /**
   * Dodaje wierzchołek do grafu (jeśli nie istnieje)
   */
  addNode(node: NodeId): void {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Map());
    }
  }

  /**
   * Dodaje krawędź nieskierowaną z etykietą między dwoma wierzchołkami
   */
  addEdge(node1: NodeId, node2: NodeId, label: EdgeLabel): void {
    this.addNode(node1);
    this.addNode(node2);

    this.adjacencyList.get(node1)!.set(node2, label);
    this.adjacencyList.get(node2)!.set(node1, label);
  }

  /**
   * Sprawdza, czy istnieje krawędź między wierzchołkami
   */
  hasEdge(node1: NodeId, node2: NodeId): boolean {
    return this.adjacencyList.get(node1)?.has(node2) ?? false;
  }

  /**
   * Zwraca etykietę krawędzi między dwoma wierzchołkami
   * @returns EdgeLabel jeśli krawędź istnieje, undefined jeśli nie
   */
  getEdgeLabel(node1: NodeId, node2: NodeId): EdgeLabel | undefined {
    return this.adjacencyList.get(node1)?.get(node2);
  }

  /**
   * Zwraca listę wszystkich sąsiadów danego wierzchołka
   */
  getNeighbors(node: NodeId): NodeId[] {
    const neighbors = this.adjacencyList.get(node);
    return neighbors ? Array.from(neighbors.keys()) : [];
  }

  /**
   * Zwraca listę sąsiadów wraz z etykietami krawędzi
   */
  getNeighborsWithLabels(node: NodeId): LabeledEdge[] {
    const neighbors = this.adjacencyList.get(node);
    if (!neighbors) return [];

    return Array.from(neighbors.entries()).map(([target, label]) => ({
      target,
      label
    }));
  }

  /**
   * Zwraca listę wszystkich wierzchołków w grafie
   */
  getAllNodes(): NodeId[] {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Zwraca wszystkie krawędzie w grafie wraz z etykietami
   */
  getAllEdges(): Array<{ node1: NodeId; node2: NodeId; label: EdgeLabel }> {
    const edges: Array<{ node1: NodeId; node2: NodeId; label: EdgeLabel }> = [];
    const visited = new Set<string>();

    for (const [node1, neighbors] of this.adjacencyList.entries()) {
      for (const [node2, label] of neighbors.entries()) {
        const edgeKey = [node1, node2].sort().join('-');
        if (!visited.has(edgeKey)) {
          edges.push({ node1, node2, label });
          visited.add(edgeKey);
        }
      }
    }

    return edges;
  }

  /**
   * Zwraca liczbę wierzchołków w grafie
   */
  getNodeCount(): number {
    return this.adjacencyList.size;
  }

  /**
   * Zwraca liczbę krawędzi w grafie
   */
  getEdgeCount(): number {
    let count = 0;
    for (const neighbors of this.adjacencyList.values()) {
      count += neighbors.size;
    }
    return count / 2; // Dzielimy przez 2, bo każda krawędź jest liczona dwukrotnie
  }
}

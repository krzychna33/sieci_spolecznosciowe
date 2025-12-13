export type NodeId = string;

/**
 * Klasa reprezentująca graf nieskierowany
 */
export class UndirectedGraph {
  // Mapa przechowująca wierzchołki i zbiór ich sąsiadów
  private adjacencyList: Map<NodeId, Set<NodeId>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  /**
   * Dodaje wierzchołek do grafu (jeśli nie istnieje)
   */
  addNode(node: NodeId): void {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, new Set());
    }
  }

  /**
   * Dodaje krawędź nieskierowaną między dwoma wierzchołkami
   */
  addEdge(node1: NodeId, node2: NodeId): void {
    this.addNode(node1);
    this.addNode(node2);

    this.adjacencyList.get(node1)!.add(node2);
    this.adjacencyList.get(node2)!.add(node1);
  }

  /**
   * Sprawdza, czy istnieje krawędź między wierzchołkami
   */
  hasEdge(node1: NodeId, node2: NodeId): boolean {
    return this.adjacencyList.get(node1)?.has(node2) ?? false;
  }

  /**
   * Zwraca listę wszystkich sąsiadów danego wierzchołka
   */
  getNeighbors(node: NodeId): NodeId[] {
    return Array.from(this.adjacencyList.get(node) || []);
  }

  /**
   * Zwraca listę wszystkich wierzchołków w grafie
   */
  getAllNodes(): NodeId[] {
    return Array.from(this.adjacencyList.keys());
  }
}

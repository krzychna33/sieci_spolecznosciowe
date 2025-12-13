import { UndirectedGraph, NodeId } from './UndirectedGraph';

/**
 * Reprezentacja krawędzi (mostu)
 */
export interface Edge {
  node1: NodeId;
  node2: NodeId;
}

/**
 * Klasa do analizy mostów w grafie
 * Most (bridge) - krawędź, której usunięcie zwiększa liczbę spójnych składowych
 */
export class BridgeAnalysis {
  private graph: UndirectedGraph;

  constructor(graph: UndirectedGraph) {
    this.graph = graph;
  }

  /**
   * Znajduje wszystkie mosty w grafie
   * Algorytm: dla każdej krawędzi sprawdza czy jej usunięcie rozspójnia graf
   */
  findBridges(): Edge[] {
    const bridges: Edge[] = [];
    const nodes = this.graph.getAllNodes();
    const edges = this.getAllEdges();

    // Dla każdej krawędzi
    for (const edge of edges) {
      // Sprawdź czy usunięcie tej krawędzi rozspójnia graf
      if (this.isGraphDisconnectedWithoutEdge(edge, nodes)) {
        bridges.push(edge);
      }
    }

    return bridges;
  }

  /**
   * Pobiera wszystkie krawędzie z grafu
   */
  private getAllEdges(): Edge[] {
    const edges: Edge[] = [];
    const visited = new Set<string>();
    const nodes = this.graph.getAllNodes();

    for (const node of nodes) {
      const neighbors = this.graph.getNeighbors(node);
      for (const neighbor of neighbors) {
        // Unikamy duplikatów - każdą krawędź liczymy raz
        const edgeKey = [node, neighbor].sort().join('-');
        if (!visited.has(edgeKey)) {
          visited.add(edgeKey);
          edges.push({ node1: node, node2: neighbor });
        }
      }
    }

    return edges;
  }

  /**
   * Sprawdza czy graf jest rozspójniony po usunięciu danej krawędzi
   * @param removedEdge - krawędź do usunięcia
   * @param nodes - wszystkie węzły grafu
   * @returns true jeśli graf jest rozspójniony (krawędź jest mostem)
   */
  private isGraphDisconnectedWithoutEdge(removedEdge: Edge, nodes: NodeId[]): boolean {
    if (nodes.length === 0) return false;

    // Spróbuj przeszukać graf BFS/DFS bez używania usuniętej krawędzi
    const visited = new Set<NodeId>();
    const queue: NodeId[] = [nodes[0]]; // Zaczynamy od pierwszego węzła
    visited.add(nodes[0]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = this.graph.getNeighbors(current);

      for (const neighbor of neighbors) {
        // Pomijamy usuniętą krawędź
        if (this.isEdge(current, neighbor, removedEdge)) {
          continue;
        }

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    // Jeśli nie odwiedziliśmy wszystkich węzłów, graf jest rozspójniony
    return visited.size < nodes.length;
  }

  /**
   * Sprawdza czy dana para węzłów to usunięta krawędź
   */
  private isEdge(node1: NodeId, node2: NodeId, edge: Edge): boolean {
    return (node1 === edge.node1 && node2 === edge.node2) ||
           (node1 === edge.node2 && node2 === edge.node1);
  }

  /**
   * Wyświetla znalezione mosty
   */
  displayBridges(): void {
    const bridges = this.findBridges();

    console.log(`Mosty: ${bridges.length}`);
    if (bridges.length > 0) {
      bridges.forEach(bridge => {
        console.log(`  ${bridge.node1} -- ${bridge.node2}`);
      });
    }
    console.log('');
  }

  /**
   * Znajduje mosty lokalne w grafie
   * Most lokalny - krawędź, której końce nie mają wspólnych sąsiadów
   * (krawędź nie jest częścią żadnego trójkąta)
   */
  findLocalBridges(): Edge[] {
    const localBridges: Edge[] = [];
    const edges = this.getAllEdges();

    for (const edge of edges) {
      if (this.isLocalBridge(edge)) {
        localBridges.push(edge);
      }
    }

    return localBridges;
  }

  /**
   * Sprawdza czy krawędź jest mostem lokalnym
   * (czy oba końce krawędzi mają wspólnych sąsiadów oprócz siebie)
   */
  private isLocalBridge(edge: Edge): boolean {
    const neighbors1 = new Set(this.graph.getNeighbors(edge.node1));
    const neighbors2 = new Set(this.graph.getNeighbors(edge.node2));

    // Usuń końce krawędzi ze zbiorów sąsiadów
    neighbors1.delete(edge.node2);
    neighbors2.delete(edge.node1);

    // Sprawdź czy istnieją wspólni sąsiedzi
    for (const neighbor of neighbors1) {
      if (neighbors2.has(neighbor)) {
        return false; // Znaleziono wspólnego sąsiada - nie jest mostem lokalnym
      }
    }

    return true; // Brak wspólnych sąsiadów - jest mostem lokalnym
  }

  /**
   * Wyświetla znalezione mosty lokalne
   */
  displayLocalBridges(): void {
    const bridges = this.findLocalBridges();

    console.log(`Mosty lokalne: ${bridges.length}`);
    if (bridges.length > 0) {
      bridges.forEach(bridge => {
        console.log(`  ${bridge.node1} -- ${bridge.node2}`);
      });
    }
    console.log('');
  }
}

// --- PRZYKŁAD UŻYCIA ---

import { LinearGraphFactory, TriangleGraphFactory, CustomGraphFactory, ComplexGraphFactory } from './GraphFactory';

const linearFactory = new LinearGraphFactory();
const linearGraph = linearFactory.createGraph();
console.log(linearFactory.getDescription());
const analysis1 = new BridgeAnalysis(linearGraph);
analysis1.displayBridges();
analysis1.displayLocalBridges();

const triangleFactory = new TriangleGraphFactory();
const triangleGraph = triangleFactory.createGraph();
console.log(triangleFactory.getDescription());
const analysis2 = new BridgeAnalysis(triangleGraph);
analysis2.displayBridges();
analysis2.displayLocalBridges();

const customFactory = new CustomGraphFactory();
const customGraph = customFactory.createGraph();
console.log(customFactory.getDescription());
const analysis3 = new BridgeAnalysis(customGraph);
analysis3.displayBridges();
analysis3.displayLocalBridges();

const complexFactory = new ComplexGraphFactory();
const complexGraph = complexFactory.createGraph();
console.log(complexFactory.getDescription());
const analysis4 = new BridgeAnalysis(complexGraph);
analysis4.displayBridges();
analysis4.displayLocalBridges();

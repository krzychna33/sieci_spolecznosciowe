import { UndirectedGraph, NodeId } from './UndirectedGraph';

/**
 * Interfejs dla fabryk grafów
 */
export interface IGraphFactory {
  /**
   * Tworzy i zwraca skonfigurowany graf
   */
  createGraph(): UndirectedGraph;
  
  /**
   * Zwraca nazwę/opis grafu
   */
  getDescription(): string;
}

/**
 * Graf liniowy: A -- B -- C -- D
 */
export class LinearGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'D');
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf liniowy: A -- B -- C -- D';
  }
}

/**
 * Graf trójkątny: A -- B -- C -- A (trójkąt)
 */
export class TriangleGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf trójkątny: A -- B -- C -- A';
  }
}

/**
 * Graf gwiazdy: Centrum połączone ze wszystkimi innymi węzłami
 *     A
 *     |
 * D--Hub--B
 *     |
 *     C
 */
export class StarGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    const hub = 'Hub';
    const nodes = ['A', 'B', 'C', 'D'];
    
    for (const node of nodes) {
      graph.addEdge(hub, node);
    }
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf gwiazdy: Hub połączony z A, B, C, D';
  }
}

/**
 * Graf pełny K4: Każdy węzeł połączony z każdym
 */
export class CompleteGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    const nodes = ['A', 'B', 'C', 'D'];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        graph.addEdge(nodes[i], nodes[j]);
      }
    }
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf pełny K4: Każdy węzeł połączony z każdym';
  }
}

/**
 * Sieć społecznościowa - przykład z zadania
 */
export class SocialNetworkGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    graph.addEdge('Anna', 'Bartek');
    graph.addEdge('Bartek', 'Celina');
    graph.addEdge('Anna', 'Daniel');
    graph.addEdge('Bartek', 'Daniel');
    graph.addEdge('Daniel', 'Ewa');
    graph.addEdge('Bartek', 'Ewa');
    
    return graph;
  }
  
  getDescription(): string {
    return 'Sieć społecznościowa: Anna, Bartek, Celina, Daniel, Ewa';
  }
}

/**
 * Graf z izolowanym węzłem
 */
export class DisconnectedGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addNode('Izolowany');
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf z izolowanym węzłem: A -- B -- C, Izolowany';
  }
}

/**
 * Graf kwadratowy (cykl 4 węzłów)
 * A -- B
 * |    |
 * D -- C
 */
export class SquareGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'D');
    graph.addEdge('D', 'A');
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf kwadratowy (cykl C4): A -- B -- C -- D -- A';
  }
}

/**
 * Graf niestandardowy ze zdjęcia
 * Struktura: G--B--F--E--D--C
 *               |     |  |  |
 *               +--A--+--+--+
 */
export class CustomGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    // Połączenia z diagramu
    graph.addEdge('G', 'B');
    graph.addEdge('B', 'F');
    graph.addEdge('B', 'A');
    graph.addEdge('F', 'E');
    graph.addEdge('E', 'A');
    graph.addEdge('A', 'D');
    graph.addEdge('A', 'C');
    graph.addEdge('D', 'C');
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf niestandardowy (ze zdjęcia): G, B, F, E, A, D, C';
  }
}

/**
 * Graf złożony ze zdjęcia
 * Kompleksowa struktura z wieloma trójkątami i kwadratami
 */
export class ComplexGraphFactory implements IGraphFactory {
  createGraph(): UndirectedGraph {
    const graph = new UndirectedGraph();
    
    // Górna część
    graph.addEdge('J', 'G');
    graph.addEdge('G', 'K');
    graph.addEdge('J', 'F');
    graph.addEdge('G', 'F');
    graph.addEdge('G', 'H');
    graph.addEdge('K', 'H');
    
    // Środkowa część - lewa strona
    graph.addEdge('F', 'C');
    graph.addEdge('F', 'A');
    
    // Środkowa część - prawa strona
    graph.addEdge('H', 'B');
    graph.addEdge('H', 'L');
    
    // Środek - połączenie A-B
    graph.addEdge('A', 'B');
    
    // Lewy kwadrat z przekątnymi (C, A, D, E)
    graph.addEdge('C', 'A');
    graph.addEdge('C', 'D');
    graph.addEdge('A', 'E');
    graph.addEdge('D', 'E');
    graph.addEdge('C', 'E'); // przekątna
    graph.addEdge('A', 'D'); // przekątna
    
    // Prawy kwadrat z przekątnymi (B, L, M, P)
    graph.addEdge('B', 'L');
    graph.addEdge('B', 'M');
    graph.addEdge('L', 'P');
    graph.addEdge('M', 'P');
    graph.addEdge('B', 'P'); // przekątna
    graph.addEdge('L', 'M'); // przekątna
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf złożony: J, G, K, F, H, C, A, B, L, D, E, M, P';
  }
}

import { UndirectedGraph, NodeId } from './UndirectedGraph';
import { LinearGraphFactory, StarGraphFactory, SquareGraphFactory } from './GraphFactory';

/**
 * Potencjalne połączenie między węzłami
 */
interface PotentialConnection {
  node1: NodeId;
  node2: NodeId;
  isTriadicClosure: boolean; // true jeśli to domknięcie triadyczne
}

/**
 * Symulacja ewolucji grafu przez domknięcia triadyczne i losowe połączenia
 */
class GraphEvolutionSimulation {
  private graph: UndirectedGraph;
  private triadicClosureProbability: number;
  private randomConnectionProbability: number;

  constructor(
    graph: UndirectedGraph,
    triadicClosureProbability: number = 0.5,
    randomConnectionProbability: number = 0.1
  ) {
    this.graph = graph;
    this.triadicClosureProbability = triadicClosureProbability;
    this.randomConnectionProbability = randomConnectionProbability;
  }

  /**
   * Znajduje potencjalne domknięcia triadyczne
   * (pary węzłów, które mają wspólnego sąsiada, ale nie są połączone)
   */
  private findTriadicClosures(): PotentialConnection[] {
    const closures: PotentialConnection[] = [];
    const nodes = this.graph.getAllNodes();
    const checked = new Set<string>();

    for (const bridge of nodes) {
      const neighbors = this.graph.getNeighbors(bridge);

      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          const u = neighbors[i];
          const w = neighbors[j];

          // Jeśli u i w nie są połączone
          if (!this.graph.hasEdge(u, w)) {
            const key = [u, w].sort().join('-');
            if (!checked.has(key)) {
              checked.add(key);
              closures.push({ node1: u, node2: w, isTriadicClosure: true });
            }
          }
        }
      }
    }

    return closures;
  }

  /**
   * Znajduje wszystkie potencjalne losowe połączenia
   * (wszystkie pary węzłów, które nie są połączone i nie są domknięciami triadycznymi)
   */
  private findRandomConnections(): PotentialConnection[] {
    const connections: PotentialConnection[] = [];
    const nodes = this.graph.getAllNodes();
    const triadicClosures = new Set(
      this.findTriadicClosures().map(c => [c.node1, c.node2].sort().join('-'))
    );

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        if (!this.graph.hasEdge(node1, node2)) {
          const key = [node1, node2].sort().join('-');
          if (!triadicClosures.has(key)) {
            connections.push({ node1, node2, isTriadicClosure: false });
          }
        }
      }
    }

    return connections;
  }

  /**
   * Sprawdza czy graf jest pełny (każdy węzeł połączony z każdym)
   */
  private isComplete(): boolean {
    const nodes = this.graph.getAllNodes();
    const n = nodes.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (!this.graph.hasEdge(nodes[i], nodes[j])) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Liczy liczbę istniejących krawędzi
   */
  private countEdges(): number {
    let count = 0;
    const nodes = this.graph.getAllNodes();

    for (let i = 0; i < nodes.length; i++) {
      count += this.graph.getNeighbors(nodes[i]).length;
    }

    return count / 2; // Każda krawędź policzona dwukrotnie
  }

  /**
   * Wykonuje jedną iterację symulacji
   * @returns liczba dodanych połączeń
   */
  private performIteration(): number {
    let addedConnections = 0;

    // 1. Próbujemy dodać domknięcia triadyczne
    const triadicClosures = this.findTriadicClosures();
    for (const closure of triadicClosures) {
      if (Math.random() < this.triadicClosureProbability) {
        this.graph.addEdge(closure.node1, closure.node2);
        addedConnections++;
      }
    }

    // 2. Próbujemy dodać losowe połączenia
    const randomConnections = this.findRandomConnections();
    for (const connection of randomConnections) {
      if (Math.random() < this.randomConnectionProbability) {
        this.graph.addEdge(connection.node1, connection.node2);
        addedConnections++;
      }
    }

    return addedConnections;
  }

  /**
   * Uruchamia symulację i zwraca liczbę iteracji potrzebnych do pełnego połączenia
   */
  simulate(maxIterations: number = 1000): {
    iterations: number;
    completed: boolean;
    finalEdges: number;
    maxPossibleEdges: number;
  } {
    const nodes = this.graph.getAllNodes();
    const n = nodes.length;
    const maxPossibleEdges = (n * (n - 1)) / 2;
    const initialEdges = this.countEdges();

    console.log(`\nRozpoczynanie symulacji:`);
    console.log(`  Węzły: ${n}`);
    console.log(`  Początkowe krawędzie: ${initialEdges}`);
    console.log(`  Maksymalne możliwe krawędzie: ${maxPossibleEdges}`);
    console.log(`  P(domknięcie triadyczne): ${this.triadicClosureProbability * 100}%`);
    console.log(`  P(połączenie losowe): ${this.randomConnectionProbability * 100}%`);

    let iteration = 0;
    
    while (iteration < maxIterations && !this.isComplete()) {
      iteration++;
      const added = this.performIteration();
      
      if (iteration % 10 === 0 || added > 0) {
        const currentEdges = this.countEdges();
        console.log(`  Iteracja ${iteration}: dodano ${added} krawędzi, razem: ${currentEdges}`);
      }

      // Jeśli nic nie dodano w ostatnich iteracjach, przerwij
      if (added === 0) {
        const triadicClosures = this.findTriadicClosures();
        const randomConnections = this.findRandomConnections();
        if (triadicClosures.length === 0 && randomConnections.length === 0) {
          break;
        }
      }
    }

    const finalEdges = this.countEdges();
    const completed = this.isComplete();

    console.log(`\nWynik symulacji:`);
    console.log(`  Iteracje: ${iteration}`);
    console.log(`  Graf pełny: ${completed ? 'TAK' : 'NIE'}`);
    console.log(`  Końcowe krawędzie: ${finalEdges}/${maxPossibleEdges}`);
    console.log(`  Stopień wypełnienia: ${((finalEdges / maxPossibleEdges) * 100).toFixed(2)}%\n`);

    return {
      iterations: iteration,
      completed,
      finalEdges,
      maxPossibleEdges
    };
  }
}

// --- PRZYKŁAD UŻYCIA ---

console.log('═'.repeat(60));
console.log('SYMULACJA 1: Graf liniowy (A--B--C--D)');
console.log('═'.repeat(60));

const linearFactory = new LinearGraphFactory();
const linearGraph = linearFactory.createGraph();
const sim1 = new GraphEvolutionSimulation(linearGraph, 0.5, 0.1);
sim1.simulate();

console.log('═'.repeat(60));
console.log('SYMULACJA 2: Graf gwiazdy');
console.log('═'.repeat(60));

const starFactory = new StarGraphFactory();
const starGraph = starFactory.createGraph();
const sim2 = new GraphEvolutionSimulation(starGraph, 0.5, 0.1);
sim2.simulate();

console.log('═'.repeat(60));
console.log('SYMULACJA 3: Graf kwadratowy');
console.log('═'.repeat(60));

const squareFactory = new SquareGraphFactory();
const squareGraph = squareFactory.createGraph();
const sim3 = new GraphEvolutionSimulation(squareGraph, 0.5, 0.1);
sim3.simulate();

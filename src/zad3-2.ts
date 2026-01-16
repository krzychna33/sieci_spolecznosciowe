import { DirectedGraph } from './DirectedGraph';
import { PageRank, PageRankOptions } from './PageRank';

/**
 * 3.2.

(zad 6)

PageRank

2 rodzaje

1. Pagerank bez zabezpieczenia przed konwergencja do jednego lub kilku punktów, 

Co każdy krok sprawdzić czy nie mamy równowagi, iteracja n == n+1

Ilość kroków jako parametr

2. Pagerank które zabezpiecza się przed tą sytuacją.

Wybieramy współczynnik s (0,1)

Po aktualizacji w pageranku mnożymy wszystkie wartości przez s.
 Mnożymy także (1-s) przez wszystkie wartości i to wchodzi do puli. 
 Pula jest dzielona na wszystkie węzły.
 */


const graphs = {
  // A -> B -> C -> D (D to ślepa uliczka)
  chain: () => {
    const g = new DirectedGraph();
    g.addEdge('A', 'B'); g.addEdge('B', 'C'); g.addEdge('C', 'D');
    return g;
  },
  // A -> B -> C -> A (zamknięty cykl)
  cycle: () => {
    const g = new DirectedGraph();
    g.addEdge('A', 'B'); g.addEdge('B', 'C'); g.addEdge('C', 'A');
    return g;
  },
  // Wszyscy linkują do Hub (Hub to ślepa uliczka)
  starIn: () => {
    const g = new DirectedGraph();
    ['A', 'B', 'C', 'D'].forEach(n => g.addEdge(n, 'Hub'));
    return g;
  },
  // A -> B -> C, C -> C (spider trap)
  spiderTrap: () => {
    const g = new DirectedGraph();
    g.addEdge('A', 'B'); g.addEdge('B', 'C'); g.addEdge('C', 'C');
    return g;
  },
  // Cykl + ślepa uliczka: A -> B -> C -> A, C -> D
  cycleWithDangling: () => {
    const g = new DirectedGraph();
    g.addEdge('A', 'B'); g.addEdge('B', 'C'); g.addEdge('C', 'A'); g.addEdge('C', 'D');
    return g;
  }
};

function runTest(name: string, graph: DirectedGraph) {
  console.log('----------------------------------------');
  console.log(`Eksperyment: ${name}`);
  
  const pr = new PageRank(graph);
  
  const optionsForBasic: PageRankOptions = { maxIterations: 10, epsilon: 1e-6};
  const basic = pr.calculateBasic(optionsForBasic);
  PageRank.printRanking(basic, 'Wariant 1 (bez tłumienia):');
  
  const optionsForDamped: PageRankOptions = { maxIterations: 100, epsilon: 1e-6, dampingFactor: 0.85 };
  const damped = pr.calculateDamped(optionsForDamped);
  PageRank.printRanking(damped, 'Wariant 2 (z tłumieniem d=0.85):');
}


runTest('Łańcuch: A -> B -> C -> D', graphs.chain());
runTest('Cykl: A -> B -> C -> A', graphs.cycle());
runTest('Gwiazda: A,B,C,D -> Hub', graphs.starIn());
runTest('Spider Trap: C -> C', graphs.spiderTrap());
runTest('Cykl + dangling: C -> D', graphs.cycleWithDangling());
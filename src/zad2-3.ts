import { LabeledGraph, EdgeLabel, NodeId } from './LabeledGraph';
import { 
  BalancedTriangleFactory, 
  UnbalancedTriangleFactory,
  BalancedQuadFactory,
  UnbalancedQuadFactory,
  ComplexNetwork15Factory
} from './LabeledGraphFactory';


/**
 * 2.2.
graf w pełni połączony: : znaleźć wszystkie cykle i sprawdzić czy każdy z nich ma parzystą liczbę krawędzi ujemnych (to jest tożsame z poprzednim, sprawdzamy same trójkąty)

*Dla tego zadania mozna wykorzystac rozwiazanie dla zadania 2.3.*

2.3.
Graf nie jest w pełni połączony: znaleźć wszystkie cykle i sprawdzić czy każdy z nich ma parzystą liczbę krawędzi ujemnych (to jest tożsame z poprzednim, sprawdzamy same trójkąty)
 */

/**
 * Reprezentuje cykl w grafie
 */
interface Cycle {
  nodes: NodeId[];
  edges: EdgeLabel[];
  negativeCount: number;
}

/**
 * Klasa sprawdzająca równowagę grafu poprzez znalezienie wszystkich cykli
 * i sprawdzenie czy każdy z nich ma parzystą liczbę krawędzi ujemnych.
 * 
 * Graf jest zrównoważony wtedy gdy każdy cykl ma parzystą liczbę
 * krawędzi negatywnych.
 */
export class CycleBasedBalanceChecker {
  
  /**
   * Znajduje wszystkie cykle proste (elementarne) w grafie.
   * Cykl prosty to taki, w którym żaden wierzchołek nie powtarza się (poza pierwszym i ostatnim).
   */
  findAllCycles(graph: LabeledGraph): Cycle[] {
    const nodes = graph.getAllNodes();
    const allCycles: Cycle[] = [];
    const visited = new Set<string>();
    
    // Dla każdego wierzchołka jako punktu startowego
    for (const startNode of nodes) {
      this.findCyclesFromNode(
        graph,
        startNode,
        startNode,
        [startNode],
        new Set([startNode]),
        allCycles,
        visited
      );
    }
    
    return allCycles;
  }
  
  /**
   * Rekurencyjnie znajduje cykle zaczynające się od danego węzła.
   * Używa DFS z backtrackingiem.
   */
  private findCyclesFromNode(
    graph: LabeledGraph,
    startNode: NodeId,
    currentNode: NodeId,
    path: NodeId[],
    pathSet: Set<NodeId>,
    allCycles: Cycle[],
    visited: Set<string>
  ): void {
    const neighbors = graph.getNeighborsWithLabels(currentNode);
    
    for (const { target, label } of neighbors) {
      if (target === startNode && path.length >= 3) {
        // Znaleźliśmy cykl - dodajemy go tylko raz (normalizacja)
        const cycleKey = this.normalizeCycle([...path]);
        
        if (!visited.has(cycleKey)) {
          visited.add(cycleKey);
          
          // Zbieramy etykiety krawędzi w cyklu
          const edges: EdgeLabel[] = [];
          let negativeCount = 0;
          
          for (let i = 0; i < path.length; i++) {
            const node1 = path[i];
            const node2 = path[(i + 1) % path.length];
            const edgeLabel = graph.getEdgeLabel(node1, node2)!;
            edges.push(edgeLabel);
            
            if (edgeLabel === EdgeLabel.Minus) {
              negativeCount++;
            }
          }
          
          allCycles.push({
            nodes: [...path],
            edges,
            negativeCount
          });
        }
      } else if (!pathSet.has(target) && target > startNode) {
        // Kontynuujemy przeszukiwanie (warunek target > startNode zapobiega duplikatom)
        path.push(target);
        pathSet.add(target);
        
        this.findCyclesFromNode(
          graph,
          startNode,
          target,
          path,
          pathSet,
          allCycles,
          visited
        );
        
        path.pop();
        pathSet.delete(target);
      }
    }
  }
  
  /**
   * Normalizuje cykl do unikalnej reprezentacji (do wykrywania duplikatów).
   * Cykl [A, B, C] jest tym samym co [B, C, A] i [C, B, A] (odwrócony).
   */
  private normalizeCycle(cycle: NodeId[]): string {
    // Znajdź minimalny element
    const minIndex = cycle.indexOf(
      cycle.reduce((min, node) => (node < min ? node : min))
    );
    
    // Rotuj cykl tak, aby zaczynał się od minimalnego elementu
    const rotated = [
      ...cycle.slice(minIndex),
      ...cycle.slice(0, minIndex)
    ];
    
    // Sprawdź czy odwrócony cykl jest "mniejszy" leksykograficznie
    const reversed = [rotated[0], ...rotated.slice(1).reverse()];
    
    const rotatedStr = rotated.join(',');
    const reversedStr = reversed.join(',');
    
    return rotatedStr < reversedStr ? rotatedStr : reversedStr;
  }
  
  /**
   * Sprawdza, czy graf jest zrównoważony.
   * Graf jest zrównoważony, gdy każdy cykl ma parzystą liczbę krawędzi negatywnych
   */
  isBalanced(graph: LabeledGraph): boolean {
    const cycles = this.findAllCycles(graph);
    
    // Sprawdzamy czy każdy cykl ma parzystą liczbę krawędzi negatywnych
    for (const cycle of cycles) {
      if (cycle.negativeCount % 2 !== 0) {
        return false; // Znaleziono cykl z nieparzystą liczbą krawędzi negatywnych
      }
    }
    
    return true;
  }
  
  /**
   * Znajduje wszystkie niezrównoważone cykle (z nieparzystą liczbą krawędzi negatywnych).
   */
  findUnbalancedCycles(graph: LabeledGraph): Cycle[] {
    const cycles = this.findAllCycles(graph);
    return cycles.filter(cycle => cycle.negativeCount % 2 !== 0);
  }
  
  /**
   * Wyświetla szczegółową analizę równowagi grafu.
   */
  printAnalysis(graph: LabeledGraph, description: string): void {
    console.log(`\n=== ${description} ===`);
    console.log(`Liczba wierzchołków: ${graph.getNodeCount()}`);
    console.log(`Liczba krawędzi: ${graph.getEdgeCount()}`);
    
    const edges = graph.getAllEdges();
    console.log('\nKrawędzie:');
    edges.forEach(({ node1, node2, label }) => {
      console.log(`  ${node1} --${label}-- ${node2}`);
    });
    
    const allCycles = this.findAllCycles(graph);
    console.log(`\nZnaleziono ${allCycles.length} cykli w grafie`);
    
    const unbalancedCycles = this.findUnbalancedCycles(graph);
    const balanced = unbalancedCycles.length === 0;
    
    console.log(`\nCzy graf jest zrównoważony? ${balanced ? 'TAK' : 'NIE'}`);
    
    if (allCycles.length > 0 && allCycles.length <= 20) {
      console.log('\nWszystkie cykle:');
      allCycles.forEach((cycle, index) => {
        const status = cycle.negativeCount % 2 === 0 ? '✓ zrównoważony' : '✗ niezrównoważony';
        console.log(`  ${index + 1}. [${cycle.nodes.join(' → ')} → ${cycle.nodes[0]}] - ${cycle.negativeCount} krawędzi ujemnych ${status}`);
      });
    } else if (allCycles.length > 20) {
      console.log(`\n(Zbyt wiele cykli do wyświetlenia: ${allCycles.length})`);
    }
    
    if (!balanced) {
      console.log(`\nZnaleziono ${unbalancedCycles.length} niezrównoważonych cykli:`);
      unbalancedCycles.slice(0, 10).forEach((cycle, index) => {
        console.log(`  ${index + 1}. [${cycle.nodes.join(' → ')} → ${cycle.nodes[0]}]`);
        console.log(`     Liczba krawędzi negatywnych: ${cycle.negativeCount}`);
      });
      
      if (unbalancedCycles.length > 10) {
        console.log(`  ... i ${unbalancedCycles.length - 10} więcej`);
      }
    }
  }
}


const checker = new CycleBasedBalanceChecker();

// Test 1: Trójkąt zbalansowany
const balancedTriangle = new BalancedTriangleFactory().createGraph();
checker.printAnalysis(balancedTriangle, 'Trójkąt zbalansowany');

// Test 2: Trójkąt niezbalansowany
const unbalancedTriangle = new UnbalancedTriangleFactory().createGraph();
checker.printAnalysis(unbalancedTriangle, 'Trójkąt niezbalansowany');

// Test 3: K4 zrównoważony
const balancedQuad = new BalancedQuadFactory().createGraph();
checker.printAnalysis(balancedQuad, 'Graf K4 zrównoważony');

// Test 4: K4 niezrównoważony
const unbalancedQuad = new UnbalancedQuadFactory().createGraph();
checker.printAnalysis(unbalancedQuad, 'Graf K4 niezrównoważony');

// Test 5: Kompleksowy graf z 15 wierzchołkami
const complexNetwork = new ComplexNetwork15Factory().createGraph();
checker.printAnalysis(complexNetwork, 'Kompleksowy graf z 15 wierzchołkami');

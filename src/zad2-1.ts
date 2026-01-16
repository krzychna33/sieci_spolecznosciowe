import { LabeledGraph, EdgeLabel, NodeId } from './LabeledGraph';
import { 
  BalancedTriangleFactory, 
  UnbalancedTriangleFactory,
  BalancedQuadFactory,
  UnbalancedQuadFactory 
} from './LabeledGraphFactory';


/**
 * Zadanie 2.1.
 * graf w pełni połączony: 
 * Sprawdź równowagę używając podejścia lokalnego 
 * (sprawdzić elementarne cykle - jeśli trójkąt jest niezrównoważony to znaczy że cały graf też jest niezrównoważony.. chyba...)
 */

export class GraphBalanceChecker {
  
  /**
   * Sprawdza, czy trójkąt jest zrównoważony.
   * Trójkąt jest zrównoważony, gdy ma parzystą liczbę krawędzi negatywnych (0 lub 2).
   */
  private isTriangleBalanced(
    graph: LabeledGraph, 
    node1: NodeId, 
    node2: NodeId, 
    node3: NodeId
  ): boolean {
    const edge12 = graph.getEdgeLabel(node1, node2);
    const edge23 = graph.getEdgeLabel(node2, node3);
    const edge13 = graph.getEdgeLabel(node1, node3);
    
    // Wszystkie trzy krawędzie muszą istnieć
    if (!edge12 || !edge23 || !edge13) {
      return true; // To nie jest pełny trójkąt
    }
    
    // Liczymy krawędzie negatywne
    let negativeCount = 0;
    if (edge12 === EdgeLabel.Minus) negativeCount++;
    if (edge23 === EdgeLabel.Minus) negativeCount++;
    if (edge13 === EdgeLabel.Minus) negativeCount++;
    
    // Trójkąt jest zrównoważony, gdy ma 0 lub 2 krawędzie negatywne
    return negativeCount === 0 || negativeCount === 2;
  }
  
  /**
   * Znajduje wszystkie trójkąty w grafie i sprawdza ich zrównoważenie.
   */
  findUnbalancedTriangles(graph: LabeledGraph): Array<{
    nodes: [NodeId, NodeId, NodeId];
    edges: [EdgeLabel, EdgeLabel, EdgeLabel];
    negativeCount: number;
  }> {
    const nodes = graph.getAllNodes();
    const unbalancedTriangles: Array<{
      nodes: [NodeId, NodeId, NodeId];
      edges: [EdgeLabel, EdgeLabel, EdgeLabel];
      negativeCount: number;
    }> = [];
    
    // Sprawdzamy wszystkie możliwe kombinacje 3 wierzchołków
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          const node3 = nodes[k];
          
          // Sprawdzamy czy wszystkie trzy krawędzie istnieją (pełny trójkąt)
          const edge12 = graph.getEdgeLabel(node1, node2);
          const edge23 = graph.getEdgeLabel(node2, node3);
          const edge13 = graph.getEdgeLabel(node1, node3);
          
          if (edge12 && edge23 && edge13) {
            // Liczymy krawędzie negatywne
            let negativeCount = 0;
            if (edge12 === EdgeLabel.Minus) negativeCount++;
            if (edge23 === EdgeLabel.Minus) negativeCount++;
            if (edge13 === EdgeLabel.Minus) negativeCount++;
            
            // Trójkąt niezrównoważony: 1 lub 3 krawędzie negatywne
            if (negativeCount === 1 || negativeCount === 3) {
              unbalancedTriangles.push({
                nodes: [node1, node2, node3],
                edges: [edge12, edge23, edge13],
                negativeCount
              });
            }
          }
        }
      }
    }
    
    return unbalancedTriangles;
  }
  
  /**
   * Sprawdza, czy graf jest zrównoważony.
   * Jeśli znajdzie choć jeden niezrównoważony trójkąt, graf jest niezrównoważony.
   */
  isBalanced(graph: LabeledGraph): boolean {
    const unbalancedTriangles = this.findUnbalancedTriangles(graph);
    return unbalancedTriangles.length === 0;
  }
  
  /**
   * Wyświetla wynik sprawdzenia wraz ze szczegółową analizą trójkątów.
   */
  printAnalysis(graph: LabeledGraph, description: string): void {
    console.log(`\n=== ${description} ===`);
    console.log(`Nodes: ${graph.getNodeCount()}`);
    console.log(`Edges: ${graph.getEdgeCount()}`);
    
    const edges = graph.getAllEdges();
    console.log('\nKrawędzie:');
    edges.forEach(({ node1, node2, label }) => {
      console.log(`  ${node1} --${label}--- ${node2}`);
    });
    
    const unbalancedTriangles = this.findUnbalancedTriangles(graph);
    const balanced = unbalancedTriangles.length === 0;
    
    console.log(`\nCzy graf jest zrównoważony? ${balanced ? 'TAK' : 'NIE'}`);
    
    if (!balanced) {
      console.log(`\nZnaleziono ${unbalancedTriangles.length} niezrównoważonych trójkątów:`);
      unbalancedTriangles.forEach(({ nodes, edges, negativeCount }, index) => {
        console.log(`  ${index + 1}. [${nodes.join(', ')}]`);
        console.log(`     Krawędzie: ${nodes[0]}-${nodes[1]}(${edges[0]}), ${nodes[1]}-${nodes[2]}(${edges[1]}), ${nodes[0]}-${nodes[2]}(${edges[2]})`);
        console.log(`     Liczba krawędzi negatywnych: ${negativeCount}`);
      });
    }
  }
}


const checker = new GraphBalanceChecker();

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

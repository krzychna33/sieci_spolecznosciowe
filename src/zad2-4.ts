import { LabeledGraph, EdgeLabel, NodeId } from './LabeledGraph';
import {
  BalancedTriangleFactory,
  UnbalancedTriangleFactory,
  BalancedQuadFactory,
  UnbalancedQuadFactory,
  ComplexNetwork15Factory
} from './LabeledGraphFactory';

/**
 * 2.4.
Graf nie jest w pełni połączony:
- Podziel go na superwęzły
- Upewnij się, że w superwęzłach nie ma krawędzi ujemnych (jak są to nie da się tego zrównoważyć sensownie i koniec węzła)
- Sprawdź czy możemy opisać superwęzły X Y i zachować zależności: X lubi X, Y lubi Y, X nie lubi Y
 */

/**
 * Reprezentuje superwęzeł - grupę wierzchołków połączonych krawędziami dodatnimi
 */
interface SuperNode {
  id: number;
  nodes: Set<NodeId>;
}

/**
 * Klasa sprawdzająca równowagę grafu poprzez podział na superwęzły.
 * 
 * Uproszczony algorytm:
 * 1. Dzieli graf na superwęzły (grupy wierzchołków połączonych krawędziami +)
 * 2. Sprawdza czy w superwęzłach nie ma krawędzi ujemnych
 * 3. Próbuje pokolorować superwęzły na 2 kolory (krawędzie - wymagają różnych kolorów)
 */
export class SuperNodeBalanceChecker {
  
  findSuperNodes(graph: LabeledGraph): SuperNode[] {
    const nodes = graph.getAllNodes();
    const visited = new Set<NodeId>();
    const superNodes: SuperNode[] = [];
    let id = 0;
    
    for (const startNode of nodes) {
      if (visited.has(startNode)) continue;
      
      // BFS aby znaleźć wszystkie wierzchołki połączone krawędziami +
      const superNodeNodes = new Set<NodeId>();
      const queue = [startNode];
      visited.add(startNode);
      superNodeNodes.add(startNode);
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        const neighbors = graph.getNeighborsWithLabels(current);
        
        for (const { target, label } of neighbors) {
          if (label === EdgeLabel.Plus && !visited.has(target)) {
            visited.add(target);
            superNodeNodes.add(target);
            queue.push(target);
          }
        }
      }
      
      superNodes.push({ id: id++, nodes: superNodeNodes });
    }
    
    return superNodes;
  }
  
  /**
   * Sprawdza czy w superwęzłach nie ma krawędzi ujemnych.
   */
  checkSuperNodesIntegrity(
    graph: LabeledGraph, 
    superNodes: SuperNode[]
  ): { valid: boolean; conflicts: Array<{ superNode: number; edge: [NodeId, NodeId] }> } {
    const conflicts: Array<{ superNode: number; edge: [NodeId, NodeId] }> = [];
    
    for (const superNode of superNodes) {
      const nodeList = Array.from(superNode.nodes);
      
      for (let i = 0; i < nodeList.length; i++) {
        for (let j = i + 1; j < nodeList.length; j++) {
          const label = graph.getEdgeLabel(nodeList[i], nodeList[j]);
          if (label === EdgeLabel.Minus) {
            conflicts.push({
              superNode: superNode.id,
              edge: [nodeList[i], nodeList[j]]
            });
          }
        }
      }
    }
    
    return { valid: conflicts.length === 0, conflicts };
  }
  
  /**
   * Próbuje pokolorować superwęzły na 2 kolory.
   * 
  */
  partitionSuperNodes(
    graph: LabeledGraph,
    superNodes: SuperNode[]
  ): { success: boolean; groupX?: number[]; groupY?: number[] } {
    if (superNodes.length === 0) {
      return { success: true, groupX: [], groupY: [] };
    }
    
    // Mapowanie: wierzchołek -> ID superwęzła
    const nodeToSN = new Map<NodeId, number>();
    for (const sn of superNodes) {
      for (const node of sn.nodes) {
        nodeToSN.set(node, sn.id);
      }
    }
    
    // Dla każdego superwęzła: lista sąsiednich superwęzłów (połączonych krawędzią -)
    const snNeighbors = new Map<number, Set<number>>();
    for (let i = 0; i < superNodes.length; i++) {
      snNeighbors.set(i, new Set());
    }
    
    // Znajdź krawędzie - między superwęzłami
    for (const { node1, node2, label } of graph.getAllEdges()) {
      if (label === EdgeLabel.Minus) {
        const sn1 = nodeToSN.get(node1)!;
        const sn2 = nodeToSN.get(node2)!;
        if (sn1 !== sn2) {
          snNeighbors.get(sn1)!.add(sn2);
          snNeighbors.get(sn2)!.add(sn1);
        }
      }
    }
    
    const colors = new Map<number, number>();
    
    for (let startId = 0; startId < superNodes.length; startId++) {
      if (colors.has(startId)) continue;
      
      const queue = [startId];
      colors.set(startId, 0);
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentColor = colors.get(current)!;
        
        for (const neighbor of snNeighbors.get(current)!) {
          const neededColor = 1 - currentColor;
          
          if (colors.has(neighbor)) {
            if (colors.get(neighbor) !== neededColor) {
              return { success: false };
            }
          } else {
            colors.set(neighbor, neededColor);
            queue.push(neighbor);
          }
        }
      }
    }
    
    const groupX = superNodes.filter(sn => (colors.get(sn.id) || 0) === 0).map(sn => sn.id);
    const groupY = superNodes.filter(sn => colors.get(sn.id) === 1).map(sn => sn.id);
    
    return { success: true, groupX, groupY };
  }
  
  isBalanced(graph: LabeledGraph): boolean {
    const superNodes = this.findSuperNodes(graph);
    const integrity = this.checkSuperNodesIntegrity(graph, superNodes);
    
    if (!integrity.valid) {
      return false;
    }
    
    const partition = this.partitionSuperNodes(graph, superNodes);
    return partition.success;
  }
  
  printAnalysis(graph: LabeledGraph, description: string): void {
    console.log(`\n=== ${description} ===`);
    console.log(`Liczba wierzchołków: ${graph.getNodeCount()}`);
    console.log(`Liczba krawędzi: ${graph.getEdgeCount()}`);
    
    const edges = graph.getAllEdges();
    console.log('\nKrawędzie:');
    edges.forEach(({ node1, node2, label }) => {
      console.log(`  ${node1} --${label}-- ${node2}`);
    });
    
    // Krok 1: Znalezienie superwęzłów
    const superNodes = this.findSuperNodes(graph);
    console.log(`\n--- Krok 1: Podział na superwęzły ---`);
    console.log(`Znaleziono ${superNodes.length} superwęzłów:`);
    superNodes.forEach(sn => {
      console.log(`  Superwęzeł ${sn.id}: [${Array.from(sn.nodes).sort().join(', ')}]`);
    });
    
    // Krok 2: Sprawdzenie integralności
    const integrity = this.checkSuperNodesIntegrity(graph, superNodes);
    console.log(`\n--- Krok 2: Sprawdzenie integralności superwęzłów ---`);
    if (integrity.valid) {
      console.log('✓ Brak krawędzi ujemnych wewnątrz superwęzłów');
    } else {
      console.log('✗ Znaleziono krawędzie ujemne wewnątrz superwęzłów:');
      integrity.conflicts.forEach(({ superNode, edge }) => {
        console.log(`  Superwęzeł ${superNode}: ${edge[0]} --(--)-- ${edge[1]}`);
      });
      console.log('\n✗ Graf NIE JEST zrównoważony (krawędzie ujemne w superwęźle)');
      return;
    }
    
    // Krok 3: Podział superwęzłów
    const partition = this.partitionSuperNodes(graph, superNodes);
    console.log(`\n--- Krok 3: Podział superwęzłów na grupy ---`);
    if (partition.success) {
      console.log('✓ Udało się podzielić superwęzły na dwie grupy:');
      console.log(`  Grupa X: [${partition.groupX!.map(id => {
        const sn = superNodes.find(s => s.id === id)!;
        return `SN${id}(${Array.from(sn.nodes).join(',')})`;
      }).join(', ')}]`);
      console.log(`  Grupa Y: [${partition.groupY!.map(id => {
        const sn = superNodes.find(s => s.id === id)!;
        return `SN${id}(${Array.from(sn.nodes).join(',')})`;
      }).join(', ')}]`);
      console.log('\n✓ Graf JEST zrównoważony');
    } else {
      console.log('✗ Nie udało się podzielić superwęzłów na dwie grupy');
      console.log('\n✗ Graf NIE JEST zrównoważony');
    }
  }
}

// Przykład użycia
if (require.main === module) {
  const checker = new SuperNodeBalanceChecker();
  
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
}

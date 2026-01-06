import { LabeledGraph, NodeId, EdgeLabel } from './LabeledGraph';

/**
 * Interfejs dla fabryk grafów z etykietowanymi krawędziami
 */
export interface ILabeledGraphFactory {
  /**
   * Tworzy i zwraca skonfigurowany graf z etykietami
   */
  createGraph(): LabeledGraph;
  
  /**
   * Zwraca nazwę/opis grafu
   */
  getDescription(): string;
}

/**
 * Graf zbalansowany - wszystkie krawędzie pozytywne
 * Trójkąt: A-B-C z etykietami: A-B(+), A-C(+), B-C(+)
 */
export class BalancedTriangleFactory implements ILabeledGraphFactory {
  createGraph(): LabeledGraph {
    const graph = new LabeledGraph();
    
    graph.addEdge('A', 'B', EdgeLabel.Plus);
    graph.addEdge('A', 'C', EdgeLabel.Plus);
    graph.addEdge('B', 'C', EdgeLabel.Plus);
    
    return graph;
  }
  
  getDescription(): string {
    return 'Trójkąt zbalansowany: A-B(+), A-C(+), B-C(+)';
  }
}

/**
 * Graf niezbalansowany - jedna krawędź negatywna
 * Trójkąt: A-B-C z etykietami: A-B(+), A-C(+), B-C(-)
 */
export class UnbalancedTriangleFactory implements ILabeledGraphFactory {
  createGraph(): LabeledGraph {
    const graph = new LabeledGraph();
    
    graph.addEdge('A', 'B', EdgeLabel.Plus);
    graph.addEdge('A', 'C', EdgeLabel.Plus);
    graph.addEdge('B', 'C', EdgeLabel.Minus);
    
    return graph;
  }
  
  getDescription(): string {
    return 'Trójkąt niezbalansowany: A-B(+), A-C(+), B-C(-)';
  }
}

/**
 * Graf zrównoważony z 4 wierzchołkami (lewy na obrazku)
 * A-C(-), A-B(+), A-D(-), B-C(-), B-D(-), C-D(+)
 */
export class BalancedQuadFactory implements ILabeledGraphFactory {
  createGraph(): LabeledGraph {
    const graph = new LabeledGraph();
    
    graph.addEdge('A', 'C', EdgeLabel.Minus);
    graph.addEdge('A', 'B', EdgeLabel.Plus);
    graph.addEdge('A', 'D', EdgeLabel.Minus);
    graph.addEdge('B', 'C', EdgeLabel.Minus);
    graph.addEdge('B', 'D', EdgeLabel.Minus);
    graph.addEdge('C', 'D', EdgeLabel.Plus);
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf zrównoważony (K4): A-C(-), A-B(+), A-D(-), B-C(-), B-D(-), C-D(+)';
  }
}

/**
 * Graf niezrównoważony z 4 wierzchołkami (prawy na obrazku)
 * A-B(-), A-C(+), A-D(-), B-C(+), B-D(+), C-D(-)
 */
export class UnbalancedQuadFactory implements ILabeledGraphFactory {
  createGraph(): LabeledGraph {
    const graph = new LabeledGraph();
    
    graph.addEdge('A', 'B', EdgeLabel.Minus);
    graph.addEdge('A', 'C', EdgeLabel.Plus);
    graph.addEdge('A', 'D', EdgeLabel.Minus);
    graph.addEdge('B', 'C', EdgeLabel.Plus);
    graph.addEdge('B', 'D', EdgeLabel.Plus);
    graph.addEdge('C', 'D', EdgeLabel.Minus);
    
    return graph;
  }
  
  getDescription(): string {
    return 'Graf niezrównoważony (K4): A-B(-), A-C(+), A-D(-), B-C(+), B-D(+), C-D(-)';
  }
}

/**
 * Kompleksowy graf z 15 wierzchołkami - przykład z diagramu
 * Graf nie jest w pełni połączony, zawiera wiele trójkątów i cykli
 */
export class ComplexNetwork15Factory implements ILabeledGraphFactory {
  createGraph(): LabeledGraph {
    const graph = new LabeledGraph();
    
    // Górna część - trójkąt 1-2-3
    graph.addEdge('1', '2', EdgeLabel.Plus);
    graph.addEdge('1', '3', EdgeLabel.Plus);
    graph.addEdge('2', '3', EdgeLabel.Plus);
    
    // Środkowa część lewa
    graph.addEdge('2', '4', EdgeLabel.Minus);
    graph.addEdge('2', '5', EdgeLabel.Plus);
    
    // Środkowa część prawa
    graph.addEdge('3', '6', EdgeLabel.Minus);
    
    // Połączenia 5-6
    graph.addEdge('5', '6', EdgeLabel.Minus);
    
    // Lewa dolna część - 4, 7, 9, 12
    graph.addEdge('4', '7', EdgeLabel.Minus);
    graph.addEdge('4', '9', EdgeLabel.Minus);
    graph.addEdge('7', '12', EdgeLabel.Plus);
    graph.addEdge('9', '12', EdgeLabel.Plus);
    
    // Prawa górna część - 6, 8, 11
    graph.addEdge('6', '8', EdgeLabel.Plus);
    graph.addEdge('6', '11', EdgeLabel.Minus);
    graph.addEdge('8', '11', EdgeLabel.Minus);
    
    // Dolna część - 10, 11, 13, 14, 15
    graph.addEdge('10', '11', EdgeLabel.Minus);
    graph.addEdge('11', '14', EdgeLabel.Minus);
    graph.addEdge('12', '13', EdgeLabel.Plus);
    graph.addEdge('13', '15', EdgeLabel.Minus);
    graph.addEdge('14', '15', EdgeLabel.Minus);
    
    return graph;
  }
  
  getDescription(): string {
    return 'Kompleksowy graf z 15 wierzchołkami (nie w pełni połączony)';
  }
}

import { UndirectedGraph, NodeId } from './UndirectedGraph';
import { CustomGraphFactory, SocialNetworkGraphFactory, StarGraphFactory } from './GraphFactory';

/**
 * zad 1:

znaleźć trójkąty i potencjalne domknięcia triadyczne


Napisać do program do znajdywania trójkątów i potencjalnych domknięć triadycznych.


Grafy nieskierowane

podpowiedz:

- potencjalne domkniecia triadyczne -> sprawdzamy wezel i jego sasiadow, następnie sprawdzamy czy sasiady maja polaczenia miedzy sobą.


- trojkat -> prawie jak domkniecie triadyczne, ale sprawdzamy czy sa sasiadami
 */


class TriadicAnalysis {
  private graph: UndirectedGraph;

  constructor(graph: UndirectedGraph) {
    this.graph = graph;
  }

  /**
   * 1. Znajduje istniejące trójkąty (Domknięte triady)
   */
  findTriangles(): NodeId[][] {
    const triangles: NodeId[][] = [];
    const nodes = this.graph.getAllNodes();

    // Iterujemy po wszystkich możliwych trójkach
    // Używamy sortowania/warunków indeksów, aby uniknąć duplikatów 
    // (żeby nie zwrócić osobno {A,B,C} i {C,A,B})
    for (let i = 0; i < nodes.length; i++) {
      const u = nodes[i];
      const uNeighbors = this.graph.getNeighbors(u);

      for (const v of uNeighbors) {
        // Warunek porządkujący
        if (v <= u) continue;

        const vNeighbors = this.graph.getNeighbors(v);

        for (const w of vNeighbors) {
          // Warunek porządkujący: w > v
          if (w <= v) continue;

          // Jeśli w jest również sąsiadem u, mamy trójkąt
          if (this.graph.hasEdge(u, w)) {
            triangles.push([u, v, w]);
          }
        }
      }
    }
    return triangles;
  }

  /**
   * 2. Znajduje potencjalne domknięcia triadyczne (Otwarte triady)
   * Czyli sytuacje: A zna B, B zna C, ale A NIE zna C.
   * Zwraca obiekty wskazujące kogo można połączyć i kto jest mostem
   */
  findPotentialClosures() {
    const suggestions: { u: NodeId; w: NodeId; bridge: NodeId }[] = [];
    const nodes = this.graph.getAllNodes();

    // Iterujemy po każdym wierzchołku, traktując go jako potencjalny "most" (bridge)
    for (const bridge of nodes) {
      const neighbors = this.graph.getNeighbors(bridge);

      // Sprawdzamy każdą parę sąsiadów tego mostu
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          const u = neighbors[i];
          const w = neighbors[j];

          // Jeśli sąsiedzi mostu NIE znają się nawzajem -> Potencjalne domknięcie
          if (!this.graph.hasEdge(u, w)) {
            suggestions.push({ u, w, bridge });
          }
        }
      }
    }
    return suggestions;
  }

}

const graphFactory = new SocialNetworkGraphFactory();
const graph1 = graphFactory.createGraph();

const graph2Factory = new StarGraphFactory();
const graph2 = graph2Factory.createGraph();

const graph3Factory = new CustomGraphFactory();
const graph3 = graph3Factory.createGraph();

const graphs = [graph3];

for (const graph of graphs) {
    console.log("--- GRAF ---");
    console.log(graph);

    const analysis = new TriadicAnalysis(graph);

    console.log("\n--- ZNALEZIONE TRÓJKĄTY ---");
    const triangles = analysis.findTriangles();
    triangles.forEach(t => console.log(`Trójkąt: ${t.join(' <-> ')}`));

    console.log("\n--- POTENCJALNE DOMKNIĘCIA ---");
    const closures = analysis.findPotentialClosures();
    closures.forEach(c => {
    console.log(`Rekomendacja: ${c.u} i ${c.w} mogą się poznać przez: ${c.bridge}`);
    });
}

import { DirectedGraph } from './DirectedGraph';
import { HITS } from './HITS';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * 3.1. 
(Zad 5)

1. Wziąć zapytanie do google np. "gazety' "news" "newspaper"
2. każdy wynik będzie głosującym (strona po lewej slajdu 10 wyk 5)
3. Do każdego rezultatu wziąć jego kontent i stworzyć słownik pod kątem linków znalezionych.
4. W pierwszej iteracji wartość każdego głosu równa się 1 (czyli linki ze słownika)
5. W kolejnej iteracji waga hubu się zmienia w zależności od autorytetów


Odfiltrowac te same autorytety na tym samym hubie
Odfiltrować domene na której jesteśmy

 */

async function extractLinks(url: string): Promise<string[]> {
  try {
    console.log(`Crawling: ${url}...`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const $ = cheerio.load(response.data);
    const domains = new Set<string>();
    
    $('a[href]').each((_, el) => {
      try {
        const href = $(el).attr('href');
        if (!href) return;
        
        const fullUrl = new URL(href, url);
        if (fullUrl.protocol === 'http:' || fullUrl.protocol === 'https:') {
          const domain = fullUrl.hostname.replace(/^www\./, '');
          domains.add(domain);
        }
      } catch {}
    });
    
    console.log(`->  ${domains.size} domen`);
    return Array.from(domains);
    
  } catch (error: any) {
    console.log(`Err: ${error.message}`);
    return [];
  }
}

async function buildGraph(startUrls: string[], depth: number = 1): Promise<DirectedGraph> {
  const graph = new DirectedGraph();
  const addedLinks = new Set<string>();
  const visitedDomains = new Set<string>();

  async function crawlLevel(urls: string[], currentDepth: number) {
    if (currentDepth > depth || urls.length === 0) return;
    
    console.log(`  Poziom ${currentDepth}: ${urls.length} stron`);
    const nextLevelDomains = new Set<string>();

    for (const url of urls) {
      const fromDomain = new URL(url).hostname.replace(/^www\./, '');
      
      if (visitedDomains.has(fromDomain)) continue;
      visitedDomains.add(fromDomain);

      const toDomains = await extractLinks(url);

      for (const toDomain of toDomains) {
        if (fromDomain === toDomain) continue;

        const linkKey = `${fromDomain}->${toDomain}`;
        if (addedLinks.has(linkKey)) continue;

        graph.addEdge(fromDomain, toDomain);
        addedLinks.add(linkKey);
        
        if (!visitedDomains.has(toDomain)) {
          nextLevelDomains.add(toDomain);
        }
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    if (currentDepth < depth && nextLevelDomains.size > 0) {
      const nextUrls = Array.from(nextLevelDomains).map(d => `https://${d}`);
      await crawlLevel(nextUrls, currentDepth + 1);
    }
  }

  await crawlLevel(startUrls, 1);
  return graph;
}

async function main() {
  const MAX_CRAWL_DEPTH = 1;
  const MAX_HITS_COMPUTE_ITERATIONS = 15;

  console.log("[Algorytm Hits]");

  const startUrls = [
    'https://www.bbc.com',
    'https://www.nytimes.com',
    'https://www.theguardian.com',
    'https://techcrunch.com',
    'https://news.ycombinator.com',
  ];

  // depth = 1: tylko startUrls
  // depth = 2: startUrls + strony, do których linkują
  const graph = await buildGraph(startUrls, MAX_CRAWL_DEPTH);

  const nodes = graph.getAllNodes().length;
  const edges = graph.getAllNodes().reduce((sum, n) => sum + graph.getOutDegree(n), 0);
  
  console.log(`Zebrano: ${nodes} domen i  ${edges} linków\n`);

  const hits = new HITS(graph);
  const scores = hits.compute(MAX_HITS_COMPUTE_ITERATIONS);

  console.log("====");
  console.log("TOP AUTHORITIES");
  hits.getTopAuthorities(scores, 10).forEach((item, i) => {
    console.log(`${item.node}: ${item.score.toFixed(4)}`);
  });

  console.log("\n");
  console.log("====");
  console.log("TOP HUBS");
  hits.getTopHubs(scores, 10).forEach((item, i) => {
    console.log(`${item.node}: ${item.score.toFixed(4)}`);
  });
}

main().catch(console.error);

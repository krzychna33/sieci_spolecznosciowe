
## Rozwiązane zadania - Sieci społecznośćowe

Do uruchomienia potrzebujemy https://nodejs.org/en (v22+)

Na początku instalujemy zaleznosci:

```
npm i
```

Poźniej mozemy uruchamiać poszczególne pliki

```
npx ts-node ./src/zad1-1.ts
```



### Zadania zajęcia 1:

1.1:

znaleźć trójkąty i potencjalne domknięcia triadyczne


Napisać do program do znajdywania trójkątów i potencjalnych domknięć triadycznych.


Grafy nieskierowane

podpowiedz:

- potencjalne domkniecia triadyczne -> sprawdzamy wezel i jego sasiadow, następnie sprawdzamy czy sasiady maja polaczenia miedzy sobą.


- trojkat -> prawie jak domkniecie triadyczne, ale sprawdzamy czy sa sasiadami


1.2.

Napisać program do szukania wszystkich mostów lokalnych i globalnych grafie.



podpowiedz:

- Most globalny - > przeszukiwanie grafu, usuniecie wezla i sprawdzenie czy zadzialalo kolejne przeszukanie grafu


- Most lokalny - > sprawdzamy czy dwa punkty mają między sobą innych sąsiadów



GRAFY NIESKIEROWANE


1.3.


Symulacja w której jest w pełni polaczony graf i mamy tu petle ( w teorii nieskonczona -> osiagniecie full connectivity, ile krawędzi musi być żeby było full connectivity).


ile iteracji jest potrzebne, żeby graf się w pełni połączył jeżeli każdy wezel ma szanse na polaczenie się z innym wezlem, oraz przez zamkniecie triadyczne które ma wieksza szanse


- polaczenie losowe 10%

- polaczenie jako domkniecie triadyczne 50%



wynikiem programu ma być ilość iteracji potrzebnych



GRAFY NIESKIEROWANE

### Zadania zajęcia 2:

2.1.

graf w pełni połączony: Sprawdź równowagę używając podejścia lokalnego (sprawdzić elementarne cykle - jeśli trójkąt jest niezrównoważony to znaczy że cały graf też jest niezrównoważony.. chyba...)

2.2.
graf w pełni połączony: : znaleźć wszystkie cykle i sprawdzić czy każdy z nich ma parzystą liczbę krawędzi ujemnych (to jest tożsame z poprzednim, sprawdzamy same trójkąty)

*Dla tego zadania mozna wykorzystac rozwiazanie dla zadania 2.3.*

2.3.
Graf nie jest w pełni połączony: znaleźć wszystkie cykle i sprawdzić czy każdy z nich ma parzystą liczbę krawędzi ujemnych (to jest tożsame z poprzednim, sprawdzamy same trójkąty)

2.4.
Graf nie jest w pełni połączony:
- Podziel go na superwęzły
- Upewnij się, że w superwęzłach nie ma krawędzi ujemnych (jak są to nie da się tego zrównoważyć sensownie i koniec węzła)
- Sprawdź czy możemy opisać superwęzły X Y i zachować zależności: X lubi X, Y lubi Y, X nie lubi Y

### Zadania zajęcia 3:

3.1. 
(Zad 5)

1.Wziąć zapytanie do google np. "gazety' "news" "newspaper"
2. każdy wynik będzie głosującym (strona po lewej slajdu 10 wyk 5)
3. Do każdego rezultatu wziąć jego kontent i stworzyć słownik pod kątem linków znalezionych.
4. W pierwszej iteracji wartość każdego głosu równa się 1 (czyli linki ze słownika)
5. W kolejnej iteracji waga hubu się zmienia w zależności od autorytetów


Odfiltrowac te same autorytety na tym samym hubie
Odfiltrować domene na której jesteśmy


3.2.

(zad 6)

PageRank

2 rodzaje

1. Pagerank bez zabezpieczenia przed konwergencja do jednego lub kilku punktów, 

Co każdy krok sprawdzić czy nie mamy równowagi, iteracja n == n+1

Ilość kroków jako parametr

2. Pagerank które zabezpiecza się przed tą sytuacją.

Wybieramy współczynnik s (0,1)

Po aktualizacji w pageranku mnożymy wszystkie wartości przez s. Mnożymy także (1-s) przez wszystkie wartości i to wchodzi do puli. Pula jest dzielona na wszystkie węzły.
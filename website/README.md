# Strona Apex AdBlocker

Wersje PL i EN: prezentacja, pobieranie ZIP-a, instrukcja instalacji,
FAQ, kontakt i polityka prywatności rozszerzenia. Statyczne HTML/CSS/JS,
bez zależności produkcyjnych, zewnętrznych fontów, analityki lub formularzy.
Kod strony nie zapisuje cookies ani localStorage.

index.html to strona polska, en.html — angielska. Przełącznik PL / EN
działa bez JavaScriptu. Komunikaty schowka dobierają język z atrybutu lang.

Kolorystyka nawiązuje do logo (#22b8a8 / #0f7f8c). Tryb jasny i ciemny
przełącza się automatycznie przez prefers-color-scheme, także po zmianie
ustawień systemu/przeglądarki przy już otwartej stronie. Dotyczy obu języków
oraz polityk prywatności. Strona nie zapisuje osobnej preferencji motywu.

## Podgląd lokalny

Z katalogu repozytorium:

    python3 -m http.server 4173 --bind 127.0.0.1 --directory website

Następnie otwórz lokalnie port 4173. Strona nie jest wdrożona na domenie.
Podgląd lokalny marki: brand/index.html lub brand/en.html.
Do publikacji dwóch domen użyj oddzielnych eksportów opisanych poniżej.

Do bezpośredniego uploadu samych publicznych plików przygotuj ZIP:

    node website/export-site.mjs

Wyniki: docs/website/Apex-Brand-hosting.zip dla marki oraz
docs/website/Apex-AdBlocker-hosting.zip dla produktu.
Każda witryna ma czyste ścieżki /pl/ i /en/ oraz wspólne zasoby w swoim
katalogu głównym. Dotychczasowy Apex-Website-hosting.zip jest kopią pakietu
produktu. Nie wgrywaj całego katalogu website jako jednej z tych witryn.

Planowane domeny edytuje się w website/deployment.config.json.
Są niezweryfikowane; generator nie kupuje ich i nie publikuje plików.
Pełna instrukcja: docs/website/HOSTING.pl.md.

Test generatora:

    node --test website/export-site.test.mjs

## Przed publikacją

- Wybrać hosting i domenę. Ustalić praktyki hostingu dotyczące logów, retencji
  i ochrony danych; strona prywatności dotyczy rozszerzenia, nie przyszłego hostingu.
- Domknąć otwarte warunki dystrybucji cudzych filtrów oraz walidację
  przeglądarkową opisane w docs/webstore/final-release-status.json.
- Potwierdzić aktualny stan CWS. Dopiero po akceptacji dodać prawdziwy link
  do wpisu sklepowego zamiast instalacji ręcznej.
- Zaktualizować wersję, wymagania Chrome i instrukcję, jeśli zmieni się produkt.
- Status „zgłoszono do weryfikacji” opiera się na informacji autora i ekranie
  z panelu; strona nie odpytuje statusu automatycznie.

Link pobrania kieruje do rzeczywistej paczki instalacyjnej GitHub Releases,
nie do ZIP-a przeznaczonego do uploadu w sklepie. Ręczne aktualizacje są opisane.
W ostatniej kontroli aktualne wydanie zawierało pliki zgodne z paczką CWS;
przy zmianie wydania sprawdzić to ponownie.

## Grafika i prywatność

assets/apex.svg pochodzi z własnych materiałów marki w brand/.
Elementy graficzne strony są ilustracją, nie przechwyceniem działającego
rozszerzenia i nie dowodzą jego skuteczności.

privacy.html i privacy-en.html pochodzą z aktualnego PRIVACY.md w repozytorium.
Po zmianie polityki odśwież je z katalogu repozytorium:

    node website/refresh-privacy.mjs

Nie zmienia to publicznego PRIVACY.md ani wpisu w Chrome Web Store.

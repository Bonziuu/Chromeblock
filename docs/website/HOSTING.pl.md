# Dwie strony Apex pod własnymi domenami

Wybrany plan adresów (nazwy domen nie są jeszcze zweryfikowane):

| Strona | Polski | English | Pakiet |
|---|---|---|---|
| Marka Apex | getapex.com/pl/ | getapex.com/en/ | Apex-Brand-hosting.zip |
| Apex AdBlocker | apexadblocker.com/pl/ | apexadblocker.com/en/ | Apex-AdBlocker-hosting.zip |

Kliknięcie produktu na stronie marki przenosi do odpowiedniego języka na
stronie AdBlockera. Stopka produktu prowadzi z powrotem do marki. Języki
mają własne polityki prywatności rozszerzenia na /pl/privacy/ i /en/privacy/.
Końcowy ukośnik jest standardowym adresem katalogu; wejście bez niego
przekierowuje do właściwej strony.

## Status i koszty

Przygotowano i przetestowano pliki, nie wykonano publicznego wdrożenia,
zakupu domen ani zmian DNS. Dostępność i własność nazw nie są potwierdzone.
Ustawienia są w website/deployment.config.json; domainsVerified pozostaje false.
Jeśli nazwa jest zajęta lub cena nie odpowiada budżetowi, wybrać inną i
odświeżyć oba pakiety po zmianie brandOrigin / productOrigin.

Proponowany hosting to dwa statyczne projekty Cloudflare Pages.
Nie są potrzebne serwer aplikacyjny, baza danych ani płatny plan funkcji.
Domeny rejestruje się oddzielnie. Przed zakupem sprawdzić dostępność,
cenę odnowienia i podatki u operatora; nie zakładać, że promocja pierwszego
roku obejmuje kolejne lata. Ten dokument nie podaje aktualnej oferty cenowej.

## Pliki do wgrania

- Apex-Brand-hosting.zip — tylko do projektu marki getapex.com.
- Apex-AdBlocker-hosting.zip — tylko do projektu produktu apexadblocker.com.
- Apex-Website-hosting.zip — zgodna bajtowo kopia pakietu AdBlockera,
  zachowana dla starej nazwy; nie jest trzecim projektem.

Każdy ZIP ma index.html w katalogu głównym, katalogi językowe, zasoby,
konfigurację przekierowań oraz stronę 404. Nie zawiera narzędzi
programistycznych, dokumentacji, testów ani paczki rozszerzenia.
Eksport nie zawiera canonical/sitemap dla niepotwierdzonych domen.

Odtworzenie z repozytorium:

    node website/refresh-privacy.mjs
    node website/export-site.mjs
    node --test website/export-site.test.mjs

Lokalny podgląd z Apex-Website-preview.zip: rozpakować i otworzyć
Apex-Website/brand/index.html; wersja EN: brand/en.html. Ten ZIP służy
do oglądania, nie do wgrywania zamiast dwóch pakietów hostingowych.

## Publikacja w Cloudflare Pages

1. Sprawdzić dostępność obu domen i koszty; kupić wyłącznie zaakceptowane nazwy.
2. Utworzyć konto Cloudflare. Przygotować dwa projekty Pages z bezpośrednim
   przesyłaniem plików, np. apex-brand i apex-adblocker.
3. Wgrać Apex-Brand-hosting.zip do pierwszego i Apex-AdBlocker-hosting.zip
   do drugiego. Nie dodawać katalogu nadrzędnego wokół plików z ZIP-a.
4. Po zakupie domen w każdym projekcie dodać właściwą domenę niestandardową.
   Przejść instrukcje DNS wyświetlone dla konkretnych domen. Zachować
   rekordy poczty i innych istniejących usług. Nie zgadywać wartości rekordów.
5. Poczekać na aktywację domen i HTTPS. Sprawdzić adresy główne oraz www,
   wybrać adres główny i ustawić przekierowanie z drugiego.
6. Sprawdzić publicznie /pl/, /en/, przełączanie języka i motywu, pobieranie,
   polityki, nieistniejący adres oraz przejście między dwiema domenami.
7. Po potwierdzeniu nazw i ich działania zaktualizować domainsVerified,
   metadane canonical/sitemap i ewentualną konfigurację indeksowania.

Adresy dostawcy hostingu służą do testów i konfiguracji. Odwiedzający
korzystają z własnych domen; można je później przenieść na inny hosting.
Przed podpięciem domen przejścia między stronami wskazują planowane adresy,
a nie tymczasowe adresy projektów Pages.

## Sprawdzenia i ograniczenia

Wykonano 3 testy Node generatora oraz lokalne kontrole obu stron w Chromium,
w dwóch językach, dwóch motywach i pięciu szerokościach. Test przeglądarkowy
przechwytywał żądania i serwował wyłącznie lokalne pliki; nie potwierdza
własności domen, działania DNS, HTTPS ani faktycznych przekierowań Cloudflare.
Wynik: deployment-validation.json.

Przed publicznym udostępnieniem trzeba również rozstrzygnąć opisane wcześniej
kwestie dystrybucji filtrów i walidacji rozszerzenia, a także sprawdzić
praktyki hostingu dotyczące logów i przetwarzania danych. Dołączone polityki
opisują rozszerzenie. Samo wdrożenie nie gwarantuje widoczności w wyszukiwarce.

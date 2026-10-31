# Apex pod jedną domeną apexsoftware.app

Wybrany plan to jedna domena dla marki i wszystkich produktów:

| Zawartość | Polski | English |
|---|---|---|
| Marka Apex | apexsoftware.app/pl/ | apexsoftware.app/en/ |
| Apex AdBlocker | apexsoftware.app/pl/adblocker/ | apexsoftware.app/en/adblocker/ |
| Polityka rozszerzenia | /pl/adblocker/privacy/ | /en/adblocker/privacy/ |

Przejścia między marką, produktem i polityką zachowują język. Wejście na
samą domenę prowadzi do /pl/. Końcowy ukośnik jest standardowym adresem
katalogu; wejście bez niego ma przekierowanie.

## Status i koszty

Autor zgłosił zakup i opłacenie domeny w OVH, wgranie plików do projektu
Cloudflare Pages apex-software oraz uruchomienie apexsoftware.app.
Nie potwierdzono jeszcze niezależnie publicznych odpowiedzi HTTP/DNS/TLS:
żądania z tego środowiska są blokowane przez jego proxy przed połączeniem
ze stroną (CONNECT 403). Nie jest to kod HTTP pochodzący z witryny.
Konfiguracja: website/deployment.config.json. Flaga domainVerified
pozostaje false do czasu niezależnej weryfikacji; nie neguje zgłoszonego zakupu.
Nowy eksport zawiera poprawione canonical i bezwzględne hreflang dla
wszystkich sześciu stron. Wgranie nowego ZIP-a to osobny krok.

Proponowany wariant: domena w OVH i jeden projekt Cloudflare Pages
na statycznym hostingu. Nie są potrzebne serwer aplikacyjny, baza danych,
płatne funkcje ani kupowany osobno certyfikat SSL. Hosting zapewnia HTTPS,
którego wymaga również końcówka .app.

Przed zakupem porównać cenę brutto pierwszego roku i odnowienia. Ten dokument
nie podaje aktualnej oferty operatora ani nie autoryzuje zakupu.

## Pakiet do wgrania

**Apex-Software-hosting.zip** jest pełną stroną marki i AdBlockera.
Wgrywa się go do JEDNEGO projektu Cloudflare Pages. Index.html znajduje się
w katalogu głównym; katalogi pl/ i en/ zawierają gotowe strony językowe,
produkt i polityki. ZIP ma wspólne style, skrypt, logo, stronę 404
oraz konfigurację przekierowań.

Apex-Website-hosting.zip jest identyczną kopią zachowaną pod starą nazwą.
Wariant dwóch domen getapex.com / apexadblocker.com został zastąpiony.
Dawne pakiety i instrukcje z poprzednich commitów nie są przeznaczone
na apexsoftware.app.

Odtworzenie pakietu z katalogu repozytorium:

    node website/refresh-privacy.mjs
    node website/export-site.mjs
    node --test website/export-site.test.mjs

Eksport nie zawiera narzędzi, dokumentacji, testów ani ZIP-a rozszerzenia.
Dodano canonical i wzajemne hreflang z adresem apexsoftware.app.
Nie dodano sitemapy ani zmiany ustawień botów po stronie Cloudflare.

Podgląd lokalny Apex-Website-preview.zip zachowuje układ plikowy:
Apex-Website/brand/index.html pokazuje markę, a index.html produkt.
To paczka do obejrzenia; do hostingu używa się Apex-Software-hosting.zip.

## Publikacja krok po kroku

1. Sprawdzić cenę brutto rejestracji i odnowienia apexsoftware.app w OVH.
   Dokończyć zakup osobiście na koncie operatora, jeśli cena mieści się
   w zaakceptowanym budżecie. Hosting ani płatny SSL w OVH nie są potrzebne.
2. W Cloudflare dodać apexsoftware.app jako domenę i wybrać plan Free.
   Sprawdzić/importować istniejące rekordy, zwłaszcza poczty, jeśli są używane.
3. Cloudflare pokaże serwery nazw przypisane do domeny. W panelu OVH,
   w ustawieniach Serwery DNS, wpisać dokładnie te wartości.
   Nie zgadywać serwerów ani rekordów DNS.
4. Poczekać na status aktywnej domeny w Cloudflare.
5. Utworzyć jeden projekt Pages z bezpośrednim uploadem plików,
   np. apex-software. Wgrać Apex-Software-hosting.zip bez dodatkowego
   folderu nadrzędnego.
6. W ustawieniach domen projektu Pages dodać apexsoftware.app.
   Wykonać instrukcje konfiguracji DNS pokazane dla tej domeny.
7. Poczekać na aktywację domeny i HTTPS. Opcjonalnie dodać www i ustawić
   przekierowanie na jeden wybrany adres główny.
8. Sprawdzić publicznie wszystkie ścieżki z tabeli, przełączniki języka,
   tryb jasny i ciemny, pobieranie, politykę oraz zachowanie nieistniejącego URL.
9. Po niezależnym potwierdzeniu działania zaktualizować domainVerified,
   sprawdzić canonical/hreflang oraz ewentualnie dodać sitemapę.

Adres pages.dev służy do testów/konfiguracji; użytkownicy mogą korzystać
z apexsoftware.app. Stronę można później przenieść na inny hosting
z zachowaniem domeny.

## Granice walidacji

Testy lokalne nie potwierdzają rejestracji, własności, DNS, certyfikatu
ani działania Cloudflare. Nie zastępują brakujących testów rozszerzenia.
Przed publicznym udostępnieniem należy rozstrzygnąć wcześniej opisane
kwestie licencji filtrów i walidacji aplikacji oraz sprawdzić praktyki
hostingu dotyczące logów i danych. Dołączone polityki opisują rozszerzenie.
Samo opublikowanie strony nie gwarantuje jej obecności w wyszukiwarce.

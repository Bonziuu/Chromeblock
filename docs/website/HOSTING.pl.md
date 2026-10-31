# Publikacja strony pod własną domeną

Proponowany wariant: statyczny hosting Cloudflare Pages i osobno kupiona
domena. Hosting nie wymaga serwera aplikacyjnego ani bazy danych.

Koszt domeny zależy od operatora, końcówki i odnowienia. Nie podano tu
aktualnej oferty konkretnego operatora. Przed zakupem sprawdzić cenę
rejestracji i kolejnych lat. Dostępność proponowanych nazw nie jest
potwierdzona.

## Gotowe pliki

Apex-Website-hosting.zip ma index.html bezpośrednio w katalogu głównym,
z wersją EN, stylami, skryptem, logo i politykami. Nie zawiera katalogu
nadrzędnego, dokumentacji, narzędzi deweloperskich ani rozszerzenia.

Odtworzenie z repozytorium:

    node website/refresh-privacy.mjs
    node website/export-site.mjs

Apex-Website-preview.zip służy do oglądania lokalnego. W uploadzie
hostingowym wygodniej użyć Apex-Website-hosting.zip.

## Cloudflare Pages — publikacja plików

1. Utworzyć konto Cloudflare i projekt Pages z bezpośrednim przesyłaniem plików.
2. Przesłać Apex-Website-hosting.zip; index.html musi pozostać w katalogu głównym.
3. Sprawdzić stronę pod tymczasowym adresem projektu: PL/EN, jasny/ciemny
   motyw, pobieranie, FAQ i obie polityki.
4. Po wyborze i zakupie domeny dodać ją w ustawieniach domen projektu Pages.
5. Wprowadzić rekordy DNS lub zmienić serwery nazw według konkretnych
   instrukcji pokazanych dla wybranej domeny. Nie zgadywać rekordów.
   Zachować istniejące rekordy poczty i innych usług.
6. Zaczekać na aktywację domeny oraz HTTPS, sprawdzić adres główny i www,
   ustawić jeden adres jako główny i przekierować drugi.

Własna domena jest adresem widocznym dla odwiedzających; adres dostawcy
hostingu służy do testów i konfiguracji. Strona może być później przeniesiona
na inny hosting z zachowaniem własnej domeny.

## Przed publicznym udostępnieniem

Należy sprawdzić opisane wcześniej otwarte kwestie dystrybucji filtrów
i walidacji rozszerzenia. Sprawdzić praktyki hostingu dotyczące logów
i przetwarzania danych; dołączone polityki opisują rozszerzenie.
Po ustaleniu domeny można dodać adresy canonical, sitemapę i konfigurację
indeksowania. Samo wdrożenie nie gwarantuje widoczności w wyszukiwarce.

Ten dokument i eksport nie tworzą konta hostingu, nie kupują domeny,
nie zmieniają DNS i nie publikują strony automatycznie.

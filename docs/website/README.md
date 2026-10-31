# Pierwsza wersja strony Apex

Kod: website/. To lokalnie sprawdzona strona statyczna, bez wdrożenia
na domenę i bez zmiany paczki rozszerzenia.

Podglądy:

- desktop-preview.png — widok 1440 px, początek strony.
- mobile-preview.png — pełna strona przy szerokości 375 px.

Sprawdzono w systemowym Chromium przez Playwright:

- odpowiedzi HTTP strony i obu polityk;
- odnośniki do lokalnych plików, kotwice i powrót z polityki;
- rozwijanie FAQ;
- menu mobilne, wybór sekcji i zamykanie klawiszem Escape;
- komunikat po kopiowaniu adresu instalacji, także przy odmowie schowka;
- brak poziomego przewijania przy 320, 375, 768 i 1440 px;
- brak błędów JavaScript i żądań o zewnętrzne zasoby;
- kontrast odnośników polityki przy ciemnym motywie.

Nie jest to wynik testów działania rozszerzenia. Istniejące ograniczenia
walidacji rozszerzenia i licencji cudzych filtrów pozostają opisane
w docs/webstore/final-release-status.json.

# Strona Apex — PL / EN, tryb jasny i ciemny

Kod: website/. To lokalnie sprawdzona strona statyczna, bez wdrożenia
na domenę i bez zmiany paczki rozszerzenia.

Podglądy:

- desktop-preview.png i mobile-preview.png — polska wersja jasna.
- desktop-preview-dark.png i mobile-preview-dark.png — polska wersja ciemna.
- desktop-preview-en.png i mobile-preview-en.png — angielska wersja jasna.
- desktop-preview-en-dark.png i mobile-preview-en-dark.png — angielska wersja ciemna.

Desktop: 1440 px, początek strony. Mobile: 375 px, pełna strona.
Paleta odpowiada turkusowemu logo (#22b8a8 / #0f7f8c).
Motyw jest dobierany automatycznie do ustawień przeglądarki/systemu.

Sprawdzono w systemowym Chromium przez Playwright:

- odpowiedzi HTTP obu wersji językowych i obu polityk;
- odnośniki do lokalnych plików, kotwice i powrót z polityki;
- rozwijanie FAQ;
- menu mobilne, wybór sekcji i zamykanie klawiszem Escape;
- polskie i angielskie komunikaty kopiowania, w kontrolowanych scenariuszach
  sukcesu oraz odmowy dostępu do schowka (bez deklaracji zmiany schowka systemowego);
- brak poziomego przewijania przy 320, 375, 768, 1024 i 1440 px
  we wszystkich czterech kombinacjach języka i motywu;
- brak błędów JavaScript i żądań o zewnętrzne zasoby;
- przełączanie języka, właściwe polityki i powrót do właściwej strony;
- automatyczną zmianę motywu bez przeładowania strony;
- czytelność kluczowych tekstów i odnośników przy ciemnym motywie.

validation.json zapisuje wynik rzeczywistego przebiegu kontroli języków,
motywów i szerokości. Nie jest to certyfikacja dostępności.

Nie jest to wynik testów działania rozszerzenia. Istniejące ograniczenia
walidacji rozszerzenia i licencji cudzych filtrów pozostają opisane
w docs/webstore/final-release-status.json.

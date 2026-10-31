# Strona Apex AdBlocker

Pierwsza wersja PL: prezentacja, pobieranie ZIP-a, instrukcja instalacji,
FAQ, kontakt i polityka prywatności rozszerzenia. Statyczne HTML/CSS/JS,
bez zależności produkcyjnych, zewnętrznych fontów, analityki lub formularzy.
Kod strony nie zapisuje cookies ani localStorage.

## Podgląd lokalny

Z katalogu repozytorium:

    python3 -m http.server 4173 --bind 127.0.0.1 --directory website

Następnie otwórz lokalnie port 4173. Strona nie jest wdrożona na domenie.
Do hostingu wystarczy zawartość katalogu website.

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

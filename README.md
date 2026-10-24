# Žan Komaricki · osebna spletna stran

Statična spletna stran (HTML, CSS, JavaScript) brez dodatnih orodij za gradnjo. V slovenščini z angleškim prevodom.

## Struktura

| Datoteka / mapa | Vsebina |
|---|---|
| `index.html` | Celotna stran: O meni, Fitnes, Delo, Kontakt |
| `style.css` | Izgled (paleta Almond Cream → Coffee Bean) |
| `script.js` | Animacije, graf teže, jedilnik, klepet, galerija |
| `i18n.js` | Angleški prevod (slovensko besedilo → angleško) |
| `img/` | Slike (pomanjšane na največ 1400 px) |
| `video/` | Videi MP4 (720 × 1280) in njihove predogledne sličice |
| `favicon.svg` | Ikona v zavihku brskalnika |
| `serve.ps1` | Lokalni predogled na http://localhost:8080 |

## Lokalni predogled

V tej mapi zaženi:

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

in odpri http://localhost:8080.

## Objava na GitHub Pages (brezplačno)

1. Na github.com ustvari nov javni repozitorij, npr. `zankomaricki`.
2. Naloži vse datoteke iz te mape (razen tistih v `.gitignore`).
3. V repozitoriju odpri **Settings → Pages**, pri **Source** izberi **Deploy from a branch**, veja `main`, mapa `/ (root)`, in shrani.
4. Čez minuto je stran na `https://<uporabnisko-ime>.github.io/zankomaricki/`.

## Lastna domena (limitlessminds.si)

Stran je nastavljena na domeno **limitlessminds.si** (datoteka `CNAME`). Za drugo domeno, npr. `zankomaricki.si`, zamenjaj vrstico v `CNAME` in ponovi korake spodaj z novo domeno.

1. Domena je registrirana pri Domenci (podaljšanje do 31. 8. 2027).
2. Datoteka `CNAME` v repozitoriju vsebuje eno vrstico: `limitlessminds.si`
3. Pri Domenci v nastavitvah DNS dodaj:
   - štiri zapise **A** za `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - zapis **CNAME** za `www`: `<uporabnisko-ime>.github.io`
4. V **Settings → Pages** vpiši domeno in vklopi **Enforce HTTPS**.

## Urejanje vsebine

- Besedila so v `index.html`. Če spremeniš slovensko besedilo, posodobi isti ključ v `i18n.js`, sicer ostane v angleščini nepreveden.
- Jedilnik, klepet in graf teže so v `script.js`.

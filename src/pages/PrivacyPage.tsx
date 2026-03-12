export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold text-anthracite mb-8">
        Ochrana soukromí
      </h1>

      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-stone text-sm leading-relaxed font-semibold">
            Zásady ochrany osobních údajů
          </p>
          <p className="text-stone text-sm leading-relaxed">
            Abychom vám mohli doručit zboží a zajistit chod e-shopu, potřebujeme zpracovávat některé vaše osobní údaje. Zde se dozvíte, jak s nimi nakládáme, aby bylo vše v souladu s nařízením GDPR.
          </p>
        </div>

        <h2 className="font-serif text-xl font-semibold text-anthracite mt-8">
          1. Kdo vaše údaje zpracovává?
        </h2>
        <div className="space-y-4">
          <p className="text-stone text-sm leading-relaxed">
            Správcem vašich osobních údajů je:
          </p>
          <ul className="space-y-2 text-stone text-sm leading-relaxed">
            <li>Martin Minárik</li>
            <li>Sídlo: Školská 660/3, 110 00 Praha - Nové Město</li>
            <li>IČ: 23034190</li>
            <li>Kontaktní e-mail: martin.mino.minarik@gmail.com</li>
          </ul>
        </div>

        <h2 className="font-serif text-xl font-semibold text-anthracite mt-8">
          2. Jaké údaje zpracováváme a proč?
        </h2>
        <div className="space-y-4">
          <p className="text-stone text-sm leading-relaxed">
            Vaše osobní údaje zpracováváme pouze v nezbytném rozsahu a pro tyto účely:
          </p>
          <ul className="space-y-3 text-stone text-sm leading-relaxed">
            <li>
              <span className="font-semibold">Vyřízení objednávky a doručení zboží:</span>{' '}
              Potřebujeme vaše jméno, příjmení, doručovací adresu (případně vybrané výdejní místo), e-mail a telefonní číslo. Tyto údaje slouží k uzavření kupní smlouvy, vystavení podkladů pro platbu převodem a k následnému doručení zboží. Telefonní číslo je nezbytné pro dopravce k odeslání informací o vyzvednutí zásilky. (Právní základ: Plnění smlouvy).
            </li>
            <li>
              <span className="font-semibold">Účetnictví a daně:</span>{' '}
              Fakturační údaje (jméno, adresa, případně IČ) uchováváme, protože nám to nařizují zákony o účetnictví a daních. (Právní základ: Plnění právní povinnosti).
            </li>
            <li>
              <span className="font-semibold">Komunikace:</span>{' '}
              Váš e-mail využíváme k tomu, abychom vás informovali o stavu vaší objednávky a řešili případné dotazy.
            </li>
          </ul>
          <p className="text-stone text-sm leading-relaxed">
            (Poznámka k newsletteru: Na našem webu se aktuálně neshromažďují e-mailové adresy pro účely hromadného e-mail marketingu).
          </p>
        </div>

        <h2 className="font-serif text-xl font-semibold text-anthracite mt-8">
          3. Komu vaše údaje předáváme?
        </h2>
        <div className="space-y-4">
          <p className="text-stone text-sm leading-relaxed">
            Snažíme se držet vaše data v maximálním bezpečí. Předáváme je pouze těmto nezbytným partnerům (zpracovatelům), kteří nám pomáhají e-shop provozovat:
          </p>
          <ul className="space-y-3 text-stone text-sm leading-relaxed">
            <li>
              <span className="font-semibold">Přepravní společnost Packeta s.r.o. (Zásilkovna):</span>{' '}
              Předáváme jim vaše jméno, e-mail a telefon, aby vám mohli zásilku doručit a informovat vás o ní.
            </li>
            <li>
              <span className="font-semibold">Poskytovatel hostingu:</span>{' '}
              Náš e-shop běží na vlastním řešení, data jsou bezpečně uložena na serverech společnosti Vercel Inc.
            </li>
          </ul>
        </div>

        <h2 className="font-serif text-xl font-semibold text-anthracite mt-8">
          4. Jak dlouho údaje uchováváme?
        </h2>
        <div className="space-y-4">
          <p className="text-stone text-sm leading-relaxed">
            Údaje potřebné k vyřízení objednávky a pro případné reklamace uchováváme po dobu 3 let od nákupu.
          </p>
          <p className="text-stone text-sm leading-relaxed">
            Daňové doklady (faktury) musíme podle zákona uchovávat po dobu 10 let.
          </p>
        </div>

        <h2 className="font-serif text-xl font-semibold text-anthracite mt-8">
          5. Vaše práva podle GDPR
        </h2>
        <div className="space-y-4">
          <p className="text-stone text-sm leading-relaxed">
            Ve vztahu k vašim osobním údajům máte svá práva. Kdykoliv se na nás můžete obrátit na výše uvedený e-mail a požadovat:
          </p>
          <ul className="space-y-3 text-stone text-sm leading-relaxed">
            <li>
              <span className="font-semibold">Přístup k údajům:</span>{' '}
              Máte právo vědět, jaké údaje o vás zpracováváme.
            </li>
            <li>
              <span className="font-semibold">Opravu údajů:</span>{' '}
              Pokud u nás máte chybně vedené údaje, rádi je opravíme.
            </li>
            <li>
              <span className="font-semibold">Výmaz údajů (právo být zapomenut):</span>{' '}
              Pokud o to požádáte, vaše údaje smažeme (s výjimkou těch, které musíme držet ze zákona, např. faktury).
            </li>
            <li>Omezení zpracování nebo vznesení námitky.</li>
          </ul>
          <p className="text-stone text-sm leading-relaxed">
            Pokud se domníváte, že s vašimi údaji nezacházíme správně, máte právo podat stížnost u Úřadu pro ochranu osobních údajů (
            <a
              href="https://www.uoou.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-honey hover:underline"
            >
              www.uoou.cz
            </a>
            ).
          </p>
        </div>
      </div>
    </main>
  );
}
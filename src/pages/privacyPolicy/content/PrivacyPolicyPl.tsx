import PolicyDocument, {
  Clause,
  ClauseList,
  Code,
  EmailLink,
  ExternalLink,
  type PolicySection,
  PolicyTable,
  SectionLink,
} from "@/pages/privacyPolicy/components/PolicyDocument";
import {
  formatPolicyDate,
  POLICY_DETAILS,
} from "@/pages/privacyPolicy/policyDetails";

const {
  version,
  effectiveDate,
  lastUpdatedDate,
  websiteUrl,
  mainWebsiteUrl,
  controllerName,
  contactEmail,
  hostingProvider,
  emailDeliveryProvider,
  supervisoryAuthorityUrl,
} = POLICY_DETAILS;

const locale = "pl-PL";

const sections: PolicySection[] = [
  {
    id: "general",
    number: "§ 1.",
    title: "Postanowienia ogólne",
    content: (
      <>
        <Clause n="1">
          Niniejsza Polityka prywatności („<strong>Polityka</strong>”) określa
          zasady przetwarzania danych osobowych w związku z korzystaniem ze
          strony internetowej dostępnej pod adresem <Code>{websiteUrl}</Code>,
          w tym wszystkich jej podstron oraz każdego innego adresu, pod którym
          udostępniana jest ta sama treść („<strong>Serwis</strong>”).
        </Clause>
        <Clause n="2">
          Polityka stanowi realizację obowiązków informacyjnych, o których mowa
          w art. 13 i 14 rozporządzenia Parlamentu Europejskiego i Rady (UE)
          2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych
          w związku z przetwarzaniem danych osobowych i w sprawie swobodnego
          przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne
          rozporządzenie o ochronie danych) (Dz. Urz. UE L 119 z 4.05.2016, str.
          1) („<strong>RODO</strong>”), a także zawiera informacje, o których
          mowa w art. 399 ustawy z dnia 12 lipca 2024 r. – Prawo komunikacji
          elektronicznej (Dz. U. z 2024 r. poz. 1221) („<strong>PKE</strong>”).
        </Clause>
        <Clause n="3">
          Pojęcia użyte w Polityce, takie jak „dane osobowe”, „przetwarzanie”,
          „administrator”, „podmiot przetwarzający”, „odbiorca” i „strona
          trzecia”, mają znaczenie nadane im w art. 4 RODO. „
          <strong>Użytkownik</strong>” lub „<strong>Ty</strong>” oznacza każdą
          osobę fizyczną korzystającą z Serwisu.
        </Clause>
        <Clause n="4">
          Polityka ma charakter informacyjny. Nie jest umową, ofertą ani
          regulaminem i nie kreuje po stronie Administratora ani Użytkownika
          żadnych praw ani obowiązków o charakterze umownym. Żadne z postanowień
          Polityki nie wyłącza ani nie ogranicza praw przysługujących
          Użytkownikowi na podstawie bezwzględnie obowiązujących przepisów
          prawa.
        </Clause>
        <Clause n="5">
          Polityka dotyczy wyłącznie Serwisu. Nie ma zastosowania do innych
          stron internetowych i usług, w tym stron, do których prowadzą
          odnośniki zamieszczone w Serwisie, oraz innych stron prowadzonych
          przez Administratora (np. <ExternalLink href={mainWebsiteUrl} />),
          dla których mogą obowiązywać odrębne dokumenty.
        </Clause>
      </>
    ),
  },
  {
    id: "controller",
    number: "§ 2.",
    title: "Administrator danych",
    content: (
      <>
        <Clause n="1">
          Administratorem Twoich danych osobowych jest {controllerName}, osoba
          fizyczna („<strong>Administrator</strong>”).
        </Clause>
        <Clause n="2">
          We wszystkich sprawach dotyczących przetwarzania danych osobowych, w
          tym realizacji przysługujących Ci praw, możesz kontaktować się z
          Administratorem za pośrednictwem poczty elektronicznej pod adresem:{" "}
          <EmailLink email={contactEmail} />.
        </Clause>
        <Clause n="3">
          Inspektor ochrony danych nie został wyznaczony, ponieważ nie ma
          takiego obowiązku na podstawie art. 37 RODO.
        </Clause>
      </>
    ),
  },
  {
    id: "visiting",
    number: "§ 3.",
    title: "Odwiedzanie Serwisu",
    content: (
      <>
        <Clause n="1">
          Przy każdym wejściu do Serwisu Twoja przeglądarka automatycznie
          przekazuje na serwery dostawcy hostingu dane techniczne, które są
          przetwarzane w celu dostarczenia Ci Serwisu. Dane te mogą obejmować:
          adres IP, datę i godzinę żądania, adres żądanego zasobu, adres strony
          odsyłającej (referrer), typ i wersję przeglądarki oraz systemu
          operacyjnego (user agent), kod odpowiedzi HTTP i ilość przesłanych
          danych, a także przybliżoną lokalizację (kraj lub region) ustaloną na
          podstawie adresu IP.
        </Clause>
        <Clause n="2">
          Dane te są przetwarzane w celu:
          <ClauseList>
            <li>dostarczenia Serwisu i jego treści na Twoje urządzenie;</li>
            <li>
              zapewnienia stabilności, dostępności i bezpieczeństwa Serwisu, w
              tym wykrywania ataków (np. ataków typu DoS), nadużyć i błędów,
              zapobiegania im i reagowania na nie;
            </li>
            <li>ustalenia, dochodzenia lub obrony przed roszczeniami.</li>
          </ClauseList>
        </Clause>
        <Clause n="3">
          Podstawą prawną przetwarzania jest art. 6 ust. 1 lit. f RODO, tj.
          prawnie uzasadniony interes Administratora polegający na udostępnianiu
          Serwisu w sposób niezawodny i bezpieczny oraz na ustaleniu,
          dochodzeniu lub obronie przed roszczeniami.
        </Clause>
        <Clause n="4">
          Administrator nie wykorzystuje tych danych do identyfikowania
          Użytkowników, nie łączy ich z innymi danymi i nie wykorzystuje ich do
          profilowania, analityki ani marketingu.
        </Clause>
        <Clause n="5">
          Dane te są przetwarzane przez dostawcę hostingu (
          <SectionLink to="recipients">§ 7</SectionLink>) przez okres
          wynikający z jego konfiguracji technicznej i zasad przechowywania
          danych, chyba że dłuższy okres jest niezbędny do wyjaśnienia
          incydentu bezpieczeństwa albo do ustalenia, dochodzenia lub obrony
          przed roszczeniami – wówczas do czasu osiągnięcia tego celu.
        </Clause>
      </>
    ),
  },
  {
    id: "contact",
    number: "§ 4.",
    title: "Formularz kontaktowy i korespondencja",
    content: (
      <>
        <Clause n="1">
          Możesz skontaktować się z Administratorem za pośrednictwem formularza
          kontaktowego dostępnego w Serwisie, poczty elektronicznej lub innych
          kanałów wskazanych w Serwisie.
        </Clause>
        <Clause n="2">
          W przypadku wysłania wiadomości za pośrednictwem formularza
          kontaktowego przetwarzane są: Twój adres e-mail, treść wiadomości,
          wybrana kategoria zapytania, temat wiadomości (jeżeli został
          uzupełniony automatycznie) oraz język interfejsu Serwisu w chwili
          wysłania. Wiadomość jest dostarczana za pośrednictwem usługi EmailJS (
          <SectionLink to="recipients">§ 7</SectionLink>); w związku z jej
          dostarczeniem dostawca tej usługi przetwarza dane techniczne
          żądania, takie jak adres IP i typ przeglądarki. Formularz zawiera
          ukryte pole służące wyłącznie do wykrywania automatycznie wysyłanego
          spamu; nie jest ono przeznaczone do wypełniania przez Użytkowników.
        </Clause>
        <Clause n="3">
          W przypadku kontaktu za pośrednictwem poczty elektronicznej lub
          innego kanału Administrator przetwarza dane zawarte w wiadomości oraz
          jej metadane (w szczególności adres e-mail, imię i nazwisko, jeżeli
          zostały podane, datę wiadomości i jej nagłówki techniczne), a także
          inne dane, które zdecydujesz się przekazać w toku korespondencji.
        </Clause>
        <Clause n="4">
          Dane osobowe, o których mowa w ust. 2 i 3, są przetwarzane w
          następujących celach i na następujących podstawach prawnych:
          <ClauseList>
            <li>
              udzielenie odpowiedzi na zapytanie i prowadzenie dalszej
              korespondencji – art. 6 ust. 1 lit. f RODO (prawnie uzasadniony
              interes Administratora polegający na komunikacji z osobami
              kontaktującymi się z Administratorem);
            </li>
            <li>
              jeżeli zapytanie dotyczy możliwego zatrudnienia, współpracy lub
              zawarcia innej umowy – podjęcie działań na Twoje żądanie przed
              zawarciem takiej umowy – art. 6 ust. 1 lit. b RODO;
            </li>
            <li>
              udokumentowanie korespondencji oraz ustalenie, dochodzenie lub
              obrona przed roszczeniami – art. 6 ust. 1 lit. f RODO (prawnie
              uzasadniony interes Administratora polegający na możliwości
              wykazania przebiegu komunikacji oraz na ochronie praw
              Administratora);
            </li>
            <li>
              ochrona formularza kontaktowego przed spamem i nadużyciami – art.
              6 ust. 1 lit. f RODO.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="5">
          W wiadomości nie należy zamieszczać szczególnych kategorii danych
          osobowych, o których mowa w art. 9 ust. 1 RODO (np. danych
          dotyczących zdrowia, poglądów politycznych, przekonań religijnych lub
          orientacji seksualnej), danych osobowych dotyczących wyroków
          skazujących oraz czynów zabronionych, o których mowa w art. 10 RODO,
          ani innych danych, które nie są niezbędne do obsługi zapytania.
          Administrator nie żąda podania takich danych. Jeżeli mimo to zostaną
          one przekazane, Administrator może je niezwłocznie usunąć w zakresie,
          w jakim jest to technicznie możliwe i nie uniemożliwia obsługi
          zapytania.
        </Clause>
        <Clause n="6">
          Jeżeli w wiadomości zamieścisz dane osobowe innej osoby, odpowiadasz
          za posiadanie uprawnienia do ich przekazania Administratorowi oraz za
          poinformowanie tej osoby o ich przekazaniu – w zakresie wymaganym
          przepisami prawa. Administrator pozyskuje takie dane od nadawcy
          wiadomości i przetwarza je wyłącznie w zakresie niezbędnym do obsługi
          zapytania, na podstawie art. 6 ust. 1 lit. f RODO; dla tych osób
          niniejsza Polityka stanowi również informację, o której mowa w art.
          14 RODO.
        </Clause>
        <Clause n="7">
          Administrator nie wykorzystuje Twojego adresu e-mail ani treści
          wiadomości do przesyłania informacji marketingowych, newslettera ani
          innej niezamówionej informacji handlowej.
        </Clause>
      </>
    ),
  },
  {
    id: "device-storage",
    number: "§ 5.",
    title: "Informacje przechowywane na Twoim urządzeniu",
    content: (
      <>
        <Clause n="1">
          Serwis nie wykorzystuje plików cookies w celach analitycznych,
          reklamowych, profilujących ani śledzących, a jego własny kod nie
          zapisuje żadnych plików cookies. W wyjątkowych sytuacjach dostawca
          hostingu może zapisać techniczne pliki cookies niezbędne dla
          bezpieczeństwa Serwisu (np. w celu weryfikacji przeglądarki w trakcie
          trwającego ataku).
        </Clause>
        <Clause n="2">
          W celu zapamiętania wybranych przez Ciebie ustawień Serwis korzysta z
          pamięci lokalnej przeglądarki (<Code>localStorage</Code>), w której
          zapisuje następujące informacje:
          <PolicyTable
            headers={["Klucz", "Zawartość", "Cel", "Okres przechowywania"]}
            rows={[
              [
                <Code>language</Code>,
                "Wybrany język interfejsu (do czasu jego zmiany: język ustalony na podstawie ustawień przeglądarki)",
                "Wyświetlanie Serwisu w Twoim języku przy kolejnych wizytach",
                "Do czasu usunięcia przez Ciebie",
              ],
              [
                <Code>settings</Code>,
                "Jakość grafiki, włączenie lub wyłączenie dźwięku i jego głośność, informacja o zamknięciu komunikatu dla małych ekranów",
                "Stosowanie wybranych ustawień przy kolejnych wizytach",
                "Do czasu usunięcia przez Ciebie",
              ],
            ]}
          />
        </Clause>
        <Clause n="3">
          W celu dostosowania Serwisu do Twojego urządzenia skrypty działające
          w Twojej przeglądarce odczytują ponadto, bez ich zapisywania,
          niektóre cechy urządzenia i przeglądarki: liczbę logicznych rdzeni
          procesora, przybliżoną ilość pamięci urządzenia, rodzaj urządzenia
          wskazującego (ekran dotykowy lub mysz), rozmiar ekranu, preferowane
          języki oraz ustawienie ograniczenia animacji. Są one wykorzystywane
          wyłącznie lokalnie, do wyboru domyślnej jakości grafiki, języka i
          układu strony.
        </Clause>
        <Clause n="4">
          Informacje, o których mowa w ust. 2 i 3, nie są przekazywane
          Administratorowi ani jakimkolwiek podmiotom trzecim, Administrator
          nie ma do nich dostępu i nie są one wykorzystywane do identyfikowania
          Użytkowników ani do tworzenia tzw. odcisku palca urządzenia
          (fingerprinting).
        </Clause>
        <Clause n="5">
          Przechowywanie informacji i uzyskiwanie do nich dostępu w sposób
          opisany w ust. 2 i 3 jest konieczne do dostarczania żądanej przez
          Ciebie usługi świadczonej drogą elektroniczną, tj. wyświetlania
          Serwisu zgodnie z Twoimi ustawieniami i możliwościami Twojego
          urządzenia, w związku z czym – zgodnie z art. 399 ust. 3 pkt 2 PKE
          (wdrażającym art. 5 ust. 3 dyrektywy 2002/58/WE) – nie wymaga Twojej
          zgody. W zakresie, w jakim informacje te mogłyby stanowić dane
          osobowe, podstawą prawną ich przetwarzania jest art. 6 ust. 1 lit. f
          RODO (prawnie uzasadniony interes Administratora polegający na
          zapewnieniu prawidłowego działania Serwisu zgodnie z preferencjami
          Użytkowników).
        </Clause>
        <Clause n="6">
          W każdej chwili możesz przejrzeć i usunąć informacje zapisane przez
          Serwis oraz zablokować ich zapisywanie za pomocą ustawień
          przeglądarki (np. usuwając dane witryny dla Serwisu). Zablokowanie
          pamięci lokalnej nie uniemożliwia korzystania z Serwisu – Twoje
          ustawienia nie będą jedynie zapamiętywane.
        </Clause>
        <Clause n="7">
          Po użyciu przycisku kopiującego adres e-mail Administratora Serwis
          jedynie zapisuje ten adres w Twoim schowku; nie odczytuje zawartości
          schowka.
        </Clause>
      </>
    ),
  },
  {
    id: "external-links",
    number: "§ 6.",
    title: "Odnośniki zewnętrzne i usługi podmiotów trzecich",
    content: (
      <>
        <Clause n="1">
          Wszystkie zasoby niezbędne do wyświetlenia Serwisu (w tym czcionki,
          obrazy, dźwięki i modele 3D) są udostępniane z hostingu Serwisu.
          Serwis nie korzysta z narzędzi analitycznych podmiotów trzecich,
          sieci reklamowych, czcionek hostowanych zewnętrznie, wtyczek mediów
          społecznościowych ani osadzonych treści podmiotów trzecich. W związku
          z tym samo odwiedzenie Serwisu nie powoduje przekazania Twoich danych
          podmiotom innym niż dostawca hostingu.
        </Clause>
        <Clause n="2">
          Serwis zawiera odnośniki do zewnętrznych stron i usług, w tym
          LinkedIn, GitHub, App Store, Google Play i npm, a także do stron
          projektów, organizacji i dostawców kursów wymienionych w Serwisie. Po
          przejściu pod taki odnośnik opuszczasz Serwis, a administratorem
          danych przetwarzanych w tym kontekście staje się operator strony
          docelowej, na zasadach określonych w jego polityce prywatności. Dane
          są przekazywane takim operatorom dopiero po kliknięciu odnośnika i w
          zakresie wynikającym z działania Twojej przeglądarki (np. adres IP
          oraz, w zależności od ustawień przeglądarki, adres strony
          odsyłającej).
        </Clause>
        <Clause n="3">
          Administrator nie ma wpływu na treść zewnętrznych stron ani na
          przetwarzanie danych osobowych przez ich operatorów i – w granicach
          dopuszczalnych przez prawo – nie ponosi za nie odpowiedzialności.
          Zalecane jest zapoznanie się z politykami prywatności tych podmiotów.
        </Clause>
      </>
    ),
  },
  {
    id: "recipients",
    number: "§ 7.",
    title: "Odbiorcy danych osobowych",
    content: (
      <>
        <Clause n="1">
          Administrator nie sprzedaje Twoich danych osobowych, nie wynajmuje
          ich ani nie udostępnia ich podmiotom trzecim do ich własnych celów
          marketingowych.
        </Clause>
        <Clause n="2">
          Dane osobowe mogą być ujawniane następującym odbiorcom, wyłącznie w
          zakresie niezbędnym do realizacji celów opisanych w Polityce:
          <ClauseList>
            <li>
              {hostingProvider} – hosting i dostarczanie Serwisu (podmiot
              przetwarzający);
            </li>
            <li>
              {emailDeliveryProvider} z siedzibą w Singapurze – dostarczanie
              wiadomości wysyłanych za pośrednictwem formularza kontaktowego
              (podmiot przetwarzający), z wykorzystaniem infrastruktury
              zlokalizowanej w Stanach Zjednoczonych Ameryki;
            </li>
            <li>
              dostawcy usług poczty elektronicznej (w tym usług przekierowania
              poczty), z których Administrator korzysta do odbierania,
              przechowywania i wysyłania korespondencji (podmioty
              przetwarzające);
            </li>
            <li>
              osoby i podmioty świadczące na rzecz Administratora pomoc prawną
              lub inne usługi profesjonalne, zobowiązane do zachowania
              poufności – jeżeli jest to niezbędne do ustalenia, dochodzenia lub
              obrony przed roszczeniami;
            </li>
            <li>
              organy publiczne i inne podmioty uprawnione na podstawie
              przepisów prawa – jeżeli Administrator jest prawnie zobowiązany do
              ujawnienia danych.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="3">
          Podmioty przetwarzające przetwarzają dane osobowe w imieniu
          Administratora na podstawie umów, o których mowa w art. 28 RODO (w
          tym warunków świadczenia usług obejmujących umowy powierzenia
          przetwarzania danych), i wyłącznie zgodnie z poleceniami
          Administratora.
        </Clause>
      </>
    ),
  },
  {
    id: "transfers",
    number: "§ 8.",
    title: "Przekazywanie danych poza Europejski Obszar Gospodarczy",
    content: (
      <>
        <Clause n="1">
          W związku z korzystaniem z usług, o których mowa w § 7 ust. 2 lit.
          a–c, dane osobowe mogą być przekazywane do państw spoza Europejskiego
          Obszaru Gospodarczego („<strong>państwa trzecie</strong>”), w
          szczególności do Stanów Zjednoczonych Ameryki i Singapuru.
        </Clause>
        <Clause n="2">
          Przekazanie odbywa się na podstawie:
          <ClauseList>
            <li>
              decyzji wykonawczej Komisji (UE) 2023/1795 z dnia 10 lipca 2023
              r. stwierdzającej odpowiedni stopień ochrony danych osobowych
              zapewniany w ramach ram ochrony danych UE–USA (EU-US Data Privacy
              Framework) (art. 45 RODO) – w odniesieniu do odbiorców
              certyfikowanych w tych ramach (w tym Vercel Inc.); lub
            </li>
            <li>
              standardowych klauzul umownych przyjętych decyzją wykonawczą
              Komisji (UE) 2021/914 z dnia 4 czerwca 2021 r. (art. 46 ust. 2
              lit. c RODO) – w odniesieniu do pozostałych odbiorców (w tym
              EmailJS Pte. Ltd.).
            </li>
          </ClauseList>
        </Clause>
        <Clause n="3">
          Informacje o stosowanych zabezpieczeniach, w tym ich kopię lub
          informację o miejscu ich udostępnienia, możesz uzyskać, kontaktując
          się z Administratorem (
          <SectionLink to="controller">§ 2 ust. 2</SectionLink>).
        </Clause>
        <Clause n="4">
          W państwach trzecich organy publiczne mogą dysponować uprawnieniami w
          zakresie dostępu do danych osobowych odmiennymi od obowiązujących w
          Unii Europejskiej.
        </Clause>
      </>
    ),
  },
  {
    id: "retention",
    number: "§ 9.",
    title: "Okres przechowywania danych",
    content: (
      <>
        <Clause n="1">
          Dane osobowe są przechowywane nie dłużej, niż jest to niezbędne do
          realizacji celów, w których są przetwarzane, w szczególności:
          <ClauseList>
            <li>
              dane techniczne, o których mowa w{" "}
              <SectionLink to="visiting">§ 3</SectionLink> – przez okres
              wskazany w § 3 ust. 5;
            </li>
            <li>
              dane związane z korespondencją, o których mowa w{" "}
              <SectionLink to="contact">§ 4</SectionLink> – przez czas
              niezbędny do obsługi zapytania i prowadzenia korespondencji, a
              następnie, w celach dowodowych, przez okres 3 lat od końca roku
              kalendarzowego, w którym korespondencja została zakończona;
            </li>
            <li>
              dane przetwarzane przez {emailDeliveryProvider} w związku z
              dostarczeniem wiadomości – przez okres wynikający z zasad
              przyjętych przez ten podmiot (według stanu na dzień sporządzenia
              Polityki – co do zasady do 30 dni);
            </li>
            <li>
              dane przetwarzane na podstawie art. 6 ust. 1 lit. b RODO – do
              czasu zakończenia działań podejmowanych przed zawarciem umowy, a w
              razie jej zawarcia – przez okres niezbędny do jej wykonania oraz
              wymagany przepisami prawa;
            </li>
            <li>
              informacje zapisane na Twoim urządzeniu (
              <SectionLink to="device-storage">§ 5</SectionLink>) – do czasu
              ich usunięcia przez Ciebie.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="2">
          W przypadku danych przetwarzanych na podstawie prawnie uzasadnionego
          interesu Administratora przetwarzanie kończy się wcześniej, jeżeli
          wniesiesz skuteczny sprzeciw (§ 10 ust. 1 lit. f).
        </Clause>
        <Clause n="3">
          Powyższe okresy mogą zostać przedłużone, jeżeli jest to niezbędne do
          ustalenia, dochodzenia lub obrony przed roszczeniami (do czasu ich
          prawomocnego rozstrzygnięcia albo przedawnienia) lub jeżeli wymagają
          tego przepisy prawa. Po upływie okresu przechowywania dane są usuwane
          lub anonimizowane.
        </Clause>
      </>
    ),
  },
  {
    id: "your-rights",
    number: "§ 10.",
    title: "Twoje prawa",
    content: (
      <>
        <Clause n="1">
          Na zasadach określonych w RODO przysługuje Ci prawo do:
          <ClauseList>
            <li>
              dostępu do swoich danych osobowych oraz otrzymania ich kopii
              (art. 15 RODO);
            </li>
            <li>
              sprostowania danych nieprawidłowych oraz uzupełnienia danych
              niekompletnych (art. 16 RODO);
            </li>
            <li>usunięcia danych (art. 17 RODO);</li>
            <li>ograniczenia przetwarzania (art. 18 RODO);</li>
            <li>
              przenoszenia danych – w zakresie, w jakim przetwarzanie odbywa
              się na podstawie umowy i w sposób zautomatyzowany (art. 20 RODO);
            </li>
            <li>
              wniesienia w dowolnym momencie sprzeciwu – z przyczyn związanych
              z Twoją szczególną sytuacją – wobec przetwarzania opartego na
              art. 6 ust. 1 lit. f RODO (art. 21 ust. 1 RODO); w takim
              przypadku Administratorowi nie wolno już przetwarzać tych danych,
              chyba że Administrator wykaże istnienie ważnych prawnie uzasadnionych
              podstaw do przetwarzania, nadrzędnych wobec Twoich interesów,
              praw i wolności, lub podstaw do ustalenia, dochodzenia lub obrony
              roszczeń;
            </li>
            <li>
              cofnięcia zgody w dowolnym momencie, jeżeli przetwarzanie odbywa
              się na podstawie zgody, bez wpływu na zgodność z prawem
              przetwarzania, którego dokonano na podstawie zgody przed jej
              cofnięciem (art. 7 ust. 3 RODO). Według stanu na dzień
              sporządzenia Polityki Administrator nie przetwarza danych
              osobowych w związku z Serwisem na podstawie zgody.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="2">
          Przysługuje Ci również prawo wniesienia skargi do organu nadzorczego
          (art. 77 RODO), w szczególności w państwie członkowskim Twojego
          zwykłego pobytu, miejsca pracy lub miejsca popełnienia domniemanego
          naruszenia. W Polsce organem nadzorczym jest Prezes Urzędu Ochrony
          Danych Osobowych, ul. Stawki 2, 00-193 Warszawa,{" "}
          <ExternalLink href={supervisoryAuthorityUrl} />.
        </Clause>
        <Clause n="3">
          W celu realizacji swoich praw skontaktuj się z Administratorem w
          sposób wskazany w <SectionLink to="controller">§ 2 ust. 2</SectionLink>
          . Administrator udziela informacji o działaniach podjętych w związku z
          żądaniem bez zbędnej zwłoki – a w każdym razie w terminie miesiąca od
          otrzymania żądania. W razie potrzeby, z uwagi na skomplikowany
          charakter żądania lub liczbę żądań, termin ten może zostać
          przedłużony o kolejne dwa miesiące; Administrator poinformuje Cię o
          takim przedłużeniu w terminie miesiąca od otrzymania żądania, wraz z
          podaniem przyczyn opóźnienia (art. 12 ust. 3 RODO).
        </Clause>
        <Clause n="4">
          Jeżeli Administrator ma uzasadnione wątpliwości co do tożsamości
          osoby składającej żądanie, może zażądać dodatkowych informacji
          niezbędnych do jej potwierdzenia (art. 12 ust. 6 RODO).
        </Clause>
        <Clause n="5">
          Informacje są udzielane, a działania podejmowane nieodpłatnie. Jeżeli
          żądania są ewidentnie nieuzasadnione lub nadmierne, w szczególności ze
          względu na ich ustawiczny charakter, Administrator może pobrać
          rozsądną opłatę uwzględniającą koszty administracyjne albo odmówić
          podjęcia działań w związku z żądaniem (art. 12 ust. 5 RODO).
        </Clause>
        <Clause n="6">
          Prawa, o których mowa powyżej, podlegają warunkom i wyjątkom
          przewidzianym w RODO; w szczególności prawo do uzyskania kopii danych
          nie może niekorzystnie wpływać na prawa i wolności innych osób (art.
          15 ust. 4 RODO), a prawo do usunięcia danych nie ma zastosowania w
          zakresie, w jakim przetwarzanie jest niezbędne do ustalenia,
          dochodzenia lub obrony roszczeń (art. 17 ust. 3 lit. e RODO).
        </Clause>
        <Clause n="7">
          Administrator nie ma dostępu do informacji zapisanych w Twojej
          przeglądarce (<SectionLink to="device-storage">§ 5</SectionLink>) i
          nie jest w stanie powiązać ich z Twoją osobą. Zgodnie z art. 11 RODO
          Administrator nie jest zobowiązany do pozyskiwania dodatkowych
          informacji w celu Twojej identyfikacji wyłącznie po to, aby
          zastosować się do RODO; informacjami tymi możesz samodzielnie
          zarządzać w sposób opisany w § 5 ust. 6.
        </Clause>
      </>
    ),
  },
  {
    id: "voluntary",
    number: "§ 11.",
    title: "Dobrowolność podania danych",
    content: (
      <>
        <Clause n="1">
          Podanie danych osobowych jest dobrowolne i nie jest wymogiem
          ustawowym ani umownym. Podanie adresu e-mail jest niezbędne do
          wysłania wiadomości za pośrednictwem formularza kontaktowego i
          otrzymania odpowiedzi; jego niepodanie uniemożliwi wysłanie
          wiadomości.
        </Clause>
        <Clause n="2">
          Przetwarzanie danych technicznych, o których mowa w{" "}
          <SectionLink to="visiting">§ 3</SectionLink>, jest technicznym
          warunkiem wyświetlenia Serwisu.
        </Clause>
      </>
    ),
  },
  {
    id: "automated-decisions",
    number: "§ 12.",
    title: "Zautomatyzowane podejmowanie decyzji i profilowanie",
    content: (
      <Clause n="1">
        Administrator nie podejmuje decyzji opierających się wyłącznie na
        zautomatyzowanym przetwarzaniu, w tym profilowaniu, które wywołują
        wobec Ciebie skutki prawne lub w podobny sposób istotnie na Ciebie
        wpływają (art. 22 RODO), i nie profiluje Użytkowników.
      </Clause>
    ),
  },
  {
    id: "security",
    number: "§ 13.",
    title: "Bezpieczeństwo",
    content: (
      <>
        <Clause n="1">
          Uwzględniając stan wiedzy technicznej, koszt wdrażania oraz
          charakter, zakres, kontekst i cele przetwarzania, a także ryzyko
          naruszenia praw lub wolności osób fizycznych, Administrator stosuje
          odpowiednie środki techniczne i organizacyjne, aby zapewnić stopień
          bezpieczeństwa odpowiadający temu ryzyku (art. 32 RODO). W
          szczególności komunikacja między Twoją przeglądarką a Serwisem jest
          szyfrowana z użyciem protokołu TLS (HTTPS), a po stronie
          Administratora dostęp do korespondencji ma wyłącznie Administrator.
        </Clause>
        <Clause n="2">
          Żadna metoda przesyłania danych przez Internet ani ich
          elektronicznego przechowywania nie jest w pełni bezpieczna. W związku
          z tym – w granicach dopuszczalnych przez prawo – Administrator nie
          może zagwarantować absolutnego bezpieczeństwa danych przesyłanych
          przez Internet. Nie wpływa to na obowiązki Administratora wynikające z
          RODO, w tym obowiązki dotyczące zgłaszania naruszeń ochrony danych
          osobowych (art. 33 i 34 RODO).
        </Clause>
        <Clause n="3">
          Formularz kontaktowy nie jest przeznaczony do przesyłania haseł,
          danych kart płatniczych, numerów dokumentów tożsamości ani innych
          informacji poufnych.
        </Clause>
      </>
    ),
  },
  {
    id: "children",
    number: "§ 14.",
    title: "Dzieci",
    content: (
      <Clause n="1">
        Serwis nie jest skierowany do dzieci. Administrator nie zbiera
        świadomie danych osobowych osób, które nie ukończyły 16 lat. Osoby,
        które nie ukończyły 16 lat, nie powinny przesyłać danych osobowych za
        pośrednictwem formularza kontaktowego bez zgody rodzica lub opiekuna
        prawnego. Jeżeli Administrator poweźmie wiadomość, że takie dane
        zostały przekazane bez tej zgody, może je usunąć.
      </Clause>
    ),
  },
  {
    id: "international-users",
    number: "§ 15.",
    title: "Użytkownicy spoza Europejskiego Obszaru Gospodarczego",
    content: (
      <>
        <Clause n="1">
          Serwis jest prowadzony przez Administratora z terytorium
          Rzeczypospolitej Polskiej, a przetwarzanie danych osobowych podlega
          RODO i prawu polskiemu. W granicach dopuszczalnych przez prawo
          Administrator nie zapewnia, że Serwis spełnia wymogi przepisów innych
          jurysdykcji.
        </Clause>
        <Clause n="2">
          Administrator nie sprzedaje danych osobowych i nie udostępnia ich w
          celu reklamy behawioralnej opartej na aktywności w różnych serwisach
          (w rozumieniu przepisów obowiązujących w poszczególnych stanach
          Stanów Zjednoczonych Ameryki, w tym California Consumer Privacy Act).
          Ponieważ Serwis nie śledzi Użytkowników w różnych serwisach, sygnały
          „Do Not Track” i Global Privacy Control nie zmieniają sposobu jego
          działania – śledzenie tego rodzaju nie odbywa się bez względu na to,
          czy takie sygnały są wysyłane.
        </Clause>
      </>
    ),
  },
  {
    id: "changes",
    number: "§ 16.",
    title: "Zmiany Polityki",
    content: (
      <>
        <Clause n="1">
          Administrator może zmieniać Politykę, w szczególności w przypadku
          zmiany przepisów prawa, wytycznych organów nadzorczych,
          wykorzystywanych technologii lub funkcjonalności Serwisu (np.
          wprowadzenia nowych narzędzi lub dostawców usług).
        </Clause>
        <Clause n="2">
          Zmieniona Polityka zostanie opublikowana na tej stronie wraz ze
          zaktualizowaną datą i numerem wersji i wchodzi w życie z chwilą
          publikacji, chyba że wskazano inaczej. Jeżeli zmiana wymaga Twojej
          zgody na podstawie przepisów prawa, Administrator zwróci się o nią
          odrębnie. Poprzednie wersje Polityki są udostępniane na żądanie.
        </Clause>
      </>
    ),
  },
  {
    id: "final",
    number: "§ 17.",
    title: "Postanowienia końcowe",
    content: (
      <>
        <Clause n="1">
          Polityka jest dostępna w języku polskim i angielskim. W razie
          rozbieżności między wersjami językowymi rozstrzygająca jest wersja
          polska.
        </Clause>
        <Clause n="2">
          W sprawach nieuregulowanych w Polityce zastosowanie mają przepisy
          RODO oraz prawa polskiego, w szczególności ustawy z dnia 10 maja 2018
          r. o ochronie danych osobowych oraz PKE.
        </Clause>
        <Clause n="3">
          Jeżeli którekolwiek z postanowień Polityki okaże się nieważne lub
          bezskuteczne, nie wpływa to na ważność ani skuteczność pozostałych
          postanowień.
        </Clause>
        <Clause n="4">
          Tytuły jednostek redakcyjnych Polityki mają charakter wyłącznie
          porządkowy i nie wpływają na jej wykładnię.
        </Clause>
      </>
    ),
  },
];

function PrivacyPolicyPl() {
  return (
    <PolicyDocument
      title="Polityka prywatności"
      meta={
        <p>
          Wersja {version} · Obowiązuje od{" "}
          <time dateTime={effectiveDate}>
            {formatPolicyDate(effectiveDate, locale)} r.
          </time>{" "}
          · Ostatnia aktualizacja{" "}
          <time dateTime={lastUpdatedDate}>
            {formatPolicyDate(lastUpdatedDate, locale)} r.
          </time>
        </p>
      }
      summaryTitle="Najważniejsze informacje w skrócie"
      summary={
        <>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-muted-foreground">
            <li>
              Administratorem Twoich danych osobowych jest {controllerName},
              kontakt: <EmailLink email={contactEmail} />.
            </li>
            <li>
              Serwis nie wykorzystuje własnych plików cookies ani narzędzi
              analitycznych, reklamowych i śledzących, nie osadza też wtyczek
              mediów społecznościowych.
            </li>
            <li>
              Dane osobowe są przetwarzane wyłącznie technicznie, gdy dostawca
              hostingu dostarcza Serwis do Twojej przeglądarki, oraz gdy
              kontaktujesz się z Administratorem, w szczególności przez
              formularz kontaktowy.
            </li>
            <li>
              Twoje ustawienia interfejsu (język, grafika, dźwięk) są
              zapisywane wyłącznie w Twojej przeglądarce i nie są nikomu
              przekazywane.
            </li>
            <li>
              Przysługują Ci prawa opisane w{" "}
              <SectionLink to="your-rights">§ 10</SectionLink>, w tym prawo
              wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.
            </li>
          </ul>
          <p className="text-muted-foreground">
            Niniejsze podsumowanie ma charakter wyłącznie pomocniczy. W razie
            rozbieżności rozstrzyga pełna treść Polityki.
          </p>
        </>
      }
      tableOfContentsTitle="Spis treści"
      sections={sections}
    />
  );
}

export default PrivacyPolicyPl;

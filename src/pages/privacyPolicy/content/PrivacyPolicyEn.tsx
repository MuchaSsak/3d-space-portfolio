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

const locale = "en-GB";

const sections: PolicySection[] = [
  {
    id: "general",
    number: "1.",
    title: "General provisions",
    content: (
      <>
        <Clause n="1.1">
          This Privacy Policy (the “<strong>Policy</strong>”) sets out the
          rules for the processing of personal data in connection with the use
          of the website available at <Code>{websiteUrl}</Code>, including all
          of its subpages and any other address at which the same content is
          made available (the “<strong>Website</strong>”).
        </Clause>
        <Clause n="1.2">
          This Policy constitutes the information provided pursuant to Articles
          13 and 14 of Regulation (EU) 2016/679 of the European Parliament and
          of the Council of 27 April 2016 on the protection of natural persons
          with regard to the processing of personal data and on the free
          movement of such data, and repealing Directive 95/46/EC (General Data
          Protection Regulation) (OJ L 119, 4.5.2016, p. 1) (the “
          <strong>GDPR</strong>”), and contains the information referred to in
          Article 399 of the Polish Act of 12 July 2024 – Electronic
          Communications Law (Journal of Laws of 2024, item 1221) (the “
          <strong>ECL</strong>”).
        </Clause>
        <Clause n="1.3">
          Terms used in this Policy, such as “personal data”, “processing”,
          “controller”, “processor”, “recipient” and “third party”, have the
          meanings given to them in Article 4 of the GDPR. “
          <strong>User</strong>” or “<strong>you</strong>” means any natural
          person who uses the Website.
        </Clause>
        <Clause n="1.4">
          This Policy is an information document. It is not a contract, an
          offer or terms of service, and it does not create any contractual
          rights or obligations on the part of the Controller or the User.
          Nothing in this Policy excludes or limits any rights that the User
          has under mandatory provisions of law.
        </Clause>
        <Clause n="1.5">
          This Policy applies only to the Website. It does not apply to any
          other website or service, including websites to which the Website
          links and other websites operated by the Controller (such as{" "}
          <ExternalLink href={mainWebsiteUrl} />
          ), which may be governed by separate documents.
        </Clause>
      </>
    ),
  },
  {
    id: "controller",
    number: "2.",
    title: "Controller",
    content: (
      <>
        <Clause n="2.1">
          The controller of your personal data is {controllerName}, a natural
          person (the “<strong>Controller</strong>”).
        </Clause>
        <Clause n="2.2">
          In all matters relating to the processing of personal data, including
          the exercise of your rights, you may contact the Controller by email
          at: <EmailLink email={contactEmail} />.
        </Clause>
        <Clause n="2.3">
          The Controller has not appointed a data protection officer, as there
          is no obligation to do so under Article 37 of the GDPR.
        </Clause>
      </>
    ),
  },
  {
    id: "visiting",
    number: "3.",
    title: "Visiting the Website",
    content: (
      <>
        <Clause n="3.1">
          Each time you visit the Website, your browser automatically transmits
          technical data to the servers of the hosting provider, which are
          processed in order to deliver the Website to you. These data may
          include: your IP address; the date and time of the request; the
          address of the requested resource; the address of the referring page
          (referrer); the type and version of your browser and operating system
          (user agent); the HTTP status code and the amount of data transferred;
          and the approximate location (country or region) derived from the IP
          address.
        </Clause>
        <Clause n="3.2">
          These data are processed for the purposes of:
          <ClauseList>
            <li>delivering the Website and its content to your device;</li>
            <li>
              ensuring the stability, availability and security of the Website,
              including detecting, preventing and responding to attacks (e.g.
              denial-of-service attacks), abuse and errors;
            </li>
            <li>the establishment, exercise or defence of legal claims.</li>
          </ClauseList>
        </Clause>
        <Clause n="3.3">
          The legal basis for the processing is Article 6(1)(f) of the GDPR,
          i.e. the legitimate interests of the Controller in making the Website
          available in a reliable and secure manner and in the establishment,
          exercise or defence of legal claims.
        </Clause>
        <Clause n="3.4">
          The Controller does not use these data to identify Users, does not
          combine them with other data, and does not use them for profiling,
          analytics or marketing.
        </Clause>
        <Clause n="3.5">
          These data are processed by the hosting provider (
          <SectionLink to="recipients">Section 7</SectionLink>) for the period
          resulting from its technical configuration and its data retention
          policies, unless a longer period is necessary to investigate a
          security incident or to establish, exercise or defend legal claims,
          in which case they are processed until that purpose has been
          achieved.
        </Clause>
      </>
    ),
  },
  {
    id: "contact",
    number: "4.",
    title: "Contact form and correspondence",
    content: (
      <>
        <Clause n="4.1">
          You may contact the Controller through the contact form available on
          the Website, by email, or through the other channels indicated on the
          Website.
        </Clause>
        <Clause n="4.2">
          When you send a message through the contact form, the following data
          are processed: your email address; the content of your message; the
          category of the inquiry you select; the subject of the message, if it
          has been filled in automatically; and the language of the Website
          interface at the time of sending. The message is delivered through
          the EmailJS service (
          <SectionLink to="recipients">Section 7</SectionLink>); in connection
          with the delivery, the provider of that service processes technical
          data of the request, such as your IP address and the type of your
          browser. The form contains a hidden field used solely to detect
          automatically sent spam; it is not intended to be filled in by Users.
        </Clause>
        <Clause n="4.3">
          When you contact the Controller by email or through another channel,
          the Controller processes the data contained in your message and its
          metadata (in particular your email address, your name if provided,
          the date of the message and its technical headers), as well as any
          other data you choose to provide in the course of the correspondence.
        </Clause>
        <Clause n="4.4">
          The personal data referred to in Sections 4.2 and 4.3 are processed
          for the following purposes and on the following legal bases:
          <ClauseList>
            <li>
              to respond to your inquiry and to conduct the resulting
              correspondence – Article 6(1)(f) of the GDPR (the legitimate
              interest of the Controller in communicating with persons who
              contact the Controller);
            </li>
            <li>
              where your inquiry concerns a possible employment, cooperation or
              other contract – to take steps at your request prior to entering
              into such a contract – Article 6(1)(b) of the GDPR;
            </li>
            <li>
              to document the correspondence and to establish, exercise or
              defend legal claims – Article 6(1)(f) of the GDPR (the legitimate
              interest of the Controller in being able to demonstrate the course
              of communication and in protecting the Controller’s rights);
            </li>
            <li>
              to protect the contact form against spam and abuse – Article
              6(1)(f) of the GDPR.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="4.5">
          You should not include in your message any special categories of
          personal data referred to in Article 9(1) of the GDPR (e.g. data
          concerning health, political opinions, religious beliefs or sexual
          orientation), personal data relating to criminal convictions and
          offences referred to in Article 10 of the GDPR, or any other data that
          are not necessary to handle your inquiry. The Controller does not
          request such data. Where such data are nevertheless provided, the
          Controller may delete them without undue delay, to the extent that
          this is technically possible and does not prevent the handling of
          your inquiry.
        </Clause>
        <Clause n="4.6">
          If you include in your message personal data of another person, you
          are responsible for being entitled to disclose those data to the
          Controller and for informing that person of the disclosure, to the
          extent required by law. The Controller obtains such data from the
          sender of the message and processes them only to the extent necessary
          to handle the inquiry, on the basis of Article 6(1)(f) of the GDPR;
          for such persons, this Policy also constitutes the information
          referred to in Article 14 of the GDPR.
        </Clause>
        <Clause n="4.7">
          The Controller does not use your email address or the content of your
          message to send marketing communications, newsletters or any other
          unsolicited commercial information.
        </Clause>
      </>
    ),
  },
  {
    id: "device-storage",
    number: "5.",
    title: "Information stored on your device",
    content: (
      <>
        <Clause n="5.1">
          The Website does not use cookies for analytics, advertising,
          profiling or tracking purposes, and its own code does not set any
          cookies. In exceptional circumstances, the hosting provider may set
          technical cookies strictly necessary for the security of the Website
          (for example, to verify the browser during an ongoing attack).
        </Clause>
        <Clause n="5.2">
          To remember the settings you choose, the Website uses the local
          storage of your browser (<Code>localStorage</Code>), in which it
          saves the following information:
          <PolicyTable
            headers={["Key", "Content", "Purpose", "Retention"]}
            rows={[
              [
                <Code>language</Code>,
                "The selected interface language (until you change it: the language determined from your browser settings)",
                "Displaying the Website in your language on subsequent visits",
                "Until deleted by you",
              ],
              [
                <Code>settings</Code>,
                "Graphics quality, sound on or off and its volume, whether you have dismissed the small-screen notice",
                "Applying the settings you chose on subsequent visits",
                "Until deleted by you",
              ],
            ]}
          />
        </Clause>
        <Clause n="5.3">
          In order to adapt the Website to your device, scripts running in your
          browser also read, without saving them, certain characteristics of
          your device and browser: the number of logical processor cores, the
          approximate amount of device memory, the type of pointing device
          (touch screen or mouse), the screen size, your preferred languages
          and your reduced-motion setting. They are used only locally, to
          select the default graphics quality, language and layout.
        </Clause>
        <Clause n="5.4">
          The information referred to in Sections 5.2 and 5.3 is not
          transmitted to the Controller or to any third party, the Controller
          has no access to it, and it is not used to identify Users or to
          create a fingerprint of the device.
        </Clause>
        <Clause n="5.5">
          Storing and accessing the information as described in Sections 5.2
          and 5.3 is necessary to provide the electronically supplied service
          you have requested, namely displaying the Website in accordance with
          your settings and the capabilities of your device; therefore,
          pursuant to Article 399(3)(2) of the ECL (implementing Article 5(3)
          of Directive 2002/58/EC), it does not require your consent. To the
          extent that such information might constitute personal data, the
          legal basis for its processing is Article 6(1)(f) of the GDPR (the
          legitimate interest of the Controller in ensuring that the Website
          works properly and in accordance with Users’ preferences).
        </Clause>
        <Clause n="5.6">
          You can view and delete the information stored by the Website, and
          block its storage, at any time using your browser settings (e.g. by
          clearing the site data for the Website). Blocking local storage does
          not prevent you from using the Website; your settings will simply not
          be remembered.
        </Clause>
        <Clause n="5.7">
          When you use the button that copies the Controller’s email address,
          the Website only writes that address to your clipboard; it does not
          read the contents of your clipboard.
        </Clause>
      </>
    ),
  },
  {
    id: "external-links",
    number: "6.",
    title: "External links and third-party services",
    content: (
      <>
        <Clause n="6.1">
          All resources required to display the Website (including fonts,
          images, sounds and 3D models) are served from the Website’s own
          hosting. The Website does not use third-party analytics tools,
          advertising networks, externally hosted fonts, social media plugins
          or embedded third-party content. Accordingly, merely visiting the
          Website does not cause your data to be transmitted to any provider
          other than the hosting provider.
        </Clause>
        <Clause n="6.2">
          The Website contains links to external websites and services,
          including LinkedIn, GitHub, the App Store, Google Play and npm, as
          well as the websites of the projects, organisations and course
          providers referred to on the Website. When you follow such a link,
          you leave the Website, and the operator of the target website becomes
          the controller of any data processed in that context, in accordance
          with its own privacy policy. Data are transmitted to such operators
          only once you click the link, and to the extent resulting from the
          operation of your browser (e.g. your IP address and, depending on
          your browser settings, the address of the referring page).
        </Clause>
        <Clause n="6.3">
          The Controller has no influence over the content of external websites
          or over the processing of personal data by their operators and, to
          the extent permitted by law, accepts no responsibility for them. You
          are advised to read the privacy policies of those operators.
        </Clause>
      </>
    ),
  },
  {
    id: "recipients",
    number: "7.",
    title: "Recipients of personal data",
    content: (
      <>
        <Clause n="7.1">
          The Controller does not sell or rent your personal data, and does not
          make them available to third parties for their own marketing
          purposes.
        </Clause>
        <Clause n="7.2">
          Personal data may be disclosed to the following recipients, only to
          the extent necessary for the purposes described in this Policy:
          <ClauseList>
            <li>
              {hostingProvider} – hosting and delivery of the Website
              (processor);
            </li>
            <li>
              {emailDeliveryProvider}, with its registered office in Singapore
              – delivery of messages sent through the contact form (processor),
              using infrastructure located in the United States of America;
            </li>
            <li>
              providers of the email services (including email forwarding
              services) used by the Controller to receive, store and send
              correspondence (processors);
            </li>
            <li>
              persons and entities providing legal or other professional
              services to the Controller and bound by a duty of
              confidentiality, where this is necessary to establish, exercise
              or defend legal claims;
            </li>
            <li>
              public authorities and other entities authorised under applicable
              law, where the Controller is legally obliged to disclose the
              data.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="7.3">
          Processors process personal data on behalf of the Controller on the
          basis of agreements referred to in Article 28 of the GDPR (including
          terms of service incorporating data processing agreements), and only
          in accordance with the Controller’s instructions.
        </Clause>
      </>
    ),
  },
  {
    id: "transfers",
    number: "8.",
    title: "Transfers outside the European Economic Area",
    content: (
      <>
        <Clause n="8.1">
          In connection with the use of the services referred to in Section
          7.2(a)–(c), personal data may be transferred to countries outside the
          European Economic Area (“<strong>third countries</strong>”), in
          particular to the United States of America and Singapore.
        </Clause>
        <Clause n="8.2">
          Such transfers take place on the basis of:
          <ClauseList>
            <li>
              Commission Implementing Decision (EU) 2023/1795 of 10 July 2023
              on the adequate level of protection of personal data under the
              EU-US Data Privacy Framework (Article 45 of the GDPR), in respect
              of recipients certified under that framework (including Vercel
              Inc.); and/or
            </li>
            <li>
              the standard contractual clauses adopted by Commission
              Implementing Decision (EU) 2021/914 of 4 June 2021 (Article
              46(2)(c) of the GDPR), in respect of other recipients (including
              EmailJS Pte. Ltd.).
            </li>
          </ClauseList>
        </Clause>
        <Clause n="8.3">
          You may obtain information about the safeguards applied, including a
          copy of them or information on where they have been made available,
          by contacting the Controller (
          <SectionLink to="controller">Section 2.2</SectionLink>).
        </Clause>
        <Clause n="8.4">
          In third countries, public authorities may have powers to access
          personal data that differ from those applicable in the European
          Union.
        </Clause>
      </>
    ),
  },
  {
    id: "retention",
    number: "9.",
    title: "Retention periods",
    content: (
      <>
        <Clause n="9.1">
          Personal data are stored for no longer than is necessary for the
          purposes for which they are processed, and in particular:
          <ClauseList>
            <li>
              the technical data referred to in{" "}
              <SectionLink to="visiting">Section 3</SectionLink> – for the
              period indicated in Section 3.5;
            </li>
            <li>
              the correspondence data referred to in{" "}
              <SectionLink to="contact">Section 4</SectionLink> – for the time
              necessary to handle your inquiry and to conduct the
              correspondence, and thereafter, for evidential purposes, for 3
              years from the end of the calendar year in which the
              correspondence ended;
            </li>
            <li>
              the data processed by {emailDeliveryProvider} in connection with
              the delivery of a message – for the period resulting from the
              policies of that provider (as at the date of this Policy, as a
              rule up to 30 days);
            </li>
            <li>
              the data processed on the basis of Article 6(1)(b) of the GDPR –
              until the steps taken prior to entering into the contract are
              completed and, if a contract is concluded, for the period
              necessary for its performance and required by law;
            </li>
            <li>
              the information stored on your device (
              <SectionLink to="device-storage">Section 5</SectionLink>) – until
              you delete it.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="9.2">
          Where data are processed on the basis of the Controller’s legitimate
          interests, the processing ends earlier if you raise an effective
          objection (Section 10.1(f)).
        </Clause>
        <Clause n="9.3">
          The above periods may be extended where this is necessary for the
          establishment, exercise or defence of legal claims (until they are
          finally resolved or become time-barred) or where required by law.
          After the retention period expires, the data are deleted or
          anonymised.
        </Clause>
      </>
    ),
  },
  {
    id: "your-rights",
    number: "10.",
    title: "Your rights",
    content: (
      <>
        <Clause n="10.1">
          Under the conditions set out in the GDPR, you have the right to:
          <ClauseList>
            <li>
              access your personal data and obtain a copy of them (Article 15
              of the GDPR);
            </li>
            <li>
              rectification of inaccurate data and completion of incomplete
              data (Article 16 of the GDPR);
            </li>
            <li>erasure of your data (Article 17 of the GDPR);</li>
            <li>restriction of processing (Article 18 of the GDPR);</li>
            <li>
              data portability, to the extent that the processing is based on
              a contract and is carried out by automated means (Article 20 of
              the GDPR);
            </li>
            <li>
              object at any time, on grounds relating to your particular
              situation, to processing based on Article 6(1)(f) of the GDPR
              (Article 21(1) of the GDPR); in such a case, the Controller will
              no longer process the data unless the Controller demonstrates
              compelling legitimate grounds for the processing which override
              your interests, rights and freedoms, or unless the processing is
              necessary for the establishment, exercise or defence of legal
              claims;
            </li>
            <li>
              withdraw your consent at any time, where processing is based on
              consent, without affecting the lawfulness of processing based on
              consent before its withdrawal (Article 7(3) of the GDPR). As at
              the date of this Policy, the Controller does not process personal
              data in connection with the Website on the basis of consent.
            </li>
          </ClauseList>
        </Clause>
        <Clause n="10.2">
          You also have the right to lodge a complaint with a supervisory
          authority (Article 77 of the GDPR), in particular in the Member State
          of your habitual residence, place of work or place of the alleged
          infringement. In Poland, the supervisory authority is the President
          of the Personal Data Protection Office (Prezes Urzędu Ochrony Danych
          Osobowych), ul. Stawki 2, 00-193 Warsaw, Poland,{" "}
          <ExternalLink href={supervisoryAuthorityUrl} />.
        </Clause>
        <Clause n="10.3">
          To exercise your rights, contact the Controller as described in{" "}
          <SectionLink to="controller">Section 2.2</SectionLink>. The
          Controller will provide information on action taken on your request
          without undue delay and in any event within one month of receipt of
          the request. That period may be extended by two further months where
          necessary, taking into account the complexity and number of the
          requests; the Controller will inform you of any such extension within
          one month of receipt of the request, together with the reasons for
          the delay (Article 12(3) of the GDPR).
        </Clause>
        <Clause n="10.4">
          Where the Controller has reasonable doubts concerning the identity of
          the person making the request, the Controller may request the
          provision of additional information necessary to confirm it (Article
          12(6) of the GDPR).
        </Clause>
        <Clause n="10.5">
          Information and actions are provided free of charge. Where requests
          are manifestly unfounded or excessive, in particular because of their
          repetitive character, the Controller may either charge a reasonable
          fee taking into account the administrative costs, or refuse to act on
          the request (Article 12(5) of the GDPR).
        </Clause>
        <Clause n="10.6">
          The rights referred to above are subject to the conditions and
          exceptions provided for in the GDPR; in particular, the right to
          obtain a copy of the data shall not adversely affect the rights and
          freedoms of others (Article 15(4) of the GDPR), and the right to
          erasure does not apply to the extent that processing is necessary for
          the establishment, exercise or defence of legal claims (Article
          17(3)(e) of the GDPR).
        </Clause>
        <Clause n="10.7">
          The Controller has no access to the information stored in your
          browser (<SectionLink to="device-storage">Section 5</SectionLink>)
          and is unable to link it to you. In accordance with Article 11 of the
          GDPR, the Controller is not obliged to obtain additional information
          in order to identify you for the sole purpose of complying with the
          GDPR; you can manage that information yourself as described in
          Section 5.6.
        </Clause>
      </>
    ),
  },
  {
    id: "voluntary",
    number: "11.",
    title: "Voluntary provision of data",
    content: (
      <>
        <Clause n="11.1">
          Providing personal data is voluntary and is not a statutory or
          contractual requirement. Providing an email address is necessary to
          send a message through the contact form and to receive a reply;
          failure to provide it will make sending the message impossible.
        </Clause>
        <Clause n="11.2">
          The processing of the technical data referred to in{" "}
          <SectionLink to="visiting">Section 3</SectionLink> is a technical
          prerequisite for displaying the Website.
        </Clause>
      </>
    ),
  },
  {
    id: "automated-decisions",
    number: "12.",
    title: "Automated decision-making and profiling",
    content: (
      <Clause n="12.1">
        The Controller does not make decisions based solely on automated
        processing, including profiling, which produce legal effects concerning
        you or similarly significantly affect you (Article 22 of the GDPR), and
        does not profile Users.
      </Clause>
    ),
  },
  {
    id: "security",
    number: "13.",
    title: "Security",
    content: (
      <>
        <Clause n="13.1">
          Taking into account the state of the art, the costs of
          implementation and the nature, scope, context and purposes of
          processing, as well as the risks to the rights and freedoms of
          natural persons, the Controller implements appropriate technical and
          organisational measures to ensure a level of security appropriate to
          the risk (Article 32 of the GDPR). In particular, communication
          between your browser and the Website is encrypted using the TLS
          protocol (HTTPS), and on the Controller’s side access to
          correspondence is limited to the Controller.
        </Clause>
        <Clause n="13.2">
          No method of transmission over the Internet or of electronic storage
          is completely secure. Accordingly, to the extent permitted by law,
          the Controller cannot guarantee the absolute security of data
          transmitted over the Internet. This does not affect the Controller’s
          obligations under the GDPR, including the obligations relating to the
          notification of personal data breaches (Articles 33 and 34 of the
          GDPR).
        </Clause>
        <Clause n="13.3">
          The contact form is not intended for sending passwords, payment card
          details, identity document numbers or any other confidential
          information.
        </Clause>
      </>
    ),
  },
  {
    id: "children",
    number: "14.",
    title: "Children",
    content: (
      <Clause n="14.1">
        The Website is not directed at children. The Controller does not
        knowingly collect personal data of persons under the age of 16. Persons
        under the age of 16 should not send personal data through the contact
        form without the consent of a parent or legal guardian. If the
        Controller becomes aware that such data have been provided without such
        consent, the Controller may delete them.
      </Clause>
    ),
  },
  {
    id: "international-users",
    number: "15.",
    title: "Users outside the European Economic Area",
    content: (
      <>
        <Clause n="15.1">
          The Website is operated by the Controller from the Republic of
          Poland, and the processing of personal data is governed by the GDPR
          and Polish law. To the extent permitted by law, the Controller makes
          no representation that the Website complies with the laws of any
          other jurisdiction.
        </Clause>
        <Clause n="15.2">
          The Controller does not sell personal information and does not share
          it for cross-context behavioural advertising, as those terms are
          understood under the laws of the states of the United States of
          America (including the California Consumer Privacy Act). As the
          Website does not track Users across websites, “Do Not Track” and
          Global Privacy Control signals do not change the way it operates; no
          such tracking takes place, whether or not such signals are sent.
        </Clause>
      </>
    ),
  },
  {
    id: "changes",
    number: "16.",
    title: "Changes to this Policy",
    content: (
      <>
        <Clause n="16.1">
          The Controller may amend this Policy, in particular in the event of
          changes in the law, in the guidelines of supervisory authorities, in
          the technologies used or in the functionality of the Website (for
          example, the introduction of new tools or service providers).
        </Clause>
        <Clause n="16.2">
          The amended Policy will be published on this page together with an
          updated date and version number, and will take effect upon
          publication unless stated otherwise. Where a change requires your
          consent under applicable law, the Controller will request it
          separately. Previous versions of the Policy are available on request.
        </Clause>
      </>
    ),
  },
  {
    id: "final",
    number: "17.",
    title: "Final provisions",
    content: (
      <>
        <Clause n="17.1">
          This Policy is available in Polish and English. In the event of any
          discrepancy between the language versions, the Polish version
          prevails.
        </Clause>
        <Clause n="17.2">
          In matters not regulated by this Policy, the provisions of the GDPR
          and of Polish law apply, in particular the Polish Act of 10 May 2018
          on the Protection of Personal Data and the ECL.
        </Clause>
        <Clause n="17.3">
          Should any provision of this Policy be found invalid or ineffective,
          this shall not affect the validity or effectiveness of the remaining
          provisions.
        </Clause>
        <Clause n="17.4">
          The headings used in this Policy are for convenience only and do not
          affect its interpretation.
        </Clause>
      </>
    ),
  },
];

function PrivacyPolicyEn() {
  return (
    <PolicyDocument
      title="Privacy Policy"
      meta={
        <p>
          Version {version} · Effective from{" "}
          <time dateTime={effectiveDate}>
            {formatPolicyDate(effectiveDate, locale)}
          </time>{" "}
          · Last updated{" "}
          <time dateTime={lastUpdatedDate}>
            {formatPolicyDate(lastUpdatedDate, locale)}
          </time>
        </p>
      }
      summaryTitle="Key points at a glance"
      summary={
        <>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-muted-foreground">
            <li>
              The controller of your personal data is {controllerName}, who can
              be contacted at <EmailLink email={contactEmail} />.
            </li>
            <li>
              The Website uses no cookies of its own and no analytics,
              advertising or tracking tools, and does not embed social media
              plugins.
            </li>
            <li>
              Personal data are processed only technically, when the hosting
              provider delivers the Website to your browser, and when you
              contact the Controller, in particular through the contact form.
            </li>
            <li>
              Your interface settings (language, graphics, sound) are stored
              only in your own browser and are not sent to anyone.
            </li>
            <li>
              You have the rights described in{" "}
              <SectionLink to="your-rights">Section 10</SectionLink>, including
              the right to lodge a complaint with the President of the Personal
              Data Protection Office.
            </li>
          </ul>
          <p className="text-muted-foreground">
            This summary is provided for convenience only. In the event of any
            inconsistency, the full text of the Policy below prevails.
          </p>
        </>
      }
      tableOfContentsTitle="Contents"
      sections={sections}
    />
  );
}

export default PrivacyPolicyEn;

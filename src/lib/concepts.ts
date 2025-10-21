export interface Concept {
  number: number;
  title: string;
  quote: string;
  author: string;
  content: string;
  imagePath: string;
}

// Parse frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2];
  
  const frontmatter: Record<string, string> = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body };
}

// Convert markdown body to HTML
function markdownToHtml(markdown: string): string {
  return markdown
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`)
    .join('\n');
}

// Load a single concept from markdown file
async function loadConcept(filename: string, language: string = 'fi'): Promise<Concept | null> {
  try {
    const response = await fetch(`/content/${language}/concepts/${filename}`);
    if (!response.ok) {
      if (language !== 'fi') {
        return loadConcept(filename, 'fi'); // Fallback to Finnish
      }
      throw new Error(`Failed to load ${filename}`);
    }
    
    const content = await response.text();
    const { frontmatter, body } = parseFrontmatter(content);
    
    return {
      number: parseInt(frontmatter.number) || 0,
      title: frontmatter.title || '',
      quote: frontmatter.quote || '',
      author: frontmatter.author || '',
      content: markdownToHtml(body),
      imagePath: frontmatter.image || ''
    };
  } catch (error) {
    console.error(`Error loading concept ${filename}:`, error);
    return null;
  }
}

// Load all concepts from markdown files
export async function getConcepts(language: string = 'fi'): Promise<Concept[]> {
  const conceptFiles = [
    'vastakkaisuus.md',
    'ilmeneminen.md', 
    'keho.md',
    'yhteys.md',
    'rytmi.md',
    'tila.md',
    'virtaus.md'
  ];
  
  const concepts = await Promise.all(
    conceptFiles.map(file => loadConcept(file, language))
  );
  
  return concepts
    .filter((concept): concept is Concept => concept !== null)
    .sort((a, b) => a.number - b.number);
}

// Legacy function for backward compatibility (hardcoded Finnish data)
export function getConceptsLegacy(): Concept[] {
  return [
    {
      number: 1,
      title: "Vastakkaisuus",
      quote: "Vahvuus on erilaisuudessa, ei samankaltaisuudessa.",
      author: "Stephen Covey",
      content: `<p>Kaksi erilaista energiaa kohtaavat.</p>
      
      <p>Toinen liikkuu, toinen pysähtyy. Toinen etsii vapautta, toinen rakennetta. Nämä vastakkaisuudet eivät taistele keskenään – ne tanssivat.</p>
      
      <p>Juuri tästä jännitteestä syntyy liike. Kun vastakohdat harmonisoituvat, tanssi herää eloon. Se ei ole tasaista tai ennakoitavaa. Se on dynaaminen, elävä kokonaisuus.</p>
      
      <p>Improtangossa rakenteen ja kaaoksen välinen vuoropuhelu pitää tanssin koossa. Rakenne antaa puitteet, jotta luovuus voi kukoistaa. Ilman tätä vastakkaisuutta tanssi olisi vain liikettä.</p>`,
      imagePath: "/images/concepts/1.webp"
    },
    {
      number: 2,
      title: "Ilmeneminen",
      quote: "Ainoa tapa saada muutoksessa järkeä on sukeltaa siihen, liikkua sen mukana ja liittyä tanssiin.",
      author: "Alan Watts",
      content: `<p>Tanssi ei synny suunnitelmasta. Se ilmenee.</p>
      
      <p>Et johda. Et seuraa. Te molemmat luotte. Jokaisessa hetkessä.</p>
      
      <p>Kun luovut kiinteistä rooleista, jotain uutta avautuu. Kumpikin pääsee mukaan luomisen prosessiin. Tanssi ei ole kenenkään yksin – se syntyy yhteytenne sujuvuudesta.</p>
      
      <p>Tämä on jatkuvaa energianvaihtoa. Impulsseja, reaktioita, vastauksia. Ei etukäteen suunniteltua, ei opeteltua. Orgaanista.</p>
      
      <p>Luovuus ei synny tyhjiössä. Se syntyy tässä jaetussa tilassa, jossa kumppanit navigoivat dialogia yhdessä. Etsivät. Kokeilevat. Löytävät. Kumppanisi tuo jotain, mitä et voi ennakoida – ja juuri se ruokkii yhteistä luovuuttanne.</p>
      
      <p>Kun uskallat päästää irti kontrollin tarpeesta, löydät jotain odottamatonta. Ainutlaatuisen tanssin, joka voi syntyä vain hetkessä. Yhdessä.</p>`,
      imagePath: "/images/concepts/2.webp"
    },
    {
      number: 3,
      title: "Keho",
      quote: "Keho on kotini, sanojeni pyhäkkö.",
      author: "Patti Smith",
      content: `<p>Keho puhuu ennen sanoja.</p>
      
      <p>Se on kanava, joka välittää ajatusten ja tunteiden hienovaraiset liikkeet. Improtangossa oppii lukemaan kehon kieltä – sekä omaa että kumppanin.</p>
      
      <p>Tämä vaatii läsnäoloa. Uskallusta kuunnella mitä keho kertoo. Luottamusta siihen, että keholla on viisautta, joka ylittää päättelyn.</p>
      
      <p>Kun kehot keskustelevat, syntyy syvempi yhteys kuin pelkät sanat voisivat luoda. Tämä kommunikaatio on suoraa, välitöntä, täysin aitoa.</p>`,
      imagePath: "/images/concepts/3.webp"
    },
    {
      number: 4,
      title: "Yhteys",
      quote: "Muistaakseni mitään aidosti tärkeitä hetkiä elämässäni, kaikissa oli läsnä tunne yhteydestä.",
      author: "Arianna Huffington",
      content: `<p>Yhteys on enemmän kuin kosketus.</p>
      
      <p>Se syntyy, kun kumpikin putoaa hetkeen täysin. Kun oma ego väistyy ja tilalle tulee jotain jaettua.</p>
      
      <p>Tässä tilassa kummankin liike vaikuttaa toiseen. Energiat vuorottelevat ja sekoittuvat. Te luotte jotain, mitä kumpikaan ei voisi luoda yksin.</p>
      
      <p>Yhteys vaatii rohkeutta. Uskallusta päästää toinen lähelle. Uskallusta olla haavoittuvainen.</p>
      
      <p>Mutta kun se tapahtuu, kun löydätte sen jaetun tilan, tanssi muuttuu meditaatioksi. Te olette yhdessä jossain, jossa aika ei kulje.</p>`,
      imagePath: "/images/concepts/4.webp"
    },
    {
      number: 5,
      title: "Rytmi",
      quote: "Energia liikkuu aaltoina. Aallot liikkuvat kuvioittain. Kuviot liikkuvat rytmeissä. Ihminen on juuri sellainen; energiaa, aaltoja, kuvioita, rytmejä. Ei enempää. Ei vähempää. Tanssia.",
      author: "Gabrielle Roth",
      content: `<p>Rytmi ei ole vain musiikissa. Se on teissä.</p>
      
      <p>Se on jännitteen rakentamista ja purkamista. Painon siirtoa. Hengitystä. Kahden ihmisen pulssien kohtaamista.</p>
      
      <p>Kun tanssitte yhdessä, luotte jatkuvasti muuttuvia jännitteitä. Rakennatte. Vapautatte. Tämä luo draamaa, tunteen intensiteettiä, elämää.</p>
      
      <p>Rytmi syntyy myös siitä, kun siirrytte yksilöllisestä tasapainosta yhteiseen tasapainoon. Yhdessä löydätte rytmin, jossa yksilöllisyys sulautuu yhtenäisyyteen.</p>
      
      <p>Tämä yhteinen pulssi syventää yhteyttä. Se luo luottamusta. Se vie tanssia eteenpäin.</p>`,
      imagePath: "/images/concepts/5.webp"
    },
    {
      number: 6,
      title: "Tila",
      quote: "Tila ei ole tyhjää. Se on täynnä mahdollisuuksia.",
      author: "Tadao Ando",
      content: `<p>Jokainen tila kertoo tarinan.</p>
      
      <p>Se muokkaa liikettä. Se vaikuttaa tunnelmaan. Se määrittelee, millainen tanssi voi syntyä.</p>
      
      <p>Improtangossa opitte lukemaan tilaa. Tunnistamaan sen antamat mahdollisuudet. Käyttämään hyväksi sen geometriaa, sen energiaa, sen erityispiirteitä.</p>
      
      <p>Tila ei ole vain fyysinen alue. Se on myös emotionaalinen ja energeettinen ympäristö, jonka te luotte yhdessä.</p>
      
      <p>Kun ymmärrätte tilan voiman, voitte käyttää sitä tarinankerronnan välineenä. Jokainen kulma, jokainen syvyys tuo jotain uutta tanssiin.</p>`,
      imagePath: "/images/concepts/6.webp"
    },
    {
      number: 7,
      title: "Virtaus",
      quote: "Putoaminen rakkauteen ja putoaminen virtaukseen ovat sama asia. Molemmissa menetät itsesi täysin, ja samalla löydät jotain syvempää.",
      author: "Steven Kotler",
      content: `<p>Virtauksessa aika katoaa.</p>
      
      <p>Te olette yhdessä jossain syvemmässä. Mielen hälinä hiljenee. Jäljelle jää vain liike, henki, yhteys.</p>
      
      <p>Tämä on Improtangon päämäärä. Tila, jossa yksilöllisyys ja yhteisyys sulautuvat. Jossa jokainen liike syntyy spontaanisti, mutta samalla täydellisessä harmoniassa kumppanin kanssa.</p>
      
      <p>Virtaus ei ole jotain, mitä voitte pakottaa. Se syntyy, kun kaikki muut kuusi käsitettä yhdistyvät. Kun vastakkaisuudet tanssivat, kun ilmeneminen on vapaata, kun kehot keskustelevat, kun yhteys on aito, kun rytmi sykkii ja kun tila tukee.</p>
      
      <p>Silloin tapahtuu jotain maagista. Te luotte tanssin, joka on enemmän kuin osiensa summa.</p>`,
      imagePath: "/images/concepts/7.webp"
    }
  ];
}

export async function getConceptByNumber(number: number, language: string = 'fi'): Promise<Concept | undefined> {
  const concepts = await getConcepts(language);
  return concepts.find(concept => concept.number === number);
}

// Convert to use image instead of imagePath for consistency with ConceptSection component
export interface ConceptData {
  number: number;
  title: string;
  quote: string;
  author: string;
  image: string;
  content: string;
}

export async function getConceptsAsConceptData(language: string = 'fi'): Promise<ConceptData[]> {
  const concepts = await getConcepts(language);
  return concepts.map(concept => ({
    ...concept,
    image: concept.imagePath,
    content: concept.content
  }));
}

// Load concept intro from markdown file
export async function getConceptIntro(language: string = 'fi'): Promise<{ quote: string; author: string; content: string }> {
  try {
    const response = await fetch(`/content/${language}/concepts/intro.md`);
    if (!response.ok) {
      if (language !== 'fi') {
        return getConceptIntro('fi'); // Fallback to Finnish
      }
      throw new Error('Failed to load intro');
    }
    
    const content = await response.text();
    
    // Extract quote and author from blockquote
    const quoteMatch = content.match(/> (.+)\n>\n> — (.+)/);
    const quote = quoteMatch ? quoteMatch[1] : "Meidän pitäisi pitää jokaista päivää menetettynä, jona emme ole tanssineet ainakin kerran.";
    const author = quoteMatch ? quoteMatch[2] : "Friedrich Nietzsche";
    
    // Extract main content (everything after the blockquote)
    const mainContent = content
      .replace(/^# .+\n\n/, '') // Remove title
      .replace(/> .+\n>\n> — .+\n\n/, '') // Remove blockquote
      .trim();
    
    return {
      quote,
      author,
      content: mainContent
    };
  } catch (error) {
    console.error('Error loading concept intro:', error);
    // Fallback to hardcoded content
    return {
      quote: "Meidän pitäisi pitää jokaista päivää menetettynä, jona emme ole tanssineet ainakin kerran.",
      author: "Friedrich Nietzsche",
      content: `Seitsemän peruskäsitettä muodostavat Improtangon sydämen. Ne eivät ole sääntöjä vaan avaimia – tapoja ymmärtää, mitä tapahtuu kun kaksi ihmistä luo tanssia yhdessä, hetkessä.

Jokainen käsite avaa oven syvempään ymmärrykseen. Yhdessä ne luovat kehyksen paritanssille, jossa molemmat voivat vaikuttaa, luoda ja löytää jotain aidosti uutta.`
    };
  }
}
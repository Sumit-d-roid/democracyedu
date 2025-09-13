import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const glossary = [
  {
    term: {
      en: 'Constitution',
      ne: 'संविधान'
    },
    definition: {
      en: 'The fundamental law that establishes the government, its structure, and the rights of citizens.',
      ne: 'सरकार, यसको संरचना, र नागरिकका अधिकारहरू निर्धारण गर्ने आधारभूत कानुन।'
    }
  },
  {
    term: {
      en: 'Fundamental Rights',
      ne: 'मौलिक अधिकारहरू'
    },
    definition: {
      en: 'Basic rights guaranteed to all citizens by the constitution.',
      ne: 'संविधानले सबै नागरिकलाई प्रत्याभूत गरिएका आधारभूत अधिकारहरू।'
    }
  },
  {
    term: {
      en: 'Federalism',
      ne: 'संघीयता'
    },
    definition: {
      en: 'A system of government in which power is divided between a central authority and constituent regions.',
      ne: 'शक्ति केन्द्रिय सरकार र प्रदेशहरूमा विभाजन गरिएको शासन प्रणाली।'
    }
  },
  {
    term: {
      en: 'Democracy',
      ne: 'लोकतन्त्र'
    },
    definition: {
      en: 'A system of government by the whole population, typically through elected representatives.',
      ne: 'जनताको प्रतिनिधिहरू मार्फत शासन गर्ने प्रणाली।'
    }
  },
  {
    term: {
      en: 'Judiciary',
      ne: 'न्यायपालिका'
    },
    definition: {
      en: 'The branch of government responsible for interpreting laws and administering justice.',
      ne: 'कानुनको व्याख्या र न्याय प्रशासन गर्ने सरकारी निकाय।'
    }
  },
  {
    term: {
      en: 'Executive',
      ne: 'कार्यपालिका'
    },
    definition: {
      en: 'The branch of government responsible for implementing laws and running the administration.',
      ne: 'कानुन कार्यान्वयन र प्रशासन सञ्चालन गर्ने सरकारी निकाय।'
    }
  },
  {
    term: {
      en: 'Legislature',
      ne: 'व्यवस्थापिका'
    },
    definition: {
      en: 'The branch of government responsible for making laws.',
      ne: 'कानुन निर्माण गर्ने सरकारी निकाय।'
    }
  },
  {
    term: {
      en: 'Citizenship',
      ne: 'नागरिकता'
    },
    definition: {
      en: 'The status of being a legal member of a country, with associated rights and duties.',
      ne: 'देशको कानुनी सदस्यको हैसियत, अधिकार र कर्तव्यसहित।'
    }
  },
  {
    term: {
      en: 'Amendment',
      ne: 'संशोधन'
    },
    definition: {
      en: 'A formal change or addition to the constitution.',
      ne: 'संविधानमा औपचारिक परिवर्तन वा थप।'
    }
  },
  {
    term: {
      en: 'Directive Principles',
      ne: 'निर्देशक सिद्धान्तहरू'
    },
    definition: {
      en: 'Guidelines for the government to follow in making laws and policies.',
      ne: 'कानुन र नीति निर्माणमा सरकारलाई मार्गदर्शन गर्ने सिद्धान्तहरू।'
    }
  }
];

export default function Glossary() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const { language } = useLanguage();
  const filtered = glossary.filter(item =>
    item.term[language].toLowerCase().includes(search.toLowerCase()) ||
    item.definition[language].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="max-w-2xl mx-auto my-8 p-6 border rounded bg-background">
      <h2 className="text-xl font-bold mb-4">{t('glossary.title') || 'Glossary of Constitutional Terms'}</h2>
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded"
        placeholder={t('glossary.search') || 'Search terms...'}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul>
        {filtered.length === 0 ? (
          <li className="text-muted">{t('glossary.noresults') || 'No matching terms found.'}</li>
        ) : (
          filtered.map(item => (
            <li key={item.term[language]} className="mb-4">
              <span className="font-semibold text-primary">{item.term[language]}</span>: {item.definition[language]}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

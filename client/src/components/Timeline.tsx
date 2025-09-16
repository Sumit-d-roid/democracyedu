import { useLanguage } from '@/contexts/LanguageContext';

const timelineEvents = [
  {
    year: 1948,
    title: 'First Constitution of Nepal',
    description: 'Nepal promulgates its first constitution, the Government of Nepal Act.',
  },
  {
    year: 1951,
    title: 'Interim Government',
    description: 'Interim government formed after the end of the Rana regime.',
  },
  {
    year: 1959,
    title: 'Parliamentary Constitution',
    description: 'Nepal adopts a parliamentary constitution.',
  },
  {
    year: 1962,
    title: 'Panchayat Constitution',
    description: 'Introduction of the Panchayat system and new constitution.',
  },
  {
    year: 1990,
    title: 'Constitutional Monarchy',
    description: 'Restoration of multiparty democracy and constitutional monarchy.',
  },
  {
    year: 2007,
    title: 'Interim Constitution',
    description: 'Interim constitution after the end of monarchy.',
  },
  {
    year: 2015,
    title: 'Current Constitution',
    description:
      'Nepal promulgates its new constitution, establishing a federal democratic republic.',
  },
];

export default function Timeline() {
  const { t } = useLanguage();
  return (
    <section className="max-w-3xl mx-auto my-8 p-6 border rounded bg-background">
      <h2 className="text-xl font-bold mb-6">
        {t('timeline.title') || 'Nepal Constitutional Timeline'}
      </h2>
      <div className="relative">
        <div className="border-l-2 border-primary absolute h-full left-6 top-0"></div>
        {timelineEvents.map((event, idx) => (
          <div key={event.year} className="mb-8 flex items-start">
            <div className="w-12 text-center font-bold text-primary text-lg">{event.year}</div>
            <div className="ml-8 p-4 rounded shadow bg-white dark:bg-gray-800">
              <div className="font-semibold text-lg mb-1">{event.title}</div>
              <div className="text-muted mb-1">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

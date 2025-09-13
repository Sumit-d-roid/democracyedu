import Glossary from '@/components/Glossary';
// import Timeline from '@/components/Timeline';
import { useState } from 'react';
function ContactSection() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert('Failed to send message. Please try again later.');
      }
    } catch {
      alert('Network error. Please try again later.');
    }
  }

  return (
    <section className="max-w-2xl mx-auto my-8 p-6 border rounded bg-background">
      <h2 className="text-xl font-bold mb-2">{t('contact.title')}</h2>
      <p className="mb-4">{t('contact.description')}</p>
      {submitted && <div className="mb-4 text-green-600">{t('contact.thankyou')}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder={t('contact.name')}
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder={t('contact.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder={t('contact.message')}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <button type="submit" className="w-full p-2 bg-primary text-primary-foreground rounded font-semibold">
          {t('contact.submit')}
        </button>
      </form>
    </section>
  );
}
import { useLanguage } from '@/contexts/LanguageContext';
function AboutSection() {
  const { t } = useLanguage();
  return (
    <section className="max-w-2xl mx-auto my-8 p-6 border rounded bg-background">
      <h2 className="text-xl font-bold mb-2">{t('about.title')}</h2>
      <p className="mb-2">{t('about.description')}</p>
      <p>{t('about.mission')}</p>
    </section>
  );
}
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
  <AboutSection />
  {/* Glossary removed from homepage. Will be added to a separate page. */}
  {/* <Timeline /> */}
      <ContactSection />
    </main>
  );
}
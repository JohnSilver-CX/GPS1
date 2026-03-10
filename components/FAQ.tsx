import React, { useState } from 'react';

const faqs = [
  {
    question: "Why is Gurukul considered the Best School in Meerut?",
    answer: "Gurukul Public School is setting the Gold Standard as the Best School in Meerut for Academic Excellence. For parents navigating the crucial decision of selecting a primary school, we offer a unique blend of traditional values and modern education with a strict 10:1 student-teacher ratio."
  },
  {
    question: "What is the AI School Curriculum?",
    answer: "We are proud to offer an innovative AI School Curriculum. We provide FREE AI classes for kids, integrating modern technology into our curriculum to prepare our students for the future, making us a pioneering AI school in Meerut."
  },
  {
    question: "Are you among the top 5 schools in Meerut?",
    answer: "Discover the top 5 schools in Meerut, and you will find Gurukul Public School consistently recognized for its holistic primary education, personalized attention, and innovative AI curriculum alongside other esteemed institutions."
  },
  {
    question: "What is the admission process for the 2024-25 session?",
    answer: "The admission process is simple. You can fill out the online admission form available on our website, or visit our campus near Hazari Ka Piyau, Meerut Cantt. After submitting the form, our admission counselor will contact you to schedule a campus tour and interaction."
  },
  {
    question: "What are the age criteria for different classes?",
    answer: "For Playgroup, the child should be 2+ years old. For Nursery, 3+ years; for KG, 4+ years; and for Class 1, 5+ years old."
  },
  {
    question: "Is Gurukul Public School recognized?",
    answer: "Yes, we are a BSA Recognized and UDISE+ Registered institution (Recognition No: MEE09078453699), ensuring we meet all quality education standards."
  },
  {
    question: "What facilities are available for students?",
    answer: "We provide a safe, hygienic, and vibrant campus. Facilities include smart classrooms, a dedicated play area, activity rooms for arts and crafts, and regular health checkups."
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-20 animate-pop-in container mx-auto px-4 max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-display font-bold text-kids-orange">Frequently Asked Questions ❓</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
          Everything you need to know about the best primary school and AI school in Meerut.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`glass-card rounded-3xl overflow-hidden transition-all duration-300 border-2 ${openIndex === index ? 'border-kids-orange shadow-kids-xl' : 'border-transparent hover:border-kids-orange/30'}`}
          >
            <button 
              onClick={() => toggleFaq(index)}
              className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
            >
              <h3 className="text-xl font-display font-bold text-kids-dark dark:text-white pr-8">
                {faq.question}
              </h3>
              <span className={`text-2xl text-kids-orange transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            <div 
              className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center bg-kids-blue/10 dark:bg-kids-midnight p-8 rounded-[3rem] border-4 border-dashed border-kids-blue">
        <h3 className="text-2xl font-display font-bold text-kids-dark dark:text-white mb-4">Still have questions?</h3>
        <p className="text-gray-600 dark:text-gray-400 font-medium mb-6">Our admission team is here to help you.</p>
        <a 
          href="tel:+919412782755" 
          className="inline-block bg-kids-blue text-white px-8 py-3 rounded-full font-bold shadow-fun hover:translate-y-1 transition-all"
        >
          Call Us Now 📞
        </a>
      </div>
    </section>
  );
};

'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { FAQS } from '@/lib/home-data';

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="py-24 bg-bgBase relative">
      <div className="neo-container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="neo-label-sm mb-4">FAQ</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-textPrimary">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`neo-card transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-borderStrong bg-bgElevated' : 'border-borderSubtle bg-bgBase hover:bg-bgElevated'
                }`}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-textPrimary pr-4">{faq.q}</span>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-borderSubtle text-textSecondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <FaChevronDown className="text-sm" />
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-textSecondary leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

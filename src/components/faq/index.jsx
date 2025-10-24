import React, { useState } from 'react';

const faqs = [
  { question: "How can I get started with Sawtar?", answer: "You can get started by booking a free consultation on our website or visiting one of our showrooms." },
  { question: "What is the timeline for completing a project with Sawtar?", answer: "Typically, projects are completed in 45 days post design finalization." },
  { question: "How does the Sawtar interior design process work?", answer: "We follow a six-step process: Meet, Design, Visualize, Finalize, Install, and Move-in." },
  { question: "Can I visit a Sawtar showroom to see your products and designs in person?", answer: "Yes, we have experience centers in multiple cities where you can explore designs." },
  { question: "What are the end-to-end services offered by Sawtar?", answer: "We offer design, manufacturing, delivery, installation, and post-installation support." },
  { question: "Are your designs customisable?", answer: "Yes, all our designs are fully customizable to match your preferences and space." },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2">Find answers to common questions about our services</p>
        </div>

        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg ">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h2>
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left text-gray-500 dark:text-gray-400 hover:bg-gray-100 transition-all"
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </h2>

              <div
                className={`px-6 py-4 text-sm text-gray-600 transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'block' : 'hidden'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;

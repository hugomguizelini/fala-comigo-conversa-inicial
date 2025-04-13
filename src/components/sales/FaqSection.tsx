
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI marketing analysis work?",
    answer: "Our platform uses advanced machine learning algorithms to analyze your marketing data across multiple channels. It identifies patterns, trends, and anomalies that human analysts might miss, then provides actionable recommendations based on this analysis. The system continuously learns from your data and results to improve its recommendations over time."
  },
  {
    question: "Do I need technical knowledge to use Insighor.AI?",
    answer: "Not at all. Insighor.AI is designed with a user-friendly interface that doesn't require technical expertise. Our intuitive dashboards and plain-language recommendations make it easy for marketers of all technical levels to understand and implement the insights provided."
  },
  {
    question: "Can I integrate Insighor.AI with my existing marketing tools?",
    answer: "Yes, Insighor.AI seamlessly integrates with most popular marketing platforms including Google Analytics, Facebook Ads, Google Ads, HubSpot, Mailchimp, and many others. Our API also allows for custom integrations if needed. This enables you to centralize all your marketing data and get holistic insights across your entire marketing ecosystem."
  },
  {
    question: "How secure is my marketing data with Insighor.AI?",
    answer: "Security is our top priority. We use bank-level encryption for data transmission and storage, implement strict access controls, and are compliant with major data protection regulations including GDPR and CCPA. Your data is never shared with third parties, and you maintain full ownership of all your information at all times."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Absolutely. There are no long-term contracts, and you can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your current billing period. We also offer a 14-day free trial for all plans with no credit card required, so you can try before you commit."
  },
  {
    question: "What kind of support do you offer?",
    answer: "All plans include email support with guaranteed response times. Professional and Enterprise plans include priority support with faster response times. Enterprise plans also include a dedicated account manager and 24/7 support. Additionally, all customers have access to our comprehensive knowledge base, video tutorials, and regular webinars."
  },
];

const FaqSection: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-purple-900/20">
          <AccordionTrigger className="text-left font-medium text-white hover:text-purple-400 py-5">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-300 pb-5">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqSection;

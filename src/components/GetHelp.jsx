// pages/dashboard/HelpPage.jsx
import { Headset, Mail, Phone, MessageSquare, Clock } from 'lucide-react';

const GetHelp = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our customer service team",
      details: "1-800-HORIZON (1-800-467-4966)",
      available: "24/7"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a message and we'll respond within 24 hours",
      details: "support@horizon.com",
      available: "Mon-Fri, 9am-5pm EST"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant messaging with a support agent",
      details: "Available through online banking portal",
      available: "Mon-Fri, 8am-8pm EST"
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password through the 'Forgot Password' link on the login page or in your account settings."
    },
    {
      question: "What should I do if my card is lost or stolen?",
      answer: "Immediately call our 24/7 support line at 1-800-HORIZON to report it. We'll cancel your card and issue a replacement."
    },
    {
      question: "How can I update my contact information?",
      answer: "Log in to your online banking and navigate to Settings > Personal Information to update your details."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Get Help</h1>
        <p className="mt-2 text-lg text-gray-600">
          We're here to help you with any questions or issues you may have.
        </p>
      </div>

      {/* Contact Methods */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Headset className="h-6 w-6 text-blue-600 mr-2" />
          Contact Support
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <method.icon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 ml-3">{method.title}</h3>
              </div>
              <p className="text-gray-600 mb-2">{method.description}</p>
              <p className="font-medium text-gray-900">{method.details}</p>
              <div className="flex items-center text-sm text-gray-500 mt-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{method.available}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-blue-600 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support Form */}
      <section>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
          <form className="space-y-5">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option>Account Inquiry</option>
                <option>Card Issue</option>
                <option>Transaction Problem</option>
                <option>Technical Support</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default GetHelp;

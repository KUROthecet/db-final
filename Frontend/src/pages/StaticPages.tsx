
import React from 'react';

const PageHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="bg-white py-16 border-b border-gray-100 mb-12">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-tlj-charcoal mb-4">{title}</h1>
      <p className="text-gray-500 font-light text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  </div>
);

export const About = () => (
  <div className="min-h-screen bg-tlj-cream pb-20">
    <PageHeader title="Our Story" subtitle="Baking with passion and tradition since 2009." />
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-600 leading-relaxed text-lg font-light">
        <p>
          Pane e Amore started as a small family kitchen with a big dream: to bring authentic, artisan baking to our community. We believe that the secret to great bread lies in time, patience, and the finest natural ingredients.
        </p>
        <p>
          Our master bakers arrive before dawn to mix, knead, and shape every loaf by hand. We use long fermentation processes to ensure deep flavor and perfect texture. From our signature sourdough to our delicate pastries, everything is crafted to bring a smile to your face.
        </p>
        <p>
          Today, we are proud to serve thousands of happy customers, but our mission remains the same: to bake the world a better place, one loaf at a time.
        </p>
      </div>
    </div>
  </div>
);

export const Contact = () => (
  <div className="min-h-screen bg-tlj-cream pb-20">
    <PageHeader title="Contact Us" subtitle="We'd love to hear from you. Get in touch!" />
    <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-tlj-green mb-6">Send us a message</h3>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" />
          <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" />
          <textarea rows={4} placeholder="How can we help?" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green"></textarea>
          <button className="w-full py-3 bg-tlj-green text-white font-bold rounded-lg hover:bg-tlj-charcoal transition-colors">Send Message</button>
        </form>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-xl font-bold text-tlj-green mb-4">Visit Us</h3>
           <p className="text-gray-600">No 1 Dai Co Viet, Hai Ba Trung<br/>Ha Noi, Vietnam</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-xl font-bold text-tlj-green mb-4">Opening Hours</h3>
           <div className="space-y-2 text-gray-600">
             <div className="flex justify-between"><span>Mon - Fri</span><span>7:00 AM - 9:00 PM</span></div>
             <div className="flex justify-between"><span>Sat - Sun</span><span>8:00 AM - 10:00 PM</span></div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export const Policy = () => (
  <div className="min-h-screen bg-tlj-cream pb-20">
    <PageHeader title="Privacy Policy" subtitle="Transparency and trust are at our core." />
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-600 leading-relaxed">
        <h3 className="text-xl font-bold text-tlj-green">Data Collection</h3>
        <p>
          We collect only the information necessary to process your orders and improve your experience. This includes your name, contact details, and delivery address. We do not store your credit card information directly; all payments are processed through secure third-party gateways.
        </p>
        <h3 className="text-xl font-bold text-tlj-green">Data Usage</h3>
        <p>
          Your data is used solely for order fulfillment, customer support, and, if you opt-in, to keep you updated on our latest treats and offers. We never sell your personal information to third parties.
        </p>
        <h3 className="text-xl font-bold text-tlj-green">Cookies</h3>
        <p>
          Our website uses cookies to remember your cart items and preferences. You can disable cookies in your browser settings, though this may affect some site functionality.
        </p>
      </div>
    </div>
  </div>
);

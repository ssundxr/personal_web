export default function Contact() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary-900 mb-6">Get in touch</h1>
      <p className="text-xl text-gray-500 mb-12">
        I am always open to discussing research collaborations, design systems, and software engineering opportunities.
      </p>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            id="name" 
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all"
            placeholder="Jane Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all"
            placeholder="jane@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
          <textarea 
            id="message" 
            rows={5}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all resize-none"
            placeholder="How can I help you?"
          />
        </div>
        <button 
          type="button" 
          className="mt-4 px-8 py-4 bg-primary-900 text-white font-medium rounded-xl hover:bg-primary-900/90 transition-all"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

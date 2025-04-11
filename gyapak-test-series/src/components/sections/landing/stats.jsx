export default function Stats() {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">45+</div>
              <div className="text-gray-600 mt-2">Exam Categories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">10,000+</div>
              <div className="text-gray-600 mt-2">Practice Tests</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">1M+</div>
              <div className="text-gray-600 mt-2">Success Stories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">4.8/5</div>
              <div className="text-gray-600 mt-2">User Rating</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
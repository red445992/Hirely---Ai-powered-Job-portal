// components/TrustedBy.tsx
import React from 'react';
import Image from 'next/image';

const TrustedBy = () => {
  const companies = [
    { name: 'eSewa', logo: '/esewa_logo.png' },
  
  ];

  return (
    <section className="w-full flex justify-center py-6">
      <div className="max-w-5xl w-full bg-white border border-neutral-200 rounded-lg px-6 py-6 mx-auto">
        {/* Heading */}
  <div className="text-center mb-6">
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
            Trusted by
          </p>
        </div>

        {/* Logos Grid */}
  <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-10 lg:gap-x-12">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={96}
                height={32}
                className="object-contain"
                // Colorize black PNG logos using CSS filter when needed.
                // Adjust the filter string to tune the resulting color.
                style={company.name === 'eSewa' ? { filter: 'invert(1) sepia(1) saturate(8) hue-rotate(100deg) brightness(0.95)' } : undefined}
              />
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;

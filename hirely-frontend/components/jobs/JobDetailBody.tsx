import React from 'react';

interface JobDetailContentProps {
  description: string;
  responsibilities?: string[];
  requirements?: string[];
}

export default function JobDetailContent({
  description,
  responsibilities = [],
  requirements = [],
}: JobDetailContentProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-8">
      {/* Job Description */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">
          Job description
        </h2>
        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* Key Responsibilities */}
      {responsibilities.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Key responsibility
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-neutral-700">
            {responsibilities.map((item, index) => (
              <li key={index} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Skills Required */}
      {requirements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Skills required
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-neutral-700">
            {requirements.map((item, index) => (
              <li key={index} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}

     
    </div>
  );
}

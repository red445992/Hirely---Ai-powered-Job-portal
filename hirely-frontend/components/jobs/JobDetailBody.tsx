import React from 'react';

interface JobDetailContentProps {
  description: string;
  responsibilities?: string[] | string;
  requirements?: string[] | string;
}

export default function JobDetailContent({
  description,
  responsibilities = [],
  requirements = [],
}: JobDetailContentProps) {
  // Helper function to ensure we have an array
  const ensureArray = (data: string[] | string | undefined): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // If not JSON, split by newlines or common separators
        return data
          .split(/\n|;|,/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
    }
    return [];
  };

  const responsibilitiesArray = ensureArray(responsibilities);
  const requirementsArray = ensureArray(requirements);

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
      {responsibilitiesArray.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Key responsibility
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-neutral-700">
            {responsibilitiesArray.map((item, index) => (
              <li key={index} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Skills Required */}
      {requirementsArray.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Skills required
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-neutral-700">
            {requirementsArray.map((item, index) => (
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

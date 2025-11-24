// ========================================
// FILE: components/jobs/filtersidebar.tsx
// Filter Sidebar Component - Clean Version
// ========================================

import React from 'react';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategories: string[];
  selectedLocations: string[];
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  categoryCounts: Record<string, number>;
  locationCounts: Record<string, number>;
  searchQuery?: string;
  searchLocation?: string;
  onClearSearch?: () => void;
}

export default function FilterSidebar({
  selectedCategories,
  selectedLocations,
  onCategoryChange,
  onLocationChange,
  categoryCounts,
  locationCounts,
  searchQuery = '',
  searchLocation = '',
  onClearSearch,
}: FilterSidebarProps) {
  
  // Debug: Log the counts being received
  console.log('📊 Filter Sidebar - Category Counts:', categoryCounts);
  console.log('📍 Filter Sidebar - Location Counts:', locationCounts);
  
  // Manual categories with fallback counts
  const defaultCategories = [
    { name: 'Programming', count: 0 },
    { name: 'Design', count: 0 },
    { name: 'Marketing', count: 0 },
    { name: 'Sales', count: 0 },
    { name: 'Finance', count: 0 },
    { name: 'Human Resources', count: 0 },
    { name: 'Operations', count: 0 },
    { name: 'Customer Service', count: 0 },
  ];

  const defaultLocations = [
    { name: 'Kathmandu', count: 0 },
    { name: 'bhaktapur', count: 0 },
    { name: 'lalitpur', count: 0 },
    { name: 'butwal', count: 0 },
    { name: 'new york', count: 0 },
    { name: 'pokhara', count: 0 },
    { name: 'Remote', count: 0 },
  ];

  // Use backend counts if available, otherwise use defaults
  const categories = Object.keys(categoryCounts).length > 0
    ? Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    : defaultCategories;

  const locations = Object.keys(locationCounts).length > 0
    ? Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    : defaultLocations;

  console.log('✅ Categories with counts:', categories);
  console.log('✅ Locations with counts:', locations);

  const hasActiveFilters = searchQuery || searchLocation || 
    selectedCategories.length > 0 || selectedLocations.length > 0;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-8">
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-neutral-900">
              Active Filters
            </h3>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Search Query Tag */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <span className="truncate max-w-[120px]">{searchQuery}</span>
                <button
                  onClick={onClearSearch}
                  className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                  aria-label="Remove search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {/* Search Location Tag */}
            {searchLocation && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                <span className="truncate max-w-[120px]">{searchLocation}</span>
                <button
                  onClick={onClearSearch}
                  className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                  aria-label="Remove location search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Selected Categories Tags */}
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
              >
                <span className="truncate max-w-[120px] capitalize">{category}</span>
                <button
                  onClick={() => onCategoryChange(category)}
                  className="hover:bg-green-100 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${category} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Selected Locations Tags */}
            {selectedLocations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
              >
                <span className="truncate max-w-[120px] capitalize">{location}</span>
                <button
                  onClick={() => onLocationChange(location)}
                  className="hover:bg-orange-100 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${location} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {hasActiveFilters && (
        <div className="border-t border-neutral-200" />
      )}

      {/* Search by Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-neutral-900 mb-4">
            Categories
          </h3>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
            {categories.map((category) => (
              <label
                key={category.name}
                className="flex items-center justify-between py-2.5 px-3 cursor-pointer group hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => onCategoryChange(category.name)}
                    className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900 capitalize truncate">
                    {category.name}
                  </span>
                </div>
                {category.count !== undefined && (
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md ml-2 shrink-0">
                    {category.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {categories.length > 0 && locations.length > 0 && (
        <div className="border-t border-neutral-200" />
      )}

      {/* Search by Location */}
      {locations.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-neutral-900 mb-4">
            Locations
          </h3>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
            {locations.map((location) => (
              <label
                key={location.name}
                className="flex items-center justify-between py-2.5 px-3 cursor-pointer group hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location.name)}
                    onChange={() => onLocationChange(location.name)}
                    className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900 capitalize truncate">
                    {location.name}
                  </span>
                </div>
                {location.count !== undefined && (
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md ml-2 shrink-0">
                    {location.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {categories.length === 0 && locations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-neutral-500">
            No filters available
          </p>
        </div>
      )}
    </div>
  );
}
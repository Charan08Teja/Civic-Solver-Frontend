import React from 'react';

const CategoryBadge = ({ category }) => {
  const categoryColors = {
    POTHOLE: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800',
    GARBAGE: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800',
    WATER_LEAKAGE: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800',
    STREETLIGHT: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800',
    ROAD_DAMAGE: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800',
    OTHER: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
  };

  const getCategoryLabel = (cat) => {
    return cat.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${categoryColors[category] || categoryColors.OTHER}`}>
      {getCategoryLabel(category)}
    </span>
  );
};

export default CategoryBadge;
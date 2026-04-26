import React from 'react';

const CategoryBadge = ({ category }) => {
  const categoryColors = {
    POTHOLE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    GARBAGE: 'bg-green-100 text-green-800 border-green-200',
    WATER_LEAKAGE: 'bg-blue-100 text-blue-800 border-blue-200',
    STREETLIGHT: 'bg-purple-100 text-purple-800 border-purple-200',
    ROAD_DAMAGE: 'bg-orange-100 text-orange-800 border-orange-200',
    OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const getCategoryLabel = (cat) => {
    return cat.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${categoryColors[category] || categoryColors.OTHER}`}>
      {getCategoryLabel(category)}
    </span>
  );
};

export default CategoryBadge;
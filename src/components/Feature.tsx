import React from "react";
import type { FeatureCardProps } from "../types.ts";

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  languages,
  categories,
  features,
  rankings,
}) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl hover:bg-gray-700/50 transition-all transform hover:-translate-y-1 hover:scale-105 border border-gray-700 group h-full">
    <div className="flex items-center mb-4 space-x-3">
      <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-400 mb-4">{description}</p>

    {languages && (
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 bg-blue-500/10 rounded-full text-sm text-blue-300"
          >
            {lang}
          </span>
        ))}
      </div>
    )}

    {categories && (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="px-3 py-1 bg-purple-500/10 rounded-full text-sm text-purple-300"
          >
            {category}
          </span>
        ))}
      </div>
    )}

    {features && (
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 bg-green-500/10 rounded-full text-sm text-green-300"
          >
            {feature}
          </span>
        ))}
      </div>
    )}

    {rankings && (
      <div className="flex flex-wrap gap-2">
        {rankings.map((rank) => (
          <span
            key={rank}
            className="px-3 py-1 bg-orange-500/10 rounded-full text-sm text-orange-300"
          >
            {rank}
          </span>
        ))}
      </div>
    )}
  </div>
);

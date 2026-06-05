import { Star, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../../../shared/types';

interface ProjectCardProps {
  project: Project;
}

const typeLabels: Record<string, string> = {
  helicopter: '直升机',
  balloon: '热气球',
  drone: '无人机',
};

const typeColors: Record<string, string> = {
  helicopter: 'bg-blue-100 text-blue-700',
  balloon: 'bg-orange-100 text-orange-700',
  drone: 'bg-green-100 text-green-700',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/project/${project.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[project.type]}`}>
            {typeLabels[project.type]}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{project.duration}分钟</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
          {project.name}
        </h3>

        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{project.rating}</span>
            <span className="text-xs text-gray-400">|</span>
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{project.salesCount}人已体验</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-gray-500">起</span>
            <span className="text-2xl font-bold text-accent-500">¥{project.basePrice}</span>
            <span className="text-xs text-gray-500">/人</span>
          </div>
          <button className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
            立即预订
          </button>
        </div>
      </div>
    </Link>
  );
}

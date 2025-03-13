
/**
 * Utility functions for implementing React code splitting
 */

import React, { lazy, Suspense } from 'react';
import { measurePerformance } from '@/utils/performanceUtils';

// Export a wrapped version of React.lazy with performance tracking
export function lazyWithPerf<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  componentName: string
): React.LazyExoticComponent<T> {
  return lazy(() => 
    measurePerformance(`Load component: ${componentName}`, () => factory())
  );
}

// A generic loading component for React.lazy suspense fallback
export const LazyLoadingPlaceholder: React.FC<{ height?: string }> = ({ height = '400px' }) => (
  <div className="flex items-center justify-center w-full" style={{ height }}>
    <div className="flex flex-col items-center space-y-2">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// Wrap a lazy-loaded component with Suspense and a loading placeholder
export function withSuspense<T extends React.ComponentType<any>>(
  LazyComponent: React.LazyExoticComponent<T>,
  height?: string
): React.FC<React.ComponentProps<T>> {
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LazyLoadingPlaceholder height={height} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Example usage:
 * 
 * // Import at the top of your file
 * import { lazyWithPerf, withSuspense } from '@/utils/codeSplitting';
 * 
 * // Lazy load a component
 * const LazyJobBoard = lazyWithPerf(() => import('./JobBoardPage'), 'JobBoardPage');
 * 
 * // Use it in your component tree with suspense
 * const JobBoardWithSuspense = withSuspense(LazyJobBoard);
 * 
 * // Then in your JSX:
 * return <JobBoardWithSuspense {...props} />;
 */

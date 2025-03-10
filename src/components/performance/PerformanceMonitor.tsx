
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BarChart, LineChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { measurePerformance } from '@/utils/performanceUtils';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Collect performance metrics on initial load
  useEffect(() => {
    // Only collect metrics in development mode
    if (process.env.NODE_ENV !== 'production') {
      collectMetrics();
    }
  }, []);

  const collectMetrics = () => {
    const newMetrics: PerformanceMetric[] = [];
    
    // Get navigation timing
    if (window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domContentLoadedTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
      const networkLatency = perfData.responseEnd - perfData.requestStart;
      
      newMetrics.push(
        { name: 'Page Load Time', value: pageLoadTime, timestamp: Date.now() },
        { name: 'DOM Content Loaded', value: domContentLoadedTime, timestamp: Date.now() },
        { name: 'Network Latency', value: networkLatency, timestamp: Date.now() }
      );
      
      // Get memory info if available
      const memory = (performance as any).memory;
      if (memory) {
        const usedHeapSize = Math.round(memory.usedJSHeapSize / (1024 * 1024));
        newMetrics.push({ name: 'Memory Usage (MB)', value: usedHeapSize, timestamp: Date.now() });
      }
      
      setMetrics(newMetrics);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      // Refresh metrics when making the monitor visible
      collectMetrics();
    }
  };

  return (
    <>
      {/* Performance Monitor Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleVisibility}
          className="bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Toggle Performance Monitor"
          title="Performance Monitor"
        >
          {isVisible ? <LineChart size={20} /> : <BarChart size={20} />}
        </button>
      </div>
      
      {/* Performance Monitor Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                <span>Performance Metrics</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowChart(!showChart)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Toggle Chart View"
                  >
                    {showChart ? <BarChart size={16} /> : <LineChart size={16} />}
                  </button>
                  <button
                    onClick={collectMetrics}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Refresh Metrics"
                  >
                    ↻
                  </button>
                </div>
              </CardTitle>
              <CardDescription>Real-time performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{metric.name}:</span>
                    <span className="font-mono text-sm">
                      {metric.value.toLocaleString()} ms
                    </span>
                  </div>
                ))}
                {metrics.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No metrics available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;

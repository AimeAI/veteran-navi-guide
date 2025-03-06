
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

type AlertLevel = 'info' | 'warning' | 'critical';

interface SecurityAlert {
  id: string;
  level: AlertLevel;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Performance optimization: Lazy load the component
const SecurityMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  // In a real app, this would listen to server events or poll an API
  useEffect(() => {
    // Mock security monitoring with performance metrics
    const checkForSecurityEvents = () => {
      // Record performance timing
      const startTime = performance.now();
      
      // This is just a simulation - in real app would check with backend
      const mockFindings = [
        // Example alerts for demo purposes
        {
          id: 'alert-' + Date.now(),
          level: 'info' as AlertLevel,
          message: 'Security audit completed successfully',
          timestamp: new Date(),
          read: false
        }
      ];
      
      if (mockFindings.length > 0) {
        setAlerts(prev => [...mockFindings, ...prev]);
        setShowAlerts(true);
      }
      
      // Log performance metrics
      const endTime = performance.now();
      console.log(`Security check performed in ${(endTime - startTime).toFixed(2)}ms`);
    };
    
    // Initial check
    checkForSecurityEvents();
    
    // Regular security checks - in real app this would be websocket or server-sent events
    const interval = setInterval(checkForSecurityEvents, 60000 * 60); // Check every hour
    
    return () => clearInterval(interval);
  }, []);
  
  const markAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };
  
  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    if (alerts.length <= 1) {
      setShowAlerts(false);
    }
  };
  
  const getAlertIcon = (level: AlertLevel) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <ShieldAlert className="h-5 w-5 text-blue-600" />;
    }
  };
  
  // Performance optimization: Only render when needed
  if (!showAlerts || alerts.length === 0) {
    return null;
  }
  
  // Performance optimization: Only render a limited number of alerts
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {alerts.slice(0, 3).map(alert => (
        <Alert 
          key={alert.id} 
          className={`mb-2 shadow-lg border-l-4 ${
            alert.level === 'critical' 
              ? 'border-l-red-500 bg-red-50' 
              : alert.level === 'warning'
                ? 'border-l-yellow-500 bg-yellow-50'
                : 'border-l-blue-500 bg-blue-50'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getAlertIcon(alert.level)}
            </div>
            <div className="ml-3 flex-1">
              <AlertTitle className={`text-sm font-medium ${
                alert.level === 'critical' 
                  ? 'text-red-800' 
                  : alert.level === 'warning'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
              }`}>
                Security {alert.level === 'critical' ? 'Alert' : alert.level === 'warning' ? 'Warning' : 'Notice'}
              </AlertTitle>
              <AlertDescription className="mt-1 text-sm text-gray-700">
                {alert.message}
              </AlertDescription>
            </div>
            <button 
              onClick={() => dismissAlert(alert.id)}
              className="ml-3 flex-shrink-0"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default SecurityMonitor;

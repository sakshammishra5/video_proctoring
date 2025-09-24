import React from 'react';
import { Shield, Eye, AlertTriangle } from 'lucide-react';

const MonitoringSidebar = ({ 
  integrityScore = 100, 
  violations = [], 
  isMonitoring = true,
  sessionDuration = '00:00:00'
}) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-900 border-red-700';
      case 'medium': return 'bg-orange-900 border-orange-700';
      case 'low': return 'bg-yellow-900 border-yellow-700';
      default: return 'bg-gray-900 border-gray-700';
    }
  };

  return (
    <div className="w-80 bg-gray-800 text-white p-6 overflow-y-auto">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-indigo-400 mr-2" />
        <h3 className="text-xl font-semibold">Proctoring Monitor</h3>
      </div>
      
      {/* Main Metrics */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Integrity Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(integrityScore)}`}>
              {integrityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                integrityScore >= 90 ? 'bg-green-500' :
                integrityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${integrityScore}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{violations.length}</div>
            <div className="text-sm text-gray-400">Violations</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white">{sessionDuration}</div>
            <div className="text-sm text-gray-400">Duration</div>
          </div>
        </div>
      </div>

      {/* Live Status */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Live Monitoring
        </h4>
        <div className="space-y-2">
          <StatusItem label="Face Detection" status="active" />
          <StatusItem label="Focus Tracking" status="active" />
          <StatusItem label="Object Detection" status="active" />
          <StatusItem 
            label="System Status" 
            status={isMonitoring ? "monitoring" : "inactive"} 
          />
        </div>
      </div>

      {/* Recent Violations */}
      {violations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
            Recent Violations
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {violations.slice(-10).reverse().map((violation, index) => (
              <ViolationItem
                key={`violation-${Date.now()}-${index}`}
                violation={violation}
                getSeverityColor={getSeverityColor}
              />
            ))}
          </div>
        </div>
      )}

      {violations.length === 0 && (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 font-semibold">All Clear!</p>
          <p className="text-gray-400 text-sm">No violations detected</p>
        </div>
      )}
    </div>
  );
};

const StatusItem = ({ label, status }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'monitoring':
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full" />;
      case 'inactive':
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'monitoring': return 'Monitoring';
      case 'warning': return 'Warning';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'monitoring':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'inactive':
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-300">{label}:</span>
      <div className="flex items-center space-x-2">
        {getStatusIcon(status)}
        <span className={getStatusColor(status)}>
          {getStatusText(status)}
        </span>
      </div>
    </div>
  );
};

const ViolationItem = ({ violation, getSeverityColor }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatViolationType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={`border rounded-lg p-3 ${getSeverityColor(violation.severity)}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium text-sm">
          {formatViolationType(violation.type)}
        </span>
        <span className="text-xs text-gray-400">
          {formatTime(violation.timestamp)}
        </span>
      </div>
      <p className="text-xs text-gray-300 mb-1">
        {violation.description}
      </p>
      {violation.duration && (
        <p className="text-xs text-gray-400">
          Duration: {violation.duration}s
        </p>
      )}
    </div>
  );
};

export default MonitoringSidebar;

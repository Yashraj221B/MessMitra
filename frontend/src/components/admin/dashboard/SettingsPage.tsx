import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Coming Soon</h3>
        <p className="text-gray-600">
          This section will include platform configuration, admin preferences, and system settings.
        </p>
      </div>
    </div>
  );
}

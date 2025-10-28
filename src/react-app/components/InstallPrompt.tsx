import { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/react-app/hooks/usePWA';

export default function InstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 shadow-2xl cosmic-glow">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-cosmic text-sm font-semibold mb-1">
              Install Cosmic Cannabis
            </h3>
            <p className="text-gray-300 text-xs leading-relaxed mb-3">
              Install our app for the best mobile experience with offline access and faster loading.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={installApp}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg text-white text-xs font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Install</span>
              </button>
              
              <button
                onClick={() => setIsDismissed(true)}
                className="px-3 py-1.5 rounded-lg text-gray-300 text-xs font-medium hover:text-white hover:bg-white/10 transition-all"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

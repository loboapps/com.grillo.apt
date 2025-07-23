import React, { useState, useEffect } from "react";
import { X, Download, Share, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  onClose?: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userDismissed, setUserDismissed] = useState(false);

  useEffect(() => {
    // Detectar plataforma
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Verificar se já foi instalado
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isNavigatorStandalone = (window.navigator as any).standalone === true;

    if (isInStandaloneMode || isNavigatorStandalone) {
      setIsInstalled(true);
      return;
    }

    // Verificar se usuário já dispensou
    const dismissed = localStorage.getItem("apt-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSince = Math.floor(
        (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Mostrar novamente após 7 dias
      if (daysSince < 7) {
        setUserDismissed(true);
        return;
      }
    }

    // Listener para evento de instalação (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostrar prompt após alguns segundos de navegação
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listener para quando app é instalado
    const handleAppInstalled = () => {
      console.log("PWA foi instalado");
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Para iOS, mostrar prompt após alguns segundos se não estiver instalado
    if (isIOSDevice && !isInStandaloneMode) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`Usuário ${outcome} a instalação`);

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("apt-install-dismissed", new Date().toISOString());
    setShowPrompt(false);
    setUserDismissed(true);
    onClose?.();
  };

  const handleRemindLater = () => {
    const remindDate = new Date();
    remindDate.setDate(remindDate.getDate() + 3); // Lembrar em 3 dias
    localStorage.setItem("apt-install-remind", remindDate.toISOString());
    setShowPrompt(false);
    onClose?.();
  };

  // Não mostrar se já instalado, já dispensado, ou usuário não quer ver
  if (isInstalled || userDismissed || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Instalar APT Poker
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Acesso rápido na tela inicial
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo específico por plataforma */}
        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Para instalar no iPhone/iPad:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Share className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  Toque em <strong>Compartilhar</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Download className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  Selecione <strong>"Adicionar à Tela de Início"</strong>
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRemindLater}
                className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Depois
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Instale o app para acesso rápido e melhor experiência.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleRemindLater}
                className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Depois
              </button>
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Benefícios */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Acesso offline</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Mais rápido</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Tela cheia</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Notificações*</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

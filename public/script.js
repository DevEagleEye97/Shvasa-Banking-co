/**
 * ============================================================================
 * SHVASA BANK - VIRTUAL ATM SCRIPT (INTERACTION & SIMULATION ENGINE)
 * Demonstrating C Programming Decisions through JavaScript
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT (Mirrors C Variables)
  // --------------------------------------------------------------------------
  const STATE = {
    // int balance = 10000;
    balance: 10000,
    // int actual_pin = 1234;
    actualPin: '1234',
    // int entered_pin;
    enteredPin: '',
    // int attempts = 0;
    attempts: 0,
    maxAttempts: 3,
    // int is_authenticated = 0;
    isAuthenticated: false,
    // Card state
    cardInserted: false,
    // Sound enabled
    soundEnabled: true,
    // Lock countdown
    lockTimer: null,
    lockRemaining: 30,
    // Pending withdrawal amount
    pendingWithdrawal: 0,
    // Transaction history (stored in localStorage)
    transactions: []
  };

  // --------------------------------------------------------------------------
  // DOM ELEMENT SELECTORS
  // --------------------------------------------------------------------------
  const elements = {
    // Screens
    idleScreen: document.getElementById('idleScreen'),
    readingScreen: document.getElementById('readingScreen'),
    pinScreen: document.getElementById('pinScreen'),
    lockedScreen: document.getElementById('lockedScreen'),
    dashboardScreen: document.getElementById('dashboardScreen'),
    withdrawScreen: document.getElementById('withdrawScreen'),
    confirmWithdrawScreen: document.getElementById('confirmWithdrawScreen'),
    processingScreen: document.getElementById('processingScreen'),
    cashScreen: document.getElementById('cashScreen'),
    balanceScreen: document.getElementById('balanceScreen'),
    netBankingScreen: document.getElementById('netBankingScreen'),
    ejectScreen: document.getElementById('ejectScreen'),
    thankYouScreen: document.getElementById('thankYouScreen'),

    // Top Bar & Controls
    soundToggle: document.getElementById('soundToggle'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettings: document.getElementById('closeSettings'),
    resetDemoBtn: document.getElementById('resetDemoBtn'),
    idleTime: document.getElementById('idleTime'),

    // ATM Machine Indicators & Slots
    lightGreen: document.getElementById('lightGreen'),
    lightAmber: document.getElementById('lightAmber'),
    cardSlot: document.getElementById('cardSlot'),
    slotIndicator: document.getElementById('slotIndicator'),
    cashOutlet: document.getElementById('cashOutlet'),
    cashShutter: document.getElementById('cashShutter'),
    receiptOutlet: document.getElementById('receiptOutlet'),

    // Card & Stage
    debitCard: document.getElementById('debitCard'),
    cardStage: document.getElementById('cardStage'),
    cardGlowLabel: document.getElementById('cardGlowLabel'),

    // Reading Screen
    readingProgress: document.getElementById('readingProgress'),
    readingText: document.getElementById('readingText'),
    terminalText: document.getElementById('terminalText'),

    // PIN Screen
    pinDots: [
      document.getElementById('d0'),
      document.getElementById('d1'),
      document.getElementById('d2'),
      document.getElementById('d3')
    ],
    pinMessage: document.getElementById('pinMessage'),
    pinKeypad: document.getElementById('pinKeypad'),
    pinAttempts: document.getElementById('pinAttempts'),

    // Locked Screen
    lockedCountdown: document.getElementById('lockedCountdown'),
    countdownSec: document.getElementById('countdownSec'),
    unlockEarlyBtn: document.getElementById('unlockEarlyBtn'),

    // Dashboard
    balanceDisplay: document.getElementById('balanceDisplay'),
    withdrawBtn: document.getElementById('withdrawBtn'),
    balanceBtn: document.getElementById('balanceBtn'),
    netBankingBtn: document.getElementById('netBankingBtn'),
    ejectBtn: document.getElementById('ejectBtn'),

    // Withdraw Screen
    quickAmounts: document.getElementById('quickAmounts'),
    customAmountInput: document.getElementById('customAmountInput'),
    withdrawMsg: document.getElementById('withdrawMsg'),
    proceedWithdrawBtn: document.getElementById('proceedWithdrawBtn'),
    withdrawBackBtn: document.getElementById('withdrawBackBtn'),

    // Confirm Withdraw
    confirmAmount: document.getElementById('confirmAmount'),
    confirmCurrent: document.getElementById('confirmCurrent'),
    confirmRemaining: document.getElementById('confirmRemaining'),
    confirmWithdrawBtn: document.getElementById('confirmWithdrawBtn'),
    cancelWithdrawBtn: document.getElementById('cancelWithdrawBtn'),
    confirmBackBtn: document.getElementById('confirmBackBtn'),

    // Processing
    processingText: document.getElementById('processingText'),
    processingSteps: document.getElementById('processingSteps'),
    processingTerminal: document.getElementById('processingTerminal'),

    // Cash Dispense
    cashAmountDisplay: document.getElementById('cashAmountDisplay'),
    cashNotes: document.getElementById('cashNotes'),
    printReceiptBtn: document.getElementById('printReceiptBtn'),
    backToDashBtn: document.getElementById('backToDashBtn'),

    // Balance Screen
    balanceCheckAmount: document.getElementById('balanceCheckAmount'),
    balanceDate: document.getElementById('balanceDate'),
    balanceBackBtn: document.getElementById('balanceBackBtn'),

    // Net Banking
    netBankingBackBtn: document.getElementById('netBankingBackBtn'),
    nbContent: document.getElementById('nbContent'),

    // Thank You
    startOverBtn: document.getElementById('startOverBtn'),

    // Receipt Modal
    receiptModal: document.getElementById('receiptModal'),
    receiptBody: document.getElementById('receiptBody'),
    closeReceiptBtn: document.getElementById('closeReceiptBtn'),

    // C Logic Panel
    cLogicPanel: document.getElementById('cLogicPanel'),
    cPanelToggle: document.getElementById('cPanelToggle'),
    cPanelBody: document.getElementById('cPanelBody'),
    cCodeDisplay: document.getElementById('cCodeDisplay'),
    particlesContainer: document.getElementById('particlesContainer')
  };

  // --------------------------------------------------------------------------
  // SYNTHESIZED SOUND EFFECTS (Web Audio API - No external mp3 files needed)
  // --------------------------------------------------------------------------
  const SoundFX = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },
    playTone(freq, duration, type = 'sine', gainVal = 0.08) {
      if (!STATE.soundEnabled) return;
      try {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Silently catch audio restrictions
      }
    },
    click() { this.playTone(850, 0.06, 'sine', 0.05); },
    insert() {
      this.playTone(400, 0.1, 'triangle', 0.08);
      setTimeout(() => this.playTone(600, 0.15, 'triangle', 0.08), 80);
    },
    success() {
      this.playTone(523.25, 0.12, 'sine', 0.08); // C5
      setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.08), 100); // E5
      setTimeout(() => this.playTone(783.99, 0.22, 'sine', 0.08), 200); // G5
    },
    error() {
      this.playTone(220, 0.15, 'sawtooth', 0.08);
      setTimeout(() => this.playTone(180, 0.25, 'sawtooth', 0.08), 120);
    },
    dispense() {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => this.playTone(300 + i * 40, 0.05, 'square', 0.03), i * 70);
      }
    },
    beep() { this.playTone(1050, 0.08, 'sine', 0.06); }
  };

  // --------------------------------------------------------------------------
  // PERSISTENCE (localStorage)
  // --------------------------------------------------------------------------
  function loadPersistedData() {
    try {
      const savedBalance = localStorage.getItem('shvasa_balance');
      if (savedBalance !== null) {
        STATE.balance = parseInt(savedBalance, 10);
      }
      const savedTxs = localStorage.getItem('shvasa_transactions');
      if (savedTxs) {
        STATE.transactions = JSON.parse(savedTxs);
      } else {
        // Sample educational transactions
        STATE.transactions = [
          {
            date: '28 Sep 2026, 11:30 AM',
            type: 'ATM Cash Withdrawal',
            amount: 2000,
            balance: 10000,
            status: 'SUCCESS'
          }
        ];
        savePersistedData();
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function savePersistedData() {
    try {
      localStorage.setItem('shvasa_balance', STATE.balance);
      localStorage.setItem('shvasa_transactions', JSON.stringify(STATE.transactions));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // --------------------------------------------------------------------------
  // UI NAVIGATION HELPER
  // --------------------------------------------------------------------------
  const allScreens = [
    elements.idleScreen,
    elements.readingScreen,
    elements.pinScreen,
    elements.lockedScreen,
    elements.dashboardScreen,
    elements.withdrawScreen,
    elements.confirmWithdrawScreen,
    elements.processingScreen,
    elements.cashScreen,
    elements.balanceScreen,
    elements.netBankingScreen,
    elements.ejectScreen,
    elements.thankYouScreen
  ];

  function showScreen(screenEl) {
    allScreens.forEach(sc => {
      if (sc) sc.classList.add('hidden');
    });
    if (screenEl) {
      screenEl.classList.remove('hidden');
    }
    updateAtmLights(screenEl);
  }

  function updateAtmLights(activeScreen) {
    if (!elements.lightGreen || !elements.lightAmber) return;
    elements.lightGreen.classList.remove('active');
    elements.lightAmber.classList.remove('active');

    if (activeScreen === elements.idleScreen || activeScreen === elements.thankYouScreen) {
      elements.lightGreen.classList.add('active');
    } else if (activeScreen === elements.readingScreen || activeScreen === elements.processingScreen) {
      elements.lightAmber.classList.add('active');
    } else if (activeScreen === elements.lockedScreen) {
      elements.lightAmber.classList.add('active');
    } else {
      elements.lightGreen.classList.add('active');
    }
  }

  function formatCurrency(val) {
    return '₹' + Number(val).toLocaleString('en-IN');
  }

  // --------------------------------------------------------------------------
  // 1. CARD INSERTION WORKFLOW
  // --------------------------------------------------------------------------
  function insertCard() {
    if (STATE.cardInserted) return;
    STATE.cardInserted = true;
    SoundFX.insert();

    // Visual animation of card sliding
    if (elements.debitCard) {
      elements.debitCard.classList.remove('ejecting');
      elements.debitCard.classList.add('sliding-in');
    }
    if (elements.cardGlowLabel) {
      elements.cardGlowLabel.style.display = 'none';
    }
    if (elements.slotIndicator) {
      elements.slotIndicator.classList.add('reading');
    }

    // Move to reading card screen
    setTimeout(() => {
      showScreen(elements.readingScreen);
      runCardReadingSimulation();
    }, 900);
  }

  function runCardReadingSimulation() {
    if (!elements.readingProgress || !elements.readingText || !elements.terminalText) return;
    elements.readingProgress.style.width = '0%';
    elements.readingText.textContent = 'Reading Card...';
    elements.terminalText.textContent = 'CHIP_DETECT: EMV-4521 [OK]';

    setTimeout(() => {
      elements.readingProgress.style.width = '50%';
      elements.terminalText.textContent = 'AES-256 HANDSHAKE ESTABLISHED...';
      SoundFX.beep();
    }, 700);

    setTimeout(() => {
      elements.readingProgress.style.width = '100%';
      elements.readingText.textContent = 'Card Verified';
      elements.terminalText.textContent = 'STATUS: AUTHORIZED TO PROCEED';
      SoundFX.beep();
    }, 1400);

    setTimeout(() => {
      showPinScreen();
    }, 2100);
  }

  // --------------------------------------------------------------------------
  // 2. PIN AUTHENTICATION WORKFLOW (Mirrors C: if (pin == 1234))
  // --------------------------------------------------------------------------
  function showPinScreen() {
    showScreen(elements.pinScreen);
    resetPinInput();
    updatePinAttemptsDisplay();
  }

  function resetPinInput() {
    STATE.enteredPin = '';
    updatePinDots();
    if (elements.pinMessage) {
      elements.pinMessage.textContent = '';
      elements.pinMessage.className = 'pin-message';
    }
  }

  function handleKeypadPress(val) {
    SoundFX.click();
    if (val === 'clear') {
      resetPinInput();
    } else if (val === 'enter') {
      verifyPin();
    } else {
      if (STATE.enteredPin.length < 4) {
        STATE.enteredPin += val;
        updatePinDots();
        if (STATE.enteredPin.length === 4) {
          // Auto submit or brief pause
          setTimeout(() => verifyPin(), 200);
        }
      }
    }
  }

  function updatePinDots() {
    for (let i = 0; i < 4; i++) {
      if (elements.pinDots[i]) {
        if (i < STATE.enteredPin.length) {
          elements.pinDots[i].classList.add('filled');
        } else {
          elements.pinDots[i].classList.remove('filled');
        }
      }
    }
  }

  function verifyPin() {
    if (STATE.enteredPin.length < 4) {
      if (elements.pinMessage) {
        elements.pinMessage.textContent = 'Please enter a 4-digit PIN.';
        elements.pinMessage.className = 'pin-message error';
        SoundFX.error();
      }
      return;
    }

    // C Equivalent:
    // if (entered_pin == actual_pin) { is_authenticated = 1; }
    if (STATE.enteredPin === STATE.actualPin) {
      SoundFX.success();
      STATE.isAuthenticated = true;
      STATE.attempts = 0;
      if (elements.pinMessage) {
        elements.pinMessage.textContent = '✓ PIN Verified. Welcome!';
        elements.pinMessage.className = 'pin-message';
        elements.pinMessage.style.color = '#34d399';
      }
      setTimeout(() => {
        showDashboard();
      }, 700);
    } else {
      SoundFX.error();
      STATE.attempts++;
      const remaining = STATE.maxAttempts - STATE.attempts;

      if (STATE.attempts >= STATE.maxAttempts) {
        lockDemoAccount();
      } else {
        if (elements.pinMessage) {
          elements.pinMessage.textContent = `Incorrect PIN. ${remaining} attempt(s) left.`;
          elements.pinMessage.className = 'pin-message error';
        }
        updatePinAttemptsDisplay();
        setTimeout(() => resetPinInput(), 800);
      }
    }
  }

  function updatePinAttemptsDisplay() {
    if (elements.pinAttempts) {
      elements.pinAttempts.textContent = `Attempts used: ${STATE.attempts} / ${STATE.maxAttempts}`;
    }
  }

  function lockDemoAccount() {
    showScreen(elements.lockedScreen);
    STATE.lockRemaining = 30;
    if (elements.lockedCountdown) elements.lockedCountdown.textContent = STATE.lockRemaining;
    if (elements.countdownSec) elements.countdownSec.textContent = STATE.lockRemaining;

    if (STATE.lockTimer) clearInterval(STATE.lockTimer);
    STATE.lockTimer = setInterval(() => {
      STATE.lockRemaining--;
      if (elements.lockedCountdown) elements.lockedCountdown.textContent = STATE.lockRemaining;
      if (elements.countdownSec) elements.countdownSec.textContent = STATE.lockRemaining;

      if (STATE.lockRemaining <= 0) {
        clearInterval(STATE.lockTimer);
        unlockDemoAccount();
      }
    }, 1000);
  }

  function unlockDemoAccount() {
    if (STATE.lockTimer) clearInterval(STATE.lockTimer);
    STATE.attempts = 0;
    showPinScreen();
  }

  // --------------------------------------------------------------------------
  // 3. MAIN DASHBOARD WORKFLOW
  // --------------------------------------------------------------------------
  function showDashboard() {
    showScreen(elements.dashboardScreen);
    updateBalanceDisplays();
  }

  function updateBalanceDisplays() {
    const formatted = formatCurrency(STATE.balance);
    if (elements.balanceDisplay) elements.balanceDisplay.textContent = formatted;
    if (elements.balanceCheckAmount) elements.balanceCheckAmount.textContent = formatted;
  }

  // --------------------------------------------------------------------------
  // 4. CASH WITHDRAWAL WORKFLOW (Mirrors C: if (amount > balance))
  // --------------------------------------------------------------------------
  function showWithdrawScreen() {
    showScreen(elements.withdrawScreen);
    if (elements.customAmountInput) elements.customAmountInput.value = '';
    if (elements.withdrawMsg) {
      elements.withdrawMsg.textContent = '';
      elements.withdrawMsg.className = 'withdraw-msg';
    }
    // Deselect quick buttons
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
    STATE.pendingWithdrawal = 0;
  }

  function selectQuickAmount(amount, buttonEl) {
    SoundFX.click();
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonEl) buttonEl.classList.add('active');
    if (elements.customAmountInput) elements.customAmountInput.value = amount;
    STATE.pendingWithdrawal = amount;
  }

  function handleWithdrawProceed() {
    SoundFX.click();
    const inputVal = elements.customAmountInput ? parseInt(elements.customAmountInput.value, 10) : 0;
    const amount = !isNaN(inputVal) && inputVal > 0 ? inputVal : STATE.pendingWithdrawal;

    // C Equivalent Validations:
    // 1. if (amount <= 0)
    if (!amount || amount <= 0) {
      SoundFX.error();
      showWithdrawError('INVALID AMOUNT: Please enter an amount greater than ₹0.');
      return;
    }

    // 2. if (amount % 100 != 0)
    if (amount % 100 !== 0) {
      SoundFX.error();
      showWithdrawError('INVALID DENOMINATION: Please enter multiples of ₹100.');
      return;
    }

    // 3. if (amount > balance)
    if (amount > STATE.balance) {
      SoundFX.error();
      showWithdrawError(`INSUFFICIENT BALANCE: Current balance is ${formatCurrency(STATE.balance)}.`);
      return;
    }

    // Valid: Proceed to confirmation
    STATE.pendingWithdrawal = amount;
    showConfirmWithdraw(amount);
  }

  function showWithdrawError(msg) {
    if (elements.withdrawMsg) {
      elements.withdrawMsg.textContent = msg;
      elements.withdrawMsg.className = 'withdraw-msg error';
    }
  }

  function showConfirmWithdraw(amount) {
    showScreen(elements.confirmWithdrawScreen);
    if (elements.confirmAmount) elements.confirmAmount.textContent = formatCurrency(amount);
    if (elements.confirmCurrent) elements.confirmCurrent.textContent = formatCurrency(STATE.balance);
    if (elements.confirmRemaining) elements.confirmRemaining.textContent = formatCurrency(STATE.balance - amount);
  }

  function executeWithdrawal() {
    SoundFX.click();
    showScreen(elements.processingScreen);
    if (elements.processingText) elements.processingText.textContent = 'PROCESSING TRANSACTION...';
    if (elements.processingSteps) elements.processingSteps.textContent = 'Contacting core banking switch...';
    if (elements.processingTerminal) elements.processingTerminal.textContent = 'TX_REQ: DISPENSE_CASH';

    setTimeout(() => {
      if (elements.processingSteps) elements.processingSteps.textContent = 'COUNTING CASH...';
      if (elements.processingTerminal) elements.processingTerminal.textContent = 'CASSETTE_A: READY | CASSETTE_B: READY';
      SoundFX.dispense();
    }, 1000);

    setTimeout(() => {
      // Deduct balance (C Equivalent: balance = balance - amount;)
      const withdrawn = STATE.pendingWithdrawal;
      STATE.balance -= withdrawn;
      savePersistedData();

      // Record transaction
      addTransactionRecord(withdrawn);

      // Open cash shutter and dispense
      dispenseCashVisual(withdrawn);
    }, 2200);
  }

  function dispenseCashVisual(amount) {
    showScreen(elements.cashScreen);
    if (elements.cashAmountDisplay) elements.cashAmountDisplay.textContent = formatCurrency(amount);

    // Open physical shutter
    if (elements.cashShutter) {
      elements.cashShutter.classList.add('open');
    }

    // Render demo currency notes (Fictional educational representation)
    if (elements.cashNotes) {
      elements.cashNotes.innerHTML = '';
      let remainder = amount;
      const notesToCreate = [];

      while (remainder >= 500 && notesToCreate.length < 3) {
        notesToCreate.push({ val: 500, cls: 'note-500' });
        remainder -= 500;
      }
      while (remainder >= 200 && notesToCreate.length < 4) {
        notesToCreate.push({ val: 200, cls: 'note-200' });
        remainder -= 200;
      }
      while (remainder >= 100 && notesToCreate.length < 5) {
        notesToCreate.push({ val: 100, cls: 'note-100' });
        remainder -= 100;
      }

      if (notesToCreate.length === 0) {
        notesToCreate.push({ val: 100, cls: 'note-100' });
      }

      notesToCreate.forEach((n, idx) => {
        const noteEl = document.createElement('div');
        noteEl.className = `demo-note ${n.cls}`;
        noteEl.style.animationDelay = `${idx * 0.15}s`;
        noteEl.innerHTML = `
          <span>DEMO ₹${n.val}</span>
          <span style="font-size:0.5rem;opacity:0.7;">SHVASA</span>
        `;
        elements.cashNotes.appendChild(noteEl);
      });
    }

    SoundFX.success();
  }

  function addTransactionRecord(amount) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    STATE.transactions.unshift({
      date: dateStr,
      type: 'Cash Withdrawal',
      amount: amount,
      balance: STATE.balance,
      status: 'SUCCESS'
    });
    savePersistedData();
  }

  // --------------------------------------------------------------------------
  // 5. RECEIPT PRINTING
  // --------------------------------------------------------------------------
  function printReceipt() {
    SoundFX.click();
    const lastTx = STATE.transactions[0] || {
      date: new Date().toLocaleDateString(),
      type: 'Cash Withdrawal',
      amount: STATE.pendingWithdrawal || 2000,
      balance: STATE.balance
    };

    if (elements.receiptBody) {
      elements.receiptBody.innerHTML = `
        <div class="receipt-row"><span>Date/Time:</span><span>${lastTx.date}</span></div>
        <div class="receipt-row"><span>ATM ID:</span><span>GV-BLR-007</span></div>
        <div class="receipt-row"><span>Card No:</span><span>XXXX XXXX 8765</span></div>
        <div class="receipt-row"><span>Tx Type:</span><span>${lastTx.type}</span></div>
        <div class="receipt-line"></div>
        <div class="receipt-row"><span>Withdrawn:</span><strong>${formatCurrency(lastTx.amount)}</strong></div>
        <div class="receipt-row"><span>Available Bal:</span><strong>${formatCurrency(lastTx.balance)}</strong></div>
        <div class="receipt-row"><span>Status:</span><span style="color:#059669;font-weight:700;">SUCCESS</span></div>
      `;
    }

    if (elements.receiptModal) {
      elements.receiptModal.classList.remove('hidden');
    }
  }

  // --------------------------------------------------------------------------
  // 6. BALANCE INQUIRY SCREEN
  // --------------------------------------------------------------------------
  function showBalanceScreen() {
    SoundFX.click();
    showScreen(elements.balanceScreen);
    updateBalanceDisplays();
    if (elements.balanceDate) {
      const now = new Date();
      elements.balanceDate.textContent = 'As of: ' + now.toLocaleString('en-IN');
    }
  }

  // --------------------------------------------------------------------------
  // 7. INTERNET BANKING SIMULATION
  // --------------------------------------------------------------------------
  function showNetBankingScreen(tab = 'summary') {
    SoundFX.click();
    showScreen(elements.netBankingScreen);
    switchNetBankingTab(tab);
  }

  function switchNetBankingTab(tabName) {
    document.querySelectorAll('.nb-tab').forEach(t => {
      if (t.dataset.tab === tabName) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    if (!elements.nbContent) return;

    if (tabName === 'summary') {
      elements.nbContent.innerHTML = `
        <div class="nb-row"><span>Account Type:</span><strong>Demo Savings A/C</strong></div>
        <div class="nb-row"><span>Account Number:</span><span class="mono">XXXX XXXX 4521</span></div>
        <div class="nb-row"><span>Available Balance:</span><strong style="color:var(--emerald-bright);">${formatCurrency(STATE.balance)}</strong></div>
        <div class="nb-row"><span>Account Status:</span><span style="color:var(--emerald-bright);font-weight:600;">ACTIVE — DEMO</span></div>
        <div class="nb-row"><span>Branch:</span><span>Indiranagar, Bengaluru</span></div>
      `;
    } else if (tabName === 'history') {
      if (STATE.transactions.length === 0) {
        elements.nbContent.innerHTML = `<p style="color:#9ca3af;text-align:center;padding:1rem;">No transactions yet.</p>`;
      } else {
        let listHtml = '<div class="tx-timeline">';
        STATE.transactions.forEach(tx => {
          listHtml += `
            <div class="tx-item">
              <div>
                <div class="tx-type">${tx.type}</div>
                <div class="tx-date">${tx.date}</div>
              </div>
              <div>
                <div class="tx-amount">- ${formatCurrency(tx.amount)}</div>
                <div class="tx-bal">Bal: ${formatCurrency(tx.balance)}</div>
              </div>
            </div>
          `;
        });
        listHtml += '</div>';
        elements.nbContent.innerHTML = listHtml;
      }
    } else if (tabName === 'details') {
      elements.nbContent.innerHTML = `
        <div class="nb-row"><span>Account Holder:</span><span>DEMO USER</span></div>
        <div class="nb-row"><span>IFSC Code:</span><span class="mono">GVBK0004521</span></div>
        <div class="nb-row"><span>Customer ID:</span><span class="mono">987654321</span></div>
        <div class="nb-row"><span>Nominee:</span><span>REGISTERED (Demo)</span></div>
        <div class="nb-row"><span>Daily ATM Limit:</span><span>₹50,000</span></div>
      `;
    } else if (tabName === 'security') {
      elements.nbContent.innerHTML = `
        <div class="nb-row"><span>2-Factor Auth:</span><span style="color:var(--emerald-bright);">ENABLED</span></div>
        <div class="nb-row"><span>Encryption:</span><span>AES-256 Bit Mock</span></div>
        <div class="nb-row"><span>Demo PIN:</span><span class="mono">1234 (Educational)</span></div>
        <div class="nb-row"><span>Last Login:</span><span>Today, Virtual Session</span></div>
        <p style="font-size:0.7rem;color:#9ca3af;margin-top:0.75rem;">Security policies adhere to simulated RBI cybersecurity guidelines for educational software.</p>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // 8. CARD EJECTION & SESSION RESET
  // --------------------------------------------------------------------------
  function ejectCard() {
    SoundFX.click();
    showScreen(elements.ejectScreen);
    STATE.isAuthenticated = false;

    // Close shutter if open
    if (elements.cashShutter) {
      elements.cashShutter.classList.remove('open');
    }
    if (elements.slotIndicator) {
      elements.slotIndicator.classList.remove('reading');
    }

    setTimeout(() => {
      // Animate card back out
      if (elements.debitCard) {
        elements.debitCard.classList.remove('sliding-in');
        elements.debitCard.classList.add('ejecting');
      }
      showScreen(elements.thankYouScreen);
    }, 1800);
  }

  function startOver() {
    SoundFX.click();
    STATE.cardInserted = false;
    STATE.isAuthenticated = false;
    STATE.enteredPin = '';
    STATE.attempts = 0;

    if (elements.debitCard) {
      elements.debitCard.classList.remove('sliding-in', 'ejecting');
    }
    if (elements.cardGlowLabel) {
      elements.cardGlowLabel.style.display = 'flex';
    }

    showScreen(elements.idleScreen);
  }

  function resetDemo() {
    SoundFX.click();
    STATE.balance = 10000;
    STATE.attempts = 0;
    STATE.enteredPin = '';
    STATE.transactions = [
      {
        date: 'Demo Reset Date',
        type: 'Initial Account Credit',
        amount: 10000,
        balance: 10000,
        status: 'SUCCESS'
      }
    ];
    savePersistedData();
    updateBalanceDisplays();
    if (elements.settingsModal) elements.settingsModal.classList.add('hidden');
    alert('Demo account reset successfully! Balance is now ₹10,000.');
  }

  // --------------------------------------------------------------------------
  // 9. C CODE INTERACTIVE SNIPPETS (Educational Viewer)
  // --------------------------------------------------------------------------
  const cSnippets = {
    pin: `// 1. PIN VERIFICATION LOGIC (C Language)
int actual_pin = 1234;
int entered_pin;

printf("Please Enter PIN: ");
scanf("%d", &entered_pin);

// Decision making with 'if' and 'else'
if (entered_pin == actual_pin) {
    printf("Authentication Successful!\n");
    is_authenticated = 1;
} else {
    printf("Incorrect PIN. Please try again.\n");
}`,
    menu: `// 2. MAIN MENU SELECTION (switch - case)
int choice;
printf("1. Check Balance\n2. Withdraw\n3. Exit\n");
scanf("%d", &choice);

switch(choice) {
    case 1:
        printf("Balance = Rs %d\n", balance);
        break;
    case 2:
        withdrawMoney();
        break;
    case 3:
        printf("Thank you for banking with us.\n");
        break;
    default:
        printf("Invalid Choice!\n");
}`,
    withdraw: `// 3. WITHDRAWAL LOGIC (Arithmetic & Comparison Operators)
int amount;
scanf("%d", &amount);

if (amount <= 0) {
    printf("Invalid Amount!\n");
} 
else if (amount > balance) {
    printf("Insufficient Balance!\n");
} 
else {
    // Arithmetic Operator: balance - amount
    balance = balance - amount;
    printf("Withdrawal Successful! Cash Dispensed: Rs %d\n", amount);
    printf("Updated Balance: Rs %d\n", balance);
}`,
    balance: `// 4. BALANCE INQUIRY
printf("==================================\n");
printf("Account: XXXX XXXX 4521\n");
printf("Available Balance = Rs %d\n", balance);
printf("Status: Active\n");
printf("==================================\n");`
  };

  function showCCode(topic) {
    document.querySelectorAll('.c-tab').forEach(t => {
      if (t.dataset.ctab === topic) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    if (elements.cCodeDisplay) {
      elements.cCodeDisplay.textContent = cSnippets[topic] || cSnippets.pin;
    }
  }

  // --------------------------------------------------------------------------
  // 10. BACKGROUND PARTICLES GENERATION
  // --------------------------------------------------------------------------
  function createParticles() {
    if (!elements.particlesContainer) return;
    elements.particlesContainer.innerHTML = '';
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 10 + 10}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      elements.particlesContainer.appendChild(p);
    }
  }

  function updateClock() {
    if (!elements.idleTime) return;
    const now = new Date();
    elements.idleTime.textContent = now.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ' | ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // --------------------------------------------------------------------------
  // 11. EVENT LISTENERS SETUP
  // --------------------------------------------------------------------------
  function initEventListeners() {
    // Card click
    if (elements.debitCard) {
      elements.debitCard.addEventListener('click', insertCard);
      elements.debitCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          insertCard();
        }
      });
    }

    // Physical Card Slot click fallback
    if (elements.cardSlot) {
      elements.cardSlot.addEventListener('click', () => {
        if (!STATE.cardInserted) insertCard();
      });
    }

    // Keypad clicks
    if (elements.pinKeypad) {
      elements.pinKeypad.addEventListener('click', (e) => {
        const btn = e.target.closest('.pin-key');
        if (btn) {
          handleKeypadPress(btn.dataset.val);
        }
      });
    }

    // Keyboard support for PIN entry
    window.addEventListener('keydown', (e) => {
      if (elements.pinScreen && !elements.pinScreen.classList.contains('hidden')) {
        if (e.key >= '0' && e.key <= '9') {
          handleKeypadPress(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          handleKeypadPress('clear');
        } else if (e.key === 'Enter') {
          handleKeypadPress('enter');
        }
      }
    });

    // Dashboard Buttons
    if (elements.withdrawBtn) elements.withdrawBtn.addEventListener('click', () => { SoundFX.click(); showWithdrawScreen(); });
    if (elements.balanceBtn) elements.balanceBtn.addEventListener('click', showBalanceScreen);
    if (elements.netBankingBtn) elements.netBankingBtn.addEventListener('click', () => showNetBankingScreen('summary'));
    if (elements.ejectBtn) elements.ejectBtn.addEventListener('click', ejectCard);

    // Withdraw Screen Actions
    if (elements.withdrawBackBtn) elements.withdrawBackBtn.addEventListener('click', () => { SoundFX.click(); showDashboard(); });
    if (elements.proceedWithdrawBtn) elements.proceedWithdrawBtn.addEventListener('click', handleWithdrawProceed);
    if (elements.quickAmounts) {
      elements.quickAmounts.addEventListener('click', (e) => {
        const btn = e.target.closest('.amount-btn');
        if (btn) {
          selectQuickAmount(parseInt(btn.dataset.amount, 10), btn);
        }
      });
    }

    // Confirm Withdraw Screen Actions
    if (elements.confirmWithdrawBtn) elements.confirmWithdrawBtn.addEventListener('click', executeWithdrawal);
    if (elements.cancelWithdrawBtn) elements.cancelWithdrawBtn.addEventListener('click', () => { SoundFX.click(); showDashboard(); });
    if (elements.confirmBackBtn) elements.confirmBackBtn.addEventListener('click', () => { SoundFX.click(); showWithdrawScreen(); });

    // Cash Screen Actions
    if (elements.printReceiptBtn) elements.printReceiptBtn.addEventListener('click', printReceipt);
    if (elements.backToDashBtn) elements.backToDashBtn.addEventListener('click', () => {
      SoundFX.click();
      if (elements.cashShutter) elements.cashShutter.classList.remove('open');
      showDashboard();
    });

    // Balance Screen Back
    if (elements.balanceBackBtn) elements.balanceBackBtn.addEventListener('click', () => { SoundFX.click(); showDashboard(); });

    // Net Banking Screen Tabs & Back
    if (elements.netBankingBackBtn) elements.netBankingBackBtn.addEventListener('click', () => { SoundFX.click(); showDashboard(); });
    document.querySelectorAll('.nb-tab').forEach(tab => {
      tab.addEventListener('click', () => switchNetBankingTab(tab.dataset.tab));
    });

    // Thank You / Start Over
    if (elements.startOverBtn) elements.startOverBtn.addEventListener('click', startOver);

    // Early Unlock Button
    if (elements.unlockEarlyBtn) elements.unlockEarlyBtn.addEventListener('click', unlockDemoAccount);

    // Settings Modal
    if (elements.settingsBtn) {
      elements.settingsBtn.addEventListener('click', () => {
        SoundFX.click();
        if (elements.settingsModal) elements.settingsModal.classList.remove('hidden');
      });
    }
    if (elements.closeSettings) {
      elements.closeSettings.addEventListener('click', () => {
        SoundFX.click();
        if (elements.settingsModal) elements.settingsModal.classList.add('hidden');
      });
    }
    if (elements.resetDemoBtn) elements.resetDemoBtn.addEventListener('click', resetDemo);

    // Close Receipt Modal
    if (elements.closeReceiptBtn) {
      elements.closeReceiptBtn.addEventListener('click', () => {
        SoundFX.click();
        if (elements.receiptModal) elements.receiptModal.classList.add('hidden');
      });
    }

    // Sound Toggle
    if (elements.soundToggle) {
      elements.soundToggle.addEventListener('click', () => {
        STATE.soundEnabled = !STATE.soundEnabled;
        elements.soundToggle.textContent = STATE.soundEnabled ? '🔊' : '🔇';
        if (STATE.soundEnabled) SoundFX.click();
      });
    }

    // C Logic Panel Toggle
    if (elements.cPanelToggle) {
      elements.cPanelToggle.addEventListener('click', () => {
        SoundFX.click();
        const isOpen = elements.cPanelToggle.classList.toggle('open');
        if (elements.cPanelBody) {
          elements.cPanelBody.classList.toggle('hidden', !isOpen);
        }
      });
    }

    // C Code Tabs
    document.querySelectorAll('.c-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        SoundFX.click();
        showCCode(tab.dataset.ctab);
      });
    });
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------
  function init() {
    loadPersistedData();
    createParticles();
    initEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
    showCCode('pin');
    showScreen(elements.idleScreen);
    console.log('🌿 Shvasa Virtual ATM Simulation initialized successfully.');
  }

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
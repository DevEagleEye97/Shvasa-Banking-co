# 🌿 Shvasa Bank — Virtual Indian ATM System
## Agent Architecture & Implementation Documentation

> **Status:** Completed & Validated  
> **Target Audience:** College/University Engineering & Computer Science Students, Evaluators, and AI Agent Engineers  
> **Core Educational Objective:** Demonstrate how fundamental C programming concepts (`int`, `printf`, `scanf`, `if/else`, `switch/case`, arithmetic & logical operators) power the automated decision-making engine of a modern banking ATM simulation through an interactive HTML5, CSS3, and JavaScript interface.

---

## 1. Executive Summary

We have created **Shvasa Bank**, a virtual Indian ATM banking simulation. The application mirrors the physical hardware workflow and digital user experience of a real-world ATM machine while remaining a safe, contained educational demonstration.

### Key Highlights:
- **No external frameworks/libraries used:** 100% Vanilla HTML5, CSS3, and JavaScript.
- **Physical ATM Simulation:** Animated card slot with reading LED, motorized cash dispenser shutter, currency notes, thermal receipt paper modal, and synthesized audio using the browser's Web Audio API.
- **Strict Logic Parity with C:** Every screen transition and transaction condition maps directly to standard first-year engineering C programming logic.

---

## 2. Project Directory Structure

```
banking/
├── index.html          # Semantic HTML5 UI structure (ATM bezel, screens, debit card, modals)
├── style.css           # Glassmorphism, luxury fintech theme, 3D card physics, keyframe animations
├── script.js           # Modular JavaScript simulation engine with localStorage persistence & Web Audio
├── AGENTS.md           # This document (Project architecture, specifications, and walkthrough)
├── README.md           # Student/Professor guide, build instructions, and academic disclaimers
└── c-program/
    └── atm.c          # Standalone, clean C program demonstrating the exact logic used by the UI
```

---

## 3. Detailed Features & Architectural Components

### A. Visual & UI/UX Design System
- **Color Palette:**
  - Background: Deep Forest Green (`#05140d` / `#0a2116`)
  - Primary Accents: Emerald Green (`#10b981`), Mint (`#34d399`)
  - Warm Highlights: Metallic Gold (`#f59e0b`, `#fef3c7`)
  - Glass Panels: Frosted backdrop blur (`12px`) with subtle gold & emerald borders (`rgba(245, 158, 11, 0.4)`)
- **Typography:**
  - Headings: *Playfair Display* (Editorial luxury banking aesthetic)
  - Interface: *Inter* (Crisp, clean legibility across all screen densities)
  - Terminals & Data: *JetBrains Mono* (Terminal microtext, IFSC, card numbers, and C code)
- **Atmospheric Effects:**
  - Ambient floating particles and rotating organic leaf motifs.
  - Subtle CRT scanline overlay across the ATM display screen.

### B. Virtual Debit Card & Insertion Mechanics
- **Card Aesthetics:**
  - Metallic gold EMV chip with detailed etched circuit lines.
  - Contactless payment curved wave indicators.
  - Dual Mastercard/RuPay-style overlapping hologram circles.
  - Partially masked card number: `4521 •••• •••• 8765`.
  - Cardholder Name: `DEMO USER`, Expiry: `12/30`.
- **Kinetic Animations:**
  - 3D perspective hover tilt (`rotateX`, `translateY`).
  - Upon user click, the card rotates and smoothly slides upward into the physical ATM slot (`cardSlideToAtm` keyframes).
  - Slot intake LED changes from idle green pulse to active amber reading state.

### C. Security & PIN Authentication Workflow
- **Verification Engine:**
  - 4-digit masked circular indicators (`○ ○ ○ ○` ➔ `● ● ● ●`).
  - Interactive virtual on-screen keypad + full physical keyboard support (0-9, Backspace, Enter).
  - Correct Demo PIN: `1234`.
  - Maximum attempts: `3`.
  - Security Lockout: If 3 wrong attempts occur, the system locks into a countdown screen with a 30-second live timer before auto-resetting.

### D. Core Banking Operations
1. **Account Balance Display:**
   - Default Starting Balance: `₹10,000`.
   - Real-time balance updates across both the ATM dashboard and Internet Banking tabs.
2. **Cash Withdrawal:**
   - Quick amount buttons: `₹500`, `₹1,000`, `₹2,000`, `₹5,000`, `₹10,000`.
   - Custom amount numeric input with Indian Rupee (`₹`) prefix.
   - **Validation Rules:**
     - Amount must be strictly `> 0`.
     - Amount must be in multiples of `₹100` (ATM denomination standard).
     - Amount must not exceed the current available balance.
   - **Confirmation Step:** Transparent breakdown showing withdrawal amount, current balance, remaining balance, and zero fees.
3. **Cash Dispenser & Note Animation:**
   - Motorized ATM cash shutter moves upward to reveal currency slot.
   - Stylized demo notes (`₹500`, `₹200`, `₹100`) emerge with pop-up physics.
4. **Thermal Receipt Printing:**
   - Realistic receipt modal styled like physical thermal paper.
   - Displays transaction timestamp, ATM ID (`GV-BLR-007`), card number, amount, and remaining balance.
5. **Simulated Internet Banking:**
   - **Summary Tab:** Account status, branch info, active balance.
   - **History Tab:** Timeline ledger of all withdrawals and initial credit.
   - **Details Tab:** IFSC code, Nominee status, Daily limit.
   - **Security Tab:** 2FA status, AES-256 mock indicator.
6. **Card Ejection & Session Reset:**
   - Card slides out from the slot with reverse physics (`cardEjectFromAtm`).
   - "Thank You" screen with "Start New Session" action.
   - "Reset Demo Account" button in Settings to return balance to ₹10,000 at any time.

### E. Web Audio Synthesizer (Zero External Audio Files)
- Keypad click: `850 Hz` sine wave burst.
- Card insertion: Dual-tone harmonic shift.
- Cash counting: Staccato square wave dispensing simulation.
- Success chime: Major triad chord (`C5 - E5 - G5`).
- Error buzz: Low-frequency sawtooth wave (`220 Hz` ➔ `180 Hz`).
- Includes a global **Sound ON/OFF** toggle in the header bar.

---

## 4. Educational C Programming Connection

The user interface logic directly mirrors the clean, beginner-friendly C code found in [`c-program/atm.c`](./c-program/atm.c).

| Concept | C Implementation | JavaScript Interface Implementation |
|---|---|---|
| **Variables & Types** | `int balance = 10000;`<br>`int actual_pin = 1234;` | `STATE.balance = 10000;`<br>`STATE.actualPin = '1234';` |
| **Input / Output** | `scanf("%d", &entered_pin);`<br>`printf("Available: %d", balance);` | Keypad click / input field listener<br>`balanceDisplay.textContent = formatCurrency(balance);` |
| **Conditional Decisions** | `if (entered_pin == actual_pin)`<br>`else { attempts++; }` | `if (STATE.enteredPin === STATE.actualPin)`<br>`else { STATE.attempts++; }` |
| **Multiple Branching** | `switch (choice) { case 1: ... case 2: ... }` | `menu-card` event listeners invoking specific view states |
| **Boundary Validations** | `if (amount <= 0)`<br>`else if (amount % 100 != 0)`<br>`else if (amount > balance)` | Client-side input validation check matching exact error copy |
| **Arithmetic Operators** | `balance = balance - withdraw_amount;` | `STATE.balance -= withdrawn; savePersistedData();` |
| **Session Control** | `while (choice != 4) { ... }` | Dynamic screen view router toggling `.hidden` utility classes |

---

## 5. Verification & Testing Performed

1. **HTTP Server Validation:** Verified on `http://localhost:3000` returning `HTTP 200 OK`.
2. **Browser Execution:** Verified screen transitions (Idle ➔ Reading ➔ PIN ➔ Dashboard ➔ Withdrawal ➔ Dispense ➔ Receipt ➔ Net Banking ➔ Ejection).
3. **Data Persistence:** Verified that refreshing the browser retains the updated balance and transaction ledger via `localStorage`.
4. **Code Quality:** Pure semantic HTML5, valid responsive CSS, and clean modular JS functions (`insertCard`, `verifyPin`, `withdrawMoney`, `addTransaction`, `ejectCard`, `resetDemo`).

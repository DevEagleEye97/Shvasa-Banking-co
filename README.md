# 🌿 Shvasa Bank — Virtual Indian ATM Simulation

An interactive educational project demonstrating **C programming logic through a modern, tactile HTML5, CSS3, and JavaScript interface**.

Designed for college and university level engineering / computer science students to understand how fundamental control structures, conditionals, arithmetic calculations, and variables power real-world financial automation.

---

## 🎯 Project Objectives

1. **Demonstrate Core C Programming Logic**:
   - Variables & Data Types (`int balance`, `int pin`)
   - Standard Input & Output (`printf`, `scanf`)
   - Decision Making Statements (`if`, `else if`, `else`)
   - Multi-way branching (`switch`, `case`, `break`)
   - Relational & Arithmetic operators (`==`, `>`, `<=`, `-`, `+`)
   - Loop structures (`while` loop for authentication and session lifecycle)

2. **Simulate Real Indian ATM Physical & Digital Workflow**:
   - Virtual debit card with chip, contactless antenna, and tactile 3D hover
   - Physical card insertion into ATM bezel slot with progress feedback
   - PIN authentication with secure masking and lock countdown
   - Cash withdrawal with quick denomination buttons (₹500, ₹1000, ₹2000, ₹5000, ₹10000) and custom inputs
   - Cash dispensing animation with educational currency notes
   - Interactive thermal receipt printing
   - Internet banking overview and transaction ledger
   - Safe card ejection and session termination

---

## 💻 C Programming Connection

The user interface's state machine directly reflects the beginner-friendly C implementation found in [`c-program/atm.c`](./c-program/atm.c).

### Core Logic Mapping

| UI Interaction | C Logic Equivalent |
|---|---|
| Card Insert & PIN Entry | `scanf("%d", &entered_pin); if (entered_pin == 1234)` |
| 3 Failed Attempts Lock | `attempts++; if (attempts >= 3) { /* lock */ }` |
| Main Menu Selection | `switch(choice) { case 1: ... case 2: ... }` |
| Cash Withdrawal Check | `if (amount <= 0) ... else if (amount > balance) ...` |
| Dispense & Deduction | `balance = balance - amount;` |
| Eject Card | `choice = 4; /* breaks out of while loop */` |

---

## 🔑 Demo Credentials

- **Demo PIN**: `1234`
- **Initial Account Balance**: `₹10,000`
- **Account Number**: `XXXX XXXX 4521`
- **Card Expiry**: `12/30`

*(All credentials and account numbers are strictly fictional for educational simulation).*

---

## 🚀 How to Run the Website

No external packages, frameworks, or dependencies are required.

1. Simply open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. Or run a local HTTP server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.

---

## 🛠️ How to Compile & Run the C Program

A standalone, ISO C99 compliant program is located in `c-program/atm.c`.

### Using GCC:
```bash
cd c-program
gcc atm.c -o atm
./atm
```

### Using Clang:
```bash
cd c-program
clang atm.c -o atm
./atm
```

### Using MSVC (Windows):
```cmd
cd c-program
cl atm.c
atm.exe
```

---

## 🎨 Visual Design Aesthetics

- **Color Palette**: Deep Forest Green (`#05140d`), Emerald Green (`#10b981`), Warm Gold (`#f59e0b`), Dark Teal (`#0f766e`).
- **Typography**: Playfair Display (Luxury Banking Headings), Inter (Clean Interface Sans), JetBrains Mono (Terminal & Microtext).
- **Physical ATM Elements**: Card slot with glowing intake LED, cash outlet with motorized shutter, thermal receipt feeder, sound synthesis using Web Audio API.

---

## ⚠️ Educational Disclaimer

This project is an **educational simulation** designed for classroom demonstrations, academic evaluations, and programming tutorials. **It does not connect to any real bank, financial institution, payment gateway, or actual currency.** Never enter real credit/debit card numbers or actual banking PINs.
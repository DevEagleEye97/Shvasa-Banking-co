/**
 * ============================================================================
 * SHVASA BANK - VIRTUAL ATM BANKING SYSTEM (C PROGRAM)
 * Educational Simulation demonstrating Beginner/Intermediate C Concepts
 * ============================================================================
 * 
 * Concepts Demonstrated:
 * 1. Variables & Data Types (int)
 * 2. Standard Input/Output (printf, scanf)
 * 3. Conditional Decision Making (if, else if, else)
 * 4. Control Flow (switch case, while loops)
 * 5. Arithmetic & Relational Operators (==, !=, >, <=, -, +)
 * 6. Clean Menu Driven Architecture
 * 
 * Note: This is an educational demo program simulating ATM decision-making logic.
 * Default Demo PIN: 1234
 * Starting Balance: 10,000 INR
 * ============================================================================
 */

#include <stdio.h>

int main()
{
    // -------------------------------------------------------------
    // 1. VARIABLE DECLARATION & INITIALIZATION
    // -------------------------------------------------------------
    int actual_pin = 1234;       // Pre-configured demo PIN
    int entered_pin;             // User inputted PIN
    int balance = 10000;         // Starting educational account balance (INR)
    int choice = 0;              // User menu choice
    int withdraw_amount = 0;     // Amount requested for cash withdrawal
    int attempts = 0;            // Failed attempt counter
    int is_authenticated = 0;    // Flag (0 = No, 1 = Yes)

    printf("\n========================================================\n");
    printf("           🌿 SHVASA BANK - VIRTUAL ATM             \n");
    printf("          Educational Simulation (C Programming)        \n");
    printf("========================================================\n");
    printf("Demo Credentials: PIN = 1234 | Starting Balance = Rs 10000\n\n");

    // -------------------------------------------------------------
    // 2. PIN AUTHENTICATION LOOP (Max 3 Attempts)
    // -------------------------------------------------------------
    while (attempts < 3)
    {
        printf("Please insert card and enter your 4-digit PIN: ");
        if (scanf("%d", &entered_pin) != 1)
        {
            printf("\n[ERROR] Invalid input. Digits only.\n");
            return 1;
        }

        // Comparison Operator: ==
        if (entered_pin == actual_pin)
        {
            is_authenticated = 1;
            printf("\n>>> Authentication Successful! Welcome, Demo User.\n");
            break;
        }
        else
        {
            attempts = attempts + 1;
            int remaining = 3 - attempts;
            printf("[ACCESS DENIED] Incorrect PIN.\n");
            if (remaining > 0)
            {
                printf("Attempts remaining: %d. Please try again.\n\n", remaining);
            }
            else
            {
                printf("\n[ALERT] 3 incorrect attempts made.\n");
                printf("[ALERT] Demo Account Temporarily Locked for Security.\n");
            }
        }
    }

    // If authentication failed after 3 tries, terminate program
    if (is_authenticated == 0)
    {
        printf("\nPlease contact branch support. Thank you for visiting Shvasa.\n");
        return 0;
    }

    // -------------------------------------------------------------
    // 3. MAIN ATM INTERACTIVE MENU LOOP
    // -------------------------------------------------------------
    while (choice != 4)
    {
        printf("\n--------------------------------------------------------\n");
        printf("                   ATM MAIN MENU                        \n");
        printf("--------------------------------------------------------\n");
        printf("  1. Check Account Balance\n");
        printf("  2. Withdraw Money (Cash)\n");
        printf("  3. Internet Banking (Summary)\n");
        printf("  4. Eject Card / Exit\n");
        printf("--------------------------------------------------------\n");
        printf("Enter your choice (1-4): ");
        scanf("%d", &choice);

        // ---------------------------------------------------------
        // 4. DECISION MAKING LOGIC (switch - case)
        // ---------------------------------------------------------
        switch (choice)
        {
            case 1:
                // Option 1: Balance Inquiry
                printf("\n>>> [ACCOUNT BALANCE INQUIRY]\n");
                printf("    Account Number : XXXX XXXX 4521\n");
                printf("    Account Holder : DEMO USER\n");
                printf("    Account Status : ACTIVE (DEMO)\n");
                printf("    Available Balance: Rs %d\n", balance);
                break;

            case 2:
                // Option 2: Cash Withdrawal
                printf("\n>>> [CASH WITHDRAWAL]\n");
                printf("    Available Balance: Rs %d\n", balance);
                printf("    Enter withdrawal amount (Multiples of Rs 100): Rs ");
                scanf("%d", &withdraw_amount);

                // Validation Condition 1: Must be greater than 0
                if (withdraw_amount <= 0)
                {
                    printf("\n    [ERROR] Invalid amount entered. Must be greater than 0.\n");
                }
                // Validation Condition 2: ATM denomination check (Multiples of 100)
                else if (withdraw_amount % 100 != 0)
                {
                    printf("\n    [ERROR] Please enter amount in multiples of Rs 100, 200, 500, or 2000.\n");
                }
                // Validation Condition 3: Check for sufficient balance
                else if (withdraw_amount > balance)
                {
                    printf("\n    [DECLINED] Insufficient Balance!\n");
                    printf("    Requested: Rs %d | Available: Rs %d\n", withdraw_amount, balance);
                }
                // Condition 4: Successful transaction
                else
                {
                    // Arithmetic Operator: balance - withdraw_amount
                    balance = balance - withdraw_amount;
                    printf("\n    [SUCCESS] Processing transaction...\n");
                    printf("    [SUCCESS] Counting cash notes...\n");
                    printf("    =========================================\n");
                    printf("    PLEASE COLLECT YOUR CASH: Rs %d\n", withdraw_amount);
                    printf("    Updated Remaining Balance: Rs %d\n", balance);
                    printf("    =========================================\n");
                }
                break;

            case 3:
                // Option 3: Internet Banking Overview
                printf("\n>>> [INTERNET BANKING SIMULATION]\n");
                printf("    Bank Name      : Shvasa Bank Ltd.\n");
                printf("    Account Type   : Premium Savings Account (Demo)\n");
                printf("    Account Number : XXXX XXXX 4521\n");
                printf("    Branch Code    : GV-IN-007\n");
                printf("    Net Banking    : Enabled (256-Bit SSL Mock)\n");
                printf("    Total Balance  : Rs %d\n", balance);
                break;

            case 4:
                // Option 4: Card Ejection and Session End
                printf("\n========================================================\n");
                printf("  PLEASE COLLECT YOUR CARD FROM THE SLOT\n");
                printf("  Thank you for banking with SHVASA BANK!\n");
                printf("  Have a wonderful day ahead.\n");
                printf("========================================================\n\n");
                break;

            default:
                // Catch-all for invalid selections
                printf("\n[ERROR] Invalid choice selected. Please choose between 1 and 4.\n");
                break;
        }
    }

    return 0;
}

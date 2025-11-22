# Librarian Workflow Guide

## 📚 How the System Works

This document explains the librarian's workflow when managing book/item loans and returns.

## 🔄 Complete Workflow

### Scenario 1: Member Borrows an Item

1. **Member comes to librarian** with an item they want to borrow
2. **Librarian opens the system** and goes to "Loans" page
3. **Librarian clicks "+ Borrow Item"** button
4. **Librarian fills in the form:**
   - Selects the available item from the dropdown
   - Selects the member who is borrowing
   - Sets the loan period (default: 14 days)
5. **Librarian clicks "📝 Record Loan (Item → UNAVAILABLE)"**
6. **System automatically:**
   - ✅ Creates a loan record
   - ✅ Marks the item as **UNAVAILABLE** (availability = false)
   - ✅ Adds the item to member's borrowed items list
   - ✅ Shows success message: "Item is now UNAVAILABLE (on loan)"

**Result:** Item status changes from **AVAILABLE** → **UNAVAILABLE**

### Scenario 2: Member Returns an Item

1. **Member comes to librarian** with the item they want to return
2. **Librarian opens the system** and goes to "Loans" page
3. **Librarian finds the item** in "Items Currently on Loan - UNAVAILABLE" section
4. **Librarian clicks "📚 Return (→ AVAILABLE)"** button
5. **System shows confirmation:** "The librarian is processing the return of '[Item Title]'. This will mark the item as AVAILABLE again. Confirm?"
6. **Librarian confirms**
7. **System automatically:**
   - ✅ Updates the loan record (sets returnDate, status = 'returned')
   - ✅ Marks the item as **AVAILABLE** (availability = true)
   - ✅ Removes the item from member's borrowed items list
   - ✅ Shows success message: "Item is now AVAILABLE for borrowing again"

**Result:** Item status changes from **UNAVAILABLE** → **AVAILABLE**

## 📊 Availability Status

### ✅ AVAILABLE
- Item is in the library
- Can be borrowed by members
- Shown in green badge: "✅ AVAILABLE"
- Appears in "Available Items - Ready to Borrow" section

### ❌ UNAVAILABLE (On Loan)
- Item is currently borrowed
- Cannot be borrowed (already on loan)
- Shown in red badge: "❌ UNAVAILABLE (On Loan)"
- Appears in "Items Currently on Loan - UNAVAILABLE" section

## 🎯 Key Points

1. **When Borrowing:**
   - Librarian records the loan in the system
   - Item automatically becomes **UNAVAILABLE**
   - Item cannot be borrowed again until returned

2. **When Returning:**
   - Librarian processes the return in the system
   - Item automatically becomes **AVAILABLE**
   - Item can be borrowed again by other members

3. **System Handles Everything:**
   - No manual status changes needed
   - Availability updates automatically
   - Loan records are created/updated automatically
   - Member's borrowed items list updates automatically

## 💡 Visual Indicators

- **Green badge** = ✅ AVAILABLE (ready to borrow)
- **Red badge** = ❌ UNAVAILABLE (currently on loan)
- **Green button** = Return action (makes item AVAILABLE)
- **Blue button** = Borrow action (makes item UNAVAILABLE)

## 🔍 Where to See Status

1. **Items Page:** Shows all items with their availability status
2. **Loans Page:** 
   - "Available Items" section = Items ready to borrow
   - "Items Currently on Loan" section = Items that are UNAVAILABLE
3. **Dashboard:** Shows statistics including available vs unavailable items

## ✅ Summary

- **Borrow** = Item becomes **UNAVAILABLE** ✅
- **Return** = Item becomes **AVAILABLE** ✅
- System handles all status changes automatically
- Librarian just needs to record the action in the system


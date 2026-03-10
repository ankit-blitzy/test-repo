# SUM and AVERAGE Formulas

SUM and AVERAGE are the two most commonly used spreadsheet functions — and often the very first formulas a new user learns. **SUM** adds all the numbers in a specified range, giving you a total. **AVERAGE** calculates the arithmetic mean of the values in a range, telling you the typical value. Together, these two functions form the foundation of data aggregation in any spreadsheet.

This chapter begins with an introduction to general formula concepts — cell references, operators, and the formula bar — that apply to all formulas you will encounter in this guide. It then covers SUM and AVERAGE in detail, with syntax references, practical examples using the [Acme Corp sample dataset](00-introduction.md#sample-dataset-acme-corp-quarterly-sales), and step-by-step cell-by-cell calculations so you can trace exactly how the spreadsheet arrives at each result.

---

## Introduction to Formulas

Before working with specific functions like SUM and AVERAGE, it is important to understand the fundamental concepts that underpin every formula in Calc. This section introduces those concepts and serves as a reference for all subsequent formula chapters in this guide.

### What Is a Formula?

A **formula** is an expression that begins with an equals sign (`=`) and instructs the spreadsheet to calculate a value. Formulas can contain any combination of the following elements:

- **Cell references** — pointers to other cells (e.g., `A1`, `C2:C6`)
- **Numbers** — literal numeric values (e.g., `100`, `0.05`)
- **Operators** — symbols that specify a calculation (e.g., `+`, `*`, `/`)
- **Functions** — named operations that perform specific calculations (e.g., `SUM`, `AVERAGE`)

When you enter a formula into a cell, the spreadsheet evaluates it and displays the computed result in that cell. The underlying formula remains visible in the Formula Bar when you select the cell.

**Example:** The formula `=A1+B1` adds the value in cell A1 to the value in cell B1 and displays the result.

### Cell References

Cell references allow a formula to use values from other cells. There are three types of cell references, and understanding how they behave when a formula is copied is essential for building reliable spreadsheets.

| Reference | Type | Behavior When Copied |
|-----------|------|----------------------|
| `A1` | Relative | Both row and column adjust relative to the new position |
| `$A$1` | Absolute | Neither row nor column adjusts — always points to A1 |
| `$A1` | Mixed | Column is fixed (always A), row adjusts |
| `A$1` | Mixed | Row is fixed (always 1), column adjusts |

- **Relative references** (e.g., `A1`) are the default. When you copy a formula containing `A1` one row down, the reference automatically changes to `A2`.
- **Absolute references** (e.g., `$A$1`) are locked in place with the dollar sign (`$`). Use absolute references when a formula must always point to the same cell, such as a tax rate or a conversion factor.
- **Mixed references** (e.g., `$A1` or `A$1`) lock either the column or the row, allowing the other to adjust. Mixed references are useful in table-style formulas that span both rows and columns.

### Operators

Operators perform calculations on values and cell references. Calc supports three categories of operators:

**Arithmetic Operators:**

| Operator | Operation | Example | Result |
|----------|-----------|---------|--------|
| `+` | Addition | `=5+3` | 8 |
| `-` | Subtraction | `=10-4` | 6 |
| `*` | Multiplication | `=6*7` | 42 |
| `/` | Division | `=20/4` | 5 |
| `^` | Exponentiation | `=2^3` | 8 |

**Comparison Operators:**

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `=` | Equal to | `=A1=10` | TRUE or FALSE |
| `>` | Greater than | `=A1>10` | TRUE or FALSE |
| `<` | Less than | `=A1<10` | TRUE or FALSE |
| `>=` | Greater than or equal to | `=A1>=10` | TRUE or FALSE |
| `<=` | Less than or equal to | `=A1<=10` | TRUE or FALSE |
| `<>` | Not equal to | `=A1<>10` | TRUE or FALSE |

**Text Operator:**

| Operator | Operation | Example | Result |
|----------|-----------|---------|--------|
| `&` | Concatenation | `="Hello"&" "&"World"` | Hello World |

**Operator Precedence:**

When a formula contains multiple operators, Calc evaluates them in the following order (highest precedence first):

1. **Parentheses** `()` — evaluated first; use them to override default precedence
2. **Exponentiation** `^`
3. **Multiplication and Division** `*` `/` — evaluated left to right
4. **Addition and Subtraction** `+` `-` — evaluated left to right

**Example:** The formula `=2+3*4` returns 14 (not 20), because multiplication is performed before addition. To force addition first, use parentheses: `=(2+3)*4` returns 20.

### The Formula Bar

The **Formula Bar** is a critical part of the Calc interface for working with formulas:

- **Location:** It is positioned above the cell grid, spanning the width of the spreadsheet workspace.
- **Display:** When you select a cell that contains a formula, the Formula Bar shows the formula itself (e.g., `=SUM(C2:C6)`), while the cell in the grid displays the calculated result (e.g., `76000`).
- **Editing:** Click inside the Formula Bar to enter a new formula or edit an existing one. Press **Enter** to confirm or **Escape** to cancel.
- **Formula View:** Press **Ctrl+`** (the backtick key) to toggle the entire sheet into formula view, which displays all formulas in their cells instead of computed results. This is useful for auditing and debugging. Press **Ctrl+`** again to return to the normal results view.

**Tip:** When entering a formula, you can click on cells directly in the grid instead of typing cell addresses. Calc will automatically insert the cell reference into the Formula Bar as you click.

---

## SUM Function

The **SUM** function adds all the numbers in a given set of cells or ranges and returns the total. It is the most fundamental aggregation function in any spreadsheet.

### Syntax

```text
=SUM(number1, [number2], ...)
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `number1` | Yes | The first number, cell reference, or range to add |
| `number2, ...` | No | Additional numbers, cell references, or ranges to include in the sum (up to 255 arguments) |

### Return Value

The sum of all numeric values across all specified arguments.

### Notes

- SUM **ignores** text values and empty cells within a range — they are skipped without causing an error.
- SUM can accept a mix of individual cell references, ranges, and literal numbers in a single call. For example: `=SUM(A1, B1:B10, 100)` adds the value in A1, all values in B1 through B10, and the number 100.
- Using `=SUM(C2:C6)` is equivalent to `=C2+C3+C4+C5+C6`, but SUM is preferred because it is easier to read, easier to extend, and handles non-numeric cells gracefully.

### Practical Example: Calculating Total Quarterly Sales

The following examples use the Acme Corp quarterly sales dataset from the [Introduction](00-introduction.md#the-data). For reference, here is the dataset as it appears in the spreadsheet:

| | A (Employee) | B (Region) | C (Q1 Sales) | D (Q2 Sales) | E (Q3 Sales) | F (Q4 Sales) |
|---|---|---|---|---|---|---|
| 1 | Employee | Region | Q1 Sales | Q2 Sales | Q3 Sales | Q4 Sales |
| 2 | Alice | North | 15000 | 18000 | 22000 | 19000 |
| 3 | Bob | South | 12000 | 14000 | 13000 | 16000 |
| 4 | Carol | East | 20000 | 17000 | 25000 | 23000 |
| 5 | Dave | West | 11000 | 13000 | 15000 | 14000 |
| 6 | Eve | North | 18000 | 21000 | 19000 | 22000 |

**Example 1: Total Q1 Sales (single column range)**

Calculate the total sales for Q1 across all five employees:

```text
=SUM(C2:C6)
```

**Result:** 76000

This formula adds every value in column C from row 2 to row 6: 15000 + 12000 + 20000 + 11000 + 18000 = 76000.

**Example 2: Total Annual Sales for Alice (single row range)**

Calculate Alice's total sales across all four quarters:

```text
=SUM(C2:F2)
```

**Result:** 74000

This formula adds Alice's sales for each quarter: 15000 + 18000 + 22000 + 19000 = 74000.

**Example 3: Grand Total of All Sales (multi-column, multi-row range)**

Calculate the grand total of all sales for all employees across all quarters:

```text
=SUM(C2:F6)
```

**Result:** 347000

This formula adds every numeric value in the rectangular range from C2 to F6 — that is, all 20 sales values in the dataset.

### Step-by-Step: SUM Calculation

Understanding how SUM evaluates a range step by step helps build confidence in using formulas and debugging unexpected results.

**Tracing `=SUM(C2:C6)` — Total Q1 Sales:**

1. **Identify the range:** The argument `C2:C6` specifies five cells — C2, C3, C4, C5, and C6.
2. **Read each cell value:**
   - C2 = 15000 (Alice)
   - C3 = 12000 (Bob)
   - C4 = 20000 (Carol)
   - C5 = 11000 (Dave)
   - C6 = 18000 (Eve)
3. **Add all values sequentially:**
   - 15000 + 12000 = 27000
   - 27000 + 20000 = 47000
   - 47000 + 11000 = 58000
   - 58000 + 18000 = **76000**
4. **Result:** Cell C7 displays **76000**.

**Verification:** 15000 + 12000 + 20000 + 11000 + 18000 = 76000 ✓

**Tracing `=SUM(C2:F2)` — Alice's Total Annual Sales:**

1. **Identify the range:** The argument `C2:F2` specifies four cells — C2, D2, E2, and F2.
2. **Read each cell value:**
   - C2 = 15000 (Q1)
   - D2 = 18000 (Q2)
   - E2 = 22000 (Q3)
   - F2 = 19000 (Q4)
3. **Add all values sequentially:**
   - 15000 + 18000 = 33000
   - 33000 + 22000 = 55000
   - 55000 + 19000 = **74000**
4. **Result:** The formula returns **74000**.

**Verification:** 15000 + 18000 + 22000 + 19000 = 74000 ✓

---

## AVERAGE Function

The **AVERAGE** function calculates the arithmetic mean of the numbers in a given set of cells or ranges. The arithmetic mean is computed by dividing the sum of all values by the count of those values.

### Syntax

```text
=AVERAGE(number1, [number2], ...)
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `number1` | Yes | The first number, cell reference, or range to include in the average |
| `number2, ...` | No | Additional numbers, cell references, or ranges to include |

### Return Value

The arithmetic mean (sum ÷ count) of all numeric values across the specified arguments.

### Notes

- AVERAGE **ignores** empty cells — they are not included in either the sum or the count.
- AVERAGE **includes** cells that contain the value 0 — zero is a valid numeric value and will be counted.
- Text values in the range are **ignored** — they are not counted in the denominator. This can produce unexpected results if some cells contain text instead of numbers (see [Common Errors and Troubleshooting](#common-errors-and-troubleshooting) below).
- **Difference from AVERAGEIF:** The AVERAGE function averages all numeric values in a range. The AVERAGEIF function (not covered in this chapter) averages only those values that meet a specified condition.

### Practical Example: Average Quarterly Sales

The following examples continue using the same Acme Corp dataset shown in the SUM section above.

**Example 1: Average Q1 Sales across all employees**

Calculate the average Q1 sales figure:

```text
=AVERAGE(C2:C6)
```

**Result:** 15200

This formula calculates (15000 + 12000 + 20000 + 11000 + 18000) ÷ 5 = 76000 ÷ 5 = 15200.

**Example 2: Average quarterly sales for Bob**

Calculate Bob's average sales per quarter:

```text
=AVERAGE(C3:F3)
```

**Result:** 13750

This formula calculates (12000 + 14000 + 13000 + 16000) ÷ 4 = 55000 ÷ 4 = 13750.

**Example 3: Average of all sales values in the dataset**

Calculate the overall average across all employees and all quarters:

```text
=AVERAGE(C2:F6)
```

**Result:** 17350

This formula calculates the sum of all 20 sales values (347000) divided by 20: 347000 ÷ 20 = 17350.

### Step-by-Step: AVERAGE Calculation

The AVERAGE function performs two operations internally: it sums the numeric values and then divides by the count. Tracing these steps reveals exactly how the result is computed.

**Tracing `=AVERAGE(C2:C6)` — Average Q1 Sales:**

1. **Identify the range:** The argument `C2:C6` specifies five cells — C2, C3, C4, C5, and C6.
2. **Read each cell value:**
   - C2 = 15000 (Alice)
   - C3 = 12000 (Bob)
   - C4 = 20000 (Carol)
   - C5 = 11000 (Dave)
   - C6 = 18000 (Eve)
3. **Calculate the sum:** 15000 + 12000 + 20000 + 11000 + 18000 = 76000
4. **Count the numeric values:** 5 cells contain numeric data.
5. **Divide sum by count:** 76000 ÷ 5 = **15200**
6. **Result:** Cell C8 displays **15200**.

**Verification:** 76000 / 5 = 15200.00 ✓

**Tracing `=AVERAGE(C3:F3)` — Bob's Average Quarterly Sales:**

1. **Identify the range:** The argument `C3:F3` specifies four cells — C3, D3, E3, and F3.
2. **Read each cell value:**
   - C3 = 12000 (Q1)
   - D3 = 14000 (Q2)
   - E3 = 13000 (Q3)
   - F3 = 16000 (Q4)
3. **Calculate the sum:** 12000 + 14000 + 13000 + 16000 = 55000
4. **Count the numeric values:** 4 cells contain numeric data.
5. **Divide sum by count:** 55000 ÷ 4 = **13750**
6. **Result:** The formula returns **13750**.

**Verification:** 55000 / 4 = 13750.00 ✓

---

## Combining SUM and AVERAGE: Regional Sales Summary

In practice, SUM and AVERAGE are often used together to build summary reports. This section demonstrates both functions working side by side to analyze Q1 sales performance by region.

### Objective

Using the Acme Corp dataset, calculate the **total** and **average** Q1 sales for each region. Recall from the [Introduction](00-introduction.md#dataset-details) that the regional distribution is:

- **North:** Alice (Row 2) and Eve (Row 6)
- **South:** Bob (Row 3)
- **East:** Carol (Row 4)
- **West:** Dave (Row 5)

### Summary Table

The table below shows the SUM and AVERAGE calculations for each region's Q1 sales:

| Region | Employees | Q1 Sales Values | Total Q1 Sales (SUM) | Average Q1 Sales (AVERAGE) |
|--------|-----------|-----------------|----------------------|---------------------------|
| North | Alice, Eve | 15000, 18000 | 15000 + 18000 = **33000** | 33000 ÷ 2 = **16500** |
| South | Bob | 12000 | **12000** | 12000 ÷ 1 = **12000** |
| East | Carol | 20000 | **20000** | 20000 ÷ 1 = **20000** |
| West | Dave | 11000 | **11000** | 11000 ÷ 1 = **11000** |
| **All** | **All 5** | — | **76000** | **15200** |

### Formulas Used

To build this summary in a spreadsheet, you would enter the following formulas. Since the North region employees are in non-contiguous rows (2 and 6), individual cell references are used instead of a single range:

**North Region:**

```text
=SUM(C2,C6)
```

Result: 33000

```text
=AVERAGE(C2,C6)
```

Result: 16500

**South Region:**

```text
=SUM(C3)
```

Result: 12000

```text
=AVERAGE(C3)
```

Result: 12000

**East Region:**

```text
=SUM(C4)
```

Result: 20000

```text
=AVERAGE(C4)
```

Result: 20000

**West Region:**

```text
=SUM(C5)
```

Result: 11000

```text
=AVERAGE(C5)
```

Result: 11000

**All Regions Combined:**

```text
=SUM(C2:C6)
```

Result: 76000

```text
=AVERAGE(C2:C6)
```

Result: 15200

**Tip:** In practice, the SUMIF and AVERAGEIF functions are more convenient for region-based calculations because they can automatically select employees belonging to a specific region based on the value in column B. These conditional aggregation functions are beyond the scope of this chapter but follow the same principles covered here.

---

## Common Errors and Troubleshooting

Working with SUM and AVERAGE is generally straightforward, but certain situations can produce unexpected results or errors. This section covers the most common issues you may encounter and how to resolve them.

### #VALUE! Error

**Cause:** A `#VALUE!` error occurs when a formula includes a direct arithmetic operation on a cell that contains text. For example, `=A1+B1` produces `#VALUE!` if B1 contains the text "hello" instead of a number.

**Important distinction:** The SUM and AVERAGE functions themselves **do not** produce `#VALUE!` errors from text cells within a range. When you use `=SUM(C2:C6)` and one of those cells contains text, SUM simply ignores that cell. The `#VALUE!` error arises only with direct arithmetic operations (using `+`, `-`, `*`, `/` operators) on text cells.

**Resolution:** Replace the direct arithmetic formula with a SUM or AVERAGE function call, or correct the text cell so it contains a numeric value.

### Incorrect Result from Text Cells in a Range

**Cause:** AVERAGE ignores text cells entirely — they are excluded from both the sum and the count. This changes the denominator and can produce a different average than expected.

**Example:** Suppose cell C5 contained the text "N/A" instead of the number 11000. The formula `=AVERAGE(C2:C6)` would then compute:

- Sum of numeric cells: 15000 + 12000 + 20000 + 18000 = 65000 (C5 is skipped)
- Count of numeric cells: 4 (not 5)
- Result: 65000 ÷ 4 = **16250** (instead of the expected 15200)

**Resolution:** Ensure all cells in the target range contain numeric values. Use the COUNTA function to verify the count of non-empty cells, or use ISNUMBER to check whether individual cells are numeric.

### #DIV/0! Error

**Cause:** A `#DIV/0!` error from AVERAGE occurs when the specified range contains **no numeric values at all** — the function attempts to divide the sum (0) by the count (0), resulting in division by zero.

**Resolution:** Ensure the range contains at least one numeric value before applying AVERAGE. You can guard against this error with an IF check:

```text
=IF(COUNT(C2:C6)>0, AVERAGE(C2:C6), 0)
```

This formula returns 0 instead of `#DIV/0!` when the range is empty.

### Unexpected Zero from SUM

**Cause:** SUM returns 0 when the specified range contains no numeric values — for example, when all cells are empty, contain text, or contain numbers that are stored as text (a common issue when importing data from external sources).

**Resolution:** Check that cell values are truly numeric. A number stored as text looks like a number but is left-aligned in the cell (numbers are right-aligned by default). To convert text-formatted numbers to actual numbers, select the cells and use the **Format > Cells** menu to set the format to "Number," or multiply each cell by 1 (e.g., `=A1*1`) to force a numeric conversion.

**Tip:** For a complete reference of all spreadsheet error codes — including `#VALUE!`, `#DIV/0!`, `#N/A`, `#REF!`, and `#NAME?` — see the [Quick Reference](09-quick-reference.md) chapter.

---

## Navigation

| | | |
|---|---|---|
| [← Data Organization](01-data-organization.md) | [↑ Documentation Index](../README.md) | [IF and VLOOKUP Formulas →](03-formulas-if-vlookup.md) |

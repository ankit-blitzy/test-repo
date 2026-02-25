# Quick Reference

This chapter consolidates all formula syntax, common keyboard shortcuts, error codes, and key spreadsheet terminology covered throughout this guide into a single, fast-lookup resource. Use it as a reference after reading the detailed chapters, or as a quick reminder when working in Calc.

Each entry includes a cross-reference to the detailed chapter where the topic is explained in full with practical examples and step-by-step calculations. For the sample dataset used throughout this guide, see the [Introduction](00-introduction.md#sample-dataset-acme-corp-quarterly-sales).

---

## Formula Syntax Quick Reference

The table below summarizes all nine functions covered in this guide. Optional parameters are enclosed in square brackets `[]`. Click the chapter reference link for detailed explanations, worked examples, and step-by-step calculation traces.

| Function | Syntax | Description | Example | Chapter Reference |
|----------|--------|-------------|---------|-------------------|
| **SUM** | `=SUM(number1, [number2], ...)` | Adds all numbers in one or more ranges | `=SUM(C2:C6)` | [Chapter 2: SUM and AVERAGE](02-formulas-sum-average.md) |
| **AVERAGE** | `=AVERAGE(number1, [number2], ...)` | Calculates the arithmetic mean of values in one or more ranges | `=AVERAGE(C2:C6)` | [Chapter 2: SUM and AVERAGE](02-formulas-sum-average.md) |
| **IF** | `=IF(condition, value_if_true, value_if_false)` | Returns one value if a logical test is TRUE and another if FALSE | `=IF(C2>15000,"Above","Below")` | [Chapter 3: IF and VLOOKUP](03-formulas-if-vlookup.md) |
| **VLOOKUP** | `=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])` | Searches the first column of a table and returns a value from a specified column in the matching row | `=VLOOKUP("Alice",A2:G6,3,FALSE)` | [Chapter 3: IF and VLOOKUP](03-formulas-if-vlookup.md) |
| **PMT** | `=PMT(rate, nper, pv, [fv], [type])` | Calculates the fixed periodic payment for a loan or annuity | `=PMT(0.05/12,360,-200000)` | [Chapter 6: Financial Analysis](06-financial-analysis.md) |
| **FV** | `=FV(rate, nper, pmt, [pv], [type])` | Calculates the future value of an investment with regular payments | `=FV(0.07/12,120,-500)` | [Chapter 6: Financial Analysis](06-financial-analysis.md) |
| **PV** | `=PV(rate, nper, pmt, [fv], [type])` | Calculates the present value of a series of future payments | `=PV(0.06/12,60,-500)` | [Chapter 6: Financial Analysis](06-financial-analysis.md) |
| **NPV** | `=NPV(rate, value1, [value2], ...)` | Calculates net present value by discounting future cash flows | `=NPV(0.10,C1:C5)` | [Chapter 6: Financial Analysis](06-financial-analysis.md) |
| **IRR** | `=IRR(values, [guess])` | Calculates the internal rate of return for a series of cash flows | `=IRR(B1:B6)` | [Chapter 6: Financial Analysis](06-financial-analysis.md) |

### Quick Tips for Formulas

- Every formula begins with an equals sign (`=`).
- Use cell references (e.g., `C2`) rather than hard-coded numbers so formulas update automatically when data changes.
- Press **F4** while editing a cell reference to cycle through relative (`A1`), absolute (`$A$1`), and mixed (`$A1`, `A$1`) reference types.
- Financial functions use a sign convention: cash outflows (payments you make) are negative, and cash inflows (money you receive) are positive.
- For NPV, add the initial investment separately outside the function because NPV assumes all values start at Period 1, not Period 0.

---

## Common Keyboard Shortcuts

The shortcuts below apply to most spreadsheet applications. Some key combinations may vary slightly between Calc implementations — consult your application's documentation if a shortcut does not work as expected.

### Navigation

| Shortcut | Action | Notes |
|----------|--------|-------|
| Ctrl+Home | Go to cell A1 | Moves the cursor to the beginning of the worksheet |
| Ctrl+End | Go to the last used cell | Moves to the bottom-right corner of the data region |
| Ctrl+Arrow Key | Jump to the edge of a data region | Moves in the arrow direction to the next non-empty or empty cell boundary |
| Ctrl+G | Go to a specific cell | Opens a dialog to enter a cell address or named range (may vary by application) |
| Page Up / Page Down | Scroll up or down by one screen | Moves the view and selection by one visible page of rows |

### Selection

| Shortcut | Action | Notes |
|----------|--------|-------|
| Shift+Arrow Key | Extend selection by one cell | Hold Shift and press an arrow key to grow the selection incrementally |
| Ctrl+Shift+End | Select from current cell to last used cell | Selects a rectangular block from the active cell to the bottom-right of the data |
| Ctrl+Shift+Home | Select from current cell to cell A1 | Selects a rectangular block from the active cell to the top-left of the sheet |
| Ctrl+A | Select all cells | Selects the entire worksheet; press once to select the current data region, twice for all cells |
| Ctrl+Space | Select entire column | Selects the full column of the active cell |
| Shift+Space | Select entire row | Selects the full row of the active cell |

### Editing

| Shortcut | Action | Notes |
|----------|--------|-------|
| F2 | Edit the active cell | Places the cursor inside the cell for editing; press Enter to confirm or Escape to cancel |
| Ctrl+Z | Undo | Reverses the last action; can be pressed multiple times to undo successive changes |
| Ctrl+Y | Redo | Reapplies an undone action |
| Ctrl+C | Copy | Copies the selected cells to the clipboard |
| Ctrl+X | Cut | Cuts the selected cells to the clipboard |
| Ctrl+V | Paste | Pastes clipboard contents into the selected location |
| Delete | Clear cell contents | Removes the content of selected cells without deleting the cells themselves |
| Ctrl+D | Fill down | Copies the content of the top cell in a selection to all cells below it |

### Formatting

| Shortcut | Action | Notes |
|----------|--------|-------|
| Ctrl+B | Bold | Toggles bold formatting on the selected cells |
| Ctrl+I | Italic | Toggles italic formatting on the selected cells |
| Ctrl+U | Underline | Toggles underline formatting on the selected cells |
| Ctrl+1 | Open Format Cells dialog | Provides access to all cell formatting options (number, alignment, font, border, background) |

### Formulas

| Shortcut | Action | Notes |
|----------|--------|-------|
| = | Start a formula | Type `=` in a cell to begin entering a formula |
| Tab | Accept autocomplete suggestion | When Calc suggests a function name, press Tab to insert it |
| Ctrl+` | Toggle formula view | Displays all formulas in their cells instead of computed results; press again to return to normal view |
| F4 | Toggle absolute/relative reference | Cycles a cell reference through relative, absolute, and mixed reference types while editing a formula |
| Ctrl+Shift+Enter | Enter an array formula | Enters the formula as an array formula (surrounded by curly braces in the Formula Bar) |

### File Operations

| Shortcut | Action | Notes |
|----------|--------|-------|
| Ctrl+S | Save | Saves the current workbook |
| Ctrl+N | New workbook | Creates a new, empty workbook |
| Ctrl+O | Open | Opens an existing workbook file |
| Ctrl+P | Print | Opens the print dialog for the current workbook |
| Ctrl+W | Close current workbook | Closes the active workbook (prompts to save if unsaved changes exist) |

---

## Error Code Reference

When a formula cannot produce a valid result, Calc displays an error code in the cell. The table below lists the six most common error codes, their meanings, typical causes, and recommended resolutions.

| Error Code | Meaning | Common Causes | Resolution |
|------------|---------|---------------|------------|
| **#VALUE!** | Wrong type of argument or operand | Using text where a number is expected; incompatible data types in a formula; applying arithmetic operators to non-numeric cells | Check cell references and data types. Ensure that all cells referenced by numeric operations contain numeric values. Use functions like `VALUE()` to convert text-formatted numbers if needed. |
| **#N/A** | Value not available | VLOOKUP cannot find the lookup value in the first column of the table; missing data in the specified range; lookup value has trailing spaces or mismatched case (for exact match) | Verify that the lookup value exists in the table. Check for leading or trailing spaces using `TRIM()`. Ensure the `range_lookup` parameter is set correctly (FALSE for exact match). Use `IFERROR()` to handle missing values gracefully. |
| **#REF!** | Invalid cell reference | Deleted cells or rows/columns that a formula was referencing; pasted data that overwrote referenced cells; moved ranges that broke formula links | Check formula references and update any broken cell addresses. Undo recent deletions or structural changes with Ctrl+Z. Manually correct the formula to point to the correct cells. |
| **#DIV/0!** | Division by zero | A formula divides by zero or by an empty cell; the divisor cell is blank or contains zero; AVERAGE applied to an empty range | Add an IF check before dividing (e.g., `=IF(B1=0, 0, A1/B1)`). Verify that divisor cells contain non-zero values. Ensure ranges passed to AVERAGE contain at least one numeric value. |
| **#NAME?** | Unrecognized formula name | Misspelled function name (e.g., `=SUMM(A1:A5)` instead of `=SUM(A1:A5)`); text strings not enclosed in quotation marks; referencing a named range that does not exist | Check the function name for correct spelling. Enclose text strings in double quotation marks. Verify that any named ranges referenced in the formula have been defined. |
| **#NUM!** | Invalid numeric value | A number is too large or too small for Calc to represent; invalid arguments passed to a function (e.g., a negative number in `SQRT()`); IRR cannot converge to a result | Verify that input values are within valid ranges for the function. For IRR, provide a `guess` parameter closer to the expected rate. Check that function arguments meet the documented constraints. |

### Error Handling Best Practice

Wrap formulas that may produce errors in the `IFERROR()` function to display a user-friendly message instead of a raw error code:

```text
=IFERROR(VLOOKUP("Alice", A2:G6, 3, FALSE), "Not Found")
```

This formula returns the VLOOKUP result if successful, or the text "Not Found" if any error occurs. See [Chapter 3: IF and VLOOKUP](03-formulas-if-vlookup.md) for additional error handling techniques.

---

## Glossary of Spreadsheet Terms

The following terms are used consistently throughout this guide. They are listed in alphabetical order for easy reference.

- **Cell** — The intersection of a row and a column; the basic unit of data entry in a spreadsheet. Each cell has a unique address such as A1 or C10.

- **Cell Reference** — The address of a cell (e.g., A1, B3). Cell references can be relative (A1), absolute ($A$1), or mixed ($A1, A$1). See [Chapter 2](02-formulas-sum-average.md) for a detailed explanation of reference types.

- **Chart** — A visual representation of data, such as a bar chart, line chart, or pie chart. Charts transform numeric data into graphical form for easier interpretation. See [Chapter 5](05-charts.md).

- **Column** — A vertical set of cells identified by letters (A, B, C, ... Z, AA, AB, ...). Each column typically represents one attribute or field in a dataset.

- **Conditional Formatting** — Rules that automatically change the appearance of cells (background color, font color, icons) based on their values or specified conditions. See [Chapter 8](08-conditional-formatting.md).

- **Data Validation** — Rules that control what data can be entered into specific cells, including dropdown lists, numeric ranges, and date constraints. See [Chapter 7](07-data-validation.md).

- **Formula** — An expression that begins with an equals sign (`=`) and instructs the spreadsheet to calculate a value. Formulas can contain cell references, numbers, operators, and functions.

- **Formula Bar** — The input area above the cell grid that displays the raw contents of the active cell. When a cell contains a formula, the Formula Bar shows the formula text while the cell displays the calculated result.

- **Function** — A predefined formula that performs a specific calculation, such as SUM, AVERAGE, IF, or VLOOKUP. Functions accept parameters (arguments) and return a computed value.

- **Named Range** — A user-defined name assigned to a cell or range of cells (e.g., naming C2:C6 as "Q1_Sales") for easier reference in formulas. See [Chapter 1](01-data-organization.md).

- **Pivot Table** — An interactive table that summarizes, groups, filters, and analyzes data from a source range. Pivot tables allow dynamic reorganization of data without modifying the original dataset. See [Chapter 4](04-pivot-tables.md).

- **Range** — A rectangular group of cells specified by the top-left and bottom-right cell addresses, separated by a colon (e.g., A1:C10, C2:C6).

- **Row** — A horizontal set of cells identified by numbers (1, 2, 3, ...). Each row typically represents one record or entry in a dataset.

- **Sheet / Worksheet** — A single page within a workbook containing its own independent grid of cells. Sheets are accessed via tabs at the bottom of the Calc window.

- **Workbook** — A file containing one or more worksheets. Workbooks are saved in formats such as ODS, XLSX, or CSV.

---

## Further Reading and Resources

### Guide Chapters

For in-depth coverage of each topic, refer to the corresponding chapter in this guide:

| Chapter | Topic | Description |
|---------|-------|-------------|
| [Introduction](00-introduction.md) | Getting Started | What is Calc, core concepts, sample dataset, and document conventions |
| [Chapter 1](01-data-organization.md) | Data Organization | Structuring data, data types, naming conventions, and layout best practices |
| [Chapter 2](02-formulas-sum-average.md) | SUM and AVERAGE | Aggregation formulas with step-by-step calculation examples |
| [Chapter 3](03-formulas-if-vlookup.md) | IF and VLOOKUP | Conditional logic and lookup formulas with evaluation traces |
| [Chapter 4](04-pivot-tables.md) | Pivot Tables | Creating, configuring, and analyzing data with pivot tables |
| [Chapter 5](05-charts.md) | Charts | Chart types, creation workflow, customization, and visualization best practices |
| [Chapter 6](06-financial-analysis.md) | Financial Analysis | PMT, FV, PV, NPV, IRR functions with worked financial examples |
| [Chapter 7](07-data-validation.md) | Data Validation | Validation rules, dropdown lists, input messages, and error alerts |
| [Chapter 8](08-conditional-formatting.md) | Conditional Formatting | Highlight rules, color scales, data bars, icon sets, and formula-based formatting |

### External Resources

The following external resources provide additional learning material and reference documentation for spreadsheet features:

- **Official LibreOffice Calc Documentation** — Comprehensive reference for all Calc features, functions, and interface elements. Available at the [LibreOffice Documentation](https://documentation.libreoffice.org/) website.
- **LibreOffice Calc Function Reference** — Complete catalog of every function available in Calc, organized by category. Accessible through the [LibreOffice Help](https://help.libreoffice.org/) portal.
- **Spreadsheet Community Forums** — Ask questions, share solutions, and learn from other users at the [Ask LibreOffice](https://ask.libreoffice.org/) community forum or the [LibreOffice subreddit](https://www.reddit.com/r/libreoffice/).
- **Getting Started with Calc Guide** — The official introductory guide for LibreOffice Calc, available at [LibreOffice Books](https://books.libreoffice.org/).

**Tip:** For the sample dataset and conventions used throughout this guide, refer to the [Introduction](00-introduction.md#sample-dataset-acme-corp-quarterly-sales).

---

[← Conditional Formatting](08-conditional-formatting.md) | [↑ Documentation Index](../README.md)

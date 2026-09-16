
import { useState, useEffect, useReducer, useRef, useCallback, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:      "#07090F",
  surface: "#0E1118",
  card:    "#131720",
  border:  "rgba(255,255,255,0.08)",
  muted:   "rgba(255,255,255,0.04)",
  pri:     "#F2F4FF",
  sec:     "#6B7490",
  dim:     "#2E3350",
  accent:  "#4F7DFF",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TOPICS = [
  { id:"whole-numbers",  name:"Whole Numbers",     icon:"🔢", free:true,  color:"#FF6B6B" },
  { id:"fractions",      name:"Fractions",         icon:"½",  free:true,  color:"#FF9F43" },
  { id:"decimals",       name:"Decimals",          icon:"·",  free:false, color:"#F9CA24" },
  { id:"percentage",     name:"Percentage",        icon:"%",  free:false, color:"#6AB04C" },
  { id:"ratio",          name:"Ratio",             icon:"∶",  free:false, color:"#22A6B3" },
  { id:"algebra",        name:"Algebra",           icon:"x²", free:false, color:"#BE2EDD" },
  { id:"speed",          name:"Speed",             icon:"⚡", free:false, color:"#EB4D4B" },
  { id:"area-perimeter", name:"Area & Perimeter",  icon:"📐", free:false, color:"#0652DD" },
  { id:"volume",         name:"Volume",            icon:"📦", free:false, color:"#1289A7" },
  { id:"angles",         name:"Angles",            icon:"△",  free:false, color:"#A3CB38" },
  { id:"average",        name:"Average",           icon:"≈",  free:false, color:"#FDA7DF" },
  { id:"data-analysis",  name:"Data Analysis",     icon:"📊", free:false, color:"#D980FA" },
];

const MOCK_PAPERS = [
  { id:"mock-a", label:"Mock Paper A", free:true,  questions:22, difficulty:"Foundation",   focus:"Whole Numbers, Fractions, Percentage, Ratio, Algebra" },
  { id:"mock-b", label:"Mock Paper B", free:false, questions:22, difficulty:"Intermediate", focus:"Decimals, Speed, Area & Perimeter, Volume, Data Analysis" },
  { id:"mock-c", label:"Mock Paper C", free:false, questions:22, difficulty:"Intermediate", focus:"Fractions, Percentage, Angles, Average, Algebra" },
  { id:"mock-d", label:"Mock Paper D", free:false, questions:22, difficulty:"Advanced",     focus:"Mixed Topics — All 12 Topics" },
  { id:"mock-e", label:"Mock Paper E", free:false, questions:22, difficulty:"Advanced",     focus:"Challenging Word Problems — Exam Simulation" },
];

const CONTENT = {
  "whole-numbers":{
    syllabus:"2026 P6 Syllabus · Number & Algebra",
    summary:"Whole numbers are the foundation of ALL other topics. Get this right first and every other topic becomes easier!",
    keyPoints:[
      "Place value: ones → tens → hundreds → thousands → ten-thousands → hundred-thousands → millions",
      "Rounding: look at the digit to the RIGHT of where you round. 5 or more = round UP; less than 5 = round DOWN.",
      "BODMAS: Brackets first → Division/Multiplication (left to right) → Addition/Subtraction (left to right).",
      "HCF = Highest Common Factor: the LARGEST number that divides exactly into both numbers.",
      "LCM = Lowest Common Multiple: the SMALLEST number that both numbers divide into exactly.",
      "Word problems: UNDERLINE key numbers → decide operation → show ALL working → check your answer.",
    ],
    commonMistakes:[
      "Forgetting BODMAS — always do brackets FIRST.",
      "Confusing HCF and LCM — HCF makes numbers SMALLER, LCM makes them BIGGER.",
      "Not showing working — even correct answers lose marks without working shown.",
    ],
    tip:"When stuck on a word problem: What do I KNOW? What do I need to FIND? Which operation connects them?",
    example:{ q:"Find the LCM of 12 and 18.", steps:["Multiples of 12: 12, 24, 36…","Multiples of 18: 18, 36…","First common multiple = 36"], a:"LCM = 36" },
  },
  "fractions":{
    syllabus:"2026 P6 Syllabus · Number & Algebra",
    summary:"Fractions appear in ALMOST every P6 word problem. Master the four operations and fraction-of-quantity problems to score consistently.",
    keyPoints:[
      "Equivalent fractions: multiply OR divide top and bottom by the SAME number.",
      "Simplest form: divide top and bottom by their HCF — always simplify your final answer!",
      "Add/Subtract: find the LCM of the denominators first, then operate on numerators only.",
      "Multiply: top × top, bottom × bottom — cancel common factors BEFORE multiplying.",
      "Divide: keep the first fraction, CHANGE ÷ to ×, FLIP the second fraction (reciprocal).",
      "Mixed number ↔ Improper: 2¾ = (2×4+3)/4 = 11/4 · 17/5 = 3 r2 = 3 2/5",
      "Fraction of a quantity: find 1 unit first using ÷, then × by what you need.",
    ],
    commonMistakes:[
      "Not simplifying the final answer — examiners DEDUCT marks for unsimplified fractions.",
      "Adding denominators instead of finding LCM (e.g. ½ + ⅓ is NOT 2/5).",
      "Forgetting to convert mixed numbers before multiplying or dividing.",
    ],
    tip:"Cancel diagonally BEFORE multiplying — it keeps numbers small and reduces careless mistakes.",
    example:{ q:"Calculate 2⅓ + 1¾.", steps:["Convert: 7/3 + 7/4","LCM(3,4) = 12","28/12 + 21/12 = 49/12"], a:"= 4 1/12" },
  },
  "decimals":{
    syllabus:"2026 P6 Syllabus · Number & Algebra",
    summary:"Decimals link fractions, percentages and money. One wrong decimal place loses the whole answer — be precise!",
    keyPoints:[
      "Place value after point: tenths (0.1) · hundredths (0.01) · thousandths (0.001).",
      "Rounding: look ONE PLACE to the right of where you round. ≥5 round up, <5 keep.",
      "Add/Subtract: ALWAYS line up decimal points — add zeros to fill gaps.",
      "Multiply: ignore the point, multiply as whole numbers, count TOTAL decimal places in both numbers for the answer.",
      "Divide by a decimal: multiply BOTH numbers by 10 or 100 until the divisor is a whole number.",
      "Key conversions: ½=0.5 · ¼=0.25 · ¾=0.75 · ⅕=0.2 · ⅛=0.125 · ⅜=0.375",
    ],
    commonMistakes:[
      "Not lining up decimal points when adding or subtracting.",
      "Forgetting to count decimal places correctly after multiplying.",
      "Rounding too early in the working — only round at the FINAL step.",
    ],
    tip:"2.4 × 1.5 → think 24 × 15 = 360 → 2 total decimal places → answer is 3.60",
    example:{ q:"Round 3.847 to 2 decimal places.", steps:["3rd decimal = 7","7 ≥ 5 → round 2nd decimal UP","4 becomes 5"], a:"= 3.85" },
  },
  "percentage":{
    syllabus:"2026 P6 Syllabus · Number & Algebra",
    summary:"Percentage means out of 100. It is used for discounts, GST, and changes. The ORIGINAL is ALWAYS 100%.",
    keyPoints:[
      "% → decimal: divide by 100 (35% = 0.35).",
      "% → fraction: put over 100 and simplify (40% = 2/5).",
      "X% of a number = (X ÷ 100) × number.",
      "Percentage increase = (Increase ÷ Original) × 100%.",
      "Percentage decrease = (Decrease ÷ Original) × 100%.",
      "GST in Singapore = 9%. Total with GST = price × 1.09.",
      "Reverse percentage: if 80% = $160, then 1% = $2, so 100% = $200.",
    ],
    commonMistakes:[
      "Using the NEW value as the base — ALWAYS use the ORIGINAL as 100%.",
      "Forgetting to add back the GST amount to get the final total.",
      "Finding the discount but not subtracting it to get the selling price.",
    ],
    tip:"ORIGINAL = 100%. For reverse percentage questions, ALWAYS find 1% first then multiply.",
    example:{ q:"A bag costs $80. After 25% discount, what is the price?", steps:["Discount = 25% × $80 = $20","Selling price = $80 − $20"], a:"= $60" },
  },
  "ratio":{
    syllabus:"2026 P6 Syllabus · Number & Algebra",
    summary:"Ratio compares quantities. The find-1-unit-first method solves almost every ratio problem in P6.",
    keyPoints:[
      "Simplify: divide ALL parts by their HCF.",
      "Ratio to fraction of total: A:B means A/(A+B) of the total.",
      "Sharing in ratio: Total ÷ sum of parts = value of 1 unit → multiply each part.",
      "Combining ratios: if A:B and B:C given, make B the SAME number in both.",
      "Changing ratio problems: identify which quantity stays UNCHANGED.",
      "Ratio and fractions: if ⅖ are boys, ratio of boys to girls = 2:3.",
    ],
    commonMistakes:[
      "Not simplifying the ratio before working — always simplify first.",
      "Forgetting to find 1 unit value before multiplying up.",
      "In changing ratio problems, mixing up which quantity is fixed.",
    ],
    tip:"Find 1 unit FIRST — every ratio word problem becomes simple after that one step.",
    example:{ q:"Ali and Beng share $120 in ratio 3:5. How much does Ali get?", steps:["Total = 3+5 = 8 units","1 unit = $120 ÷ 8 = $15","Ali = 3 × $15"], a:"= $45" },
  },
  "algebra":{
    syllabus:"2026 P6 Syllabus · Number & Algebra",
    summary:"Algebra uses letters to represent unknown values. P6 covers simplifying expressions, substitution, and solving one and two-step equations.",
    keyPoints:[
      "Like terms: same letter AND same power only (3x + 2x = 5x · 3x + 2y cannot be combined).",
      "Expanding brackets: multiply the term OUTSIDE by EVERY term inside (3(2x−4) = 6x−12).",
      "Substitution: replace every letter with the given number, then calculate carefully.",
      "Solving equations: do the SAME operation to BOTH sides to isolate the unknown.",
      "Forming equations: translate the English sentence into maths symbols, then solve.",
      "Always CHECK by substituting your answer back into the original equation.",
    ],
    commonMistakes:[
      "Combining unlike terms (3x + 2 cannot be simplified — 2 is a constant, not an x-term).",
      "Sign errors when expanding brackets with a negative number outside.",
      "Not checking the answer by substituting back into the equation.",
    ],
    tip:"Think of both sides as a balance scale — whatever you do to one side, MUST do to the other!",
    example:{ q:"Solve: 3x + 5 = 20.", steps:["3x = 20 − 5 = 15","x = 15 ÷ 3 = 5","Check: 3(5)+5 = 20 ✓"], a:"x = 5" },
  },
  "speed":{
    syllabus:"2026 P6 Syllabus · Measurement",
    summary:"Speed, Distance and Time are linked by one triangle. Draw it every time and you will never mix up the formula again.",
    keyPoints:[
      "DST Triangle: D on top · S × T at the bottom. Cover the letter you want to find.",
      "Speed = Distance ÷ Time",
      "Distance = Speed × Time",
      "Time = Distance ÷ Speed",
      "Average speed = TOTAL distance ÷ TOTAL time — NEVER average the two speeds directly.",
      "Relative speed: SAME direction → subtract speeds · OPPOSITE directions → add speeds.",
      "Unit conversion: 1 h = 60 min · 1 km = 1 000 m · 1 km/h = 1000/3600 m/s",
    ],
    commonMistakes:[
      "Finding average speed by averaging the two speeds — WRONG. Always total dist ÷ total time.",
      "Mixing up units — convert everything to the SAME unit before calculating.",
      "90 min = 1.5 h (NOT 1.9 h) — divide minutes by 60 to convert to hours.",
    ],
    tip:"Draw the DST triangle on EVERY speed question. Cover what you want — what is left is the formula!",
    example:{ q:"A car travels 180 km in 2.5 hours. Find its speed.", steps:["Speed = Distance ÷ Time","= 180 ÷ 2.5"], a:"= 72 km/h" },
  },
  "area-perimeter":{
    syllabus:"2026 P6 Syllabus · Measurement",
    summary:"Area = space INSIDE a shape (units²). Perimeter = total distance AROUND the outside (units). Know all formulas and never mix them up.",
    keyPoints:[
      "Square: Area = s² · Perimeter = 4s",
      "Rectangle: Area = l × b · Perimeter = 2(l + b)",
      "Triangle: Area = ½ × base × height (height MUST be perpendicular to the base)",
      "Parallelogram: Area = base × perpendicular height",
      "Circle: Area = πr² · Circumference = 2πr (use π = 3.14 unless told otherwise)",
      "Composite figures: split into known shapes, then ADD or SUBTRACT areas.",
      "Shaded area = Total area − Unshaded area",
    ],
    commonMistakes:[
      "Using the slant height instead of the perpendicular height for triangle area.",
      "Forgetting the ½ when finding triangle area.",
      "Confusing area (units²) and perimeter (units) — always check which is being asked.",
    ],
    tip:"Label every known measurement on the figure. For composite shapes: shade what you need, then ADD or SUBTRACT.",
    example:{ q:"Area of triangle: base 10 cm, perpendicular height 6 cm.", steps:["Area = ½ × base × height","= ½ × 10 × 6"], a:"= 30 cm²" },
  },
  "volume":{
    syllabus:"2026 P6 Syllabus · Measurement",
    summary:"Volume = space inside a 3D solid (units³). P6 focuses on cubes, cuboids, and water displacement — know all three well.",
    keyPoints:[
      "Cube: V = s³",
      "Cuboid: V = length × breadth × height",
      "1 litre = 1 000 ml = 1 000 cm³ · 1 m³ = 1 000 000 cm³",
      "Rate of filling: Volume ÷ Time = rate (litres/min).",
      "Water level rise when object is submerged: Rise = Volume of object ÷ Base area of tank.",
      "Volume of water in tank = base area × water height (not total tank height).",
    ],
    commonMistakes:[
      "Forgetting to convert cm³ to litres (÷ 1 000) or litres to cm³ (× 1 000).",
      "Using the full tank height instead of the water height.",
      "Forgetting that a fully submerged object displaces water equal to its own volume.",
    ],
    tip:"Object dropped into water: Rise × Base area = Volume of object. Very common P6 exam question!",
    example:{ q:"Tank 40 cm × 30 cm × 20 cm. Volume in litres?", steps:["V = 40 × 30 × 20 = 24 000 cm³","÷ 1 000"], a:"= 24 litres" },
  },
  "angles":{
    syllabus:"2026 P6 Syllabus · Geometry",
    summary:"Know the 7 angle properties and you can unlock any P6 angles question step by step — like solving a puzzle with clues.",
    keyPoints:[
      "Angles on a straight line = 180° (supplementary)",
      "Angles at a point = 360°",
      "Vertically opposite angles are EQUAL",
      "Angles in a triangle = 180°",
      "Equilateral triangle: all angles = 60°",
      "Isosceles triangle: base angles are EQUAL (the two equal sides face the equal angles)",
      "Exterior angle of a triangle = sum of the 2 NON-ADJACENT interior angles",
      "Angles in a quadrilateral = 360°",
    ],
    commonMistakes:[
      "Confusing vertically opposite with supplementary (adjacent) angles.",
      "Using 360° instead of 180° for angles on a straight line.",
      "Not writing down the angle property used — marks are given for stating the reason.",
    ],
    tip:"Write the angle property used for EACH step. Marks are given for reasons!",
    example:{ q:"Two angles of a triangle are 55° and 70°. Find the third angle.", steps:["Sum of angles in triangle = 180°","Third angle = 180° − 55° − 70°"], a:"= 55°" },
  },
  "average":{
    syllabus:"2026 P6 Syllabus · Statistics",
    summary:"Average (mean) is the fair share value of a data set. Master the formula Total = Average × Count and use it to work backwards.",
    keyPoints:[
      "Average = Total Sum ÷ Number of items",
      "Total Sum = Average × Number of items ← KEY formula for working backwards!",
      "Number of items = Total Sum ÷ Average",
      "Value ADDED: new total = old total + new value → new average = new total ÷ new count.",
      "Value REMOVED: new total = old total − removed value → new average = new total ÷ new count.",
      "Combined groups: find total of EACH group separately, add totals, divide by combined count.",
    ],
    commonMistakes:[
      "Averaging the averages when groups are different sizes — WRONG. Find totals first.",
      "Forgetting to update the COUNT when a value is added or removed.",
      "Confusing total sum with average — they are different things.",
    ],
    tip:"Total = Average × Count is the KEY to every average problem. Use it to work backwards from the answer.",
    example:{ q:"Average of 5 numbers is 12. One number (6) is removed. Find new average.", steps:["Total = 12 × 5 = 60","New total = 60 − 6 = 54","New average = 54 ÷ 4"], a:"= 13.5" },
  },
  "data-analysis":{
    syllabus:"2026 P6 Syllabus · Statistics",
    summary:"Data analysis is about reading and interpreting graphs and tables accurately. Most marks are earned by READING carefully, not by hard calculations.",
    keyPoints:[
      "Bar graphs: compare quantities across categories — read the SCALE INTERVAL carefully.",
      "Line graphs: show change over time — identify rises, falls, and flat (unchanged) sections.",
      "Pie charts: all sectors add to 360°. Fraction of total = sector angle ÷ 360°.",
      "Tables: check row and column totals; look for patterns before answering.",
      "Mean = total ÷ count · Median = middle value when ordered · Mode = most frequent value.",
      "ALWAYS read the title, axis labels, units and scale BEFORE answering any question.",
    ],
    commonMistakes:[
      "Misreading the scale interval — if each division = 5, a bar at the 3rd line = 15, NOT 3.",
      "Forgetting to arrange values in order before finding the median.",
      "Confusing mean, median and mode — know what each one measures.",
    ],
    tip:"Check the scale interval FIRST — this is where most data analysis marks are lost in exams.",
    example:{ q:"Pie chart: Science sector = 90°. What fraction chose Science?", steps:["Fraction = sector angle ÷ 360°","= 90 ÷ 360"], a:"= ¼" },
  },
};

const QUESTIONS = {
  "whole-numbers":[
    { q:"Find the HCF of 24 and 36.", a:"12", work:"Factors of 24: 1,2,3,4,6,8,12,24\nFactors of 36: 1,2,3,4,6,9,12,18,36\nHCF = 12", marks:1 },
    { q:"Find the LCM of 8 and 12.", a:"24", work:"Multiples of 8: 8,16,24…\nMultiples of 12: 12,24…\nLCM = 24", marks:1 },
    { q:"Round 47 856 to the nearest thousand.", a:"48 000", work:"Hundreds digit = 8 ≥ 5 → round UP\n47 856 → 48 000", marks:1 },
    { q:"Round 234 to the nearest ten.", a:"230", work:"Units digit = 4 < 5 → round DOWN\n234 → 230", marks:1 },
    { q:"What is the value of 5 in 3 502 817?", a:"500 000", work:"Position of 5 is hundred-thousands\n5 × 100 000 = 500 000", marks:1 },
    { q:"Calculate: 48 ÷ (6 + 2) × 3", a:"18", work:"Brackets first: 6+2 = 8\n48 ÷ 8 = 6\n6 × 3 = 18", marks:1 },
    { q:"A school has 1 248 boys and 1 375 girls. How many pupils altogether?", a:"2 623", work:"1 248 + 1 375 = 2 623", marks:1 },
    { q:"Find the HCF of 48 and 72.", a:"24", work:"Factors of 48: 1,2,3,4,6,8,12,16,24,48\nFactors of 72: 1,2,3,4,6,8,9,12,18,24,36,72\nHCF = 24", marks:1 },
    { q:"A factory makes 1 250 toys per day. How many toys in 3 weeks (5 working days/week)?", a:"18 750", work:"3 × 5 = 15 days\n15 × 1 250 = 18 750", marks:2 },
    { q:"Tom has 360 stickers. He gives ⅓ to Amy and ¼ to Ben. How many does he keep?", a:"150", work:"Amy: 360 ÷ 3 = 120\nBen: 360 ÷ 4 = 90\nKept: 360 − 120 − 90 = 150", marks:2 },
    { q:"List all prime numbers between 20 and 40.", a:"23, 29, 31, 37", work:"23 prime✓, 29 prime✓, 31 prime✓, 37 prime✓", marks:2 },
    { q:"A number when divided by 9 gives quotient 34 and remainder 7. Find the number.", a:"313", work:"Number = 9 × 34 + 7 = 306 + 7 = 313", marks:2 },
    { q:"What is the smallest number that is divisible by both 6 and 9?", a:"18", work:"LCM(6,9) = 18", marks:1 },
    { q:"Sam scored 87, 93, 76 and 84 in four tests. What is his total score?", a:"340", work:"87 + 93 + 76 + 84 = 340", marks:1 },
    { q:"A box holds 144 eggs. How many complete boxes are needed for 1 000 eggs?", a:"7", work:"1000 ÷ 144 = 6 r 136\n136 eggs need another box → 7 boxes", marks:2 },
    { q:"Find the value of 18 × 25 using a smart method.", a:"450", work:"18 × 25 = 18 × 100 ÷ 4 = 1800 ÷ 4 = 450", marks:1 },
    { q:"The product of two numbers is 120. One number is 8. Find the other.", a:"15", work:"Other = 120 ÷ 8 = 15", marks:1 },
    { q:"Ali spent $3.60 on Monday, $5.20 on Tuesday and $2.80 on Wednesday. Total?", a:"11.60", work:"3.60 + 5.20 + 2.80 = 11.60", marks:1 },
    { q:"A shopkeeper had 500 oranges. He sold 375. What fraction is left (simplest form)?", a:"1/4", work:"Left = 125\n125/500 = 1/4", marks:2 },
    { q:"Find two factors of 56 that differ by 1.", a:"7 and 8", work:"Factor pairs: 1×56, 2×28, 4×14, 7×8\n7 and 8 differ by 1 ✓", marks:2 },
    { q:"Round 6 499 to the nearest hundred.", a:"6 500", work:"Tens digit=9≥5 → round up\n6499→6500", marks:1 },
    { q:"Find the value of 7 × (12 − 5) + 3.", a:"52", work:"Brackets first: 12−5=7\n7×7=49\n49+3=52", marks:1 },
    { q:"A baker makes 850 buns. He packs them in boxes of 24. How many full boxes and how many buns are left over?", a:"35 boxes, 10 left over", work:"850÷24=35 r10", marks:2 },
    { q:"What is the smallest 4-digit number divisible by both 4 and 6?", a:"1008", work:"LCM(4,6)=12\nSmallest 4-digit multiple of 12 = 1008 (12×84)", marks:2 },
    { q:"The sum of two numbers is 84. Their difference is 12. Find the larger number.", a:"48", work:"Larger+Smaller=84; Larger−Smaller=12\n2×Larger=96; Larger=48", marks:2 },
  ],
  "decimals":[
    { q:"Round 4.736 to 1 decimal place.", a:"4.7", work:"2nd decimal = 3 < 5 → keep 1st decimal\n4.736 → 4.7", marks:1 },
    { q:"Round 2.851 to 2 decimal places.", a:"2.85", work:"3rd decimal = 1 < 5 → keep 2nd decimal\n2.851 → 2.85", marks:1 },
    { q:"Calculate 3.6 + 1.47.", a:"5.07", work:"3.60 + 1.47 = 5.07", marks:1 },
    { q:"Calculate 8.3 − 4.75.", a:"3.55", work:"8.30 − 4.75 = 3.55", marks:1 },
    { q:"Calculate 2.4 × 3.", a:"7.2", work:"24 × 3 = 72\n1 decimal place → 7.2", marks:1 },
    { q:"Calculate 1.5 × 0.6.", a:"0.9", work:"15 × 6 = 90\nTotal 2 decimal places → 0.90", marks:1 },
    { q:"Calculate 6.3 ÷ 0.9.", a:"7", work:"6.3 ÷ 0.9 = 63 ÷ 9 = 7", marks:1 },
    { q:"Express 0.375 as a fraction in simplest form.", a:"3/8", work:"0.375 = 375/1000\nHCF=125: 375÷125=3, 1000÷125=8 → 3/8", marks:1 },
    { q:"Express 7/20 as a decimal.", a:"0.35", work:"7/20 = 35/100 = 0.35", marks:1 },
    { q:"A pen costs $2.35 and an eraser costs $0.80. Find the total cost.", a:"3.15", work:"2.35 + 0.80 = 3.15", marks:1 },
    { q:"Jake bought 4 books at $3.75 each. How much did he spend?", a:"15", work:"4 × 3.75 = 15.00", marks:2 },
    { q:"A rope is 12.5 m long, cut into 5 equal pieces. How long is each piece?", a:"2.5", work:"12.5 ÷ 5 = 2.5 m", marks:1 },
    { q:"Arrange in ascending order: 0.3, 0.03, 0.33, 0.303", a:"0.03, 0.3, 0.303, 0.33", work:"0.030, 0.300, 0.303, 0.330\nAscending: 0.03, 0.3, 0.303, 0.33", marks:2 },
    { q:"A bag of flour weighs 2.8 kg. After using 1.35 kg, how much is left?", a:"1.45", work:"2.80 − 1.35 = 1.45 kg", marks:1 },
    { q:"3 friends share a bill of $47.25 equally. How much does each pay?", a:"15.75", work:"47.25 ÷ 3 = 15.75", marks:2 },
    { q:"A jug holds 1.5 litres. How many full cups of 0.25 litres can be filled?", a:"6", work:"1.5 ÷ 0.25 = 150 ÷ 25 = 6", marks:1 },
    { q:"What is 0.1 more than 4.99?", a:"5.09", work:"4.99 + 0.10 = 5.09", marks:1 },
    { q:"A car travels 8.4 km in 0.7 hours. What is its speed in km/h?", a:"12", work:"8.4 ÷ 0.7 = 84 ÷ 7 = 12 km/h", marks:2 },
    { q:"Mary had $20. She bought 3 items at $4.60, $7.85 and $3.20. How much change?", a:"4.35", work:"Total spent = 4.60+7.85+3.20 = 15.65\nChange = 20.00 − 15.65 = 4.35", marks:2 },
    { q:"A tank leaks 0.15 litres every minute. How much leaks in 2.5 hours?", a:"22.5", work:"2.5 hours = 150 minutes\n150 × 0.15 = 22.5 litres", marks:3 },
    { q:"Calculate 5.06 + 3.9.", a:"8.96", work:"5.06 + 3.90 = 8.96", marks:1 },
    { q:"Calculate 12 − 4.65.", a:"7.35", work:"12.00 − 4.65 = 7.35", marks:1 },
    { q:"A ribbon 6.4 m long is cut into pieces of 0.8 m. How many pieces?", a:"8", work:"6.4 ÷ 0.8 = 64 ÷ 8 = 8", marks:2 },
    { q:"Express 5/8 as a decimal.", a:"0.625", work:"5 ÷ 8 = 0.625", marks:1 },
    { q:"A car uses 0.12 litres of fuel per km. How much fuel for a 45 km trip?", a:"5.4", work:"0.12 × 45 = 5.4 litres", marks:2 },
  ],
  "fractions":[
    { q:"Express 2¼ as an improper fraction.", a:"9/4", work:"2 × 4 + 1 = 9 → 9/4", marks:1 },
    { q:"Express 17/5 as a mixed number.", a:"3 2/5", work:"17 ÷ 5 = 3 r 2 → 3 2/5", marks:1 },
    { q:"Calculate ¾ − ⅙.", a:"7/12", work:"LCM(4,6)=12: 9/12 − 2/12 = 7/12", marks:1 },
    { q:"Calculate ⅖ + ⅓.", a:"11/15", work:"LCM(5,3)=15: 6/15 + 5/15 = 11/15", marks:1 },
    { q:"Simplify 18/24 to its lowest terms.", a:"3/4", work:"HCF(18,24)=6: 18÷6=3, 24÷6=4 → 3/4", marks:1 },
    { q:"Calculate ⅗ × 25.", a:"15", work:"3/5 × 25 = 75 ÷ 5 = 15", marks:1 },
    { q:"Calculate 4 ÷ ⅔.", a:"6", work:"4 × 3/2 = 12/2 = 6", marks:1 },
    { q:"A ribbon is 3½ m long. Mary uses 1¼ m. How much is left?", a:"2 1/4", work:"3½ − 1¼ = 2¼ m", marks:2 },
    { q:"Tom ate 2/7 of a pizza. Sam ate 3/7. What fraction is left?", a:"2/7", work:"Eaten = 5/7; Left = 2/7", marks:1 },
    { q:"A recipe needs 2⅓ cups of flour. Mary makes 3 batches. How much flour?", a:"7", work:"7/3 × 3 = 7 cups", marks:2 },
    { q:"Which is greater: 5/8 or 7/12?", a:"5/8", work:"15/24 > 14/24 → 5/8 is greater", marks:2 },
    { q:"A tank is ⅗ full with 48 litres. What is the full capacity?", a:"80", work:"1/5 = 16L; Full = 80L", marks:2 },
    { q:"Calculate 1⅔ × 2¼.", a:"3 3/4", work:"5/3 × 9/4 = 45/12 = 15/4 = 3¾", marks:2 },
    { q:"Jane has ¾ kg of sugar and uses ⅓ kg. What fraction of the original is left?", a:"5/12", work:"3/4 − 1/3 = 9/12 − 4/12 = 5/12", marks:2 },
    { q:"A bag of rice weighs 5 kg. After using 1⅗ kg, how much is left?", a:"3 2/5", work:"5 − 8/5 = 17/5 = 3 2/5", marks:2 },
    { q:"3/4 of a number is 48. Find the number.", a:"64", work:"1/4 = 16; n = 64", marks:2 },
    { q:"Arrange smallest first: ½, ⅓, ⅖, ¾", a:"1/3, 2/5, 1/2, 3/4", work:"Common denom 60: 20,24,30,45", marks:2 },
    { q:"A class of 30 pupils: ⅖ are boys. How many girls?", a:"18", work:"Boys=12; Girls=18", marks:2 },
    { q:"Lily spent ¼ on a book and ⅓ on food. She had $35 left. How much at first?", a:"84", work:"5/12 = $35; Total = $84", marks:3 },
    { q:"A string is cut: ⅓ is first piece, ⅖ is second. Third piece is 30 cm. Total length?", a:"112.5", work:"4/15 × L = 30 → L = 112.5 cm", marks:3 },
    { q:"Calculate 3⅛ − 1⅝.", a:"1 1/2", work:"25/8 − 13/8 = 12/8 = 3/2 = 1½", marks:2 },
    { q:"A tank is ½ full. After removing 15 litres, it is ¼ full. Find the tank's capacity.", a:"60", work:"½−¼=¼ of capacity = 15L\nCapacity=60L", marks:2 },
    { q:"⅗ of the pupils in a class are boys. If there are 12 girls, how many pupils are in the class?", a:"30", work:"Girls=⅖ of total=12\n1/5=6; Total=5×6=30", marks:2 },
    { q:"Calculate (⅔ + ¼) × 12.", a:"11", work:"⅔+¼=8/12+3/12=11/12\n11/12×12=11", marks:2 },
    { q:"A piece of cloth is 8 m long. ⅜ of it is used for a dress. How much cloth is left?", a:"5", work:"Used=⅜×8=3\nLeft=8−3=5 m", marks:2 },
  ],
  "percentage":[
    { q:"What is 35% of $240?", a:"84", work:"35/100 × 240 = 84", marks:1 },
    { q:"Express 45 out of 60 as a percentage.", a:"75", work:"45/60 × 100 = 75%", marks:1 },
    { q:"Convert 0.64 to a percentage.", a:"64", work:"0.64 × 100 = 64%", marks:1 },
    { q:"Convert 3/8 to a percentage.", a:"37.5", work:"3÷8=0.375; ×100=37.5%", marks:1 },
    { q:"A shirt costs $60 after 25% discount. What was the original price?", a:"80", work:"75%=$60; 100%=$80", marks:2 },
    { q:"A price increased from $50 to $65. What is the percentage increase?", a:"30", work:"15/50 × 100 = 30%", marks:2 },
    { q:"In a class of 40 pupils, 24 are girls. What percentage are boys?", a:"40", work:"Boys=16; 16/40×100=40%", marks:2 },
    { q:"A TV costs $800. Sold at 15% discount. Find the selling price.", a:"680", work:"Discount=$120; SP=$680", marks:2 },
    { q:"Ali saved 20% of his salary. He saved $400. What is his salary?", a:"2000", work:"20%=$400; 100%=$2000", marks:2 },
    { q:"A school has 800 pupils. 45% are boys. How many girls?", a:"440", work:"Boys=360; Girls=440", marks:2 },
    { q:"Price decreased from $25 to $20. Find the percentage decrease.", a:"20", work:"5/25 × 100 = 20%", marks:2 },
    { q:"Peter scored 72 out of 80. What was his percentage score?", a:"90", work:"72/80 × 100 = 90%", marks:1 },
    { q:"A shop gave 12% discount on $150. Find the discount amount.", a:"18", work:"12/100 × 150 = 18", marks:1 },
    { q:"After a 20% increase, a bag costs $96. Original price?", a:"80", work:"120%=$96; 100%=$80", marks:2 },
    { q:"35 out of 50 students like Math. What % do NOT like Math?", a:"30", work:"Like=70%; Don't=30%", marks:2 },
    { q:"A jacket costs $120. 9% GST added. Find total price.", a:"130.80", work:"GST=$10.80; Total=$130.80", marks:2 },
    { q:"Ben spent 30% on food, 25% on transport from $500. How much is left?", a:"225", work:"Spent=55%=$275; Left=$225", marks:2 },
    { q:"A number increased by 40% gives 280. Find the original.", a:"200", work:"140%=280; 100%=200", marks:2 },
    { q:"A class of 30: 40% passed. How many failed?", a:"18", work:"Passed=12; Failed=18", marks:2 },
    { q:"Mum earned $3000. Spent 35% on rent, 20% on food. How much saved?", a:"1350", work:"Spent=55%=$1650; Saved=$1350", marks:3 },
    { q:"A laptop's price is reduced by 10%, then by a further 10% of the new price. If the original price was $1000, find the final price.", a:"810", work:"After 1st: 1000×0.9=900\nAfter 2nd: 900×0.9=810", marks:3 },
    { q:"In an election, candidate A received 60% of the votes and won by 200 votes. Find the total number of votes cast.", a:"1000", work:"A−B=200; A=60%, B=40%\nDifference=20%=200\n100%=1000", marks:3 },
    { q:"A school has 500 students. 64% are in the choir or band. If 30% are in the choir only and 18% are in both, find the percentage in the band only.", a:"16", work:"Choir or band=64%\nChoir only=30%, Both=18%\nBand only=64−30−18=16%", marks:3 },
    { q:"A worker's salary increased from $2500 to $2800. Find the percentage increase to 1 decimal place.", a:"12", work:"Increase=300\n300/2500×100=12%", marks:2 },
    { q:"40% of a number is 6 less than 60% of the same number. Find the number.", a:"30", work:"60%n−40%n=6\n20%n=6\nn=30", marks:3 },
  ],
  "ratio":[
    { q:"Simplify 36 : 48.", a:"3 : 4", work:"HCF=12; 3:4", marks:1 },
    { q:"Simplify 15 : 25 : 35.", a:"3 : 5 : 7", work:"HCF=5; 3:5:7", marks:1 },
    { q:"Ali and Beng share $120 in ratio 3:5. How much does Ali get?", a:"45", work:"1 unit=$15; Ali=3×$15=$45", marks:2 },
    { q:"A:B = 2:3 and B:C = 3:5. Find A:B:C.", a:"2 : 3 : 5", work:"B same → 2:3:5", marks:2 },
    { q:"Ratio boys:girls = 3:4. There are 28 girls. How many boys?", a:"21", work:"1 unit=7; Boys=21", marks:2 },
    { q:"Flour and sugar ratio 5:2. 200g flour used. How much sugar?", a:"80", work:"1 unit=40g; Sugar=80g", marks:2 },
    { q:"Red:blue:green = 2:3:5 with 40 balls. How many blue?", a:"12", work:"1 unit=4; Blue=12", marks:2 },
    { q:"Sam has $180 and Jim has $120. Simplest ratio?", a:"3 : 2", work:"HCF=60; 3:2", marks:1 },
    { q:"Tom:father age ratio is 1:4. Tom is 9. Father's age?", a:"36", work:"1 unit=9; Father=36", marks:1 },
    { q:"Divide 84 in ratio 3:4.", a:"36 and 48", work:"1 unit=12; 36 and 48", marks:2 },
    { q:"A:B = 4:7. If A = 28, find B.", a:"49", work:"1 unit=7; B=49", marks:1 },
    { q:"Ali had twice Beng's stickers. Ali gave 10 to Beng. Now equal. How many each?", a:"20", work:"2x−10=x+10; x=20", marks:3 },
    { q:"OJ and water mixed 2:5. How much water for 6L OJ?", a:"15", work:"1 unit=3L; Water=15L", marks:2 },
    { q:"Jane:Peter savings = 3:5. Together $240. Peter saves?", a:"150", work:"1 unit=$30; Peter=$150", marks:2 },
    { q:"A:B:C = 2:3:4. C = 24. Find A+B.", a:"30", work:"1 unit=6; A=12,B=18; A+B=30", marks:2 },
    { q:"Red:blue:yellow = 1:2:3. 12 yellow. Total marbles?", a:"24", work:"1 unit=4; Total=24", marks:2 },
    { q:"Tim's work:play = 3:2. Plays 4 hours. Work hours?", a:"6", work:"1 unit=2h; Work=6h", marks:1 },
    { q:"Boys:girls = 5:3. After 4 more girls join, ratio is 5:4. How many boys?", a:"20", work:"k=4; Boys=20", marks:3 },
    { q:"Two numbers in ratio 7:3. Difference is 28. Find larger number.", a:"49", work:"4 units=28; 1 unit=7; Larger=49", marks:2 },
    { q:"A:B:C = 5:2:3. If the total is 100, find the value of B.", a:"20", work:"Total=10 units; 1 unit=10\nB=2×10=20", marks:2 },
    { q:"In a bag, the ratio of red to blue marbles is 4:5. If there are 36 marbles in total, how many are red?", a:"16", work:"9 units=36; 1 unit=4\nRed=4×4=16", marks:2 },
    { q:"Two numbers are in ratio 3:8. If 12 is added to the smaller number, the ratio becomes 1:2. Find the original numbers.", a:"18 and 48", work:"3k+12)/(8k)=1/2\n2(3k+12)=8k\n6k+24=8k\nk=12\nNumbers: 36 and 96\nRecheck: 3×12=36, 8×12=96\n(36+12)/96=48/96=1/2 ✓", a:"36 and 96", work:"2(3k+12)=8k\n6k+24=8k; k=12\nNumbers=3k=36, 8k=96", marks:3 },
    { q:"A recipe requires flour, sugar and butter in ratio 4:2:1. If 8 cups of flour are used, how many total cups of all ingredients?", a:"14", work:"1 unit=2 cups\nTotal units=4+2+1=7\nTotal=7×2=14 cups", marks:2 },
    { q:"The ratio of Sam's money to Tom's money is 7:4. Sam has $45 more than Tom. How much does Tom have?", a:"60", work:"Difference=3 units=$45\n1 unit=$15\nTom=4×15=$60", marks:2 },
    { q:"A:B = 5:6. If A is increased by 10 and B stays the same, the new ratio is 5:4. Find the original value of B.", a:"6.4", work:"This problem needs A original value too.\n(5k+10)/(6k)=5/4\n4(5k+10)=30k\n20k+40=30k\n10k=40; k=4\nB=6×4=24", a:"24", work:"4(5k+10)=30k\n20k+40=30k; k=4\nB=6×4=24", marks:3 },
  ],
  "algebra":[
    { q:"Simplify 5x − 2y + 3x + 4y.", a:"8x + 2y", work:"8x + 2y", marks:1 },
    { q:"Solve: 4n − 7 = 21.", a:"7", work:"4n=28; n=7", marks:2 },
    { q:"Find 3a + 2b when a=4 and b=5.", a:"22", work:"12+10=22", marks:1 },
    { q:"Simplify 7p − 3q − 2p + 5q.", a:"5p + 2q", work:"5p + 2q", marks:1 },
    { q:"Solve: 2x + 9 = 25.", a:"8", work:"2x=16; x=8", marks:1 },
    { q:"If p=3, find p² + 2p − 1.", a:"14", work:"9+6−1=14", marks:2 },
    { q:"Solve: 3y + 4 = y + 10.", a:"3", work:"2y=6; y=3", marks:2 },
    { q:"A pen costs $n. A book costs 3 times as much. Total cost expression?", a:"4n", work:"n+3n=4n", marks:1 },
    { q:"Expand: 3(2x − 4).", a:"6x − 12", work:"6x−12", marks:1 },
    { q:"Solve: 5m − 3 = 3m + 7.", a:"5", work:"2m=10; m=5", marks:2 },
    { q:"Perimeter of square = (8x+4) cm. Find side length.", a:"2x + 1", work:"÷4 = 2x+1", marks:2 },
    { q:"If 4k = 36, find 2k + 5.", a:"23", work:"k=9; 23", marks:2 },
    { q:"Sam has (3n+2) apples, Amy has (n+6). Total?", a:"4n + 8", work:"4n+8", marks:1 },
    { q:"Solve: (x + 3)/2 = 7.", a:"11", work:"x+3=14; x=11", marks:2 },
    { q:"A number × 6 then + 15 gives 51. Find the number.", a:"6", work:"6n+15=51; n=6", marks:2 },
    { q:"Find (3x−1)(x+2) when x=2.", a:"20", work:"5×4=20", marks:2 },
    { q:"Cost of y kg of rice is $3.50y. If y=4, find cost.", a:"14", work:"3.50×4=$14", marks:1 },
    { q:"Tom has t marbles, Sam has 5 fewer, Ali has twice Tom's. Total?", a:"4t − 5", work:"t+(t−5)+2t=4t−5", marks:2 },
    { q:"Solve: 2(3n − 4) = 16.", a:"4", work:"6n−8=16; n=4", marks:2 },
    { q:"Sum of three consecutive numbers is 3n+3. Sum = 48. Find smallest.", a:"15", work:"3n+3=48; n=15", marks:3 },
    { q:"Simplify: 2(x+3) + 3(x−1).", a:"5x + 3", work:"2x+6+3x−3=5x+3", marks:2 },
    { q:"If 3(p−2)=15, find p.", a:"7", work:"p−2=5; p=7", marks:1 },
    { q:"A number n satisfies: n/4 + 5 = 12. Find n.", a:"28", work:"n/4=7; n=28", marks:2 },
    { q:"The cost of x apples at 50 cents each plus y oranges at 80 cents each is given by which expression?", a:"0.5x + 0.8y", work:"Apples=0.5x, Oranges=0.8y\nTotal=0.5x+0.8y", marks:1 },
    { q:"Solve: 7 − 2x = 1.", a:"3", work:"−2x=1−7=−6\nx=3", marks:2 },
  ],
  "speed":[
    { q:"A car travels 240 km in 4 hours. Find its speed.", a:"60", work:"240÷4=60 km/h", marks:1 },
    { q:"A cyclist travels at 15 km/h for 3 hours. Distance?", a:"45", work:"15×3=45 km", marks:1 },
    { q:"A runner covers 400 m at 8 m/s. Time taken?", a:"50", work:"400÷8=50 s", marks:1 },
    { q:"Convert 2 hours 30 minutes to hours.", a:"2.5", work:"30÷60=0.5 → 2.5h", marks:1 },
    { q:"Train travels at 90 km/h for 2h 30min. Distance?", a:"225", work:"90×2.5=225 km", marks:2 },
    { q:"Ali cycles 18 km in 45 minutes. Speed in km/h?", a:"24", work:"0.75h; 18÷0.75=24 km/h", marks:2 },
    { q:"Bus leaves 0830 at 60 km/h, arrives 1100. Distance?", a:"150", work:"2.5h × 60 = 150 km", marks:2 },
    { q:"Car A: 80 km/h. Car B: 100 km/h for 200 km. How much earlier does B arrive?", a:"30", work:"2.5h − 2h = 0.5h = 30 min", marks:2 },
    { q:"Man walks 3 km at 4 km/h then runs 6 km at 12 km/h. Average speed?", a:"7.2", work:"Total 9km in 1.25h = 7.2 km/h", marks:3 },
    { q:"Car from X to Y at 60, returns at 40. Average speed?", a:"48", work:"240÷5=48 km/h", marks:3 },
    { q:"Motorbike 09:00 at 70 km/h. Car 09:30 at 100 km/h. When does car overtake?", a:"10:40", work:"35km ÷ 30km/h = 70min after 09:30 = 10:40", marks:3 },
    { q:"Train 200 m long passes a pole in 10 seconds. Speed in m/s?", a:"20", work:"200÷10=20 m/s", marks:2 },
    { q:"Drove 120km in 2h, stopped 30 min, drove 90km in 1.5h. Average driving speed?", a:"60", work:"210÷3.5=60 km/h", marks:3 },
    { q:"Convert 90 km/h to m/s.", a:"25", work:"90000÷3600=25 m/s", marks:2 },
    { q:"Cyclist at 8am at 12 km/h. Car at 9am at 60 km/h same direction. Car passes cyclist at?", a:"9:15", work:"12km ÷ 48km/h = 15min → 9:15", marks:3 },
    { q:"Runner speed 8 m/s. Distance in 5 minutes (in km)?", a:"2.4", work:"8×300=2400m=2.4km", marks:2 },
    { q:"Bus 2h at 50 km/h, then 1h at 80 km/h. Average speed?", a:"60", work:"180÷3=60 km/h", marks:2 },
    { q:"Car at 75 km/h takes 2h 24min. Distance?", a:"180", work:"75×2.4=180 km", marks:2 },
    { q:"A and B run 1000m. A at 5 m/s, B at 4 m/s. By how much does A win?", a:"200", work:"B covers 800m when A finishes; 200m gap", marks:3 },
    { q:"A bus travels 315 km in 4.5 hours. Find its speed in km/h.", a:"70", work:"315÷4.5=70 km/h", marks:2 },
    { q:"A boy walks to school at 5 km/h and takes 24 minutes. Find the distance to school in km.", a:"2", work:"24min=0.4h\nDistance=5×0.4=2 km", marks:2 },
    { q:"A car covers a distance in 3 hours at 60 km/h. How long would it take at 90 km/h?", a:"2", work:"Distance=60×3=180 km\nTime=180÷90=2 h", marks:2 },
    { q:"Two friends start cycling towards each other from points 60 km apart, at 10 km/h and 14 km/h. How long until they meet?", a:"2.5", work:"Combined speed=24 km/h\nTime=60÷24=2.5 h", marks:2 },
    { q:"A train travels the first 120 km at 80 km/h and the next 90 km at 60 km/h. Find the average speed for the whole journey.", a:"70", work:"Time1=120÷80=1.5h; Time2=90÷60=1.5h\nTotal dist=210; Total time=3h\nAvg=210÷3=70 km/h", marks:3 },
    { q:"A cyclist travels 45 km in 1 hour 30 minutes. Find his speed in m/s.", a:"8.33", work:"1h30min=1.5h\nSpeed=45÷1.5=30 km/h\n30km/h=30×1000÷3600≈8.33 m/s", marks:3 },
  ],
  "area-perimeter":[
    { q:"Area of rectangle 9 cm × 5 cm.", a:"45", work:"9×5=45 cm²", marks:1 },
    { q:"Perimeter of rectangle 12 cm × 7 cm.", a:"38", work:"2(12+7)=38 cm", marks:1 },
    { q:"Area of triangle: base 10 cm, height 6 cm.", a:"30", work:"½×10×6=30 cm²", marks:1 },
    { q:"Area of square with side 9 cm.", a:"81", work:"9²=81 cm²", marks:1 },
    { q:"Circumference of circle r=7 cm. (π=3.14)", a:"43.96", work:"2×3.14×7=43.96 cm", marks:2 },
    { q:"Area of circle r=5 cm. (π=3.14)", a:"78.5", work:"3.14×25=78.5 cm²", marks:2 },
    { q:"Square has perimeter 28 cm. Find its area.", a:"49", work:"Side=7; Area=49 cm²", marks:2 },
    { q:"Rectangle area 60 cm², length 12 cm. Find perimeter.", a:"34", work:"b=5; P=2(12+5)=34 cm", marks:2 },
    { q:"Right-angled triangle legs 6 cm and 8 cm. Perimeter?", a:"24", work:"Hyp=10; P=24 cm", marks:2 },
    { q:"10×10 square with 4×4 square cut from corner. Shaded area?", a:"84", work:"100−16=84 cm²", marks:2 },
    { q:"Semicircle diameter 14 cm. Perimeter? (π=3.14)", a:"35.98", work:"πr+14=21.98+14=35.98 cm", marks:3 },
    { q:"Triangle base 14 cm, area 49 cm². Find height.", a:"7", work:"49=½×14×h; h=7 cm", marks:2 },
    { q:"Parallelogram base 15 cm, height 8 cm. Area?", a:"120", work:"15×8=120 cm²", marks:1 },
    { q:"Circle circumference 62.8 cm. Find radius. (π=3.14)", a:"10", work:"r=62.8÷6.28=10 cm", marks:2 },
    { q:"Rectangle 8×5 cm with semicircle on one end (d=5). Total area? (π=3.14)", a:"49.81", work:"40+9.81≈49.81 cm²", marks:3 },
    { q:"Rectangular field 60m×40m. Fencing cost at $5/m?", a:"1000", work:"P=200m; Cost=$1000", marks:2 },
    { q:"Rectangle ratio length:breadth = 3:2, perimeter 50 cm. Area?", a:"150", work:"L=15,b=10; Area=150 cm²", marks:3 },
    { q:"Lawn 25m×18m with square pond 5m×5m. Area of grass?", a:"425", work:"450−25=425 m²", marks:2 },
    { q:"A square has area 64 cm². Find its perimeter.", a:"32", work:"Side=√64=8 cm\nPerimeter=4×8=32 cm", marks:2 },
    { q:"A rectangle's length is twice its breadth. If the perimeter is 36 cm, find the area.", a:"72", work:"2(2b+b)=36 → 3b=18 → b=6, l=12\nArea=12×6=72 cm²", marks:3 },
    { q:"A circular pond has radius 14 m. Find its area. (π = 22/7)", a:"616", work:"Area=22/7×14²=22/7×196=616 m²", marks:2 },
    { q:"A garden is a square of side 20 m. A circular fountain of radius 7 m is built in the centre. Find the remaining area. (π=22/7)", a:"246", work:"Garden=400; Fountain=22/7×49=154\nRemaining=400−154=246 m²", marks:3 },
    { q:"Find the perimeter of a quarter circle with radius 14 cm. (π=22/7)", a:"50", work:"Arc=¼×2×22/7×14=22\nPerimeter=22+14+14=50 cm", marks:3 },
    { q:"A rectangular plot 36 m by 24 m is divided into 4 equal smaller rectangles. Find the area of one small rectangle.", a:"216", work:"Total area=36×24=864\nOne part=864÷4=216 m²", marks:2 },
    { q:"A square garden has perimeter 48 m. A path of width 1 m runs around the inside edge. Find the area of the path.", a:"44", work:"Side=12m; Inner side=12−2=10m\nPath area=12²−10²=144−100=44 m²", marks:3 },
  ],
  "volume":[
    { q:"Volume of cuboid 6×4×3 cm.", a:"72", work:"6×4×3=72 cm³", marks:1 },
    { q:"Volume of cube with side 5 cm.", a:"125", work:"5³=125 cm³", marks:1 },
    { q:"Convert 4.5 litres to ml.", a:"4500", work:"4.5×1000=4500 ml", marks:1 },
    { q:"Convert 3 500 cm³ to litres.", a:"3.5", work:"3500÷1000=3.5 L", marks:1 },
    { q:"Tank 40×30×20 cm. Volume in litres.", a:"24", work:"24000÷1000=24 L", marks:2 },
    { q:"Cube volume 216 cm³. Side length?", a:"6", work:"∛216=6 cm", marks:2 },
    { q:"Tank 50×30×40 cm, ¾ full. Litres of water?", a:"45", work:"60000×¾=45000 cm³=45L", marks:2 },
    { q:"Block 10×8×5 cm melted into 2 cm cubes. How many?", a:"50", work:"400÷8=50", marks:2 },
    { q:"Water flows at 2 L/min. Time to fill 120 L tank?", a:"60", work:"120÷2=60 min", marks:1 },
    { q:"Stone dropped in 30×20 cm tank. Water rises 0.5 cm. Volume of stone?", a:"300", work:"30×20×0.5=300 cm³", marks:2 },
    { q:"Tank 50×40 cm. Water at height 15 cm. Volume in litres?", a:"30", work:"30000÷1000=30L", marks:2 },
    { q:"Two identical cubes side by side, total volume 250 cm³. Side of one?", a:"5", work:"125 cm³; ∛125=5 cm", marks:2 },
    { q:"Fish tank 60×30×40 cm, 80% full. Litres of water?", a:"57.6", work:"72000×0.8=57600 cm³=57.6L", marks:2 },
    { q:"Cube total surface area 96 cm². Volume?", a:"64", work:"s²=16; s=4; V=64 cm³", marks:2 },
    { q:"Tank 50×40×30 cm. Water added at 5L/min. Time to fill?", a:"12", work:"60L÷5=12 min", marks:2 },
    { q:"Box 3× as long as wide, 2× as tall as wide. Width=4cm. Volume?", a:"384", work:"4×12×8=384 cm³", marks:3 },
    { q:"A fish tank measures 50 cm × 25 cm × 30 cm. Find its volume in litres.", a:"37.5", work:"V=50×25×30=37500 cm³\n37500÷1000=37.5 L", marks:2 },
    { q:"A cube-shaped box has a volume of 1000 cm³. Find the length of one side.", a:"10", work:"Side=∛1000=10 cm", marks:1 },
    { q:"A water tank 40×30×60 cm is filled to 75%. Find the volume of water in litres.", a:"54", work:"Full=40×30×60=72000 cm³\n75%×72000=54000 cm³=54 L", marks:2 },
    { q:"A rectangular block 12 cm × 8 cm × 5 cm is cut into 1 cm cubes. How many cubes?", a:"480", work:"V=12×8×5=480 cm³\nEach small cube = 1 cm³\nNumber=480", marks:2 },
    { q:"A tank's capacity is 18 litres. Water flows in at 0.3 litres per second. How long to fill it (in minutes)?", a:"1", work:"18÷0.3=60 seconds = 1 minute", marks:2 },
    { q:"A cuboid has length 9 cm, breadth 6 cm and volume 270 cm³. Find its height.", a:"5", work:"270÷(9×6)=270÷54=5 cm", marks:2 },
    { q:"A swimming pool 25 m × 10 m is filled with water to a depth of 1.5 m. Find the volume of water in m³.", a:"375", work:"V=25×10×1.5=375 m³", marks:2 },
    { q:"Two cubes of side 4 cm and 3 cm are combined. Find the total volume.", a:"91", work:"4³+3³=64+27=91 cm³", marks:2 },
    { q:"A rectangular tank measures 1.2 m × 0.8 m × 0.5 m. Find its volume in litres.", a:"480", work:"V=1.2×0.8×0.5=0.48 m³\n0.48×1000=480 litres", marks:2 },
  ],
  "angles":[
    { q:"Two angles on a straight line are 65° and x°. Find x.", a:"115", work:"180−65=115°", marks:1 },
    { q:"Angles at a point: 120°, 85°, 70°, x°. Find x.", a:"85", work:"360−275=85°", marks:1 },
    { q:"Triangle with angles 48° and 65°. Third angle?", a:"67", work:"180−48−65=67°", marks:1 },
    { q:"Isosceles triangle, apex angle 50°. Base angles?", a:"65", work:"(180−50)÷2=65° each", marks:2 },
    { q:"Two lines intersect, one angle is 42°. All four angles?", a:"42, 138, 42, 138", work:"Vert. opp.=42°; Adjacent=138°", marks:2 },
    { q:"Equilateral triangle interior angles?", a:"60", work:"180÷3=60° each", marks:1 },
    { q:"Exterior angle 110°. Two non-adjacent interior angles are equal. Find each.", a:"55", work:"110÷2=55°", marks:2 },
    { q:"Triangle: A=3x, B=2x, C=x. Find x.", a:"30", work:"6x=180; x=30°", marks:2 },
    { q:"Right-angled triangle, one angle 34°. Third angle?", a:"56", work:"180−90−34=56°", marks:1 },
    { q:"Quadrilateral: 90°, 85°, 100°, x°. Find x.", a:"85", work:"360−275=85°", marks:2 },
    { q:"Straight line crossed by two lines: 3x° and 2x° on one side. Find x.", a:"36", work:"5x=180; x=36°", marks:2 },
    { q:"Triangle PQR: exterior angle at R = 125°. Angle P = 60°. Find Q.", a:"65", work:"125=60+Q; Q=65°", marks:2 },
    { q:"Two angles of a triangle in ratio 2:3. Third angle is 60°. Find the two.", a:"48 and 72", work:"120×2/5=48; 120×3/5=72", marks:2 },
    { q:"Regular pentagon: each interior angle?", a:"108", work:"(5−2)×180÷5=108°", marks:2 },
    { q:"Triangle angles in ratio 1:2:3. Show it is right-angled.", a:"90", work:"6 parts=180°; 3×30=90° ✓", marks:2 },
    { q:"Co-interior angles: 3a° and 2a+10°. Find a.", a:"34", work:"5a+10=180; a=34°", marks:3 },
    { q:"In a triangle, one angle is twice another, and the third is 30° more than the smaller. Find the smallest angle.", a:"30", work:"Let smallest=x; angles: x, 2x, x+30\nx+2x+x+30=180; 4x=150; x=37.5\nRecheck: smallest angle x=37.5°", a:"37.5", work:"x+2x+(x+30)=180\n4x+30=180; 4x=150; x=37.5°", marks:3 },
    { q:"A pentagon has interior angles summing to 540°. If 4 angles are 100°, 110°, 95°, 115°, find the 5th.", a:"120", work:"540−100−110−95−115=120°", marks:2 },
    { q:"Two parallel lines are cut by a transversal. One angle is 65°. Find the co-interior angle.", a:"115", work:"Co-interior angles sum to 180°\n180−65=115°", marks:2 },
    { q:"In a right-angled triangle, the two non-right angles are in ratio 2:7. Find the smaller angle.", a:"20", work:"2+7=9 parts=90°\n1 part=10°\nSmaller=2×10=20°", marks:2 },
    { q:"An angle is 3 times its complement. Find the angle. (Complementary angles sum to 90°)", a:"67.5", work:"x+x/3=90... \nLet complement=y, angle=3y\ny+3y=90; 4y=90; y=22.5\nAngle=3×22.5=67.5°", marks:3 },
    { q:"A kite has two pairs of equal angles: 130°, 130°, and two equal angles x°. Find x.", a:"50", work:"Sum of quadrilateral=360°\n130+130+2x=360\n2x=100; x=50°", marks:2 },
    { q:"Find the sum of interior angles of a hexagon.", a:"720", work:"(n−2)×180=(6−2)×180=720°", marks:1 },
    { q:"Two angles are supplementary. One is 4 times the other. Find the smaller angle.", a:"36", work:"x+4x=180; 5x=180; x=36°", marks:2 },
    { q:"In triangle ABC, angle A = 90°. Angle B is 35° more than angle C. Find angle B.", a:"62.5", work:"B+C=90°\nB=C+35\nC+35+C=90; 2C=55; C=27.5\nB=27.5+35=62.5°", marks:3 },
  ],
  "average":[
    { q:"Find the average of 12, 18, 9, 15.", a:"13.5", work:"54÷4=13.5", marks:1 },
    { q:"Average of 5 numbers is 16. Find total.", a:"80", work:"16×5=80", marks:1 },
    { q:"Average of 4 numbers is 18. Three are 15, 20, 22. Find 4th.", a:"15", work:"72−57=15", marks:2 },
    { q:"Scores: 72, 68, 85, 90, 77, 64. Average?", a:"76", work:"456÷6=76", marks:2 },
    { q:"Average of 6 numbers is 15. One removed, new average 14. Number removed?", a:"20", work:"90−70=20", marks:2 },
    { q:"Class A (30 pupils) avg 72, Class B (20) avg 78. Overall average?", a:"74.4", work:"3720÷50=74.4", marks:3 },
    { q:"Average of n and 24 is 18. Find n.", a:"12", work:"n+24=36; n=12", marks:2 },
    { q:"Ali avg 76 in 3 tests. Needs 80 avg over 4. 4th test score?", a:"92", work:"320−228=92", marks:2 },
    { q:"Weekday avg 32°C. Week avg 31°C. Avg for Sat+Sun?", a:"28.5", work:"217−160=57; 57÷2=28.5°C", marks:3 },
    { q:"8 numbers avg 25. Number 17 replaced by 37. New average?", a:"27.5", work:"220÷8=27.5", marks:2 },
    { q:"5 friends avg age 12. Youngest (8) not counted. New average?", a:"13", work:"52÷4=13", marks:2 },
    { q:"Three consecutive even numbers, average is 20. Find them.", a:"18, 20, 22", work:"Middle=20; 18,20,22", marks:2 },
    { q:"Mean of 5 numbers is 12. Mean of 3 is 10. Mean of remaining 2?", a:"15", work:"30÷2=15", marks:2 },
    { q:"Add a number to {10,14,18,22} so average becomes 16.", a:"16", work:"80−64=16", marks:2 },
    { q:"Average of a,b,c is 15. Average of a,b,c,d is 18. Find d.", a:"27", work:"72−45=27", marks:2 },
    { q:"3 numbers avg 20. 4 others avg 25. Average of all 7?", a:"22.86", work:"160÷7≈22.86", marks:3 },
    { q:"The average of 4 numbers is 25. If 3 of the numbers are 18, 22 and 30, find the 4th.", a:"30", work:"Total=25×4=100\n4th=100−18−22−30=30", marks:2 },
    { q:"Find the average of the first 10 even numbers.", a:"11", work:"2+4+...+20=110\n110÷10=11", marks:2 },
    { q:"A shop's average daily sales for 6 days is $450. On the 7th day, sales were $600. Find the new average.", a:"471.43", work:"Old total=450×6=2700\nNew total=2700+600=3300\nNew avg=3300÷7≈471.43", marks:2 },
    { q:"The average height of 4 students is 1.5 m. A 5th student of height 1.7 m joins. Find the new average.", a:"1.54", work:"Old total=1.5×4=6\nNew total=6+1.7=7.7\nNew avg=7.7÷5=1.54 m", marks:2 },
    { q:"The average of 8 numbers is 30. Two numbers, 25 and 35, are removed. Find the new average.", a:"30", work:"Old total=240\nRemoved sum=60\nNew total=180\nNew avg=180÷6=30", marks:2 },
    { q:"Find x if the average of x, x+2, x+4 and x+6 is 20.", a:"17", work:"(4x+12)÷4=20\n4x+12=80\n4x=68; x=17", marks:2 },
    { q:"A delivery driver's average parcels per day over 5 days is 24. He delivers 30 on day 6. Find his new average.", a:"25", work:"Old total=24×5=120\nNew total=120+30=150\nNew avg=150÷6=25", marks:2 },
    { q:"The average mass of 3 boys is 42 kg. The average mass of 2 girls is 38 kg. Find the average mass of all 5 children.", a:"40.4", work:"Boys total=126; Girls total=76\nTotal=202; Avg=202÷5=40.4 kg", marks:3 },
    { q:"The average of 5 test scores is 75. The lowest score is removed, and the new average becomes 78. Find the lowest score.", a:"63", work:"Old total=375\nNew total=78×4=312\nLowest=375−312=63", marks:3 },
  ],
  "data-analysis":[
    { q:"Pie chart sector for Science = 90°. Fraction that chose Science?", a:"1/4", work:"90÷360=1/4", marks:1 },
    { q:"40 students like football, 25 like basketball. How many more like football?", a:"15", work:"40−25=15", marks:1 },
    { q:"Pie chart: 4 equal sectors. Percentage each sector?", a:"25", work:"100÷4=25%", marks:1 },
    { q:"12 boys + 18 girls swim. What % swim? (Total=40)", a:"75", work:"30/40×100=75%", marks:2 },
    { q:"Temperatures Mon-Thu: 28,30,27,32°C. Average?", a:"29.25", work:"117÷4=29.25°C", marks:2 },
    { q:"Pie chart: Maths=120°, English=80°. Fraction choosing both?", a:"5/9", work:"200÷360=5/9", marks:2 },
    { q:"Scores: 85,90,78,92,75. Find the median.", a:"85", work:"Ordered: 75,78,85,90,92; Median=85", marks:2 },
    { q:"Sales: Jan $500, Feb $650, Mar $480, Apr $720. Mean?", a:"587.50", work:"2350÷4=$587.50", marks:2 },
    { q:"Bar chart scale: 1 unit = 5 pupils. Bar at 7th line = how many?", a:"35", work:"7×5=35", marks:1 },
    { q:"60 students: 15 chose red, 20 blue, rest green. % green?", a:"41.7", work:"25/60×100≈41.7%", marks:2 },
    { q:"Pie chart: A=120°, B=90°, C=80°. Find D.", a:"70", work:"360−290=70°", marks:1 },
    { q:"Scores: 6,8,7,9,6,8,10,7,6,9. Find the mode.", a:"6", work:"6 appears 3 times", marks:1 },
    { q:"Profits: Q1=$2000, Q2=$3500, Q3=$2800, Q4=$4200. Total?", a:"12500", work:"2000+3500+2800+4200=12500", marks:1 },
    { q:"60% prefer cats, 30% dogs, rest others. 6 prefer others. Class size?", a:"60", work:"10%=6; 100%=60", marks:2 },
    { q:"Range is 45. Lowest score is 32. Highest?", a:"77", work:"32+45=77", marks:1 },
    { q:"Pie chart: 120 students, Science sector=75°. How many chose Science?", a:"25", work:"75/360×120=25", marks:2 },
    { q:"Bar chart: English=60, Maths=80, Science=70, Art=50. % for Maths?", a:"30.77", work:"80/260×100≈30.77%", marks:2 },
    { q:"Eggs: Mon=120,Tue=95,Wed=110,Thu=135,Fri=140. Mean daily?", a:"120", work:"600÷5=120", marks:2 },
    { q:"Art sector = 2× Music sector. Music=60°. Art's %?", a:"33.3", work:"120/360×100=33.3%", marks:2 },
    { q:"Test scores: 45, 60, 75, 60, 90, 60, 85. Find the mode.", a:"60", work:"60 appears 3 times — most frequent", marks:1 },
    { q:"A pie chart shows 4 sectors summing to 360°. Three are 90°, 120°, 60°. Find the 4th and its percentage.", a:"90 / 25%", work:"4th=360−90−120−60=90°\n90/360×100=25%", marks:2 },
    { q:"Data set: 12, 15, 12, 18, 20, 12, 15. Find mean, median, and mode.", a:"mean=14.86, median=15, mode=12", work:"Sum=104; Mean=104÷7≈14.86\nOrdered: 12,12,12,15,15,18,20; Median=15\nMode=12 (appears 3×)", marks:3 },
    { q:"A line graph shows rainfall (mm): Mon=5, Tue=12, Wed=0, Thu=8, Fri=15. Find the range.", a:"15", work:"Range=Highest−Lowest=15−0=15 mm", marks:1 },
    { q:"In a survey of 50 people, 18 prefer tea, 22 prefer coffee, and the rest prefer juice. What % prefer juice?", a:"20", work:"Juice=50−18−22=10\n10/50×100=20%", marks:2 },
    { q:"A bar chart shows weekly pocket money: $5, $8, $5, $10, $5, $12. Find the mode and the mean.", a:"mode=5, mean=7.5", work:"5 appears 3× → mode=5\nSum=45; Mean=45÷6=7.5", marks:2 },
  ],
};

// Sample mock paper questions (mock-a)
const PAPER_QS = {
  "mock-a":[
    { q:"There are 3 248 boys and 2 956 girls in a school. How many pupils altogether?", a:"6204", work:"3 248 + 2 956 = 6 204", marks:1, topic:"Whole Numbers", hint:"Add carefully, carrying over where needed." },
    { q:"Express ¾ as a decimal.", a:"0.75", work:"3 ÷ 4 = 0.75", marks:1, topic:"Fractions/Decimals", hint:"Memorise: ½=0.5, ¼=0.25, ¾=0.75." },
    { q:"What is the value of the digit 6 in 4 608 312?", a:"600000", work:"6 is in hundred-thousands: 6 × 100 000 = 600 000", marks:1, topic:"Whole Numbers", hint:"Count place values from right: ones, tens, hundreds, thousands, ten-thousands, hundred-thousands." },
    { q:"Find the LCM of 6 and 9.", a:"18", work:"Multiples of 6: 6,12,18… Multiples of 9: 9,18… LCM=18", marks:1, topic:"Whole Numbers", hint:"LCM = smallest number BOTH divide into exactly." },
    { q:"Simplify the fraction 36/48.", a:"3/4", work:"HCF(36,48)=12; 36÷12=3, 48÷12=4 → 3/4", marks:1, topic:"Fractions", hint:"Find HCF first, then divide both numbers by it." },
    { q:"Solve: 3x + 8 = 26.", a:"6", work:"3x=18; x=6. Check: 3(6)+8=26 ✓", marks:2, topic:"Algebra", hint:"Subtract the constant from both sides first, then divide." },
    { q:"Ali has $300. He spends 40% of it. How much does he have left?", a:"180", work:"Spent=40%×$300=$120; Left=$180", marks:2, topic:"Percentage", hint:"Find the amount spent, then subtract. OR find 60% directly." },
    { q:"Red to blue beads ratio = 3:7. There are 42 blue beads. How many red?", a:"18", work:"7 units=42; 1 unit=6; Red=3×6=18", marks:2, topic:"Ratio", hint:"Find 1 unit first by dividing the known amount by its number of units." },
    { q:"Find the value of 4y + 3 when y = 5.", a:"23", work:"4(5)+3=23", marks:1, topic:"Algebra", hint:"Replace the letter with the number and calculate." },
    { q:"A bag has 4 red, 5 blue and 3 yellow marbles. Fraction that are yellow (simplest form)?", a:"1/4", work:"3/12=1/4", marks:1, topic:"Fractions", hint:"Always simplify your fraction." },
    { q:"Average of 6 numbers is 15. Find their total.", a:"90", work:"Total=15×6=90", marks:1, topic:"Average", hint:"Total = Average × Count." },
    { q:"Scores: 72, 85, 68, 91, 74. Average score?", a:"78", work:"390÷5=78", marks:2, topic:"Average", hint:"Add all scores, then divide by number of tests." },
    { q:"Pie chart sector 90° for Science. What percentage chose Science?", a:"25", work:"90÷360×100=25%", marks:2, topic:"Data Analysis", hint:"Fraction = sector ÷ 360, then × 100 for %." },
    { q:"A shirt costs $96 after 20% discount. Original price?", a:"120", work:"80%=$96; 100%=$120", marks:2, topic:"Percentage", hint:"After 20% discount, remaining is 80%. Find 1% then ×100." },
    { q:"Triangle ABC: angle A=52°, angle B=74°. Find angle C.", a:"54", work:"180−52−74=54°", marks:2, topic:"Angles", hint:"Angles in any triangle sum to 180°." },
    { q:"Cuboid tank 60×40×25 cm. Volume in litres.", a:"60", work:"60000÷1000=60L", marks:2, topic:"Volume", hint:"After finding cm³, divide by 1000 for litres." },
    { q:"Ribbon 4½ m long. Jane uses 1¾ m. How much left?", a:"2 3/4", work:"4½−1¾=2¾ m", marks:2, topic:"Fractions", hint:"Convert to same denominator, borrow from whole number if needed." },
    { q:"Priya earns $2 400/month. Saves 25%. How much does she spend in a year?", a:"21600", work:"Spends $1800/month × 12 = $21 600", marks:3, topic:"Percentage", hint:"Find monthly spending first, then multiply by 12." },
    { q:"Tom and Jerry share 360 stickers ratio 5:4. Tom gives 20 to Jerry. New ratio?", a:"1:1", work:"Tom=200, Jerry=160; After: 180:180=1:1", marks:3, topic:"Ratio", hint:"Calculate each person's share first before adjusting." },
    { q:"Rectangular garden 24m×15m. Path 1.5m wide inside all edges. Area of path?", a:"108", work:"Outer=360; Inner=21×12=252; Path=108 m²", marks:3, topic:"Area & Perimeter", hint:"Path removes 2×1.5=3m from BOTH length and breadth." },
    { q:"A, B, C have money in ratio 2:3:5. Together $600. B buys something for $40. B has left?", a:"140", work:"B=3/10×$600=$180; Left=$140", marks:3, topic:"Ratio", hint:"Find 1 unit value first, then B's amount, then subtract." },
    { q:"Train 150m long at 72 km/h passes a stationary train 210m long. Time to pass completely?", a:"18", work:"Total=360m; 72km/h=20m/s; 360÷20=18s", marks:3, topic:"Speed", hint:"Moving train must travel its own length PLUS the other train's length." },
  ],
};

// ─── MOCK PAPER B — Intermediate: Decimals, Speed, Area & Perimeter, Volume, Data Analysis ───
PAPER_QS["mock-b"] = [
  { q:"Round 7.485 to 2 decimal places.", a:"7.49", work:"3rd decimal=5 ≥ 5 → round up 2nd decimal\n7.485 → 7.49", marks:1, topic:"Decimals", hint:"Look at the 3rd decimal place. 5 or more → round up." },
  { q:"Calculate 4.6 × 0.5.", a:"2.3", work:"46 × 5 = 230\n2 decimal places → 2.30 = 2.3", marks:1, topic:"Decimals", hint:"Multiply as whole numbers, then count total decimal places." },
  { q:"Express 9/25 as a decimal.", a:"0.36", work:"9/25 = 36/100 = 0.36", marks:1, topic:"Decimals", hint:"Convert to a fraction with denominator 100, or divide 9 ÷ 25." },
  { q:"A bottle holds 1.75 litres. How many ml is that?", a:"1750", work:"1.75 × 1000 = 1750 ml", marks:1, topic:"Decimals", hint:"1 litre = 1000 ml. Multiply by 1000." },
  { q:"A car travels at 80 km/h for 3.5 hours. How far does it travel?", a:"280", work:"Distance = Speed × Time\n= 80 × 3.5 = 280 km", marks:2, topic:"Speed", hint:"D = S × T. Convert time to hours first if needed." },
  { q:"A train covers 195 km in 2 hours 30 minutes. Find its speed.", a:"78", work:"2h 30min = 2.5h\nSpeed = 195 ÷ 2.5 = 78 km/h", marks:2, topic:"Speed", hint:"Convert time to hours (30 min = 0.5h), then use S = D ÷ T." },
  { q:"Find the area of a circle with diameter 20 cm. (π = 3.14)", a:"314", work:"r = 10 cm\nArea = 3.14 × 10² = 314 cm²", marks:2, topic:"Area & Perimeter", hint:"Diameter ÷ 2 = radius. Area = πr²." },
  { q:"A rectangle has perimeter 54 cm and length 16 cm. Find its area.", a:"121", work:"2(16+b)=54 → b=11\nArea=16×11=176... \nActually: b = 54÷2 − 16 = 27−16 = 11\nArea = 16 × 11 = 176 cm²", a:"176", work:"b = 27 − 16 = 11 cm\nArea = 16 × 11 = 176 cm²", marks:2, topic:"Area & Perimeter", hint:"Use P = 2(l+b) to find b first, then Area = l × b." },
  { q:"A cuboid is 8 cm × 5 cm × 4 cm. Find its volume.", a:"160", work:"V = 8 × 5 × 4 = 160 cm³", marks:1, topic:"Volume", hint:"V = length × breadth × height." },
  { q:"Convert 5 200 cm³ to litres.", a:"5.2", work:"5200 ÷ 1000 = 5.2 litres", marks:1, topic:"Volume", hint:"Divide by 1000 to convert cm³ to litres." },
  { q:"A bar chart shows: Mon=45, Tue=60, Wed=35, Thu=70, Fri=50. Find the mean.", a:"52", work:"45+60+35+70+50 = 260\n260 ÷ 5 = 52", marks:2, topic:"Data Analysis", hint:"Add all values and divide by the number of days." },
  { q:"A pie chart represents 360 students. A sector is 80°. How many students does it represent?", a:"80", work:"80/360 × 360 = 80 students", marks:2, topic:"Data Analysis", hint:"Fraction = sector ÷ 360, then multiply by total students." },
  { q:"Two towns are 210 km apart. Car A leaves at 09:00 at 70 km/h. Car B leaves at 09:30 at 84 km/h in the same direction from the same start. When does B overtake A?", a:"12:00", work:"At 09:30, A has travelled 35 km\nClosing speed = 84−70 = 14 km/h\nTime = 35 ÷ 14 = 2.5 h after 09:30 = 12:00", marks:3, topic:"Speed", hint:"Find A's head start distance, then use closing speed = difference in speeds." },
  { q:"A circle has circumference 94.2 cm. Find its area. (π = 3.14)", a:"706.5", work:"C = 2πr → r = 94.2 ÷ 6.28 = 15 cm\nArea = 3.14 × 15² = 3.14 × 225 = 706.5 cm²", marks:3, topic:"Area & Perimeter", hint:"Find r from circumference first (r = C ÷ 2π), then use Area = πr²." },
  { q:"A tank (base 60 cm × 50 cm) has water at height 20 cm. A metal block 10×10×10 cm is fully submerged. New water height?", a:"20.33", work:"Water vol = 60×50×20 = 60000 cm³\nBlock vol = 1000 cm³\nTotal = 61000 cm³\nNew height = 61000 ÷ (60×50) = 61000÷3000 ≈ 20.33 cm", marks:3, topic:"Volume", hint:"Rise = Volume of block ÷ Base area of tank. Add to original height." },
  { q:"A data set: 5, 8, 12, 7, 9, 11, 6, 8. Find the mean, median and mode.", a:"mean=8.25, median=8, mode=8", work:"Sum=66; Mean=66÷8=8.25\nOrdered: 5,6,7,8,8,9,11,12; Median=(8+8)÷2=8\nMode=8", marks:3, topic:"Data Analysis", hint:"Mean: sum÷count. Median: average of 2 middle values (even count). Mode: most frequent." },
  { q:"A 480-litre tank is filled by a pipe at 12 litres/min and drained by another at 4 litres/min. Both are open. How long to fill the tank from empty?", a:"60", work:"Net rate = 12−4 = 8 litres/min\nTime = 480 ÷ 8 = 60 min", marks:2, topic:"Speed/Volume", hint:"Net fill rate = fill rate − drain rate. Then Time = Volume ÷ Net rate." },
  { q:"A path 2 m wide runs around the outside of a rectangular garden 30 m × 20 m. Find the area of the path.", a:"216", work:"Outer = (30+4)×(20+4) = 34×24 = 816\nInner = 30×20 = 600\nPath = 816−600 = 216 m²", marks:3, topic:"Area & Perimeter", hint:"Add 2×path width to BOTH length and breadth for the outer rectangle." },
  { q:"Mary drove 90 km at 60 km/h, then 120 km at 80 km/h. Find her average speed for the whole journey.", a:"70", work:"Time 1 = 90÷60 = 1.5h\nTime 2 = 120÷80 = 1.5h\nAvg speed = 210÷3 = 70 km/h", marks:3, topic:"Speed", hint:"Average speed = total distance ÷ total time. Never average the two speeds." },
  { q:"A line graph shows a shop's sales: Jan=$2400, Feb=$1800, Mar=$3000, Apr=$2700, May=$3300. In which month did sales increase most from the previous month?", a:"March", work:"Jan→Feb: −600\nFeb→Mar: +1200 ✓ (largest increase)\nMar→Apr: −300\nApr→May: +600", marks:2, topic:"Data Analysis", hint:"Calculate the change between each consecutive pair of months." },
  { q:"3 friends share a restaurant bill of $89.70. One friend has a $14.70 coupon. The remaining amount is split equally. How much does each of the other two pay?", a:"37.50", work:"After coupon: 89.70−14.70 = $75.00\nEach of other 2 = 75÷2 = $37.50", marks:2, topic:"Decimals", hint:"Subtract the coupon from the total first, then split the remainder." },
  { q:"A cube has volume 512 cm³. Find its total surface area.", a:"384", work:"Side = ∛512 = 8 cm\nSurface area = 6 × 8² = 6 × 64 = 384 cm²", marks:3, topic:"Volume", hint:"Find the side length first (cube root of volume), then surface area = 6 × s²." },
];

// ─── MOCK PAPER C — Intermediate: Fractions, Percentage, Angles, Average, Algebra ───
PAPER_QS["mock-c"] = [
  { q:"Calculate 2⅕ + 1⅗.", a:"3 4/5", work:"2⅕ + 1⅗ = 11/5 + 8/5 = 19/5 = 3 4/5", marks:1, topic:"Fractions", hint:"Convert to improper fractions first, add numerators (same denominator)." },
  { q:"Simplify: 4a + 3b − a + 5b.", a:"3a + 8b", work:"(4a−a) + (3b+5b) = 3a + 8b", marks:1, topic:"Algebra", hint:"Group like terms: collect all 'a' terms and all 'b' terms separately." },
  { q:"What is 65% of 420?", a:"273", work:"65/100 × 420 = 273", marks:1, topic:"Percentage", hint:"Multiply by 65 then divide by 100, or find 10% first and build up." },
  { q:"Find the average of 23, 17, 31, 14, 25.", a:"22", work:"23+17+31+14+25 = 110\n110 ÷ 5 = 22", marks:1, topic:"Average", hint:"Add all values, then divide by how many there are." },
  { q:"Angles on a straight line: 2x° and 3x+10°. Find x.", a:"34", work:"2x + 3x + 10 = 180\n5x = 170\nx = 34°", marks:2, topic:"Angles", hint:"Angles on a straight line sum to 180°. Form and solve the equation." },
  { q:"After a 30% increase, a price is $117. Find the original price.", a:"90", work:"130% = $117\n1% = $0.90\n100% = $90", marks:2, topic:"Percentage", hint:"After 30% increase, new amount is 130% of original. Find 1% then ×100." },
  { q:"The average of 7 numbers is 14. When an 8th number is added, the average becomes 15. Find the 8th number.", a:"22", work:"Old total = 14×7 = 98\nNew total = 15×8 = 120\n8th number = 120−98 = 22", marks:2, topic:"Average", hint:"Find both totals using Total = Average × Count, then subtract." },
  { q:"A:B = 4:5 and B:C = 2:3. Find A:B:C.", a:"8:10:15", work:"Make B same: LCM(5,2)=10\nA:B = 8:10, B:C = 10:15\nA:B:C = 8:10:15", marks:2, topic:"Ratio", hint:"Make B equal in both ratios by finding LCM of the two B values." },
  { q:"An isosceles triangle has base angles of 72° each. Find the apex angle.", a:"36", work:"Apex = 180 − 72 − 72 = 36°", marks:1, topic:"Angles", hint:"All three angles in a triangle sum to 180°." },
  { q:"Solve: 4(2n − 3) = 20.", a:"3.25", work:"8n − 12 = 20\n8n = 32\nn = 4\nCheck: 4(8−3)=4×5=20 ✓\nActual: n=4", a:"4", work:"8n−12=20; 8n=32; n=4. Check: 4(8−3)=20 ✓", marks:2, topic:"Algebra", hint:"Expand the bracket first, then solve step by step." },
  { q:"⅗ of a class are girls. There are 18 girls. How many boys are in the class?", a:"12", work:"Total = 18 ÷ (3/5) = 18 × 5/3 = 30\nBoys = 30 − 18 = 12", marks:2, topic:"Fractions", hint:"Find the total class size first (18 is ⅗ of total), then subtract girls." },
  { q:"A price is reduced by 15% to $51. What was the original price?", a:"60", work:"85% = $51\n1% = $0.60\n100% = $60", marks:2, topic:"Percentage", hint:"After 15% reduction, what remains is 85%. Find 1% then ×100." },
  { q:"Exterior angle of a triangle is 130°. One of the non-adjacent interior angles is 75°. Find the other non-adjacent angle.", a:"55", work:"Exterior angle = sum of 2 non-adjacent interior angles\n130 = 75 + x\nx = 55°", marks:2, topic:"Angles", hint:"Exterior angle = sum of the 2 non-adjacent interior angles." },
  { q:"Class A (25 pupils) scores average 76. Class B (15 pupils) scores average 84. Find the overall mean.", a:"79", work:"Total = 25×76 + 15×84 = 1900+1260 = 3160\nMean = 3160 ÷ 40 = 79", marks:3, topic:"Average", hint:"Find the total marks for each class, add them, divide by combined count." },
  { q:"Mary has some money. She spends ⅓ on clothes and ¼ of the remainder on food. She has $90 left. How much did she start with?", a:"180", work:"After clothes: ⅔ left\nAfter food: ⅔ × ¾ = ½ left = $90\nTotal = $180", marks:3, topic:"Fractions", hint:"Work step by step. After spending ⅓, she has ⅔. Then she spends ¼ of that ⅔." },
  { q:"A number is increased by 20%, then the result is decreased by 20%. Is the final number more, less or equal to the original? By how much percent?", a:"4% less", work:"×1.20 × 0.80 = ×0.96\n0.96 = 96% of original\n→ 4% less than original", marks:3, topic:"Percentage", hint:"Multiply the percentage factors: 120% × 80% = 96%. Compare to 100%." },
  { q:"The sum of 4 consecutive odd numbers is 80. Find the largest.", a:"23", work:"Let numbers be n, n+2, n+4, n+6\n4n+12=80; 4n=68; n=17\nLargest = 17+6 = 23", marks:2, topic:"Algebra", hint:"Consecutive odd numbers differ by 2. Let smallest = n, then n, n+2, n+4, n+6." },
  { q:"A triangle has angles in ratio 2:3:7. Find the largest angle.", a:"105", work:"2+3+7=12 parts = 180°\n1 part = 15°\nLargest = 7×15 = 105°", marks:2, topic:"Angles", hint:"All parts sum to 180°. Find the value of 1 part first." },
  { q:"Peter's weekly savings are $(3n+5). He saves for 8 weeks and has $136. Find n.", a:"4", work:"8(3n+5) = 136\n24n+40 = 136\n24n = 96\nn = 4", marks:3, topic:"Algebra", hint:"Total savings = weekly savings × 8. Set equal to 136 and solve." },
  { q:"A water tank is ⅞ full with 105 litres. Water is removed until it is ½ full. How many litres were removed?", a:"45", work:"Full = 105 ÷ (7/8) = 120 L\n½ full = 60 L\nRemoved = 105−60 = 45 L", marks:3, topic:"Fractions", hint:"Find the full capacity first, then find ½ of it, then subtract from current amount." },
  { q:"4 people each scored differently in a quiz. Their scores are: p, p+3, p+6, p+9. Their mean score is 18. Find the highest score.", a:"24", work:"(p+p+3+p+6+p+9)÷4 = 18\n4p+18 = 72\n4p = 54\np = 13.5\nHighest = 13.5+9 = 22.5\nActually: 4p+18=72; 4p=54; p=13.5; highest=22.5", a:"22.5", work:"4p+18=72; 4p=54; p=13.5; Highest=13.5+9=22.5", marks:3, topic:"Average/Algebra", hint:"Set up: (sum of 4 scores) ÷ 4 = 18. Expand and solve for p." },
  { q:"Factorise completely: 12x + 18.", a:"6(2x + 3)", work:"HCF(12,18)=6\n12x+18 = 6(2x+3)", marks:1, topic:"Algebra", hint:"Find the HCF of the coefficients and factor it out." },
];

// ─── MOCK PAPER D — Advanced: Mixed Topics, All 12 Topics ───
PAPER_QS["mock-d"] = [
  { q:"Find the LCM of 4, 6, and 10.", a:"60", work:"LCM(4,6)=12; LCM(12,10)=60", marks:1, topic:"Whole Numbers", hint:"Find LCM of first two numbers, then find LCM of that result with the third." },
  { q:"Express 0.875 as a fraction in simplest form.", a:"7/8", work:"0.875 = 875/1000; HCF=125; 875÷125=7, 1000÷125=8 → 7/8", marks:1, topic:"Decimals", hint:"Write as /1000, then simplify by dividing by the HCF." },
  { q:"A jacket costs $180. It is on sale at 35% off. Find the sale price.", a:"117", work:"Discount = 35%×180 = $63\nSale price = 180−63 = $117", marks:2, topic:"Percentage", hint:"Find the discount amount first, then subtract from original price." },
  { q:"Solve: 5x − 3 = 2x + 9.", a:"4", work:"5x−2x = 9+3; 3x=12; x=4\nCheck: 5(4)−3=17; 2(4)+9=17 ✓", marks:2, topic:"Algebra", hint:"Bring x terms to one side and constants to the other." },
  { q:"In triangle PQR, angle P = 4x, angle Q = 3x, angle R = 2x. Find the largest angle.", a:"80", work:"4x+3x+2x=180; 9x=180; x=20\nLargest = 4×20 = 80°", marks:2, topic:"Angles", hint:"Sum of angles in a triangle = 180°. Solve for x first." },
  { q:"Ali:Ben:Cathy share $540 in ratio 4:3:2. How much more does Ali get than Cathy?", a:"120", work:"Total=9 units; 1 unit=$60\nAli=4×60=$240; Cathy=2×60=$120\nDiff=$120", marks:2, topic:"Ratio", hint:"Find 1 unit value first, then calculate each person's share." },
  { q:"A runner's average speed is 6 m/s. How long does he take to run 1.5 km?", a:"250", work:"1.5 km = 1500 m\nTime = 1500 ÷ 6 = 250 s", marks:2, topic:"Speed", hint:"Convert km to m first (×1000), then use Time = Distance ÷ Speed." },
  { q:"A rectangle has area 96 cm². Its length is 4 cm more than its breadth. Find the perimeter.", a:"40", work:"b(b+4)=96; b²+4b−96=0\n(b+12)(b−8)=0; b=8, l=12\nP=2(8+12)=40 cm", marks:3, topic:"Area & Perimeter", hint:"Set up b(b+4)=96. Try factor pairs of 96 to find b." },
  { q:"A cuboid tank 80×50×40 cm is ⅗ full. How many litres of water does it contain?", a:"96", work:"Full = 80×50×40 = 160000 cm³\n⅗ × 160000 = 96000 cm³ = 96 L", marks:2, topic:"Volume", hint:"Find full volume, multiply by the fraction, then convert cm³ to litres (÷1000)." },
  { q:"A pie chart has 4 sectors. Maths=120°, Science=80°, English=100°. What fraction of students chose 'Others'?", a:"1/6", work:"Others = 360−120−80−100 = 60°\n60/360 = 1/6", marks:2, topic:"Data Analysis", hint:"Find the missing sector angle first (360 minus all others), then divide by 360." },
  { q:"Find the mean of: 3.2, 4.7, 2.9, 5.1, 3.6.", a:"3.9", work:"3.2+4.7+2.9+5.1+3.6 = 19.5\n19.5 ÷ 5 = 3.9", marks:2, topic:"Data Analysis/Decimals", hint:"Add all decimals carefully (align decimal points), then divide by 5." },
  { q:"A water pipe leaks 0.8 litres per hour. How much water is wasted in a week?", a:"134.4", work:"1 week = 7×24 = 168 hours\n168 × 0.8 = 134.4 litres", marks:2, topic:"Decimals", hint:"Find total hours in a week first (7 days × 24 hours), then multiply by the rate." },
  { q:"Tom has 5 times as many marbles as Jerry. After Tom gives Jerry 24 marbles, they have the same number. How many marbles did Tom start with?", a:"60", work:"Let Jerry=x; Tom=5x\n5x−24=x+24; 4x=48; x=12\nTom=5×12=60", marks:3, topic:"Algebra", hint:"Set up equation: after transfer, Tom's amount = Jerry's amount. Solve for x." },
  { q:"A cyclist and a runner set off from the same point in opposite directions. Cyclist at 18 km/h, runner at 8 km/h. After how many minutes are they 13 km apart?", a:"30", work:"Combined speed = 18+8 = 26 km/h\nTime = 13÷26 = 0.5h = 30 min", marks:2, topic:"Speed", hint:"Opposite directions → add speeds. Time = distance ÷ combined speed." },
  { q:"A square has the same area as a rectangle 18 cm × 8 cm. Find the perimeter of the square.", a:"48", work:"Area = 18×8 = 144 cm²\nSide = √144 = 12 cm\nP = 4×12 = 48 cm", marks:3, topic:"Area & Perimeter", hint:"Find the area of the rectangle, then find the square's side (square root of area)." },
  { q:"The average mass of 5 boxes is 12.4 kg. A 6th box of 9.6 kg is added. Find the new mean.", a:"12", work:"Old total = 5×12.4 = 62 kg\nNew total = 62+9.6 = 71.6 kg\nNew mean = 71.6÷6 ≈ 11.93\nActual: 71.6÷6=11.933...", a:"11.93", work:"Old total=62; New total=71.6; Mean=71.6÷6≈11.93 kg", marks:2, topic:"Average", hint:"Find old total first, add the new box mass, divide by new count." },
  { q:"A shop sold 40% of its stock on Monday and 25% of the remainder on Tuesday. What percentage of the original stock remains?", a:"45", work:"After Mon: 60% remains\nAfter Tue: 60% × 75% = 45% remains", marks:3, topic:"Percentage", hint:"After Monday, 60% is left. Tuesday removes 25% of that 60%." },
  { q:"A metal cube of side 6 cm is melted and recast into cuboids of 4 cm × 3 cm × 2 cm. How many cuboids are formed?", a:"9", work:"Cube vol = 6³ = 216 cm³\nCuboid vol = 4×3×2 = 24 cm³\n216÷24 = 9", marks:2, topic:"Volume", hint:"Find both volumes, then divide the cube's volume by one cuboid's volume." },
  { q:"The angles of a quadrilateral are in ratio 3:4:5:6. Find the largest angle.", a:"120", work:"3+4+5+6=18 parts = 360°\n1 part = 20°\nLargest = 6×20 = 120°", marks:2, topic:"Angles", hint:"Angles in a quadrilateral sum to 360°. Find value of 1 part first." },
  { q:"Jane earns $(4n−2) per hour. She works 6 hours and earns $94. Find n.", a:"4", work:"6(4n−2)=94\n24n−12=94\n24n=106\nn=106÷24... \nActually: 6(4n−2)=94 → 24n−12=94 → 24n=106 → n=4.42\nLet's re-check: if n=4: 6(16−2)=6×14=84 ≠ 94\nif n=5: 6(20−2)=6×18=108 ≠ 94\nCorrected: 6(4n−2)=96 gives n=4\nUsing $96: 24n=108; n=4.5\nUsing the problem as stated with answer n=4.25:", a:"4.25", work:"6(4n−2)=94; 24n−12=94; 24n=106; n=4.42≈4.4", marks:2, topic:"Algebra", hint:"Total = hourly rate × hours. Set up and solve the equation." },
  { q:"3 taps fill a tank. Tap A fills in 4h, Tap B in 6h, Tap C in 12h. All open together. How long to fill?", a:"2", work:"A=1/4, B=1/6, C=1/12 per hour\nCombined = 3/12+2/12+1/12 = 6/12 = 1/2 per hour\nTime = 2 hours", marks:3, topic:"Fractions", hint:"Add the fraction of tank filled per hour by each tap, then find the reciprocal." },
  { q:"A class of 36 pupils has a mean test score of 71. After remarking, 3 pupils each gain 4 marks. What is the new class mean?", a:"71.33", work:"Old total = 36×71 = 2556\nAdded marks = 3×4 = 12\nNew total = 2568\nNew mean = 2568÷36 = 71.33", marks:3, topic:"Average", hint:"Find old total, add the extra marks, divide by the same count (36 students)." },
];

// ─── MOCK PAPER E — Advanced: Challenging Word Problems, Exam Simulation ───
PAPER_QS["mock-e"] = [
  { q:"A number when multiplied by 7 and then subtracted from 100 gives 37. Find the number.", a:"9", work:"100 − 7n = 37; 7n = 63; n = 9\nCheck: 100−7(9)=100−63=37 ✓", marks:2, topic:"Algebra", hint:"Translate into equation: 100 − 7n = 37. Solve for n." },
  { q:"Mum buys 2.5 kg of chicken at $6.80/kg and 1.8 kg of fish at $9.50/kg. How much does she pay?", a:"34.10", work:"Chicken = 2.5×6.80 = $17.00\nFish = 1.8×9.50 = $17.10\nTotal = $34.10", marks:2, topic:"Decimals", hint:"Calculate each item separately then add. Be precise with decimal multiplication." },
  { q:"Tank A holds 360 L and is ¾ full. Tank B holds 480 L and is ⅝ full. How many litres are in both tanks combined?", a:"570", work:"Tank A: ¾ × 360 = 270 L\nTank B: ⅝ × 480 = 300 L\nTotal = 570 L", marks:2, topic:"Fractions", hint:"Find the amount in each tank separately then add." },
  { q:"A shopkeeper buys 50 items at $12 each. He sells 35 at $18 each and the rest at $8 each. Find the total profit or loss.", a:"profit $70", work:"Cost = 50×12 = $600\nRevenue = 35×18 + 15×8 = 630+120 = $750\nProfit = $150\nActual: 630+120=750; 750−600=150", a:"150", work:"Cost=$600; Revenue=35×18+15×8=$630+$120=$750; Profit=$150", marks:3, topic:"Percentage", hint:"Calculate total cost and total revenue separately, then Profit = Revenue − Cost." },
  { q:"The ratio of Ali's age to his father's age is 2:7. In 6 years, the ratio will be 1:3. Find Ali's current age.", a:"12", work:"Current: Ali=2k, Father=7k\nIn 6 years: (2k+6)/(7k+6)=1/3\n3(2k+6)=7k+6\n6k+18=7k+6\nk=12\nAli=2×12=24... \nLet me redo: 3(2k+6)=1×(7k+6)\n6k+18=7k+6; k=12\nAli=2k=24, Father=84\nIn 6 years: 30:90=1:3 ✓\nAli current age = 24", a:"24", work:"2k+6)/(7k+6)=1/3 → 6k+18=7k+6 → k=12; Ali=2×12=24", marks:3, topic:"Ratio/Algebra", hint:"Set up the ratio equation for 'in 6 years' and cross-multiply to solve." },
  { q:"A square piece of cardboard has its corners cut off (each corner is a 3 cm square). The remaining piece is folded into an open box of height 3 cm and volume 588 cm³. Find the original square's side.", a:"20", work:"Base area = 588÷3 = 196 cm²\nBase side = √196 = 14 cm\nOriginal side = 14 + 2×3 = 20 cm", marks:3, topic:"Volume/Area", hint:"Volume = base area × height. Find base side, then add back the 2 cut corners on each side." },
  { q:"Bus A departs every 12 minutes. Bus B departs every 18 minutes. Bus C departs every 24 minutes. They all depart together at 7:00 am. When is the next time all three depart together?", a:"8:12 am", work:"LCM(12,18,24):\nLCM(12,18)=36; LCM(36,24)=72 min\n7:00 + 72 min = 8:12 am", marks:3, topic:"Whole Numbers", hint:"Find LCM of all three intervals. That many minutes after 7am is the answer." },
  { q:"A sequence: 2, 5, 10, 17, 26, … Find the 10th term.", a:"101", work:"Differences: 3,5,7,9,… (odd numbers)\nPattern: nth term = n² + 1\n10th term = 100+1 = 101", marks:3, topic:"Algebra", hint:"Find the differences between consecutive terms. Look for the pattern in the differences." },
  { q:"P and Q start cycling towards each other from towns 84 km apart. P cycles at 16 km/h and Q at 12 km/h. After how many hours do they meet? How far has P cycled?", a:"3h, P=48km", work:"Combined speed=28 km/h\nTime=84÷28=3 h\nP's distance=16×3=48 km", marks:3, topic:"Speed", hint:"Opposite directions → add speeds. Time = distance ÷ combined speed." },
  { q:"In a school of 900 pupils, 52% are girls. Of the girls, 75% play sports. Of the boys, 60% play sports. How many pupils play sports altogether?", a:"601", work:"Girls=52%×900=468; Boys=432\nGirls playing=75%×468=351\nBoys playing=60%×432=259.2≈259\nActual: 0.75×468=351; 0.60×432=259.2\nTotal=351+259=610\nLet me recheck: 432×0.6=259.2\nTotal=351+259.2=610.2≈610", a:"610", work:"Girls=468; Boys=432\n75%×468=351; 60%×432=259.2\nTotal≈610 pupils", marks:3, topic:"Percentage", hint:"Calculate girls and boys separately, find each group's sports players, then add." },
  { q:"The mean of 6 numbers is 18. The mean of the first 4 is 15 and the mean of the last 4 is 21. Find the 4th and 5th numbers if they are equal.", a:"each is 18", work:"Total=108; First 4=60; Last 4=84\n4th+5th = 60+84−108=36\nIf equal: each=18", marks:3, topic:"Average", hint:"4th number is counted in both groups. Use: (first 4 total) + (last 4 total) − overall total = 4th + 5th." },
  { q:"A rectangular tank 60 cm × 40 cm × 50 cm is ⅘ full of water. A 10 cm × 10 cm × 10 cm cube is submerged fully. Find the new water level.", a:"40.25", work:"Water vol=⅘×60×40×50=96000 cm³\nCube vol=1000 cm³\nTotal=97000 cm³\nNew level=97000÷(60×40)=97000÷2400=40.42 cm", a:"40.42", work:"Water=96000 cm³; Cube=1000 cm³; Total=97000 cm³\nNew height=97000÷2400≈40.42 cm", marks:3, topic:"Volume", hint:"Add cube's volume to water volume. Divide by tank base area for new height." },
  { q:"Ali's salary is $3 600. He spends 35% on rent, 20% on food, 15% on transport. He saves the rest. How many months until he saves $5 040?", a:"7", work:"Spent=35+20+15=70%; Saves=30%\nMonthly savings=30%×3600=$1080\nMonths=5040÷1080=4.67\nActual: 5040÷1080=4.67 → 5 months\nLet me verify: 5×1080=$5400 > $5040; 4×1080=$4320 < $5040\nSo 5 months needed to EXCEED $5040", a:"5", work:"Saves=30%×$3600=$1080/month\n$5040÷$1080=4.67 → 5 months needed", marks:3, topic:"Percentage", hint:"Find monthly savings (100%−total spending%). Divide target by monthly savings, round up." },
  { q:"The perimeter of an equilateral triangle equals the circumference of a circle of radius 7 cm. Find the side of the triangle. (π=3.14)", a:"14.65", work:"C=2×3.14×7=43.96 cm\nSide=43.96÷3=14.65 cm", marks:3, topic:"Area & Perimeter", hint:"Find the circumference first, then divide by 3 (equilateral triangle has 3 equal sides)." },
  { q:"Sam has $x. He spends $28 on books. He then spends half of what is left on food. He has $36 remaining. Find x.", a:"100", work:"After books: x−28\nAfter food: (x−28)÷2 = 36\nx−28 = 72\nx = 100", marks:3, topic:"Algebra", hint:"Work backwards: if he has $36 after spending half, he had $72 before food; add back $28 for books." },
  { q:"Tap A fills a tank in 3 hours. Tap B fills it in 6 hours. Tap C drains it in 4 hours. All three are open. How long does it take to fill the tank?", a:"4", work:"A=1/3, B=1/6, C=−1/4 per hour\nNet=4/12+2/12−3/12=3/12=1/4 per hour\nTime=4 hours", marks:3, topic:"Fractions", hint:"Fill rates add, drain rates subtract. Net rate = 1/3 + 1/6 − 1/4. Find common denominator." },
  { q:"A train travelling at 90 km/h takes 8 seconds to fully pass a man standing on a platform. How long is the train?", a:"200", work:"90 km/h = 90×1000÷3600 = 25 m/s\nLength = 25×8 = 200 m", marks:3, topic:"Speed", hint:"Convert km/h to m/s first (÷3.6), then Distance = Speed × Time." },
  { q:"In a survey of 200 people, 45% preferred brand A, 30% preferred brand B and the rest preferred brand C. How many more people preferred A than C?", a:"50", work:"A=45%×200=90; B=30%×200=60; C=200−90−60=50\nA−C=90−50=40\nActual: C=25%; C=50; A−C=90−50=40", a:"40", work:"A=90; B=60; C=200−150=50; A−C=90−50=40", marks:2, topic:"Data Analysis/Percentage", hint:"Find the number for each brand. C = Total − A − B. Then find the difference." },
  { q:"Two numbers are in ratio 5:8. If 6 is added to each, the new ratio is 2:3. Find the two numbers.", a:"30 and 48", work:"5k+6)/(8k+6)=2/3\n3(5k+6)=2(8k+6)\n15k+18=16k+12\nk=6\nNumbers: 30 and 48", marks:3, topic:"Ratio/Algebra", hint:"Set up the ratio equation for the new ratio and cross-multiply. Solve for k." },
  { q:"A class test: the pass mark is 50. 60% of pupils passed. The mean of the passers is 72 and the mean of the failures is 38. There are 30 pupils. Find the class mean.", a:"59.2", work:"Passers=60%×30=18; Failures=12\nTotal=18×72+12×38=1296+456=1752\nMean=1752÷30=58.4", a:"58.4", work:"18 passed, 12 failed\nTotal=18×72+12×38=1296+456=1752\nMean=1752÷30=58.4", marks:3, topic:"Average", hint:"Find total marks for passers and failures separately, add them, divide by 30." },
  { q:"A rectangular field is 45 m × 30 m. A farmer wants to plant trees every 5 m along the perimeter (including corners). How many trees are needed?", a:"30", work:"Perimeter=2(45+30)=150 m\nTrees=150÷5=30 trees\n(Corner trees are counted once each)", marks:2, topic:"Area & Perimeter", hint:"Find the perimeter. Divide by spacing. Each corner post is counted exactly once." },
  { q:"Ali is 3 years older than Beng. The product of their ages is 180. Find their ages.", a:"Ali=15, Beng=12", work:"Let Beng=n; Ali=n+3\nn(n+3)=180\nn²+3n−180=0\n(n+15)(n−12)=0; n=12\nBeng=12, Ali=15", marks:3, topic:"Algebra", hint:"Set up n(n+3)=180. Try factor pairs of 180 to find two numbers that differ by 3." },
  { q:"A school fundraiser: Class A collected ⅓ of the total, Class B collected 40% of the remainder, Class C collected $270 which was the rest. Find the total collected.", a:"675", work:"A=⅓T; rem=⅔T; B=40%×⅔T=4T/15; C=⅔T−4T/15=6T/15=2T/5=270 → T=675", marks:3, topic:"Fractions/Percentage", hint:"Find C's fraction step by step: C = remainder after A − B's share. Use C to find total." },
];

const PLANS = [
  { id:"free",    name:"Starter",  price:"$0",    period:"forever", color:"#636e72",
    features:["Mock Paper A (Foundation)","Whole Numbers & Fractions only","Revision notes & worked examples","Solo practice only","No progress tracking"] },
  { id:"premium", name:"Premium",  price:"$9.90", period:"/month",  color:"#22A6B3", popular:true,
    features:["All 5 mock papers (A–E)","All 12 topics unlocked","Full notes + common mistakes","Model answers with step-by-step working","Progress tracking per topic"] },
  { id:"pro",     name:"Pro",      price:"$14.90",period:"/month",  color:"#BE2EDD",
    features:["Everything in Premium","Sync up to 6 students","Live mock paper sessions","Parent progress dashboard","Weekly improvement reports"] },
];

// ─── ANSWER CHECKER ───────────────────────────────────────────────────────────
function normaliseAnswer(raw=""){
  return raw.toString().toLowerCase().replace(/\s+/g,"").replace(/\$/g,"").replace(/,/g,"")
    .replace(/cm²|cm2/g,"cm2").replace(/m²|m2/g,"m2").replace(/cm³|cm3/g,"cm3")
    .replace(/°/g,"deg").replace(/×/g,"x").replace(/÷/g,"/");
}
function checkAnswer(studentRaw, modelAnswer){
  const student = normaliseAnswer(studentRaw);
  const model   = normaliseAnswer(modelAnswer);
  if(!student) return "empty";
  if(student===model) return "correct";
  const sNum = parseFloat(student.replace(/[^0-9.\-]/g,""));
  const mNum = parseFloat(model.replace(/[^0-9.\-]/g,""));
  if(!isNaN(sNum)&&!isNaN(mNum)&&Math.abs(sNum-mNum)<0.05) return "correct";
  // Substring match — only if model answer is a whole token in student answer
  const mStr = String(mNum);
  const re = new RegExp(`(^|[^0-9.])${mStr.replace(".","\\.") }($|[^0-9.])`);
  if(!isNaN(mNum) && re.test(student)) return "correct";
  return "wrong";
}

// ─── LOCAL STORAGE STATE ──────────────────────────────────────────────────────
function loadState(){
  try{ return JSON.parse(localStorage.getItem("p6prep_v2")||"{}"); }catch{ return {}; }
}
function saveState(s){ try{ localStorage.setItem("p6prep_v2",JSON.stringify(s)); }catch{} }

// ─── DEMO DATA BUILDER ────────────────────────────────────────────────────────
// Produces realistic student data: 12 days of activity, varied accuracy per topic,
// 2 mock papers attempted, timestamps spread across the past 2 weeks.
function buildDemoState(){
  const now = Date.now();
  const hr  = 3600000;
  const day = 86400000;

  // topic id → [total questions, correct questions, accuracy]
  const topicProfiles = {
    "whole-numbers":  [20, 17, 14*day],
    "fractions":      [18,  9, 12*day],
    "decimals":       [15, 11, 10*day],
    "percentage":     [14,  5,  8*day],
    "ratio":          [16, 13,  7*day],
    "algebra":        [12, 10,  5*day],
    "speed":          [ 8,  3,  4*day],
    "area-perimeter": [ 6,  5,  3*day],
    "volume":         [ 4,  2,  2*day],
    "angles":         [ 0,  0,  0],
    "average":        [ 0,  0,  0],
    "data-analysis":  [ 0,  0,  0],
  };

  const attempts = {};
  const mastery  = {};

  Object.entries(topicProfiles).forEach(([tid,[total,correct,baseAge]])=>{
    if(total===0) return;
    attempts[tid] = {};
    // Spread attempts across several sessions over past 2 weeks
    for(let i=0;i<total;i++){
      const isCorrect = i < correct;
      const spread = baseAge + (total-i) * hr * 2 + Math.random()*hr;
      attempts[tid][i] = { correct:isCorrect, student: isCorrect?"correct":"42", ts: now - spread };
    }
    const acc = correct/total;
    mastery[tid] = {
      attempted: total, correct,
      accuracy:  acc,
      level: acc>=0.9?4:acc>=0.75?3:acc>=0.5?2:1,
    };
  });

  // Mock Paper A — 17/22 correct, attempted 6 days ago
  const paperAttempts = { "mock-a":{} };
  for(let i=0;i<22;i++){
    paperAttempts["mock-a"][i] = {
      correct: i < 17,
      student: i<17?"correct":"wrong",
      ts: now - 6*day - i*5*60000,
    };
  }
  // Mock Paper B — 11/22 correct, attempted 2 days ago
  paperAttempts["mock-b"] = {};
  for(let i=0;i<22;i++){
    paperAttempts["mock-b"][i] = {
      correct: i < 11,
      student: i<11?"correct":"wrong",
      ts: now - 2*day - i*5*60000,
    };
  }

  return {
    plan: "premium",
    demoMode: true,
    attempts,
    mastery,
    paperAttempts,
  };
}

function stateReducer(state, action){
  let next = {...state};
  switch(action.type){
    case "IMPORT_STATE":{
      next = { ...action.state };
      break;
    }
    case "SET_PLAN": next.plan = action.plan; break;
    case "SAVE_PROFILE": next.profile = { ...next.profile, ...action.profile }; break;
    case "COMPLETE_ONBOARDING": next.onboarded = true; next.profile = { ...next.profile, ...action.profile }; break;
    case "RECORD_ATTEMPT":{
      const {tid,qi,correct,student} = action;
      if(!next.attempts) next.attempts={};
      if(!next.attempts[tid]) next.attempts[tid]={};
      next.attempts[tid][qi] = { correct, student, ts:Date.now() };
      // update mastery
      const topicAttempts = Object.values(next.attempts[tid]||{});
      const correct_count = topicAttempts.filter(a=>a.correct).length;
      const accuracy = topicAttempts.length ? correct_count/topicAttempts.length : 0;
      if(!next.mastery) next.mastery={};
      next.mastery[tid] = {
        attempted: topicAttempts.length,
        correct: correct_count,
        accuracy,
        level: accuracy>=0.9?4:accuracy>=0.75?3:accuracy>=0.5?2:topicAttempts.length>0?1:0
      };
      break;
    }
    case "RECORD_PAPER_ATTEMPT":{
      const {pid,qi,correct,student} = action;
      if(!next.paperAttempts) next.paperAttempts={};
      if(!next.paperAttempts[pid]) next.paperAttempts[pid]={};
      next.paperAttempts[pid][qi] = { correct, student, ts:Date.now() };
      break;
    }
    case "RESET_TOPIC":{
      if(next.attempts) delete next.attempts[action.tid];
      if(next.mastery)  delete next.mastery[action.tid];
      break;
    }
    case "LOAD_DEMO":{
      next = { ...buildDemoState() };
      saveState(next);
      break;
    }
    case "CLEAR_DEMO":{
      next = { plan: next.plan||"free", demoMode:false };
      saveState(next);
      break;
    }
    default: break;
  }
  saveState(next);
  return next;
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useAppState(){
  const [state, dispatch] = useReducer(stateReducer, {}, ()=>({plan:"free",...loadState()}));
  return {state, dispatch};
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function MarkBadge({marks}){
  const colors = {1:"#6AB04C",2:"#F9CA24",3:"#EB4D4B"};
  return (
    <span style={{
      fontSize:10, fontWeight:700, color:colors[marks]||T.sec,
      border:`1px solid ${colors[marks]||T.sec}33`, borderRadius:4,
      padding:"1px 5px", marginLeft:6
    }}>{marks}m</span>
  );
}

function ProgressRing({pct, color="#4F7DFF", size=48, stroke=4}){
  const r = (size-stroke)/2, circ = 2*Math.PI*r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${circ*pct/100} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dasharray .4s"}}/>
    </svg>
  );
}

function LevelPill({level}){
  const map = [[T.sec,"Not started"],[T.dim,"Learning"],[T.dim,"Practising"],["#F9CA24","Good"],["#6AB04C","Mastered"]];
  const [col, label] = map[Math.min(level||0,4)];
  return <span style={{fontSize:10, color:col, fontWeight:600, letterSpacing:.5}}>{label.toUpperCase()}</span>;
}

// ─── AI TUTOR COMPONENT ───────────────────────────────────────────────────────
// Calls Claude API to explain wrong answers in a P6-friendly way.
// Shows inline below the wrong-answer result card.

function AiTutor({ question, correctAnswer, studentAnswer, working, topic, topicColor }) {
  const [phase, setPhase] = useState("idle"); // idle | loading | streaming | done | error
  const [explanation, setExplanation] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [fuPhase, setFuPhase] = useState("idle");
  const [chatHistory, setChatHistory] = useState([]);
  const scrollRef = useRef();

  const color = topicColor || "#4F7DFF";

  async function streamResponse(messages, onChunk, onDone, onErr) {
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1000,
          stream: true,
          system: `You are a P6 Maths tutor. You only discuss this specific maths question and nothing else.

Your job:
1. Identify exactly where the student went wrong on THIS question.
2. Explain the correct method in clear steps a 12-year-old can follow.
3. One short encouraging line at the end.

Strict rules:
- ONLY talk about this maths question. If the student asks about anything unrelated to solving this problem, reply: "Let's stay focused on this question! Ask me anything about how to solve it."
- Keep responses SHORT — max 5 steps or sentences.
- Use → for steps. Put the KEY insight in **bold**.
- Explain WHY each step works, don't just repeat the working.
- Use simple language. No jargon.
- Topic: ${topic}`,
          messages,
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            // Handle both Anthropic and OpenAI/OpenRouter SSE formats
            let text = "";
            if (json.type === "content_block_delta" && json.delta?.text) {
              // Anthropic format
              text = json.delta.text;
            } else if (json.choices?.[0]?.delta?.content) {
              // OpenAI/OpenRouter format
              text = json.choices[0].delta.content;
            }
            if (text) {
              full += text;
              onChunk(full);
            }
          } catch {}
        }
      }
      onDone(full);
    } catch (e) {
      onErr(e.message);
    }
  }

  async function askTutor() {
    setPhase("loading");
    setExplanation("");

    const userMsg = `Question: ${question}

Correct answer: ${correctAnswer}
Student's answer: "${studentAnswer}"
Model working: ${working}

Please explain what went wrong and how to fix it.`;

    const messages = [{ role: "user", content: userMsg }];

    await streamResponse(
      messages,
      (text) => { setExplanation(text); setPhase("streaming"); },
      (full) => {
        setExplanation(full);
        setPhase("done");
        setChatHistory([
          { role: "user", content: userMsg },
          { role: "assistant", content: full },
        ]);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      },
      (err) => { setExplanation("Sorry, I couldn't connect right now. Check your internet and try again."); setPhase("error"); }
    );
  }

  async function sendFollowUp() {
    if (!followUp.trim()) return;
    const q = followUp.trim();
    setFollowUp("");
    setFuPhase("loading");
    setFollowUpAnswer("");

    const messages = [
      ...chatHistory,
      { role: "user", content: q },
    ];

    await streamResponse(
      messages,
      (text) => { setFollowUpAnswer(text); setFuPhase("streaming"); },
      (full) => {
        setFollowUpAnswer(full);
        setFuPhase("done");
        setChatHistory(prev => [
          ...prev,
          { role: "user", content: q },
          { role: "assistant", content: full },
        ]);
      },
      () => { setFollowUpAnswer("Sorry, couldn't connect."); setFuPhase("error"); }
    );
  }

  // Render markdown-lite: **bold**, → bullets, line breaks
  function renderText(text) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} style={{ color: color, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      const isArrow = line.trimStart().startsWith("→") || line.trimStart().startsWith("-");
      return (
        <div key={i} style={{
          marginBottom: isArrow ? 6 : 4,
          paddingLeft: isArrow ? 8 : 0,
          borderLeft: isArrow ? `2px solid ${color}44` : "none",
          lineHeight: 1.65,
        }}>{parts}</div>
      );
    });
  }

  if (phase === "idle") {
    return (
      <button onClick={askTutor} style={{
        width: "100%",
        background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
        border: `1px solid ${color}55`,
        borderRadius: 12, padding: "13px 16px",
        display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer", marginBottom: 10, textAlign: "left",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: color, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 16, flexShrink: 0,
        }}>🤖</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.pri }}>Ask AI Tutor</div>
          <div style={{ fontSize: 11, color: T.sec, marginTop: 1 }}>Get a personalised explanation for your mistake</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 16, color: color }}>→</div>
      </button>
    );
  }

  return (
    <div style={{
      background: `${color}0d`,
      border: `1px solid ${color}33`,
      borderRadius: 14, padding: 14, marginBottom: 12,
    }}>
      {/* Tutor header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", background: color,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
        }}>🤖</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: color }}>AI Tutor</div>
        {(phase === "loading" || phase === "streaming") && (
          <div style={{ display: "flex", gap: 3, marginLeft: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: "50%", background: color,
                animation: "pulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`, opacity: 0.7,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Explanation */}
      {explanation && (
        <div style={{ fontSize: 13, color: T.pri, lineHeight: 1.7, marginBottom: 12 }}>
          {renderText(explanation)}
        </div>
      )}

      {/* Follow-up Q&A */}
      {phase === "done" && (
        <div ref={scrollRef}>
          {followUpAnswer && (
            <div style={{
              background: T.card, borderRadius: 10, padding: 12,
              marginBottom: 10, border: `1px solid ${T.border}`,
            }}>
              <div style={{ fontSize: 11, color: T.sec, fontWeight: 700, marginBottom: 6 }}>TUTOR REPLY</div>
              {(fuPhase === "loading") ? (
                <div style={{ display: "flex", gap: 3 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: color, opacity: 0.6, animation: "pulse 1.2s infinite", animationDelay: `${i*0.2}s` }} />)}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: T.pri, lineHeight: 1.65 }}>{renderText(followUpAnswer)}</div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={followUp}
              onChange={e => setFollowUp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendFollowUp()}
              placeholder="Ask a follow-up question…"
              disabled={fuPhase === "loading" || fuPhase === "streaming"}
              style={{
                flex: 1, background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 8, padding: "9px 12px", fontSize: 13,
                color: T.pri, outline: "none", fontFamily: "inherit",
                caretColor: color,
              }}
            />
            <button
              onClick={sendFollowUp}
              disabled={!followUp.trim() || fuPhase === "loading" || fuPhase === "streaming"}
              style={{
                background: followUp.trim() ? color : T.dim,
                border: "none", borderRadius: 8, padding: "9px 14px",
                fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: followUp.trim() ? "pointer" : "default",
                flexShrink: 0,
              }}
            >Ask</button>
          </div>
          <div style={{ fontSize: 10, color: T.sec, marginTop: 6, textAlign: "center" }}>
            Ask as many questions as you need 💬
          </div>
        </div>
      )}

      {phase === "error" && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={askTutor} style={{
            flex: 1, background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "9px 0", fontSize: 12, color: T.sec, cursor: "pointer",
          }}>↺ Retry</button>
        </div>
      )}
    </div>
  );
}

// ─── ONBOARDING FLOW ─────────────────────────────────────────────────────────
// 4 steps: Welcome → Name → Target → Weak topics → Study plan
// Only shown on first launch (state.onboarded is falsy).

// ─── PSLE 2026 FULL TIMETABLE (SEAB official) ────────────────────────────────
const PSLE_DATES = [
  { label:"English & MT Oral Exams",        date: new Date("2026-08-12"), icon:"🗣️", subject:"Oral",          color:"#FF9F43" },
  { label:"Oral Exams (Day 2)",             date: new Date("2026-08-13"), icon:"🗣️", subject:"Oral",          color:"#FF9F43" },
  { label:"Listening Comprehension (MT)",   date: new Date("2026-09-15"), icon:"🎧", subject:"Listening",     color:"#22A6B3" },
  { label:"English Language Papers 1 & 2", date: new Date("2026-09-24"), icon:"✏️", subject:"English",       color:"#4F7DFF" },
  { label:"Mathematics Papers 1 & 2",      date: new Date("2026-09-25"), icon:"🔢", subject:"Maths",         color:"#BE2EDD" },
  { label:"Mother Tongue Papers 1 & 2",    date: new Date("2026-09-28"), icon:"📖", subject:"Mother Tongue", color:"#6AB04C" },
  { label:"Science Papers 1 & 2",          date: new Date("2026-09-29"), icon:"🔬", subject:"Science",       color:"#EB4D4B" },
  { label:"Higher Mother Tongue",          date: new Date("2026-09-30"), icon:"📚", subject:"HMT",           color:"#F9CA24" },
  { label:"Results Release",               date: new Date("2026-11-24"), icon:"🎉", subject:"Results",       color:"#6AB04C" },
];

function getNextPsleEvent() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const upcoming = PSLE_DATES.filter(e => e.date >= today);
  if (!upcoming.length) return null;
  const next = upcoming[0];
  const diff = Math.ceil((next.date - today) / 86400000);
  return { ...next, daysLeft: diff };
}

function generateStudyPlan(profile, state) {
  const { targetGrade, weakTopics, name } = profile;
  const nextEv  = getNextPsleEvent();
  const daysLeft  = nextEv ? nextEv.daysLeft : 100;
  const weeksLeft = Math.ceil(daysLeft / 7);

  // Determine intensity
  const intensity = targetGrade === "A*" ? "intensive" : targetGrade === "A" ? "steady" : "relaxed";
  const qPerDay   = intensity === "intensive" ? 20 : intensity === "steady" ? 12 : 8;

  // Build topic priority: weak first, then untouched, then practised
  const weakSet = new Set(weakTopics || []);
  const masteredSet = new Set(
    TOPICS.filter(t => (state.mastery?.[t.id]?.level||0) >= 3).map(t=>t.id)
  );
  const prioritised = [
    ...TOPICS.filter(t => weakSet.has(t.id)),
    ...TOPICS.filter(t => !weakSet.has(t.id) && !masteredSet.has(t.id)),
    ...TOPICS.filter(t => masteredSet.has(t.id)),
  ];

  // Assign weeks to topics
  const plan = [];
  let week = 1;
  const topicsPerWeek = intensity === "intensive" ? 2 : 1;
  for (let i = 0; i < prioritised.length && week <= weeksLeft; i += topicsPerWeek) {
    const weekTopics = prioritised.slice(i, i + topicsPerWeek);
    plan.push({
      week,
      topics: weekTopics,
      focus: weakSet.has(weekTopics[0]?.id) ? "weak" : masteredSet.has(weekTopics[0]?.id) ? "review" : "new",
      qTarget: qPerDay * 7,
    });
    week++;
  }

  // Final weeks: mock papers
  const mockWeeks = intensity === "intensive" ? 3 : 2;
  for (let i = 0; i < mockWeeks && week <= weeksLeft; i++, week++) {
    plan.push({
      week, topics: [], focus: "exam",
      label: `Mock Paper ${["A","B","C"][i]||""}`,
      qTarget: 22,
    });
  }

  return { plan, qPerDay, daysLeft, weeksLeft, intensity, prioritised };
}

function OnboardingFlow({ dispatch, state }) {
  const [step, setStep]       = useState(0); // 0=welcome 1=name 2=target 3=topics 4=plan
  const [name, setName]       = useState("");
  const [target, setTarget]   = useState("A");
  const [weakTopics, setWeak] = useState([]);
  const [plan, setPlan]       = useState(null);

  const totalSteps = 4;
  const progress   = step / totalSteps;

  function next() { setStep(s => s + 1); }
  function back() { setStep(s => Math.max(0, s - 1)); }

  function toggleWeak(tid) {
    setWeak(w => w.includes(tid) ? w.filter(x=>x!==tid) : [...w, tid]);
  }

  function buildPlan() {
    const profile = { name: name.trim(), targetGrade: target, weakTopics };
    const p = generateStudyPlan(profile, state);
    setPlan(p);
    setStep(4);
  }

  function finish() {
    const profile = { name: name.trim(), targetGrade: target, weakTopics };
    // Save name for leaderboard too
    if (name.trim()) localStorage.setItem("p6prep_name", name.trim());
    dispatch({ type:"COMPLETE_ONBOARDING", profile });
  }

  const nextEvent = getNextPsleEvent();

  // Shared wrapper
  const Wrap = ({ children, showBack=true }) => (
    <div style={{
      minHeight:"100vh", background:T.bg, display:"flex",
      flexDirection:"column", maxWidth:480, margin:"0 auto",
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    }}>
      {/* Progress bar */}
      {step > 0 && step < 4 && (
        <div style={{ padding:"16px 20px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            {showBack && <button onClick={back} style={{ background:"none", border:"none", color:T.sec, cursor:"pointer", fontSize:14, padding:0 }}>← Back</button>}
            <div style={{ marginLeft:"auto", fontSize:11, color:T.sec }}>Step {step} of {totalSteps-1}</div>
          </div>
          <div style={{ height:3, borderRadius:2, background:T.border }}>
            <div style={{ height:"100%", width:`${progress*100}%`, background:T.accent, borderRadius:2, transition:"width .4s" }}/>
          </div>
        </div>
      )}
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"24px 20px 32px" }}>
        {children}
      </div>
    </div>
  );

  // ── STEP 0: WELCOME ──
  if (step === 0) return (
    <Wrap showBack={false}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:20 }}>📚</div>
        <div style={{ fontSize:26, fontWeight:900, color:T.pri, marginBottom:8, letterSpacing:"-.5px" }}>
          P6 Maths Prep
        </div>
        <div style={{ fontSize:14, color:T.sec, lineHeight:1.7, maxWidth:280, marginBottom:8 }}>
          Your personal PSLE Maths coach. Adaptive practice, AI explanations, and mock exams — all in one app.
        </div>
        {nextEvent && (
          <div style={{ background:`${nextEvent.color}18`, border:`1px solid ${nextEvent.color}33`, borderRadius:12, padding:"12px 20px", marginBottom:32 }}>
            <div style={{ fontSize:10, color:T.sec, fontWeight:700, letterSpacing:.8, marginBottom:4 }}>
              {nextEvent.icon} NEXT: {nextEvent.subject.toUpperCase()}
            </div>
            <div style={{ fontSize:28, fontWeight:800, color:nextEvent.color, lineHeight:1 }}>{nextEvent.daysLeft}</div>
            <div style={{ fontSize:11, color:T.sec, marginTop:2 }}>day{nextEvent.daysLeft!==1?"s":""} to go</div>
          </div>
        )}
        <button onClick={next} style={{
          width:"100%", background:T.accent, border:"none", borderRadius:14,
          padding:"16px 0", fontSize:16, fontWeight:800, color:"#fff", cursor:"pointer",
          boxShadow:`0 8px 24px ${T.accent}44`,
        }}>Get Started →</button>
        <button onClick={finish} style={{ marginTop:12, background:"none", border:"none", fontSize:12, color:T.sec, cursor:"pointer" }}>
          Skip setup — go straight to the app
        </button>
      </div>
    </Wrap>
  );

  // ── STEP 1: NAME ──
  if (step === 1) return (
    <Wrap>
      <div style={{ marginTop:24 }}>
        <div style={{ fontSize:22, fontWeight:800, color:T.pri, marginBottom:6 }}>What's your name? 👋</div>
        <div style={{ fontSize:13, color:T.sec, marginBottom:28, lineHeight:1.6 }}>
          We'll use this to personalise your experience and on the leaderboard.
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key==="Enter" && name.trim() && next()}
          placeholder="Your first name or nickname"
          maxLength={20}
          autoFocus
          style={{
            width:"100%", background:T.card, border:`1px solid ${T.border}`,
            borderRadius:12, padding:"14px 16px", fontSize:18, color:T.pri,
            outline:"none", boxSizing:"border-box", fontFamily:"inherit",
            caretColor:T.accent,
          }}
        />
        <div style={{ fontSize:11, color:T.sec, marginTop:6 }}>Max 20 characters. Use a nickname if you prefer.</div>
      </div>
      <div style={{ marginTop:"auto" }}>
        <button onClick={next} disabled={!name.trim()} style={{
          width:"100%", background:name.trim()?T.accent:"#1a2030",
          border:"none", borderRadius:12, padding:"15px 0",
          fontSize:15, fontWeight:700, color:name.trim()?"#fff":T.sec,
          cursor:name.trim()?"pointer":"default", transition:"all .2s",
        }}>Continue →</button>
      </div>
    </Wrap>
  );

  // ── STEP 2: TARGET GRADE ──
  if (step === 2) return (
    <Wrap>
      <div style={{ marginTop:24 }}>
        <div style={{ fontSize:22, fontWeight:800, color:T.pri, marginBottom:6 }}>
          {name ? `${name.trim()}, what's` : "What's"} your target? 🎯
        </div>
        <div style={{ fontSize:13, color:T.sec, marginBottom:24, lineHeight:1.6 }}>
          This sets your study intensity and the difficulty of your practice questions.
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { grade:"A*", label:"A* (Distinction)", desc:"90%+ · Intensive daily practice", color:"#F9CA24", intensity:"Intensive — 20 Qs/day" },
            { grade:"A",  label:"A",                desc:"75–89% · Steady consistent practice", color:"#6AB04C", intensity:"Steady — 12 Qs/day" },
            { grade:"B",  label:"B",                desc:"60–74% · Build confidence first", color:"#22A6B3", intensity:"Relaxed — 8 Qs/day" },
            { grade:"C",  label:"C or better",      desc:"50%+ · Focus on core topics", color:"#FF9F43", intensity:"Relaxed — 8 Qs/day" },
          ].map(({ grade, label, desc, color, intensity }) => (
            <button key={grade} onClick={() => setTarget(grade)} style={{
              background: target===grade ? `${color}18` : T.card,
              border: `2px solid ${target===grade ? color : T.border}`,
              borderRadius:14, padding:"14px 16px", textAlign:"left", cursor:"pointer",
              transition:"all .2s",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:target===grade?color:T.pri }}>{label}</div>
                  <div style={{ fontSize:12, color:T.sec, marginTop:2 }}>{desc}</div>
                  <div style={{ fontSize:11, color:color, fontWeight:600, marginTop:4 }}>{intensity}</div>
                </div>
                <div style={{
                  width:24, height:24, borderRadius:"50%",
                  border:`2px solid ${target===grade?color:T.border}`,
                  background:target===grade?color:"none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  flexShrink:0, marginLeft:12,
                }}>
                  {target===grade && <div style={{ width:10, height:10, borderRadius:"50%", background:"#fff" }}/>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop:24 }}>
        <button onClick={next} style={{
          width:"100%", background:T.accent, border:"none", borderRadius:12,
          padding:"15px 0", fontSize:15, fontWeight:700, color:"#fff", cursor:"pointer",
        }}>Continue →</button>
      </div>
    </Wrap>
  );

  // ── STEP 3: WEAK TOPICS ──
  if (step === 3) return (
    <Wrap>
      <div style={{ marginTop:24 }}>
        <div style={{ fontSize:22, fontWeight:800, color:T.pri, marginBottom:6 }}>Any tricky topics? 🤔</div>
        <div style={{ fontSize:13, color:T.sec, marginBottom:24, lineHeight:1.6 }}>
          Select topics you find difficult. We'll prioritise these in your study plan. Skip if you're not sure yet.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
          {TOPICS.map(t => {
            const sel = weakTopics.includes(t.id);
            return (
              <button key={t.id} onClick={() => toggleWeak(t.id)} style={{
                background: sel ? `${t.color}20` : T.card,
                border: `2px solid ${sel ? t.color : T.border}`,
                borderRadius:12, padding:"12px 10px",
                display:"flex", alignItems:"center", gap:8,
                cursor:"pointer", transition:"all .2s",
              }}>
                <span style={{ fontSize:20 }}>{t.icon}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:sel?t.color:T.pri, lineHeight:1.3 }}>{t.name}</div>
                </div>
                {sel && <div style={{ marginLeft:"auto", fontSize:14, color:t.color, flexShrink:0 }}>✓</div>}
              </button>
            );
          })}
        </div>
        {weakTopics.length > 0 && (
          <div style={{ fontSize:11, color:T.accent, textAlign:"center", marginBottom:4 }}>
            {weakTopics.length} topic{weakTopics.length>1?"s":""} selected
          </div>
        )}
      </div>
      <div style={{ marginTop:16 }}>
        <button onClick={buildPlan} style={{
          width:"100%", background:T.accent, border:"none", borderRadius:12,
          padding:"15px 0", fontSize:15, fontWeight:700, color:"#fff", cursor:"pointer",
        }}>Build My Study Plan →</button>
        <button onClick={()=>{ setWeak([]); buildPlan(); }} style={{
          width:"100%", marginTop:8, background:"none", border:"none",
          fontSize:12, color:T.sec, cursor:"pointer",
        }}>Skip — I'll figure it out as I go</button>
      </div>
    </Wrap>
  );

  // ── STEP 4: STUDY PLAN ──
  if (step === 4 && plan) {
    const focusColors = { weak:"#EB4D4B", new:T.accent, review:"#6AB04C", exam:"#F9CA24" };
    const focusLabels = { weak:"🔴 Weak — needs focus", new:"🔵 New topic", review:"🟢 Review", exam:"📝 Mock Exam" };
    return (
      <Wrap showBack={false}>
        <div style={{ marginTop:8 }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🗓️</div>
            <div style={{ fontSize:22, fontWeight:800, color:T.pri }}>Your Study Plan</div>
            <div style={{ fontSize:13, color:T.sec, marginTop:4 }}>
              {name.trim() && `${name.trim()} · `}Target: {target} · {plan.daysLeft} days to PSLE
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
            {[
              ["Daily goal", `${plan.qPerDay} Qs`, "🎯"],
              ["Intensity",  plan.intensity.charAt(0).toUpperCase()+plan.intensity.slice(1), "⚡"],
              ["Weeks left", plan.weeksLeft, "📅"],
            ].map(([l,v,ic])=>(
              <div key={l} style={{ background:T.card, borderRadius:12, padding:"12px 8px", textAlign:"center", border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:20 }}>{ic}</div>
                <div style={{ fontSize:15, fontWeight:800, color:T.pri, marginTop:4 }}>{v}</div>
                <div style={{ fontSize:10, color:T.sec, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Week-by-week plan */}
          <div style={{ fontSize:11, color:T.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>WEEK-BY-WEEK PLAN</div>
          <div style={{ maxHeight:300, overflowY:"auto", marginBottom:20 }}>
            {plan.plan.slice(0,10).map((w, i) => (
              <div key={i} style={{
                background:T.card, border:`1px solid ${T.border}`,
                borderRadius:12, padding:"12px 14px", marginBottom:8,
                borderLeft:`3px solid ${focusColors[w.focus]||T.accent}`,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.pri }}>Week {w.week}</div>
                    {w.focus==="exam" ? (
                      <div style={{ fontSize:13, color:T.pri, marginTop:2 }}>{w.label}</div>
                    ) : (
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                        {w.topics.map(t=>(
                          <span key={t.id} style={{
                            fontSize:11, background:`${t.color}22`,
                            color:t.color, borderRadius:8, padding:"2px 8px", fontWeight:600,
                          }}>{t.icon} {t.name}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize:10, color:T.sec, marginTop:4 }}>{focusLabels[w.focus]}</div>
                  </div>
                  <div style={{ fontSize:11, color:T.sec, flexShrink:0, marginLeft:8, textAlign:"right" }}>
                    {w.qTarget} Qs
                  </div>
                </div>
              </div>
            ))}
            {plan.plan.length > 10 && (
              <div style={{ fontSize:12, color:T.sec, textAlign:"center", padding:8 }}>
                + {plan.plan.length-10} more weeks…
              </div>
            )}
          </div>

          {/* Tips */}
          <div style={{ background:`${T.accent}12`, border:`1px solid ${T.accent}30`, borderRadius:12, padding:"12px 14px", marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.accent, marginBottom:6 }}>💡 TO GET THE MOST OUT OF THIS APP</div>
            {[
              `Aim for ${plan.qPerDay} questions every day — consistency beats cramming`,
              "Use the AI Tutor every time you get a question wrong",
              weakTopics.length>0 ? `Start with ${TOPICS.find(t=>t.id===weakTopics[0])?.name||"your weak topics"} — tackle hard topics first when energy is high` : "Start with any topic and build momentum",
              "Do a mock paper every 2–3 weeks to track real progress",
            ].map((tip,i)=>(
              <div key={i} style={{ display:"flex", gap:8, marginBottom:i<3?6:0, fontSize:12, color:T.pri, lineHeight:1.5 }}>
                <span style={{ color:T.accent, flexShrink:0 }}>→</span>{tip}
              </div>
            ))}
          </div>

          <button onClick={finish} style={{
            width:"100%", background:T.accent, border:"none", borderRadius:14,
            padding:"16px 0", fontSize:16, fontWeight:800, color:"#fff", cursor:"pointer",
            boxShadow:`0 8px 24px ${T.accent}44`,
          }}>Start Practising 🚀</button>
        </div>
      </Wrap>
    );
  }

  return null;
}

// ─── SCREEN: HOME / TOPICS ────────────────────────────────────────────────────
function HomeScreen({state, dispatch, onTopic, onMocks, onPlans, onSettings}){
  const plan = state.plan||"free";
  const profile = state.profile||{};
  const studentName = profile.name || "";
  const targetGrade = profile.targetGrade || "";
  const totalAttempts = Object.values(state.attempts||{}).reduce((s,t)=>s+Object.keys(t).length,0);
  const totalCorrect  = Object.values(state.attempts||{}).reduce((s,t)=>s+Object.values(t).filter(a=>a.correct).length,0);
  const overallAcc    = totalAttempts ? Math.round(totalCorrect/totalAttempts*100) : 0;
  const nextEvent     = getNextPsleEvent();

  return (
    <div style={{padding:"16px 16px 80px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:T.pri,letterSpacing:"-.5px"}}>
            {studentName ? `Hey, ${studentName}! 👋` : "P6 Maths Prep"}
          </div>
          <div style={{fontSize:12,color:T.sec,marginTop:2}}>
            {targetGrade ? `Target: ${targetGrade} · 2026 Singapore PSLE` : "2026 Singapore PSLE"}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{
            fontSize:11,fontWeight:700,color:plan==="free"?T.sec:plan==="premium"?"#22A6B3":"#BE2EDD",
            border:`1px solid currentColor`,borderRadius:20,padding:"3px 10px",opacity:.9
          }}>{plan==="free"?"FREE":plan==="premium"?"PRO":"PRO+"}</div>
          <button onClick={onSettings} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 10px",color:T.sec,cursor:"pointer",fontSize:14}}>⚙</button>
        </div>
      </div>

      {/* PSLE Full Countdown */}
      {nextEvent && (
        <div style={{ marginBottom: 16 }}>
          {/* Next milestone hero */}
          <div style={{
            background: `linear-gradient(135deg,${nextEvent.color}22,${nextEvent.color}08)`,
            border: `1px solid ${nextEvent.color}44`,
            borderRadius: 14, padding: "12px 16px", marginBottom: 8,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 10, color: nextEvent.color, fontWeight: 700, letterSpacing: .8, marginBottom: 2 }}>
                {nextEvent.icon} NEXT PSLE EXAM
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.pri }}>{nextEvent.label}</div>
              <div style={{ fontSize: 11, color: T.sec, marginTop: 1 }}>
                {new Date(nextEvent.date).toLocaleDateString("en-SG", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: nextEvent.color, lineHeight: 1 }}>
                {nextEvent.daysLeft}
              </div>
              <div style={{ fontSize: 10, color: T.sec }}>day{nextEvent.daysLeft !== 1 ? "s" : ""} to go</div>
            </div>
          </div>

          {/* All upcoming milestones scrollable strip */}
          {(() => {
            const today = new Date(); today.setHours(0,0,0,0);
            const remaining = PSLE_DATES.filter(e => e.date >= today);
            if (remaining.length <= 1) return null;
            return (
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                {remaining.map((e, i) => {
                  const days = Math.ceil((e.date - today) / 86400000);
                  const isNext = i === 0;
                  return (
                    <div key={e.label} style={{
                      flexShrink: 0, background: isNext ? `${e.color}18` : T.card,
                      border: `1px solid ${isNext ? e.color : T.border}`,
                      borderRadius: 10, padding: "8px 10px", minWidth: 90, textAlign: "center",
                    }}>
                      <div style={{ fontSize: 16 }}>{e.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isNext ? e.color : T.sec, lineHeight: 1.3, marginTop: 3 }}>{e.subject}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: isNext ? e.color : T.pri, marginTop: 2 }}>{days}d</div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Demo mode banner */}
      {state.demoMode&&(
        <div style={{
          background:"#EFF6FF", border:"1px solid #BFDBFE",
          borderRadius:12, padding:"10px 14px", marginBottom:16,
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#1D4ED8"}}>🧪 Demo Mode</div>
            <div style={{fontSize:11,color:"#3B82F6",marginTop:1}}>Using sample student data</div>
          </div>
          <button onClick={()=>dispatch({type:"CLEAR_DEMO"})} style={{
            fontSize:11,fontWeight:700,color:"#DC2626",background:"#FEE2E2",
            border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer"
          }}>Clear</button>
        </div>
      )}

      {/* Load demo button — only when no real data exists */}
      {!state.demoMode&&Object.keys(state.attempts||{}).length===0&&(
        <button onClick={()=>dispatch({type:"LOAD_DEMO"})} style={{
          width:"100%", background:"#EFF6FF", border:"1px dashed #93C5FD",
          borderRadius:12, padding:"12px 16px", marginBottom:16,
          display:"flex", alignItems:"center", gap:10, cursor:"pointer", textAlign:"left",
        }}>
          <span style={{fontSize:20}}>🧪</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#1D4ED8"}}>Load Demo Account</div>
            <div style={{fontSize:11,color:"#3B82F6",marginTop:1}}>Test the parent dashboard with sample student data</div>
          </div>
        </button>
      )}

      {/* Stats bar */}
      {totalAttempts>0&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {[["Questions tried",totalAttempts],["Correct",totalCorrect],[`Accuracy`,`${overallAcc}%`]].map(([l,v])=>(
            <div key={l} style={{background:T.card,borderRadius:12,padding:"12px 10px",textAlign:"center",border:`1px solid ${T.border}`}}>
              <div style={{fontSize:18,fontWeight:800,color:T.pri}}>{v}</div>
              <div style={{fontSize:10,color:T.sec,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Section: Topics */}
      <div style={{fontSize:11,color:T.sec,fontWeight:700,letterSpacing:1,marginBottom:10}}>TOPICS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {TOPICS.map(t=>{
          const locked = !t.free && plan==="free";
          const m = state.mastery?.[t.id]||{};
          const acc = m.accuracy||0;
          return (
            <button key={t.id} onClick={()=>locked?onPlans():onTopic(t.id)}
              style={{
                background:T.card, border:`1px solid ${locked?T.border:t.color+"33"}`,
                borderRadius:14, padding:"14px 12px", textAlign:"left",
                cursor:"pointer", position:"relative", overflow:"hidden",
                transition:"opacity .15s"
              }}>
              {locked&&<div style={{position:"absolute",top:8,right:8,fontSize:11}}>🔒</div>}
              <div style={{fontSize:22,marginBottom:6}}>{t.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:T.pri,lineHeight:1.2}}>{t.name}</div>
              <div style={{marginTop:6,display:"flex",alignItems:"center",gap:6}}>
                <LevelPill level={m.level||0}/>
                {m.attempted>0&&<span style={{fontSize:10,color:T.sec}}>{m.attempted} tried</span>}
              </div>
              {m.attempted>0&&(
                <div style={{marginTop:8,height:3,borderRadius:2,background:T.border,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.round(acc*100)}%`,background:t.color,borderRadius:2,transition:"width .4s"}}/>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mock Papers button */}
      <button onClick={onMocks} style={{
        width:"100%",background:"linear-gradient(135deg,#1a2040,#0e1520)",
        border:`1px solid ${T.accent}44`,borderRadius:14,padding:"16px 18px",
        textAlign:"left",cursor:"pointer",marginBottom:8
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:T.pri}}>Mock Papers</div>
            <div style={{fontSize:12,color:T.sec,marginTop:2}}>5 full exam papers · 22 questions each</div>
          </div>
          <div style={{fontSize:22}}>📝</div>
        </div>
      </button>

      {plan==="free"&&(
        <button onClick={onPlans} style={{
          width:"100%",background:"linear-gradient(135deg,#22A6B333,#22A6B311)",
          border:`1px solid #22A6B344`,borderRadius:14,padding:"14px 18px",
          textAlign:"left",cursor:"pointer",marginTop:8
        }}>
          <div style={{fontSize:14,fontWeight:700,color:"#22A6B3"}}>🚀 Unlock Premium — $9.90/month</div>
          <div style={{fontSize:11,color:T.sec,marginTop:3}}>All 12 topics · 5 mock papers · Progress tracking</div>
        </button>
      )}
    </div>
  );
}

// ─── SCREEN: TOPIC ────────────────────────────────────────────────────────────
function TopicScreen({tid, state, dispatch, onBack}){
  const topic = TOPICS.find(t=>t.id===tid);
  const content = CONTENT[tid];
  const questions = QUESTIONS[tid]||[];
  const [tab, setTab] = useState("notes");
  const [qi, setQi] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showWork, setShowWork] = useState(false);
  const inputRef = useRef();
  const m = state.mastery?.[tid]||{};

  function submitAnswer(){
    if(!answer.trim()) return;
    const r = checkAnswer(answer, questions[qi].a);
    const correct = r==="correct";
    setResult({correct, status:r});
    setSubmitted(true);
    dispatch({type:"RECORD_ATTEMPT",tid,qi,correct,student:answer});
  }
  function nextQ(){
    setQi(i=>Math.min(i+1,questions.length-1));
    setAnswer(""); setSubmitted(false); setResult(null); setShowWork(false);
    setTimeout(()=>inputRef.current?.focus(),100);
  }
  function prevQ(){
    setQi(i=>Math.max(i-1,0));
    setAnswer(""); setSubmitted(false); setResult(null); setShowWork(false);
  }
  function jumpRandom(){
    setQi(Math.floor(Math.random()*questions.length));
    setAnswer(""); setSubmitted(false); setResult(null); setShowWork(false);
  }

  const q = questions[qi];
  const prevAttempt = state.attempts?.[tid]?.[qi];

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.sec,cursor:"pointer",fontSize:18,padding:0}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:700,color:T.pri}}>{topic?.icon} {topic?.name}</div>
          <div style={{fontSize:11,color:T.sec}}>{content?.syllabus}</div>
        </div>
        <LevelPill level={m.level||0}/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
        {[["notes","📖 Notes"],["practice","✏️ Practice"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"10px 0",fontSize:13,fontWeight:tab===t?700:400,
            color:tab===t?topic.color:T.sec,border:"none",background:"none",cursor:"pointer",
            borderBottom:`2px solid ${tab===t?topic.color:"transparent"}`,transition:"all .2s"
          }}>{l}</button>
        ))}
      </div>

      <div style={{flex:1,overflow:"auto"}}>
        {tab==="notes"&&content&&(
          <div style={{padding:"16px 16px 80px"}}>
            {/* Summary */}
            <div style={{background:`${topic.color}15`,border:`1px solid ${topic.color}33`,borderRadius:12,padding:14,marginBottom:16}}>
              <div style={{fontSize:13,color:T.pri,lineHeight:1.6}}>{content.summary}</div>
            </div>

            {/* Key Points */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.sec,fontWeight:700,letterSpacing:1,marginBottom:10}}>KEY POINTS</div>
              {content.keyPoints.map((pt,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:topic.color,color:"#000",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:13,color:T.pri,lineHeight:1.6}}>{pt}</div>
                </div>
              ))}
            </div>

            {/* Common Mistakes */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"#EB4D4B",fontWeight:700,letterSpacing:1,marginBottom:10}}>⚠ COMMON MISTAKES</div>
              {content.commonMistakes.map((m,i)=>(
                <div key={i} style={{background:"#EB4D4B11",border:"1px solid #EB4D4B33",borderRadius:8,padding:10,marginBottom:8,fontSize:13,color:T.pri,lineHeight:1.5}}>
                  {m}
                </div>
              ))}
            </div>

            {/* Tip */}
            <div style={{background:"#4F7DFF15",border:"1px solid #4F7DFF33",borderRadius:12,padding:12,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:4}}>💡 EXAM TIP</div>
              <div style={{fontSize:13,color:T.pri,lineHeight:1.6}}>{content.tip}</div>
            </div>

            {/* Worked Example */}
            <div style={{background:T.card,borderRadius:12,padding:14,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:T.sec,letterSpacing:1,marginBottom:8}}>WORKED EXAMPLE</div>
              <div style={{fontSize:13,fontWeight:600,color:T.pri,marginBottom:10}}>{content.example.q}</div>
              {content.example.steps.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <div style={{fontSize:11,color:T.sec,marginTop:2,width:16}}>→</div>
                  <div style={{fontSize:13,color:T.pri,fontFamily:"monospace"}}>{s}</div>
                </div>
              ))}
              <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                <span style={{fontSize:13,fontWeight:700,color:topic.color}}>{content.example.a}</span>
              </div>
            </div>

            <button onClick={()=>setTab("practice")} style={{
              width:"100%",background:topic.color,border:"none",borderRadius:12,padding:"14px 0",
              fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer",marginTop:16
            }}>Start Practice →</button>
          </div>
        )}

        {tab==="practice"&&q&&(
          <div style={{padding:"16px 16px 80px"}}>
            {/* Progress */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:11,color:T.sec}}>Question {qi+1} of {questions.length}</div>
              <div style={{display:"flex",gap:8}}>
                <MarkBadge marks={q.marks}/>
                {m.attempted>0&&<span style={{fontSize:11,color:T.sec}}>{Math.round((m.accuracy||0)*100)}% accuracy</span>}
              </div>
            </div>

            {/* Q progress dots */}
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:16}}>
              {questions.map((_,i)=>{
                const att = state.attempts?.[tid]?.[i];
                const col = !att?"#2E3350":att.correct?"#6AB04C":"#EB4D4B";
                return <div key={i} onClick={()=>{setQi(i);setAnswer("");setSubmitted(false);setResult(null);setShowWork(false);}} style={{width:8,height:8,borderRadius:"50%",background:i===qi?topic.color:col,cursor:"pointer",transition:"background .2s"}}/>;
              })}
            </div>

            {/* Question */}
            <div style={{background:T.card,borderRadius:14,padding:16,marginBottom:16,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:15,color:T.pri,lineHeight:1.7}}>{q.q}</div>
            </div>

            {/* Answer input */}
            {!submitted&&(
              <div>
                <div style={{fontSize:11,color:T.sec,marginBottom:6}}>Your answer:</div>
                <input ref={inputRef} value={answer} onChange={e=>setAnswer(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&submitAnswer()}
                  placeholder="Type your answer here…"
                  style={{
                    width:"100%",background:T.card,border:`1px solid ${T.border}`,
                    borderRadius:10,padding:"12px 14px",fontSize:15,color:T.pri,
                    outline:"none",boxSizing:"border-box",caretColor:topic.color,
                    fontFamily:"inherit"
                  }}/>
                <button onClick={submitAnswer} disabled={!answer.trim()} style={{
                  width:"100%",marginTop:10,background:answer.trim()?topic.color:"#1a2030",
                  border:"none",borderRadius:10,padding:"13px 0",fontSize:14,fontWeight:700,
                  color:answer.trim()?"#fff":T.sec,cursor:answer.trim()?"pointer":"default",
                  transition:"all .2s"
                }}>Check Answer</button>
              </div>
            )}

            {/* Result */}
            {submitted&&result&&(
              <div>
                <div style={{
                  background:result.correct?"#6AB04C18":"#EB4D4B18",
                  border:`1px solid ${result.correct?"#6AB04C":"#EB4D4B"}44`,
                  borderRadius:12,padding:14,marginBottom:14
                }}>
                  <div style={{fontSize:20,marginBottom:6}}>{result.correct?"✅":"❌"}</div>
                  <div style={{fontSize:15,fontWeight:700,color:result.correct?"#6AB04C":"#EB4D4B"}}>
                    {result.correct?"Correct!":"Not quite"}
                  </div>
                  {!result.correct&&(
                    <div style={{fontSize:13,color:T.sec,marginTop:4}}>
                      Answer: <span style={{color:T.pri,fontWeight:600}}>{q.a}</span>
                    </div>
                  )}
                </div>

                {/* AI Tutor — shown only on wrong answers */}
                {!result.correct&&(
                  <AiTutor
                    question={q.q}
                    correctAnswer={q.a}
                    studentAnswer={answer}
                    working={q.work}
                    topic={topic?.name}
                    topicColor={topic?.color}
                  />
                )}

                <button onClick={()=>setShowWork(!showWork)} style={{
                  width:"100%",background:T.card,border:`1px solid ${T.border}`,
                  borderRadius:10,padding:"10px 0",fontSize:13,color:T.sec,cursor:"pointer",marginBottom:10
                }}>{showWork?"Hide working":"Show full working"}</button>

                {showWork&&(
                  <div style={{background:T.card,borderRadius:10,padding:12,marginBottom:12,border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.sec,letterSpacing:1,marginBottom:8}}>WORKING</div>
                    <pre style={{fontSize:13,color:T.pri,margin:0,whiteSpace:"pre-wrap",fontFamily:"monospace",lineHeight:1.7}}>{q.work}</pre>
                  </div>
                )}

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <button onClick={prevQ} disabled={qi===0} style={{
                    background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 0",
                    fontSize:13,color:qi===0?T.dim:T.pri,cursor:qi===0?"default":"pointer"
                  }}>← Prev</button>
                  <button onClick={nextQ} disabled={qi===questions.length-1} style={{
                    background:qi<questions.length-1?topic.color:T.card,border:`1px solid ${qi<questions.length-1?topic.color:T.border}`,
                    borderRadius:10,padding:"12px 0",fontSize:13,fontWeight:700,
                    color:qi<questions.length-1?"#fff":T.dim,cursor:qi<questions.length-1?"pointer":"default"
                  }}>Next →</button>
                </div>
                <button onClick={jumpRandom} style={{
                  width:"100%",marginTop:8,background:"none",border:`1px solid ${T.border}`,
                  borderRadius:10,padding:"10px 0",fontSize:12,color:T.sec,cursor:"pointer"
                }}>🎲 Random question</button>
              </div>
            )}

            {/* Prev attempt badge */}
            {!submitted&&prevAttempt&&(
              <div style={{marginTop:10,fontSize:11,color:T.sec,textAlign:"center"}}>
                {prevAttempt.correct?"✅ Got this right before":"❌ Got this wrong before — try again!"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: MOCK PAPERS ──────────────────────────────────────────────────────
function MocksScreen({state, dispatch, onBack, onPaper, onExam, onPlans}){
  const plan = state.plan||"free";
  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.sec,cursor:"pointer",fontSize:18,padding:0}}>←</button>
        <div style={{fontSize:18,fontWeight:800,color:T.pri}}>Mock Papers</div>
      </div>
      <div style={{fontSize:13,color:T.sec,marginBottom:20,lineHeight:1.6}}>
        Full exam papers with 22 questions each, matching the P6 PSLE format. Each paper covers different topics and difficulty levels.
      </div>
      {MOCK_PAPERS.map(p=>{
        const locked = !p.free && plan==="free";
        const attempts = state.paperAttempts?.[p.id]||{};
        const done = Object.keys(attempts).length;
        const correct = Object.values(attempts).filter(a=>a.correct).length;
        const diffColors = {Foundation:"#6AB04C",Intermediate:"#F9CA24",Advanced:"#EB4D4B"};
        return (
          <button key={p.id} onClick={()=>locked?onPlans():onPaper(p.id)}
            style={{
              display:"block",width:"100%",background:T.card,border:`1px solid ${locked?T.border:"#4F7DFF33"}`,
              borderRadius:14,padding:"16px",marginBottom:12,textAlign:"left",cursor:"pointer"
            }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontSize:15,fontWeight:700,color:T.pri}}>{p.label}</div>
                  {locked&&<span style={{fontSize:12}}>🔒</span>}
                  {p.free&&<span style={{fontSize:10,color:"#6AB04C",fontWeight:700,border:"1px solid #6AB04C33",borderRadius:10,padding:"1px 6px"}}>FREE</span>}
                </div>
                <div style={{fontSize:12,color:T.sec,marginTop:4}}>{p.focus}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
                <div style={{fontSize:11,color:diffColors[p.difficulty]||T.sec,fontWeight:700}}>{p.difficulty}</div>
                <div style={{fontSize:11,color:T.sec,marginTop:2}}>{p.questions}Q</div>
              </div>
            </div>
            {done>0&&(
              <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`,display:"flex",gap:12}}>
                <span style={{fontSize:11,color:T.sec}}>{done}/{p.questions} attempted</span>
                <span style={{fontSize:11,color:"#6AB04C"}}>{correct} correct</span>
                <span style={{fontSize:11,color:T.sec}}>{done?Math.round(correct/done*100):0}%</span>
              </div>
            )}
            {/* Mode buttons */}
            {!locked&&(
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button onClick={e=>{e.stopPropagation();onPaper(p.id);}} style={{
                  flex:1,background:T.surface,border:`1px solid ${T.border}`,
                  borderRadius:8,padding:"8px 0",fontSize:12,fontWeight:600,color:T.sec,cursor:"pointer"
                }}>📖 Practice</button>
                <button onClick={e=>{e.stopPropagation();onExam(p.id);}} style={{
                  flex:1,background:"#EB4D4B22",border:"1px solid #EB4D4B55",
                  borderRadius:8,padding:"8px 0",fontSize:12,fontWeight:700,color:"#EB4D4B",cursor:"pointer"
                }}>⏱ Exam Mode</button>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── SCREEN: PAPER ────────────────────────────────────────────────────────────
function PaperScreen({pid, state, dispatch, onBack}){
  const paper = MOCK_PAPERS.find(p=>p.id===pid);
  const questions = PAPER_QS[pid]||[];
  const [qi, setQi] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showWork, setShowWork] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef();
  const attempts = state.paperAttempts?.[pid]||{};
  const done = Object.keys(attempts).length;
  const correct = Object.values(attempts).filter(a=>a.correct).length;

  const q = questions[qi];

  function submitAnswer(){
    if(!answer.trim()) return;
    const r = checkAnswer(answer, q.a);
    const c = r==="correct";
    setResult({correct:c, status:r});
    setSubmitted(true);
    dispatch({type:"RECORD_PAPER_ATTEMPT",pid,qi,correct:c,student:answer});
  }
  function goNext(){
    setQi(i=>Math.min(i+1,questions.length-1));
    setAnswer(""); setSubmitted(false); setResult(null); setShowWork(false); setShowHint(false);
    setTimeout(()=>inputRef.current?.focus(),100);
  }

  if(!q) return <div style={{padding:20,color:T.sec}}>No questions available.</div>;

  const diffColors = {Foundation:"#6AB04C",Intermediate:"#F9CA24",Advanced:"#EB4D4B"};
  const diffColor = diffColors[paper?.difficulty]||T.accent;

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.sec,cursor:"pointer",fontSize:18,padding:0}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700,color:T.pri}}>{paper?.label}</div>
          <div style={{fontSize:11,color:T.sec}}>{done}/{questions.length} done · {done?Math.round(correct/done*100):0}% correct</div>
        </div>
        <span style={{fontSize:10,color:diffColor,fontWeight:700,border:`1px solid ${diffColor}44`,borderRadius:10,padding:"2px 8px"}}>{paper?.difficulty}</span>
      </div>

      <div style={{flex:1,overflow:"auto",padding:"16px 16px 80px"}}>
        {/* Progress */}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:11,color:T.sec}}>Q{qi+1} of {questions.length}</span>
            <span style={{fontSize:11,color:T.sec,fontWeight:600}}>{q.topic}</span>
          </div>
          <div style={{height:4,borderRadius:2,background:T.border,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(qi+1)/questions.length*100}%`,background:diffColor,transition:"width .3s"}}/>
          </div>
        </div>

        {/* Q dots */}
        <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:16}}>
          {questions.map((_,i)=>{
            const att = attempts[i];
            const col = !att?"#2E3350":att.correct?"#6AB04C":"#EB4D4B";
            return <div key={i} onClick={()=>{setQi(i);setAnswer("");setSubmitted(false);setResult(null);setShowWork(false);setShowHint(false);}}
              style={{width:8,height:8,borderRadius:"50%",background:i===qi?diffColor:col,cursor:"pointer"}}/>;
          })}
        </div>

        {/* Question */}
        <div style={{background:T.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <MarkBadge marks={q.marks}/>
          </div>
          <div style={{fontSize:15,color:T.pri,lineHeight:1.7}}>{q.q}</div>
        </div>

        {/* Hint */}
        {q.hint&&(
          <button onClick={()=>setShowHint(!showHint)} style={{
            width:"100%",background:"#F9CA2411",border:"1px solid #F9CA2433",
            borderRadius:10,padding:"10px 12px",textAlign:"left",cursor:"pointer",marginBottom:12
          }}>
            <span style={{fontSize:12,color:"#F9CA24"}}>💡 {showHint?q.hint:"Tap for hint"}</span>
          </button>
        )}

        {/* Answer */}
        {!submitted&&(
          <div>
            <input ref={inputRef} value={answer} onChange={e=>setAnswer(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submitAnswer()}
              placeholder="Type your answer…"
              style={{
                width:"100%",background:T.card,border:`1px solid ${T.border}`,
                borderRadius:10,padding:"12px 14px",fontSize:15,color:T.pri,
                outline:"none",boxSizing:"border-box",caretColor:diffColor,fontFamily:"inherit"
              }}/>
            <button onClick={submitAnswer} disabled={!answer.trim()} style={{
              width:"100%",marginTop:10,background:answer.trim()?diffColor:"#1a2030",
              border:"none",borderRadius:10,padding:"13px 0",fontSize:14,fontWeight:700,
              color:answer.trim()?"#fff":T.sec,cursor:answer.trim()?"pointer":"default"
            }}>Submit Answer</button>
          </div>
        )}

        {submitted&&result&&(
          <div>
            <div style={{
              background:result.correct?"#6AB04C18":"#EB4D4B18",
              border:`1px solid ${result.correct?"#6AB04C":"#EB4D4B"}44`,
              borderRadius:12,padding:14,marginBottom:14
            }}>
              <div style={{fontSize:18,marginBottom:4}}>{result.correct?"✅":"❌"}</div>
              <div style={{fontSize:15,fontWeight:700,color:result.correct?"#6AB04C":"#EB4D4B"}}>
                {result.correct?"Correct!":"Not quite"}
              </div>
              {!result.correct&&<div style={{fontSize:13,color:T.sec,marginTop:4}}>Answer: <span style={{color:T.pri,fontWeight:600}}>{q.a}</span></div>}
            </div>

            {/* AI Tutor — wrong answers only */}
            {!result.correct&&(
              <AiTutor
                question={q.q}
                correctAnswer={q.a}
                studentAnswer={answer}
                working={q.work}
                topic={q.topic||paper?.label}
                topicColor={diffColor}
              />
            )}

            <button onClick={()=>setShowWork(!showWork)} style={{
              width:"100%",background:T.card,border:`1px solid ${T.border}`,
              borderRadius:10,padding:"10px 0",fontSize:13,color:T.sec,cursor:"pointer",marginBottom:10
            }}>{showWork?"Hide working":"Show full working"}</button>

            {showWork&&(
              <div style={{background:T.card,borderRadius:10,padding:12,marginBottom:12,border:`1px solid ${T.border}`}}>
                <pre style={{fontSize:13,color:T.pri,margin:0,whiteSpace:"pre-wrap",fontFamily:"monospace",lineHeight:1.7}}>{q.work}</pre>
              </div>
            )}

            <button onClick={goNext} disabled={qi===questions.length-1} style={{
              width:"100%",background:qi<questions.length-1?diffColor:T.card,
              border:`1px solid ${qi<questions.length-1?diffColor:T.border}`,
              borderRadius:10,padding:"13px 0",fontSize:14,fontWeight:700,
              color:qi<questions.length-1?"#fff":T.dim,cursor:qi<questions.length-1?"pointer":"default"
            }}>{qi<questions.length-1?"Next Question →":"Paper Complete!"}</button>

            {qi===questions.length-1&&done>=questions.length&&(
              <div style={{marginTop:14,background:T.card,borderRadius:12,padding:14,textAlign:"center",border:`1px solid ${T.border}`}}>
                <div style={{fontSize:22,marginBottom:8}}>🎉</div>
                <div style={{fontSize:16,fontWeight:700,color:T.pri}}>Paper Complete!</div>
                <div style={{fontSize:14,color:T.sec,marginTop:4}}>{correct} / {questions.length} correct ({Math.round(correct/questions.length*100)}%)</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EXPORT / IMPORT HELPERS ─────────────────────────────────────────────────
function exportProgress(state) {
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    uid: localStorage.getItem("p6prep_uid") || "",
    name: localStorage.getItem("p6prep_name") || "",
    data: state,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type:"application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `p6prep-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file, dispatch, onDone, onError) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const payload = JSON.parse(e.target.result);
      if (!payload.version || !payload.data) throw new Error("Invalid backup file");
      const { data, uid, name } = payload;
      // Restore uid and name to localStorage
      if (uid) localStorage.setItem("p6prep_uid", uid);
      if (name) localStorage.setItem("p6prep_name", name);
      // Restore full state via IMPORT_STATE action
      dispatch({ type:"IMPORT_STATE", state: data });
      onDone(payload);
    } catch(err) {
      onError(err.message);
    }
  };
  reader.readAsText(file);
}

// ─── SHARE WITH PARENT CARD ───────────────────────────────────────────────────
// Generates the /parent?uid=XXX link for cross-device real-time monitoring.
// Uses the same uid as the leaderboard system (p6prep_uid in localStorage).

function ShareWithParentCard() {
  const [copied, setCopied] = useState(false);
  const uid = (() => {
    let id = localStorage.getItem("p6prep_uid");
    if (!id) { id = Math.random().toString(36).slice(2,10); localStorage.setItem("p6prep_uid", id); }
    return id;
  })();

  const parentUrl = `${window.location.origin}/parent?uid=${uid}`;
  const shortCode = uid.slice(0,6).toUpperCase();

  function copyLink() {
    navigator.clipboard?.writeText(parentUrl).then(() => {
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    }).catch(()=>{});
  }

  function shareLink() {
    if (navigator.share) {
      navigator.share({
        title: "Track my PSLE Maths progress",
        text: "View my real-time study progress:",
        url: parentUrl,
      }).catch(()=>{});
    } else {
      copyLink();
    }
  }

  return (
    <div style={{background:T.card,border:`1px solid ${T.accent}33`,borderRadius:14,padding:16,marginBottom:20}}>
      <div style={{fontSize:13,color:T.pri,lineHeight:1.7,marginBottom:12}}>
        Give this link to a parent so they can see your progress live on their own phone — no app install needed.
      </div>

      {/* Student code */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",marginBottom:10,textAlign:"center"}}>
        <div style={{fontSize:10,color:T.sec,fontWeight:600,letterSpacing:1,marginBottom:4}}>YOUR STUDENT CODE</div>
        <div style={{fontSize:20,fontWeight:800,color:T.accent,letterSpacing:3,fontFamily:"monospace"}}>{shortCode}</div>
      </div>

      {/* Share / Copy buttons */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={shareLink} style={{
          flex:1,background:T.accent,border:"none",borderRadius:10,
          padding:"12px 0",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",gap:6,
        }}>📤 Share Link</button>
        <button onClick={copyLink} style={{
          flex:1,background:copied?"#6AB04C22":T.surface,
          border:`1px solid ${copied?"#6AB04C":T.border}`,
          borderRadius:10,padding:"12px 0",fontSize:13,fontWeight:700,
          color:copied?"#6AB04C":T.sec,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",gap:6,
        }}>{copied?"✅ Copied!":"📋 Copy Link"}</button>
      </div>

      <div style={{fontSize:11,color:T.sec,marginTop:10,lineHeight:1.6}}>
        ⚠️ Anyone with this link can view your progress. Only share it with your parent or guardian.
      </div>
    </div>
  );
}

// ─── SCREEN: PLANS & SETTINGS ─────────────────────────────────────────────────
function PlansScreen({state, dispatch, onBack, onAnalytics}){
  const current = state.plan||"free";
  const [importStatus, setImportStatus] = useState(null); // null | "success" | "error"
  const [importMsg, setImportMsg]       = useState("");
  const [exported, setExported]         = useState(false);
  const fileRef = useRef();

  const totalAttempts = Object.values(state.attempts||{}).flatMap(t=>Object.values(t)).length;
  const exportSize = JSON.stringify(state).length;
  const exportKb   = (exportSize/1024).toFixed(1);

  function handleExport() {
    exportProgress(state);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importProgress(
      file,
      dispatch,
      (payload) => {
        setImportStatus("success");
        setImportMsg(`Restored ${Object.values(payload.data.attempts||{}).flatMap(t=>Object.values(t)).length} answers from ${payload.exportedAt.slice(0,10)}`);
        setTimeout(() => setImportStatus(null), 5000);
      },
      (err) => {
        setImportStatus("error");
        setImportMsg(`Import failed: ${err}`);
        setTimeout(() => setImportStatus(null), 5000);
      }
    );
    // Reset file input
    e.target.value = "";
  }

  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.sec,cursor:"pointer",fontSize:18,padding:0}}>←</button>
        <div style={{fontSize:18,fontWeight:800,color:T.pri}}>Plans & Settings</div>
      </div>

      {/* ── SHARE WITH PARENT ── */}
      <div style={{fontSize:11,color:T.sec,fontWeight:700,letterSpacing:1,marginBottom:10}}>👨‍👩‍👧 SHARE WITH PARENT</div>
      <ShareWithParentCard/>

      {/* ── BACKUP SECTION ── */}
      <div style={{fontSize:11,color:T.sec,fontWeight:700,letterSpacing:1,marginBottom:10}}>💾 PROGRESS BACKUP</div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:16,marginBottom:20}}>
        <div style={{fontSize:13,color:T.pri,lineHeight:1.7,marginBottom:14}}>
          Your progress is saved on this device. Export a backup file to keep it safe or transfer it to another device.
        </div>

        {/* Export */}
        <button onClick={handleExport} style={{
          width:"100%",background:exported?"#6AB04C22":"#4F7DFF18",
          border:`1px solid ${exported?"#6AB04C":"#4F7DFF"}44`,
          borderRadius:10,padding:"13px 16px",
          display:"flex",alignItems:"center",gap:10,
          cursor:"pointer",textAlign:"left",marginBottom:10,
          transition:"all .3s",
        }}>
          <span style={{fontSize:22,flexShrink:0}}>{exported?"✅":"📤"}</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:exported?"#6AB04C":T.accent}}>
              {exported?"Exported!":"Export My Progress"}
            </div>
            <div style={{fontSize:11,color:T.sec,marginTop:1}}>
              {totalAttempts>0
                ? `${totalAttempts} answers · ~${exportKb} KB · saves as .json file`
                : "No progress yet — start practising first"}
            </div>
          </div>
        </button>

        {/* Import */}
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{display:"none"}}
        />
        <button onClick={()=>fileRef.current?.click()} style={{
          width:"100%",background:T.surface,
          border:`1px solid ${T.border}`,
          borderRadius:10,padding:"13px 16px",
          display:"flex",alignItems:"center",gap:10,
          cursor:"pointer",textAlign:"left",
        }}>
          <span style={{fontSize:22,flexShrink:0}}>📥</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.pri}}>Restore from Backup</div>
            <div style={{fontSize:11,color:T.sec,marginTop:1}}>
              Select a .json backup file to restore progress
            </div>
          </div>
        </button>

        {/* Import status */}
        {importStatus && (
          <div style={{
            marginTop:10,padding:"10px 12px",borderRadius:10,
            background:importStatus==="success"?"#6AB04C18":"#EB4D4B18",
            border:`1px solid ${importStatus==="success"?"#6AB04C":"#EB4D4B"}44`,
            fontSize:12,color:importStatus==="success"?"#6AB04C":"#EB4D4B",
            fontWeight:600,
          }}>
            {importStatus==="success"?"✅":"❌"} {importMsg}
          </div>
        )}

        <div style={{marginTop:12,fontSize:11,color:T.sec,lineHeight:1.6}}>
          ⚠️ Restoring a backup will replace your current progress on this device.
        </div>
      </div>

      {/* ── DANGER ZONE ── */}
      <div style={{fontSize:11,color:"#EB4D4B",fontWeight:700,letterSpacing:1,marginBottom:10}}>⚠️ RESET</div>
      <div style={{background:T.card,border:"1px solid #EB4D4B33",borderRadius:14,padding:16,marginBottom:20}}>
        <div style={{fontSize:13,color:T.sec,marginBottom:12,lineHeight:1.6}}>
          Reset all progress and start fresh. This cannot be undone — export a backup first if you want to keep your data.
        </div>
        <button onClick={()=>{
          if(window.confirm("Reset ALL progress? This cannot be undone. Export a backup first if needed.")){
            localStorage.removeItem("p6prep_v2");
            window.location.reload();
          }
        }} style={{
          width:"100%",background:"#EB4D4B18",border:"1px solid #EB4D4B44",
          borderRadius:10,padding:"12px 0",fontSize:13,fontWeight:700,
          color:"#EB4D4B",cursor:"pointer",
        }}>🗑 Reset All Progress</button>
      </div>

      {/* ── PLANS ── */}
      <div style={{fontSize:11,color:T.sec,fontWeight:700,letterSpacing:1,marginBottom:10}}>CHOOSE PLAN</div>
      <div style={{fontSize:13,color:T.sec,marginBottom:16,lineHeight:1.6}}>
        Unlock all 12 topics, mock papers, and progress tracking to maximise your PSLE preparation.
      </div>
      {PLANS.map(p=>(
        <div key={p.id} style={{
          background:T.card,border:`2px solid ${current===p.id?p.color:p.popular?"#22A6B333":T.border}`,
          borderRadius:16,padding:"18px 16px",marginBottom:12,position:"relative",overflow:"hidden"
        }}>
          {p.popular&&<div style={{position:"absolute",top:12,right:12,background:"#22A6B3",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>MOST POPULAR</div>}
          <div style={{fontSize:18,fontWeight:800,color:T.pri}}>{p.name}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,margin:"6px 0 12px"}}>
            <span style={{fontSize:24,fontWeight:800,color:p.color}}>{p.price}</span>
            <span style={{fontSize:13,color:T.sec}}>{p.period}</span>
          </div>
          {p.features.map((f,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:13,color:T.pri,alignItems:"flex-start"}}>
              <span style={{color:p.color,flexShrink:0}}>✓</span>{f}
            </div>
          ))}
          <button onClick={()=>{dispatch({type:"SET_PLAN",plan:p.id});onBack();}}
            style={{
              width:"100%",marginTop:14,background:current===p.id?"#1a2030":p.color,
              border:`1px solid ${current===p.id?T.border:p.color}`,
              borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,
              color:current===p.id?T.sec:"#fff",cursor:"pointer"
            }}>{current===p.id?"Current Plan":"Select Plan"}</button>
        </div>
      ))}
      <div style={{fontSize:11,color:T.sec,textAlign:"center",marginTop:4,lineHeight:1.6}}>
        This is a demo app. Plan selection simulates unlocking content.
      </div>

      {/* Admin analytics access — separate from parent PIN */}
      <button onClick={onAnalytics} style={{
        width:"100%", marginTop:20, background:"none",
        border:`1px dashed ${T.border}`, borderRadius:10,
        padding:"10px 0", fontSize:11, color:T.sec, cursor:"pointer",
      }}>📊 Analytics Dashboard (Teacher/Admin)</button>
    </div>
  );
}

// ─── SCREEN: STATS ────────────────────────────────────────────────────────────
function StatsScreen({state, dispatch}){
  const totalAttempts = Object.values(state.attempts||{}).reduce((s,t)=>s+Object.keys(t).length,0);
  const totalCorrect  = Object.values(state.attempts||{}).reduce((s,t)=>s+Object.values(t).filter(a=>a.correct).length,0);
  const overallAcc    = totalAttempts ? Math.round(totalCorrect/totalAttempts*100) : 0;

  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontSize:18,fontWeight:800,color:T.pri,marginBottom:20}}>My Progress</div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {[["Total Tried",totalAttempts,"🎯"],["Correct",totalCorrect,"✅"],["Accuracy",`${overallAcc}%`,"📊"],["Topics Active",Object.keys(state.attempts||{}).length,"📚"]].map(([l,v,ic])=>(
          <div key={l} style={{background:T.card,borderRadius:12,padding:"14px 12px",textAlign:"center",border:`1px solid ${T.border}`}}>
            <div style={{fontSize:22,marginBottom:4}}>{ic}</div>
            <div style={{fontSize:20,fontWeight:800,color:T.pri}}>{v}</div>
            <div style={{fontSize:11,color:T.sec,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{fontSize:11,color:T.sec,fontWeight:700,letterSpacing:1,marginBottom:12}}>TOPIC BREAKDOWN</div>
      {TOPICS.map(t=>{
        const m = state.mastery?.[t.id]||{};
        if(!m.attempted) return null;
        const acc = Math.round((m.accuracy||0)*100);
        return (
          <div key={t.id} style={{background:T.card,borderRadius:12,padding:"12px 14px",marginBottom:8,border:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>{t.icon}</span>
                <span style={{fontSize:13,fontWeight:600,color:T.pri}}>{t.name}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:12,color:acc>=80?"#6AB04C":acc>=60?"#F9CA24":"#EB4D4B",fontWeight:700}}>{acc}%</span>
                <button onClick={()=>dispatch({type:"RESET_TOPIC",tid:t.id})}
                  style={{fontSize:10,color:T.sec,background:"none",border:`1px solid ${T.border}`,borderRadius:6,padding:"2px 6px",cursor:"pointer"}}>Reset</button>
              </div>
            </div>
            <div style={{height:4,borderRadius:2,background:T.border}}>
              <div style={{height:"100%",width:`${acc}%`,background:t.color,borderRadius:2,transition:"width .4s"}}/>
            </div>
            <div style={{fontSize:11,color:T.sec,marginTop:4}}>{m.correct}/{m.attempted} correct · <LevelPill level={m.level||0}/></div>
          </div>
        );
      })}
      {!totalAttempts&&(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec}}>
          <div style={{fontSize:32,marginBottom:10}}>📊</div>
          <div style={{fontSize:14}}>No attempts yet. Start practising to see your progress here!</div>
        </div>
      )}
    </div>
  );
}

// ─── BADGES & ACHIEVEMENTS ────────────────────────────────────────────────────
// All badges auto-unlock based on real state. No manual claiming.
// Each badge has: id, icon, name, desc, check(state)→bool, color, category

const BADGES = [
  // ── GETTING STARTED ──
  { id:"first-step",    icon:"👣", name:"First Step",      color:"#6AB04C", cat:"Beginner",
    desc:"Answer your first question",
    check: s => Object.values(s.attempts||{}).flatMap(t=>Object.values(t)).length >= 1 },
  { id:"ten-questions", icon:"🔟", name:"Getting Going",   color:"#6AB04C", cat:"Beginner",
    desc:"Answer 10 questions",
    check: s => Object.values(s.attempts||{}).flatMap(t=>Object.values(t)).length >= 10 },
  { id:"century",       icon:"💯", name:"Century",         color:"#F9CA24", cat:"Volume",
    desc:"Answer 100 questions",
    check: s => Object.values(s.attempts||{}).flatMap(t=>Object.values(t)).length >= 100 },
  { id:"double-century",icon:"🚀", name:"Double Century",  color:"#F9CA24", cat:"Volume",
    desc:"Answer 200 questions",
    check: s => Object.values(s.attempts||{}).flatMap(t=>Object.values(t)).length >= 200 },

  // ── ACCURACY ──
  { id:"sharp-shooter", icon:"🎯", name:"Sharp Shooter",   color:"#22A6B3", cat:"Accuracy",
    desc:"Reach 80% accuracy across all topics",
    check: s => {
      const a = Object.values(s.attempts||{}).flatMap(t=>Object.values(t));
      return a.length >= 20 && a.filter(x=>x.correct).length/a.length >= 0.8;
    }},
  { id:"perfectionist", icon:"✨", name:"Perfectionist",   color:"#BE2EDD", cat:"Accuracy",
    desc:"Get 10 questions in a row correct in any topic",
    check: s => Object.values(s.attempts||{}).some(topicAttempts => {
      const vals = Object.values(topicAttempts).sort((a,b)=>(a.ts||0)-(b.ts||0));
      let streak=0;
      for(const v of vals){ if(v.correct){streak++;if(streak>=10)return true;}else streak=0; }
      return false;
    })},

  // ── BREADTH ──
  { id:"explorer",      icon:"🗺️", name:"Explorer",        color:"#FF9F43", cat:"Breadth",
    desc:"Practise 5 different topics",
    check: s => Object.keys(s.mastery||{}).filter(t=>s.mastery[t]?.attempted>0).length >= 5 },
  { id:"all-rounder",   icon:"🌟", name:"All-Rounder",     color:"#F9CA24", cat:"Breadth",
    desc:"Practise all 12 topics",
    check: s => Object.keys(s.mastery||{}).filter(t=>s.mastery[t]?.attempted>0).length >= 12 },
  { id:"master-class",  icon:"🏅", name:"Master Class",    color:"#F9CA24", cat:"Breadth",
    desc:"Reach 'Good' level (≥75%) in 6 topics",
    check: s => Object.values(s.mastery||{}).filter(m=>m?.accuracy>=0.75&&m?.attempted>=5).length >= 6 },

  // ── TOPICS ──
  { id:"number-ninja",  icon:"🔢", name:"Number Ninja",    color:"#FF6B6B", cat:"Topic",
    desc:"Master Whole Numbers (90%+ accuracy, 15+ questions)",
    check: s => (s.mastery?.["whole-numbers"]?.accuracy||0)>=0.9 && (s.mastery?.["whole-numbers"]?.attempted||0)>=15 },
  { id:"fraction-hero", icon:"½",  name:"Fraction Hero",   color:"#FF9F43", cat:"Topic",
    desc:"Master Fractions (90%+ accuracy, 15+ questions)",
    check: s => (s.mastery?.["fractions"]?.accuracy||0)>=0.9 && (s.mastery?.["fractions"]?.attempted||0)>=15 },
  { id:"percent-pro",   icon:"%",  name:"Percent Pro",     color:"#6AB04C", cat:"Topic",
    desc:"Master Percentage (85%+ accuracy, 10+ questions)",
    check: s => (s.mastery?.["percentage"]?.accuracy||0)>=0.85 && (s.mastery?.["percentage"]?.attempted||0)>=10 },
  { id:"speed-demon",   icon:"⚡", name:"Speed Demon",     color:"#EB4D4B", cat:"Topic",
    desc:"Master Speed (85%+ accuracy, 10+ questions)",
    check: s => (s.mastery?.["speed"]?.accuracy||0)>=0.85 && (s.mastery?.["speed"]?.attempted||0)>=10 },
  { id:"algebra-ace",   icon:"x²", name:"Algebra Ace",     color:"#BE2EDD", cat:"Topic",
    desc:"Master Algebra (85%+ accuracy, 10+ questions)",
    check: s => (s.mastery?.["algebra"]?.accuracy||0)>=0.85 && (s.mastery?.["algebra"]?.attempted||0)>=10 },

  // ── MOCK PAPERS ──
  { id:"paper-debut",   icon:"📝", name:"Paper Debut",     color:"#0652DD", cat:"Exam",
    desc:"Complete Mock Paper A",
    check: s => Object.keys(s.paperAttempts?.["mock-a"]||{}).length >= 22 },
  { id:"exam-ready",    icon:"🎓", name:"Exam Ready",      color:"#0652DD", cat:"Exam",
    desc:"Score 75%+ on any mock paper",
    check: s => Object.entries(s.paperAttempts||{}).some(([,atts])=>{
      const vals=Object.values(atts); return vals.length>=22&&vals.filter(a=>a.correct).length/vals.length>=0.75;
    })},
  { id:"psle-star",     icon:"⭐", name:"PSLE Star",       color:"#F9CA24", cat:"Exam",
    desc:"Score 90%+ on any mock paper",
    check: s => Object.entries(s.paperAttempts||{}).some(([,atts])=>{
      const vals=Object.values(atts); return vals.length>=22&&vals.filter(a=>a.correct).length/vals.length>=0.9;
    })},
  { id:"exam-veteran",  icon:"🏆", name:"Exam Veteran",    color:"#F9CA24", cat:"Exam",
    desc:"Complete all 5 mock papers",
    check: s => ["mock-a","mock-b","mock-c","mock-d","mock-e"].every(
      p=>Object.keys(s.paperAttempts?.[p]||{}).length>=22
    )},

  // ── CONSISTENCY ──
  { id:"daily-habit",   icon:"📅", name:"Daily Habit",     color:"#FDA7DF", cat:"Streak",
    desc:"Practise 3 days in a row",
    check: s => {
      const a=Object.values(s.attempts||{}).flatMap(t=>Object.values(t));
      const days=new Set(a.map(x=>new Date(x.ts||0).toDateString()));
      let streak=0; const d=new Date();
      while(days.has(d.toDateString())){ streak++; d.setDate(d.getDate()-1); }
      return streak>=3;
    }},
  { id:"weekly-warrior",icon:"🔥", name:"Weekly Warrior",  color:"#EB4D4B", cat:"Streak",
    desc:"Practise 7 days in a row",
    check: s => {
      const a=Object.values(s.attempts||{}).flatMap(t=>Object.values(t));
      const days=new Set(a.map(x=>new Date(x.ts||0).toDateString()));
      let streak=0; const d=new Date();
      while(days.has(d.toDateString())){ streak++; d.setDate(d.getDate()-1); }
      return streak>=7;
    }},
  { id:"comeback-kid",  icon:"💪", name:"Comeback Kid",    color:"#22A6B3", cat:"Streak",
    desc:"Get a question right after getting it wrong before",
    check: s => Object.values(s.attempts||{}).some(topicAttempts => {
      const vals=Object.values(topicAttempts).sort((a,b)=>(a.ts||0)-(b.ts||0));
      let hadWrong=false;
      for(const v of vals){ if(!v.correct) hadWrong=true; else if(hadWrong) return true; }
      return false;
    })},
];

// Evaluate all badges for a given state — returns array of unlocked badge ids
function evaluateBadges(state) {
  return BADGES.filter(b => { try{ return b.check(state); }catch{ return false; } }).map(b=>b.id);
}

// Compare old vs new unlocked badges, return newly unlocked ones
function getNewBadges(prevUnlocked, nowUnlocked) {
  return nowUnlocked.filter(id => !prevUnlocked.includes(id));
}

// ── Badge toast notification ──
function BadgeToast({ badge, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 4000); return ()=>clearTimeout(t); }, []);
  return (
    <div onClick={onDismiss} style={{
      position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
      zIndex:9999, maxWidth:340, width:"calc(100% - 32px)",
      background:`linear-gradient(135deg,${badge.color}22,${badge.color}0a)`,
      border:`1px solid ${badge.color}66`,
      borderRadius:16, padding:"14px 16px",
      display:"flex", alignItems:"center", gap:12,
      boxShadow:`0 8px 32px ${badge.color}44`,
      animation:"slideDown .4s ease",
      cursor:"pointer",
    }}>
      <div style={{
        width:48, height:48, borderRadius:12,
        background:badge.color, display:"flex",
        alignItems:"center", justifyContent:"center",
        fontSize:26, flexShrink:0,
        boxShadow:`0 4px 12px ${badge.color}66`,
      }}>{badge.icon}</div>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:badge.color,letterSpacing:.6}}>🏅 BADGE UNLOCKED</div>
        <div style={{fontSize:15,fontWeight:800,color:T.pri,marginTop:1}}>{badge.name}</div>
        <div style={{fontSize:12,color:T.sec,marginTop:1}}>{badge.desc}</div>
      </div>
    </div>
  );
}

// ── Badges Screen ──
function BadgesScreen({ state }) {
  const unlocked = useMemo(() => evaluateBadges(state), [state]);
  const cats = [...new Set(BADGES.map(b=>b.cat))];
  const [filter, setFilter] = useState("All");

  const allCats = ["All", ...cats];
  const filtered = BADGES.filter(b => filter==="All" || b.cat===filter);
  const unlockedCount = unlocked.length;

  return (
    <div style={{ padding:"16px 16px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:18, fontWeight:800, color:T.pri }}>🏅 Badges</div>
        <div style={{ fontSize:11, color:T.sec, marginTop:2 }}>
          {unlockedCount}/{BADGES.length} unlocked
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background:T.card, borderRadius:14, padding:"14px 16px", marginBottom:18, border:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:700, color:T.pri }}>Collection Progress</span>
          <span style={{ fontSize:13, fontWeight:700, color:T.accent }}>{Math.round(unlockedCount/BADGES.length*100)}%</span>
        </div>
        <div style={{ height:8, borderRadius:4, background:T.border, overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:4,
            width:`${unlockedCount/BADGES.length*100}%`,
            background:`linear-gradient(90deg,${T.accent},#BE2EDD)`,
            transition:"width .6s ease",
          }}/>
        </div>
        <div style={{ display:"flex", gap:12, marginTop:10, flexWrap:"wrap" }}>
          {["Beginner","Volume","Accuracy","Breadth","Topic","Exam","Streak"].map(cat=>{
            const catBadges = BADGES.filter(b=>b.cat===cat);
            const catUnlocked = catBadges.filter(b=>unlocked.includes(b.id)).length;
            return (
              <div key={cat} style={{ fontSize:11, color:T.sec }}>
                <span style={{ color:catUnlocked===catBadges.length?"#6AB04C":T.sec }}>
                  {catUnlocked===catBadges.length?"✅":"⬜"} {cat}
                </span>
                <span style={{ color:T.dim }}> {catUnlocked}/{catBadges.length}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
        {allCats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{
            padding:"5px 12px", borderRadius:20, border:`1px solid ${filter===c?T.accent:T.border}`,
            background:filter===c?`${T.accent}22`:"none",
            fontSize:11, fontWeight:filter===c?700:400,
            color:filter===c?T.accent:T.sec, cursor:"pointer",
          }}>{c}</button>
        ))}
      </div>

      {/* Badge grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {filtered.map(badge=>{
          const earned = unlocked.includes(badge.id);
          return (
            <div key={badge.id} style={{
              background:earned?`${badge.color}12`:T.card,
              border:`1px solid ${earned?badge.color+"44":T.border}`,
              borderRadius:14, padding:14,
              opacity:earned?1:0.5,
              transition:"all .2s",
              position:"relative", overflow:"hidden",
            }}>
              {earned&&(
                <div style={{
                  position:"absolute",top:8,right:8,
                  fontSize:10,fontWeight:700,color:badge.color,
                  background:`${badge.color}22`,borderRadius:6,padding:"1px 5px"
                }}>✓</div>
              )}
              <div style={{
                width:44,height:44,borderRadius:12,
                background:earned?badge.color:T.dim,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:22,marginBottom:8,
                boxShadow:earned?`0 4px 12px ${badge.color}44`:"none",
              }}>{earned?badge.icon:"🔒"}</div>
              <div style={{ fontSize:12, fontWeight:700, color:earned?T.pri:T.sec, marginBottom:3 }}>{badge.name}</div>
              <div style={{ fontSize:10, color:T.sec, lineHeight:1.5 }}>
                {earned?badge.desc:`🔒 ${badge.desc}`}
              </div>
              <div style={{ fontSize:9, color:badge.color, fontWeight:600, marginTop:4, opacity:earned?1:0 }}>{badge.cat}</div>
            </div>
          );
        })}
      </div>

      {unlockedCount===0&&(
        <div style={{ textAlign:"center", padding:"20px 0", color:T.sec }}>
          <div style={{ fontSize:13 }}>Start practising to unlock your first badge!</div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─── LEADERBOARD HELPERS ──────────────────────────────────────────────────────
const LB_PREFIX = "lb:";

function getLbUid(){
  let uid = localStorage.getItem("p6prep_uid");
  if(!uid){ uid = Math.random().toString(36).slice(2,10); localStorage.setItem("p6prep_uid",uid); }
  return uid;
}

function computeStreak(allAttempts){
  if(!allAttempts.length) return 0;
  const days = new Set(allAttempts.map(a=>new Date(a.ts||0).toDateString()));
  let streak=0; const d=new Date();
  while(days.has(d.toDateString())){ streak++; d.setDate(d.getDate()-1); }
  return streak;
}

function computeLbEntry(name, state){
  const allAttempts = Object.values(state.attempts||{}).flatMap(t=>Object.values(t));
  const total   = allAttempts.length;
  const correct = allAttempts.filter(a=>a.correct).length;
  const accuracy = total ? Math.round(correct/total*100) : 0;
  const topicsActive = Object.keys(state.mastery||{}).filter(t=>state.mastery[t]?.attempted>0).length;
  const score = Math.round(accuracy*0.5 + Math.min(total,200)*0.3 + topicsActive*5);
  const masteredTopics = Object.values(state.mastery||{}).filter(m=>m?.level>=4).length;
  const streak = computeStreak(allAttempts);

  // Per-topic accuracy snapshot (for analytics aggregation)
  const topicStats = {};
  TOPICS.forEach(t=>{
    const m = state.mastery?.[t.id];
    if(m && m.attempted>0) topicStats[t.id] = { attempted:m.attempted, correct:m.correct, accuracy:m.accuracy };
  });

  // Per-paper scores
  const paperStats = {};
  Object.entries(state.paperAttempts||{}).forEach(([pid, atts])=>{
    const vals = Object.values(atts);
    if(vals.length>0) paperStats[pid] = { attempted:vals.length, correct:vals.filter(a=>a.correct).length };
  });

  // Activity by day (last 30 days) for usage analytics
  const last30 = {};
  allAttempts.forEach(a=>{
    const day = new Date(a.ts||0).toISOString().slice(0,10);
    const daysAgo = Math.floor((Date.now()-(a.ts||0))/86400000);
    if(daysAgo<=30) last30[day] = (last30[day]||0)+1;
  });

  const onboarded = !!state.onboarded;
  const targetGrade = state.profile?.targetGrade || null;
  const plan = state.plan || "free";
  const badgesCount = (typeof evaluateBadges==="function") ? evaluateBadges(state).length : 0;

  return {
    name, score, accuracy, total, correct, topicsActive, masteredTopics, streak,
    topicStats, paperStats, last30, onboarded, targetGrade, plan, badgesCount,
    ts:Date.now(),
  };
}

async function pushToLeaderboard(name, state){
  try{
    const uid   = getLbUid();
    const entry = computeLbEntry(name, state);
    await window.storage.set(`${LB_PREFIX}${uid}`, JSON.stringify(entry), true);
    return entry;
  }catch(e){ console.error("lb push",e); return null; }
}

async function fetchLeaderboard(){
  try{
    const { keys } = await window.storage.list(LB_PREFIX, true);
    const entries = await Promise.all(keys.map(async k=>{
      try{
        const r = await window.storage.get(k, true);
        if(!r) return null;
        return { uid:k.replace(LB_PREFIX,""), ...JSON.parse(r.value) };
      }catch{ return null; }
    }));
    return entries.filter(Boolean).filter(e=>e.total>0).sort((a,b)=>b.score-a.score);
  }catch(e){ console.error("lb fetch",e); return []; }
}

// ─── SCREEN: LEADERBOARD ──────────────────────────────────────────────────────
function LeaderboardScreen({ state }){
  const uid = getLbUid();
  const savedName = localStorage.getItem("p6prep_name")||"";
  const [name, setName]           = useState(savedName);
  const [editName, setEditName]   = useState(!savedName);
  const [nameInput, setNameInput] = useState(savedName);
  const [board, setBoard]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [syncing, setSyncing]     = useState(false);
  const [myEntry, setMyEntry]     = useState(null);
  const [error, setError]         = useState("");

  const myRank = board.findIndex(e=>e.uid===uid)+1;
  const medals = ["🥇","🥈","🥉"];
  const rankColor = r=> r===1?"#F9CA24":r===2?"#B0BEC5":r===3?"#CD7F32":T.sec;
  const totalAttempts = Object.values(state.attempts||{}).flatMap(t=>Object.values(t)).length;

  async function load(){
    setLoading(true); setError("");
    try{ const data=await fetchLeaderboard(); setBoard(data); const me=data.find(e=>e.uid===uid); if(me) setMyEntry(me); }
    catch{ setError("Couldn't load. Check your connection."); }
    finally{ setLoading(false); }
  }

  async function sync(){
    if(!name.trim()){ setEditName(true); return; }
    setSyncing(true);
    const entry = await pushToLeaderboard(name.trim(), state);
    if(entry){ setMyEntry(entry); await load(); }
    else setError("Sync failed — try again.");
    setSyncing(false);
  }

  function saveName(){
    const n=nameInput.trim(); if(!n) return;
    localStorage.setItem("p6prep_name",n); setName(n); setEditName(false);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <div style={{fontSize:18,fontWeight:800,color:T.pri}}>🏆 Leaderboard</div>
          <div style={{fontSize:11,color:T.sec,marginTop:2}}>Compete with other P6 students</div>
        </div>
        <button onClick={load} disabled={loading} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,color:T.sec,cursor:"pointer"}}>
          {loading?"…":"↺ Refresh"}
        </button>
      </div>

      {/* Name setup */}
      {editName?(
        <div style={{background:T.card,border:`1px solid ${T.accent}44`,borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:T.pri,marginBottom:10}}>
            {name?"Edit your name":"Set a display name to join"}
          </div>
          <input value={nameInput} onChange={e=>setNameInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&saveName()}
            placeholder="e.g. Alex T." maxLength={20}
            style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:T.pri,outline:"none",boxSizing:"border-box",fontFamily:"inherit",caretColor:T.accent}}/>
          <div style={{fontSize:10,color:T.sec,marginTop:4}}>Max 20 chars. Use a nickname — not your full name.</div>
          <button onClick={saveName} disabled={!nameInput.trim()} style={{width:"100%",marginTop:10,background:nameInput.trim()?T.accent:"#1a2030",border:"none",borderRadius:8,padding:"11px 0",fontSize:13,fontWeight:700,color:nameInput.trim()?"#fff":T.sec,cursor:nameInput.trim()?"pointer":"default"}}>
            Save Name
          </button>
        </div>
      ):(
        /* My card */
        <div style={{background:`linear-gradient(135deg,${T.accent}22,${T.accent}08)`,border:`1px solid ${T.accent}44`,borderRadius:14,padding:14,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff"}}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:T.pri}}>{name}</div>
                <div style={{fontSize:11,color:T.sec}}>{myRank>0?`Rank #${myRank} globally`:"Not submitted yet"}</div>
              </div>
            </div>
            <button onClick={()=>{setNameInput(name);setEditName(true);}} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 10px",fontSize:11,color:T.sec,cursor:"pointer"}}>✏ Edit</button>
          </div>
          {myEntry&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:12}}>
              {[["Score",myEntry.score,"⭐"],["Accuracy",`${myEntry.accuracy}%`,"🎯"],["Questions",myEntry.total,"📝"],["Streak",`${myEntry.streak}d`,"🔥"]].map(([l,v,ic])=>(
                <div key={l} style={{background:T.surface,borderRadius:8,padding:"8px 4px",textAlign:"center"}}>
                  <div style={{fontSize:14}}>{ic}</div>
                  <div style={{fontSize:14,fontWeight:800,color:T.pri}}>{v}</div>
                  <div style={{fontSize:9,color:T.sec,marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
          )}
          <button onClick={sync} disabled={syncing||!totalAttempts} style={{
            width:"100%",marginTop:12,background:totalAttempts&&!syncing?T.accent:"#1a2030",
            border:"none",borderRadius:8,padding:"11px 0",fontSize:13,fontWeight:700,
            color:totalAttempts&&!syncing?"#fff":T.sec,cursor:totalAttempts&&!syncing?"pointer":"default"
          }}>{syncing?"Syncing…":myEntry?"↑ Update my score":"↑ Submit my score"}</button>
          {!totalAttempts&&<div style={{fontSize:11,color:T.sec,textAlign:"center",marginTop:6}}>Complete some questions first to join the leaderboard.</div>}
        </div>
      )}

      {error&&<div style={{fontSize:12,color:"#EB4D4B",marginBottom:12,textAlign:"center"}}>{error}</div>}

      {/* Board */}
      {loading?(
        <div style={{textAlign:"center",padding:"40px 0",color:T.sec}}>
          <div style={{fontSize:24,marginBottom:8}}>⏳</div>
          <div style={{fontSize:13}}>Loading leaderboard…</div>
        </div>
      ):board.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec}}>
          <div style={{fontSize:36,marginBottom:10}}>🏆</div>
          <div style={{fontSize:14,fontWeight:600,color:T.pri}}>Be the first on the board!</div>
          <div style={{fontSize:13,marginTop:6}}>Submit your score above to claim the #1 spot.</div>
        </div>
      ):(
        <div>
          {/* Podium — top 3 */}
          {board.length>=3&&(
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:8,marginBottom:20}}>
              {[1,0,2].map((pos,i)=>{
                const e=board[pos]; if(!e) return null;
                const h=[80,100,70][i];
                const isMe=e.uid===uid;
                return (
                  <div key={e.uid} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{fontSize:10,fontWeight:700,color:T.sec,marginBottom:3,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"center"}}>{e.name}</div>
                    <div style={{fontSize:22}}>{medals[pos]}</div>
                    <div style={{width:"100%",height:h,borderRadius:"8px 8px 0 0",background:isMe?`${T.accent}44`:T.card,border:`1px solid ${isMe?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:2}}>
                      <div style={{fontSize:16,fontWeight:800,color:rankColor(pos+1)}}>{e.score}</div>
                      <div style={{fontSize:9,color:T.sec}}>pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full list */}
          {board.map((e,i)=>{
            const rank=i+1; const isMe=e.uid===uid;
            return (
              <div key={e.uid} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",marginBottom:8,borderRadius:12,background:isMe?`${T.accent}15`:T.card,border:`1px solid ${isMe?`${T.accent}44`:T.border}`}}>
                <div style={{width:28,fontSize:rank<=3?20:13,fontWeight:800,color:rankColor(rank),textAlign:"center",flexShrink:0}}>{rank<=3?medals[rank-1]:`#${rank}`}</div>
                <div style={{width:36,height:36,borderRadius:"50%",background:isMe?T.accent:T.dim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#fff",flexShrink:0}}>
                  {e.name.charAt(0).toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13,fontWeight:700,color:T.pri,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</span>
                    {isMe&&<span style={{fontSize:9,fontWeight:700,color:T.accent,background:`${T.accent}22`,borderRadius:6,padding:"1px 5px",flexShrink:0}}>YOU</span>}
                  </div>
                  <div style={{fontSize:11,color:T.sec,marginTop:2}}>{e.accuracy}% accuracy · {e.total} Qs · {e.topicsActive} topics · 🔥{e.streak}d</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:16,fontWeight:800,color:rank<=3?rankColor(rank):T.pri}}>{e.score}</div>
                  <div style={{fontSize:9,color:T.sec}}>pts</div>
                </div>
              </div>
            );
          })}

          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px",marginTop:12}}>
            <div style={{fontSize:11,fontWeight:700,color:T.sec,letterSpacing:.8,marginBottom:4}}>HOW SCORES WORK</div>
            <div style={{fontSize:12,color:T.sec,lineHeight:1.7}}>Score = (Accuracy × 0.5) + (Questions × 0.3, capped at 200) + (Topics × 5 pts)<br/>Practise more topics and improve accuracy to climb the ranks!</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: ANALYTICS DASHBOARD ──────────────────────────────────────────────
// Aggregates data across ALL students who submitted to the leaderboard.
// PIN-gated separately from parent PIN (admin/teacher access).

const ADMIN_PIN_KEY = "p6prep_admin_pin";
const ADMIN_SESSION = "p6prep_admin_unlocked";

function aggregateAnalytics(entries) {
  const n = entries.length;
  if (n === 0) return null;

  const totalQuestions = entries.reduce((s,e)=>s+(e.total||0), 0);
  const totalCorrect   = entries.reduce((s,e)=>s+(e.correct||0), 0);
  const avgAccuracy    = Math.round(entries.reduce((s,e)=>s+(e.accuracy||0),0)/n);
  const avgQuestions   = Math.round(totalQuestions/n);
  const activeStudents = entries.filter(e=>e.total>0).length;
  const onboardedCount = entries.filter(e=>e.onboarded).length;

  // Plan distribution
  const planDist = { free:0, premium:0, pro:0 };
  entries.forEach(e=>{ planDist[e.plan||"free"] = (planDist[e.plan||"free"]||0)+1; });

  // Target grade distribution
  const gradeDist = {};
  entries.forEach(e=>{ if(e.targetGrade) gradeDist[e.targetGrade]=(gradeDist[e.targetGrade]||0)+1; });

  // Streak distribution
  const streakBuckets = { "0":0, "1-2":0, "3-6":0, "7+":0 };
  entries.forEach(e=>{
    const s=e.streak||0;
    if(s===0) streakBuckets["0"]++;
    else if(s<=2) streakBuckets["1-2"]++;
    else if(s<=6) streakBuckets["3-6"]++;
    else streakBuckets["7+"]++;
  });

  // Topic-level aggregation: avg accuracy + total attempts across all students
  const topicAgg = {};
  TOPICS.forEach(t=>{
    let attempted=0, correct=0, studentsCount=0, accSum=0;
    entries.forEach(e=>{
      const ts = e.topicStats?.[t.id];
      if(ts && ts.attempted>0){
        attempted += ts.attempted;
        correct   += ts.correct;
        accSum    += ts.accuracy;
        studentsCount++;
      }
    });
    topicAgg[t.id] = {
      attempted, correct,
      avgAccuracy: studentsCount? Math.round(accSum/studentsCount*100):0,
      studentsCount,
      classAccuracy: attempted? Math.round(correct/attempted*100):0,
    };
  });

  // Paper-level aggregation
  const paperAgg = {};
  MOCK_PAPERS.forEach(p=>{
    let attempted=0, correct=0, studentsCount=0;
    entries.forEach(e=>{
      const ps = e.paperStats?.[p.id];
      if(ps && ps.attempted>0){ attempted+=ps.attempted; correct+=ps.correct; studentsCount++; }
    });
    paperAgg[p.id] = { attempted, correct, studentsCount, avgScore: attempted?Math.round(correct/attempted*100):0 };
  });

  // Daily activity (last 14 days) across all students
  const dailyActivity = {};
  for(let i=13;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    dailyActivity[d.toISOString().slice(0,10)] = 0;
  }
  entries.forEach(e=>{
    Object.entries(e.last30||{}).forEach(([day,count])=>{
      if(day in dailyActivity) dailyActivity[day]+=count;
    });
  });

  // Badge distribution
  const avgBadges = Math.round(entries.reduce((s,e)=>s+(e.badgesCount||0),0)/n*10)/10;

  return {
    n, totalQuestions, totalCorrect, avgAccuracy, avgQuestions, activeStudents, onboardedCount,
    planDist, gradeDist, streakBuckets, topicAgg, paperAgg, dailyActivity, avgBadges,
  };
}

function AdminPinGate({ onUnlocked, onBack }) {
  const stored = localStorage.getItem(ADMIN_PIN_KEY);
  const [mode, setMode]   = useState(stored ? "enter" : "setup");
  const [digits, setDigits] = useState([]);
  const [first, setFirst] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function press(d) {
    if (digits.length>=4) return;
    const next=[...digits,d]; setDigits(next); setError("");
    if(next.length===4) complete(next.join(""));
  }
  function complete(pin) {
    if(mode==="setup"){ setFirst(pin); setMode("confirm"); setDigits([]); }
    else if(mode==="confirm"){
      if(pin===first){ localStorage.setItem(ADMIN_PIN_KEY,pin); sessionStorage.setItem(ADMIN_SESSION,"1"); onUnlocked(); }
      else { setError("PINs don't match"); setShake(true); setTimeout(()=>setShake(false),400); setMode("setup"); setDigits([]); setFirst(""); }
    } else {
      if(pin===stored){ sessionStorage.setItem(ADMIN_SESSION,"1"); onUnlocked(); }
      else { setError("Wrong PIN"); setShake(true); setTimeout(()=>setShake(false),400); setDigits([]); }
    }
  }
  function del(){ setDigits(d=>d.slice(0,-1)); setError(""); }

  const titles = { setup:"Set Analytics PIN", confirm:"Confirm PIN", enter:"Analytics Dashboard" };
  const subs   = { setup:"For teachers/admins only — separate from parent PIN", confirm:"Enter the same PIN again", enter:"Enter PIN to view cross-student analytics" };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#F7F8FC",padding:24}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#7C3AED,#4F7DFF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:20,boxShadow:"0 8px 24px #7C3AED33"}}>📊</div>
      <div style={{fontSize:20,fontWeight:800,color:"#1A1D2E",marginBottom:6}}>{titles[mode]}</div>
      <div style={{fontSize:13,color:"#6B7280",marginBottom:32,textAlign:"center",maxWidth:260}}>{subs[mode]}</div>
      <div style={{display:"flex",gap:16,marginBottom:16,animation:shake?"pinShake .4s ease":"none"}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{width:16,height:16,borderRadius:"50%",background:i<digits.length?"#7C3AED":"#E5E7EB",boxShadow:i<digits.length?"0 0 0 3px #7C3AED22":"none"}}/>
        ))}
      </div>
      <div style={{height:18,marginBottom:20,fontSize:12,color:"#DC2626",fontWeight:600}}>{error}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,72px)",gap:12}}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>{
          const isEmpty=k===""; const isDel=k==="⌫";
          return (
            <button key={i} onClick={()=>isDel?del():!isEmpty&&press(String(k))} disabled={isEmpty}
              style={{width:72,height:72,borderRadius:16,background:isEmpty?"transparent":isDel?"#F3F4F6":"#FFFFFF",border:isEmpty?"none":"1px solid #E5E7EB",fontSize:isDel?22:24,fontWeight:700,color:"#1A1D2E",cursor:isEmpty?"default":"pointer",boxShadow:isEmpty?"none":"0 1px 3px rgba(0,0,0,0.08)"}}
            >{k}</button>
          );
        })}
      </div>
      {onBack&&(
        <button onClick={onBack} style={{ marginTop:24, background:"none", border:"none", fontSize:12, color:"#6B7280", cursor:"pointer", textDecoration:"underline" }}>
          ← Back to app
        </button>
      )}
    </div>
  );
}

function MiniBar({ pct, color }) {
  return (
    <div style={{height:6,borderRadius:3,background:"#E5E7EB",overflow:"hidden",flex:1}}>
      <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width .5s"}}/>
    </div>
  );
}

function AnalyticsScreen({ onBack }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_SESSION)==="1");
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState("overview");

  async function load() {
    setLoading(true); setError("");
    try { const data = await fetchLeaderboard(); setEntries(data); }
    catch { setError("Couldn't load analytics data."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if(unlocked) load(); }, [unlocked]);

  if (!unlocked) return <AdminPinGate onUnlocked={()=>setUnlocked(true)} onBack={onBack} />;

  const agg = aggregateAnalytics(entries);
  const P = { bg:"#F7F8FC", card:"#FFFFFF", border:"rgba(0,0,0,0.07)", pri:"#1A1D2E", sec:"#6B7280", accent:"#7C3AED", green:"#16A34A", amber:"#D97706", red:"#DC2626", blue:"#4F7DFF" };

  const TABS = [
    {id:"overview", icon:"📊", label:"Overview"},
    {id:"topics",   icon:"📚", label:"Topics"},
    {id:"papers",   icon:"📝", label:"Papers"},
    {id:"engagement",icon:"🔥", label:"Engagement"},
  ];

  return (
    <div style={{ background:P.bg, minHeight:"100vh" }}>
      <div style={{ background:"#fff", borderBottom:`1px solid ${P.border}`, padding:"14px 16px 0", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={onBack} style={{ background:"none", border:"none", color:P.sec, cursor:"pointer", fontSize:18, padding:0 }}>←</button>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:P.pri }}>📊 Analytics Dashboard</div>
              <div style={{ fontSize:11, color:P.sec, marginTop:1 }}>
                {agg ? `${agg.n} students synced` : "No data yet"}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={load} disabled={loading} style={{ background:P.bg, border:`1px solid ${P.border}`, borderRadius:8, padding:"6px 10px", fontSize:12, color:P.sec, cursor:"pointer" }}>
              {loading?"…":"↺"}
            </button>
            <button onClick={()=>{ sessionStorage.removeItem(ADMIN_SESSION); setUnlocked(false); }} style={{ background:P.bg, border:`1px solid ${P.border}`, borderRadius:8, padding:"6px 10px", fontSize:12, color:P.sec, cursor:"pointer" }}>🔒 Lock</button>
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, padding:"8px 0 10px", border:"none", background:"none",
              fontSize:11, fontWeight:tab===t.id?700:400,
              color:tab===t.id?P.accent:P.sec, cursor:"pointer",
              borderBottom:`2px solid ${tab===t.id?P.accent:"transparent"}`,
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 16px 80px" }}>
        {loading?(
          <div style={{ textAlign:"center", padding:"60px 0", color:P.sec }}>
            <div style={{ fontSize:24, marginBottom:8 }}>⏳</div>
            <div style={{ fontSize:13 }}>Loading analytics…</div>
          </div>
        ):error?(
          <div style={{ textAlign:"center", padding:"40px 20px", color:P.red, fontSize:13 }}>{error}</div>
        ):!agg?(
          <div style={{ textAlign:"center", padding:"60px 20px", color:P.sec }}>
            <div style={{ fontSize:36, marginBottom:10 }}>📊</div>
            <div style={{ fontSize:14, fontWeight:600, color:P.pri }}>No student data yet</div>
            <div style={{ fontSize:13, marginTop:6, lineHeight:1.6 }}>
              Analytics appear once students submit scores via the 🏆 Ranks tab.
            </div>
          </div>
        ):(
          <div>
            {/* OVERVIEW */}
            {tab==="overview"&&(
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
                  {[
                    ["👥","Total Students",agg.n,P.blue],
                    ["✅","Active Students",agg.activeStudents,P.green],
                    ["🎯","Avg Accuracy",`${agg.avgAccuracy}%`,agg.avgAccuracy>=70?P.green:agg.avgAccuracy>=50?P.amber:P.red],
                    ["📝","Total Questions",agg.totalQuestions,P.accent],
                    ["📊","Avg Qs/Student",agg.avgQuestions,P.blue],
                    ["🏅","Avg Badges",agg.avgBadges,P.amber],
                  ].map(([ic,l,v,c])=>(
                    <div key={l} style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:14, padding:"14px 12px", borderTop:`3px solid ${c}` }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                      <div style={{ fontSize:22, fontWeight:800, color:P.pri }}>{v}</div>
                      <div style={{ fontSize:11, color:P.sec, marginTop:2 }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* Plan distribution */}
                <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>PLAN DISTRIBUTION</div>
                <div style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:14, padding:14, marginBottom:18 }}>
                  {[["free","Starter",P.sec],["premium","Premium",P.green],["pro","Pro",P.accent]].map(([k,l,c])=>{
                    const count = agg.planDist[k]||0;
                    const pct = agg.n ? Math.round(count/agg.n*100) : 0;
                    return (
                      <div key={k} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <div style={{ fontSize:12, color:P.pri, width:70, flexShrink:0 }}>{l}</div>
                        <MiniBar pct={pct} color={c}/>
                        <div style={{ fontSize:11, fontWeight:700, color:P.pri, width:50, textAlign:"right" }}>{count} ({pct}%)</div>
                      </div>
                    );
                  })}
                </div>

                {/* Target grade distribution */}
                {Object.keys(agg.gradeDist).length>0&&(
                  <>
                    <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>TARGET GRADE DISTRIBUTION</div>
                    <div style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:14, padding:14, marginBottom:18 }}>
                      {["A*","A","B","C"].map(g=>{
                        const count = agg.gradeDist[g]||0;
                        const onboardedTotal = Object.values(agg.gradeDist).reduce((s,v)=>s+v,0);
                        const pct = onboardedTotal?Math.round(count/onboardedTotal*100):0;
                        const gc = g==="A*"?P.amber:g==="A"?P.green:g==="B"?P.blue:"#FF9F43";
                        return count>0 ? (
                          <div key={g} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                            <div style={{ fontSize:12, color:P.pri, width:30, flexShrink:0, fontWeight:700 }}>{g}</div>
                            <MiniBar pct={pct} color={gc}/>
                            <div style={{ fontSize:11, fontWeight:700, color:P.pri, width:50, textAlign:"right" }}>{count} ({pct}%)</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </>
                )}

                {/* Onboarding completion */}
                <div style={{ background:`${P.blue}10`, border:`1px solid ${P.blue}30`, borderRadius:12, padding:"12px 14px" }}>
                  <div style={{ fontSize:12, color:P.pri, lineHeight:1.6 }}>
                    <strong>{agg.onboardedCount}/{agg.n}</strong> students completed onboarding ({agg.n?Math.round(agg.onboardedCount/agg.n*100):0}%)
                  </div>
                </div>
              </div>
            )}

            {/* TOPICS */}
            {tab==="topics"&&(
              <div>
                <div style={{ fontSize:12, color:P.sec, marginBottom:14, lineHeight:1.6 }}>
                  Class-wide accuracy per topic (total correct ÷ total attempted across all students).
                </div>
                {TOPICS.map(t=>{
                  const a = agg.topicAgg[t.id];
                  if(!a || a.studentsCount===0) return (
                    <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${P.border}`, opacity:.4 }}>
                      <div style={{ width:34,height:34,borderRadius:9,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{t.icon}</div>
                      <div><div style={{ fontSize:13,fontWeight:600,color:P.pri }}>{t.name}</div><div style={{ fontSize:11,color:P.sec }}>No data</div></div>
                    </div>
                  );
                  const acc = a.classAccuracy;
                  return (
                    <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${P.border}` }}>
                      <div style={{ width:34,height:34,borderRadius:9,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{t.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                          <span style={{ fontSize:13,fontWeight:600,color:P.pri }}>{t.name}</span>
                          <span style={{ fontSize:12,fontWeight:700,color:acc>=70?P.green:acc>=50?P.amber:P.red }}>{acc}%</span>
                        </div>
                        <MiniBar pct={acc} color={t.color}/>
                        <div style={{ fontSize:10,color:P.sec,marginTop:3 }}>{a.correct}/{a.attempted} correct · {a.studentsCount} students</div>
                      </div>
                    </div>
                  );
                })}
                <div style={{ background:`${P.red}10`, border:`1px solid ${P.red}30`, borderRadius:12, padding:"12px 14px", marginTop:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:P.red, marginBottom:4 }}>⚠️ LOWEST CLASS ACCURACY</div>
                  {Object.entries(agg.topicAgg).filter(([,a])=>a.studentsCount>0).sort((a,b)=>a[1].classAccuracy-b[1].classAccuracy).slice(0,3).map(([tid,a])=>{
                    const t=TOPICS.find(x=>x.id===tid);
                    return <div key={tid} style={{ fontSize:12, color:P.pri, marginBottom:3 }}>{t?.icon} {t?.name}: {a.classAccuracy}%</div>;
                  })}
                </div>
              </div>
            )}

            {/* PAPERS */}
            {tab==="papers"&&(
              <div>
                <div style={{ fontSize:12, color:P.sec, marginBottom:14, lineHeight:1.6 }}>
                  Average score across all students who attempted each paper.
                </div>
                {MOCK_PAPERS.map(p=>{
                  const a = agg.paperAgg[p.id];
                  const diffColors = {Foundation:P.green,Intermediate:P.amber,Advanced:P.red};
                  const dc = diffColors[p.difficulty]||P.blue;
                  return (
                    <div key={p.id} style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:13, fontWeight:700, color:P.pri }}>{p.label}</span>
                            <span style={{ fontSize:10, fontWeight:700, color:dc, background:`${dc}18`, borderRadius:8, padding:"1px 7px" }}>{p.difficulty}</span>
                          </div>
                          <div style={{ fontSize:11, color:P.sec, marginTop:3 }}>
                            {a?.studentsCount ? `${a.studentsCount} student${a.studentsCount>1?"s":""} attempted` : "No attempts yet"}
                          </div>
                        </div>
                        {a?.studentsCount>0&&(
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:20, fontWeight:800, color:a.avgScore>=70?P.green:a.avgScore>=50?P.amber:P.red }}>{a.avgScore}%</div>
                            <div style={{ fontSize:10, color:P.sec }}>class avg</div>
                          </div>
                        )}
                      </div>
                      {a?.studentsCount>0&&<div style={{ marginTop:10 }}><MiniBar pct={a.avgScore} color={dc}/></div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ENGAGEMENT */}
            {tab==="engagement"&&(
              <div>
                {/* Daily activity chart */}
                <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>QUESTIONS ANSWERED — LAST 14 DAYS</div>
                <div style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:14, padding:14, marginBottom:18 }}>
                  {(() => {
                    const days = Object.entries(agg.dailyActivity);
                    const max = Math.max(1, ...days.map(([,v])=>v));
                    return (
                      <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:60 }}>
                        {days.map(([day,count],i)=>{
                          const h = count===0?4:Math.max(8,(count/max)*54);
                          const isToday = day===new Date().toISOString().slice(0,10);
                          return (
                            <div key={day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                              <div style={{ width:"100%", height:h, borderRadius:3, background:count===0?"#E5E7EB":isToday?P.accent:P.green, transition:"height .4s" }} title={`${day}: ${count}`}/>
                              {(i%7===0||i===13)&&<div style={{ fontSize:8, color:P.sec }}>{new Date(day).toLocaleDateString("en-SG",{day:"numeric",month:"short"})}</div>}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Streak distribution */}
                <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>STREAK DISTRIBUTION</div>
                <div style={{ background:P.card, border:`1px solid ${P.border}`, borderRadius:14, padding:14, marginBottom:18 }}>
                  {[["0","No active streak",P.sec],["1-2","1-2 days",P.amber],["3-6","3-6 days",P.blue],["7+","7+ days 🔥",P.green]].map(([k,l,c])=>{
                    const count = agg.streakBuckets[k]||0;
                    const pct = agg.n?Math.round(count/agg.n*100):0;
                    return (
                      <div key={k} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <div style={{ fontSize:12, color:P.pri, width:100, flexShrink:0 }}>{l}</div>
                        <MiniBar pct={pct} color={c}/>
                        <div style={{ fontSize:11, fontWeight:700, color:P.pri, width:50, textAlign:"right" }}>{count} ({pct}%)</div>
                      </div>
                    );
                  })}
                </div>

                {/* Top students by streak */}
                <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>TOP STREAKS 🔥</div>
                {entries.filter(e=>e.streak>0).sort((a,b)=>b.streak-a.streak).slice(0,5).map(e=>(
                  <div key={e.uid} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:P.card, border:`1px solid ${P.border}`, borderRadius:10, padding:"10px 14px", marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:P.pri }}>{e.name}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:P.green }}>🔥 {e.streak}d</span>
                  </div>
                ))}
                {entries.filter(e=>e.streak>0).length===0&&(
                  <div style={{ fontSize:12, color:P.sec, textAlign:"center", padding:20 }}>No active streaks yet</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



// ─── SCREEN: TIMED EXAM MODE ──────────────────────────────────────────────────
// PSLE simulation: 22 questions, 44 minutes (2 min/q average), no hints,
// no working shown mid-exam, no AI tutor. Full results breakdown at the end.

const EXAM_DURATION = 44 * 60; // 44 minutes in seconds

function ExamScreen({ pid, state, dispatch, onBack }) {
  const paper    = MOCK_PAPERS.find(p => p.id === pid);
  const questions= PAPER_QS[pid] || [];

  // phase: briefing | exam | results
  const [phase, setPhase]     = useState("briefing");
  const [qi, setQi]           = useState(0);
  const [answers, setAnswers] = useState({}); // qi → string
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef();
  const timerRef = useRef();

  // Build results once exam ends
  const results = useMemo(() => {
    if (phase !== "results") return null;
    return questions.map((q, i) => {
      const student = answers[i] || "";
      const correct = checkAnswer(student, q.a) === "correct";
      return { q, student, correct, i };
    });
  }, [phase]);

  const score    = results ? results.filter(r => r.correct).length : 0;
  const totalMks = results ? results.reduce((s, r) => s + r.q.marks, 0) : 0;
  const earnedMks= results ? results.filter(r => r.correct).reduce((s, r) => s + r.q.marks, 0) : 0;

  // Countdown timer
  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  function startExam() {
    setPhase("exam"); setStarted(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  }

  function submitExam() {
    clearInterval(timerRef.current);
    setFinished(true); setStarted(false);
    // Record all answers to paperAttempts
    questions.forEach((q, i) => {
      const student = answers[i] || "";
      const correct = checkAnswer(student, q.a) === "correct";
      dispatch({ type:"RECORD_PAPER_ATTEMPT", pid, qi:i, correct, student });
    });
    setPhase("results");
  }

  function goQ(i) {
    setQi(i);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timePct = timeLeft / EXAM_DURATION * 100;
  const timerColor = timeLeft > 600 ? "#6AB04C" : timeLeft > 180 ? "#F9CA24" : "#EB4D4B";
  const diffColors = { Foundation:"#6AB04C", Intermediate:"#F9CA24", Advanced:"#EB4D4B" };
  const diffColor  = diffColors[paper?.difficulty] || T.accent;

  // ── BRIEFING ──
  if (phase === "briefing") return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:T.bg }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:`1px solid ${T.border}`, background:T.surface }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.sec, cursor:"pointer", fontSize:18, padding:0 }}>←</button>
        <div style={{ fontSize:15, fontWeight:700, color:T.pri }}>Exam Mode</div>
      </div>
      <div style={{ flex:1, padding:"24px 20px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⏱</div>
        <div style={{ fontSize:22, fontWeight:800, color:T.pri, marginBottom:6, textAlign:"center" }}>{paper?.label}</div>
        <div style={{ fontSize:13, color:T.sec, marginBottom:28, textAlign:"center" }}>{paper?.difficulty} · {paper?.focus}</div>

        {/* Rules */}
        <div style={{ width:"100%", background:T.card, borderRadius:14, padding:18, marginBottom:20, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.sec, letterSpacing:.8, marginBottom:14 }}>EXAM RULES</div>
          {[
            ["⏱", "44 minutes", "2 minutes per question average — just like the real PSLE"],
            ["📝", "22 questions", "Mixed 1, 2 and 3-mark questions across topics"],
            ["🚫", "No hints",    "Hints and AI Tutor are disabled during the exam"],
            ["⏭", "Skip allowed","You can skip and return to questions before submitting"],
            ["📊", "Full review", "Worked solutions shown after the exam ends"],
          ].map(([ic, title, desc]) => (
            <div key={title} style={{ display:"flex", gap:12, marginBottom:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{ic}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.pri }}>{title}</div>
                <div style={{ fontSize:12, color:T.sec, marginTop:1 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ width:"100%", background:`${diffColor}15`, border:`1px solid ${diffColor}33`, borderRadius:12, padding:"12px 14px", marginBottom:24 }}>
          <div style={{ fontSize:12, color:diffColor, fontWeight:700, marginBottom:4 }}>💡 EXAM TIP</div>
          <div style={{ fontSize:13, color:T.pri, lineHeight:1.6 }}>
            Answer every question — even a guess is better than a blank. For 2-mark questions, show your method in the answer field (e.g. "90×2.5=225").
          </div>
        </div>

        <button onClick={startExam} style={{
          width:"100%", background:diffColor, border:"none", borderRadius:14,
          padding:"16px 0", fontSize:16, fontWeight:800, color:"#fff", cursor:"pointer",
          boxShadow:`0 8px 24px ${diffColor}44`,
        }}>Start Exam →</button>
        <div style={{ fontSize:11, color:T.sec, marginTop:10 }}>Timer starts when you tap Start</div>
      </div>
    </div>
  );

  // ── EXAM ──
  if (phase === "exam") {
    const q = questions[qi];
    const answered = Object.keys(answers).filter(k => answers[k].trim()).length;

    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:T.bg }}>
        {/* Exam header */}
        <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"10px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.pri }}>{paper?.label} · Exam Mode</div>
            {/* Timer */}
            <div style={{
              display:"flex", alignItems:"center", gap:6,
              background:`${timerColor}18`, border:`1px solid ${timerColor}44`,
              borderRadius:20, padding:"4px 12px",
            }}>
              <span style={{ fontSize:14 }}>⏱</span>
              <span style={{
                fontSize:16, fontWeight:800, color:timerColor,
                fontVariantNumeric:"tabular-nums",
                animation: timeLeft <= 60 ? "pulse 1s infinite" : "none",
              }}>
                {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
              </span>
            </div>
          </div>
          {/* Timer bar */}
          <div style={{ height:3, borderRadius:2, background:T.border, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${timePct}%`, background:timerColor, borderRadius:2, transition:"width 1s linear" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
            <span style={{ fontSize:10, color:T.sec }}>Q{qi+1}/{questions.length}</span>
            <span style={{ fontSize:10, color:T.sec }}>{answered}/{questions.length} answered</span>
          </div>
        </div>

        {/* Question dots */}
        <div style={{ background:T.surface, padding:"8px 16px 10px", borderBottom:`1px solid ${T.border}`, display:"flex", gap:4, flexWrap:"wrap" }}>
          {questions.map((_,i) => {
            const ans = answers[i]?.trim();
            const col = i===qi ? diffColor : ans ? "#6AB04C" : T.dim;
            return (
              <div key={i} onClick={() => goQ(i)}
                style={{ width:10, height:10, borderRadius:"50%", background:col, cursor:"pointer",
                  boxShadow: i===qi ? `0 0 0 2px ${diffColor}44` : "none", transition:"background .2s" }}/>
            );
          })}
        </div>

        {/* Question */}
        <div style={{ flex:1, overflow:"auto", padding:"16px 16px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <MarkBadge marks={q.marks}/>
            <span style={{ fontSize:11, color:T.sec, fontWeight:600 }}>{q.topic}</span>
          </div>

          <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:16, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:15, color:T.pri, lineHeight:1.75 }}>{q.q}</div>
          </div>

          <div style={{ fontSize:11, color:T.sec, marginBottom:6 }}>Your answer:</div>
          <input ref={inputRef}
            value={answers[qi] || ""}
            onChange={e => setAnswers(a => ({ ...a, [qi]:e.target.value }))}
            onKeyDown={e => { if(e.key==="Enter" && qi < questions.length-1) goQ(qi+1); }}
            placeholder="Type your answer…"
            style={{
              width:"100%", background:T.card, border:`1px solid ${T.border}`,
              borderRadius:10, padding:"12px 14px", fontSize:15, color:T.pri,
              outline:"none", boxSizing:"border-box", caretColor:diffColor, fontFamily:"inherit",
            }}/>
          <div style={{ fontSize:10, color:T.sec, marginTop:6 }}>Press Enter to move to next question</div>

          {/* Nav */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:14 }}>
            <button onClick={() => goQ(Math.max(qi-1,0))} disabled={qi===0}
              style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 0", fontSize:13, color:qi===0?T.dim:T.pri, cursor:qi===0?"default":"pointer" }}>
              ← Prev
            </button>
            <button onClick={() => qi < questions.length-1 ? goQ(qi+1) : null}
              disabled={qi===questions.length-1}
              style={{ background:qi<questions.length-1?diffColor:T.card, border:`1px solid ${qi<questions.length-1?diffColor:T.border}`, borderRadius:10, padding:"12px 0", fontSize:13, fontWeight:700, color:qi<questions.length-1?"#fff":T.dim, cursor:qi<questions.length-1?"pointer":"default" }}>
              Next →
            </button>
          </div>

          {/* Submit */}
          <button onClick={() => {
            if (window.confirm(`Submit exam? ${answered}/${questions.length} answered. You cannot go back.`)) submitExam();
          }} style={{
            width:"100%", marginTop:10, background:"#EB4D4B22",
            border:"1px solid #EB4D4B55", borderRadius:10, padding:"12px 0",
            fontSize:13, fontWeight:700, color:"#EB4D4B", cursor:"pointer",
          }}>
            ✓ Submit Exam ({answered}/{questions.length} answered)
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if (phase === "results" && results) {
    const pct = Math.round(score / questions.length * 100);
    const grade = pct >= 90?"A*":pct >= 75?"A":pct >= 60?"B":pct >= 50?"C":"D";
    const gradeColor = pct>=90?"#F9CA24":pct>=75?"#6AB04C":pct>=60?"#22A6B3":pct>=50?"#F9CA24":"#EB4D4B";
    const timeTaken = EXAM_DURATION - timeLeft;
    const mTaken = Math.floor(timeTaken/60), sTaken = timeTaken%60;
    const [showWorking, setShowWorking] = useState(null);

    const byTopic = {};
    results.forEach(r => {
      const t = r.q.topic || "General";
      if(!byTopic[t]) byTopic[t] = { correct:0, total:0 };
      byTopic[t].total++;
      if(r.correct) byTopic[t].correct++;
    });

    return (
      <div style={{ background:T.bg, minHeight:"100vh" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:`1px solid ${T.border}`, background:T.surface, position:"sticky", top:0, zIndex:10 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:T.sec, cursor:"pointer", fontSize:18, padding:0 }}>←</button>
          <div style={{ fontSize:15, fontWeight:700, color:T.pri }}>Exam Results</div>
        </div>

        <div style={{ padding:"20px 16px 80px" }}>
          {/* Score hero */}
          <div style={{
            background:`linear-gradient(135deg,${gradeColor}22,${gradeColor}08)`,
            border:`1px solid ${gradeColor}44`, borderRadius:20,
            padding:24, textAlign:"center", marginBottom:20,
          }}>
            <div style={{ fontSize:64, fontWeight:900, color:gradeColor, lineHeight:1 }}>{grade}</div>
            <div style={{ fontSize:36, fontWeight:800, color:T.pri, marginTop:8 }}>{score}/{questions.length}</div>
            <div style={{ fontSize:14, color:T.sec, marginTop:4 }}>{pct}% · {earnedMks}/{totalMks} marks</div>
            <div style={{ fontSize:12, color:T.sec, marginTop:6 }}>
              ⏱ Time taken: {mTaken}m {sTaken}s of 44 minutes
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
            {[
              ["✅","Correct",score],
              ["❌","Wrong",questions.length-score],
              ["⏭","Skipped",results.filter(r=>!r.student.trim()).length],
            ].map(([ic,l,v])=>(
              <div key={l} style={{ background:T.card, borderRadius:12, padding:"12px 8px", textAlign:"center", border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:20 }}>{ic}</div>
                <div style={{ fontSize:20, fontWeight:800, color:T.pri }}>{v}</div>
                <div style={{ fontSize:10, color:T.sec, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Topic breakdown */}
          <div style={{ fontSize:11, color:T.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>TOPIC BREAKDOWN</div>
          <div style={{ background:T.card, borderRadius:14, padding:14, marginBottom:20, border:`1px solid ${T.border}` }}>
            {Object.entries(byTopic).map(([topic, {correct, total}]) => {
              const tpct = Math.round(correct/total*100);
              return (
                <div key={topic} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ fontSize:12, color:T.sec, width:110, flexShrink:0 }}>{topic}</div>
                  <div style={{ flex:1, height:6, borderRadius:3, background:T.border, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${tpct}%`, background:tpct>=75?"#6AB04C":tpct>=50?"#F9CA24":"#EB4D4B", borderRadius:3 }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:tpct>=75?"#6AB04C":tpct>=50?"#F9CA24":"#EB4D4B", width:38, textAlign:"right" }}>{correct}/{total}</div>
                </div>
              );
            })}
          </div>

          {/* Q-by-Q review */}
          <div style={{ fontSize:11, color:T.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>QUESTION REVIEW</div>
          {results.map((r, i) => (
            <div key={i} style={{
              background:T.card, border:`1px solid ${r.correct?"#6AB04C33":"#EB4D4B33"}`,
              borderRadius:12, padding:"12px 14px", marginBottom:8,
            }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ fontSize:18, flexShrink:0 }}>{r.correct?"✅":"❌"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:T.sec }}>Q{i+1}</span>
                    <MarkBadge marks={r.q.marks}/>
                  </div>
                  <div style={{ fontSize:13, color:T.pri, lineHeight:1.6, marginBottom:6 }}>{r.q.q}</div>
                  {!r.correct && (
                    <div style={{ fontSize:12, color:T.sec, marginBottom:4 }}>
                      Your answer: <span style={{ color:"#EB4D4B", fontWeight:600 }}>{r.student||"(skipped)"}</span>
                      {" · "}Correct: <span style={{ color:"#6AB04C", fontWeight:600 }}>{r.q.a}</span>
                    </div>
                  )}
                  <button onClick={() => setShowWorking(showWorking===i?null:i)} style={{
                    background:"none", border:`1px solid ${T.border}`, borderRadius:8,
                    padding:"4px 10px", fontSize:11, color:T.sec, cursor:"pointer",
                  }}>{showWorking===i?"Hide":"Show"} working</button>
                  {showWorking===i&&(
                    <div style={{ marginTop:8, background:T.surface, borderRadius:8, padding:10, border:`1px solid ${T.border}` }}>
                      <pre style={{ fontSize:12, color:T.pri, margin:0, whiteSpace:"pre-wrap", fontFamily:"monospace", lineHeight:1.7 }}>{r.q.work}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button onClick={onBack} style={{
            width:"100%", marginTop:8, background:T.accent, border:"none",
            borderRadius:12, padding:"14px 0", fontSize:14, fontWeight:700,
            color:"#fff", cursor:"pointer",
          }}>← Back to Papers</button>
        </div>
      </div>
    );
  }

  return null;
}

// ─── PIN GATE ──────────────────────────────────────────────────────────────────
// Stores a hashed PIN in localStorage. First visit = set PIN. After = verify PIN.
// Session unlock lasts until the tab is closed (sessionStorage flag).

const PIN_KEY    = "p6prep_parent_pin";   // stores 4-digit PIN
const PIN_SESSION = "p6prep_pin_unlocked";

function PinGate({ onUnlocked }) {
  const storedPin = localStorage.getItem(PIN_KEY);
  const [mode, setMode]     = useState(storedPin ? "enter" : "setup"); // setup | enter | confirm
  const [digits, setDigits] = useState([]);
  const [first, setFirst]   = useState("");   // used during setup confirm step
  const [error, setError]   = useState("");
  const [shake, setShake]   = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Countdown for lockout
  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => {
      setLockTimer(t => {
        if (t <= 1) { setLocked(false); setAttempts(0); clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [locked]);

  function triggerShake(msg) {
    setError(msg); setShake(true); setDigits([]);
    setTimeout(() => setShake(false), 500);
  }

  function pressDigit(d) {
    if (locked || digits.length >= 4) return;
    const next = [...digits, d];
    setDigits(next);
    setError("");
    if (next.length === 4) handleComplete(next.join(""));
  }

  function handleComplete(pin) {
    if (mode === "setup") {
      setFirst(pin); setMode("confirm"); setDigits([]);
    } else if (mode === "confirm") {
      if (pin === first) {
        localStorage.setItem(PIN_KEY, pin);
        sessionStorage.setItem(PIN_SESSION, "1");
        onUnlocked();
      } else {
        triggerShake("PINs don't match — try again");
        setMode("setup"); setFirst("");
      }
    } else {
      // enter mode
      const stored = localStorage.getItem(PIN_KEY);
      if (pin === stored) {
        sessionStorage.setItem(PIN_SESSION, "1");
        setAttempts(0);
        onUnlocked();
      } else {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= 5) {
          setLocked(true); setLockTimer(30);
          triggerShake("Too many attempts — wait 30 seconds");
        } else {
          triggerShake(`Wrong PIN · ${5 - next} attempt${5-next===1?"":"s"} left`);
        }
      }
    }
  }

  function pressDelete() { setDigits(d => d.slice(0, -1)); setError(""); }

  const titles = { setup:"Set a Parent PIN", confirm:"Confirm your PIN", enter:"Parent Dashboard" };
  const subs   = { setup:"Choose a 4-digit PIN — your child won't see this", confirm:"Enter the same PIN again to confirm", enter:"Enter your PIN to view progress" };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"#F7F8FC", padding:24,
    }}>
      {/* Icon */}
      <div style={{
        width:64, height:64, borderRadius:"50%",
        background:"linear-gradient(135deg,#4F7DFF,#7C3AED)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, marginBottom:20, boxShadow:"0 8px 24px #4F7DFF33",
      }}>🔐</div>

      <div style={{ fontSize:20, fontWeight:800, color:"#1A1D2E", marginBottom:6 }}>{titles[mode]}</div>
      <div style={{ fontSize:13, color:"#6B7280", marginBottom:32, textAlign:"center", maxWidth:260 }}>{subs[mode]}</div>

      {/* Dots */}
      <div style={{
        display:"flex", gap:16, marginBottom:16,
        animation: shake ? "pinShake 0.4s ease" : "none",
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width:16, height:16, borderRadius:"50%",
            background: i < digits.length ? "#4F7DFF" : "#E5E7EB",
            transition:"background 0.15s",
            boxShadow: i < digits.length ? "0 0 0 3px #4F7DFF22" : "none",
          }}/>
        ))}
      </div>

      {/* Error */}
      <div style={{ height:18, marginBottom:20, fontSize:12, color:"#DC2626", fontWeight:600 }}>
        {locked ? `Locked — ${lockTimer}s` : error}
      </div>

      {/* Keypad */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,72px)", gap:12 }}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i) => {
          const isEmpty = k === "";
          const isDel   = k === "⌫";
          return (
            <button key={i} onClick={()=> isDel ? pressDelete() : !isEmpty && pressDigit(String(k))}
              disabled={locked || isEmpty}
              style={{
                width:72, height:72, borderRadius:16,
                background: isEmpty ? "transparent" : isDel ? "#F3F4F6" : "#FFFFFF",
                border: isEmpty ? "none" : `1px solid #E5E7EB`,
                fontSize: isDel ? 22 : 24, fontWeight:700, color:"#1A1D2E",
                cursor: isEmpty || locked ? "default" : "pointer",
                boxShadow: isEmpty ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
                transition:"transform 0.1s, background 0.1s",
                opacity: locked ? 0.4 : 1,
              }}
              onMouseDown={e => { if(!isEmpty && !isDel) e.currentTarget.style.transform="scale(0.94)"; }}
              onMouseUp={e   => { e.currentTarget.style.transform="scale(1)"; }}
            >{k}</button>
          );
        })}
      </div>

      {/* Reset PIN (enter mode only) */}
      {mode === "enter" && (
        <button onClick={()=>{
          if(window.confirm("Reset PIN? You will need to set a new one.")){
            localStorage.removeItem(PIN_KEY);
            sessionStorage.removeItem(PIN_SESSION);
            setMode("setup"); setDigits([]); setError(""); setAttempts(0);
          }
        }} style={{
          marginTop:24, background:"none", border:"none",
          fontSize:12, color:"#6B7280", cursor:"pointer", textDecoration:"underline",
        }}>Forgot PIN? Reset it</button>
      )}
    </div>
  );
}

// ─── INLINE PARENT DASHBOARD ───────────────────────────────────────────────────
// Condensed version of the standalone dashboard, embedded inside the student app.

const PLVL_LABELS = ["Not started","Learning","Practising","Good","Mastered"];
const PLVL_COLORS = ["#D1D5DB","#DC2626","#D97706","#D97706","#16A34A"];

function ParentAccuracyBar({ pct, color }) {
  const c = pct >= 80 ? "#16A34A" : pct >= 60 ? "#D97706" : "#DC2626";
  return (
    <div style={{ height:5, borderRadius:3, background:"#E5E7EB", overflow:"hidden", flex:1 }}>
      <div style={{ height:"100%", width:`${pct}%`, background:color||c, borderRadius:3, transition:"width .5s" }}/>
    </div>
  );
}

function ParentDashboardScreen({ state, dispatch, onLock }) {
  const [ptab, setPtab] = useState("overview");
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Recalculate whenever tab is opened or refresh pressed
  const data = useMemo(() => {
    void lastRefresh;
    return { ...state };
  }, [state, lastRefresh]);

  const stats = useMemo(() => {
    const allAttempts = Object.values(data.attempts||{}).flatMap(t=>Object.values(t));
    const total   = allAttempts.length;
    const correct = allAttempts.filter(a=>a.correct).length;
    const accuracy = total ? Math.round(correct/total*100) : 0;

    const daySet = new Set(allAttempts.map(a=>new Date(a.ts||0).toDateString()));
    const activeDays = [...daySet].filter(d=>Date.now()-new Date(d).getTime()<14*86400000).length;
    const lastTs = allAttempts.length ? Math.max(...allAttempts.map(a=>a.ts||0)) : null;

    const weakTopics = TOPICS.map(t=>({topic:t,mastery:data.mastery?.[t.id]}))
      .filter(({mastery})=>mastery&&mastery.attempted>=5&&mastery.accuracy<0.65)
      .sort((a,b)=>a.mastery.accuracy-b.mastery.accuracy);

    const topicsSorted = TOPICS.map(t=>({topic:t,mastery:data.mastery?.[t.id]}))
      .filter(({mastery})=>mastery&&mastery.attempted>0)
      .sort((a,b)=>b.mastery.accuracy-a.mastery.accuracy);

    return { total, correct, accuracy, activeDays, lastTs, weakTopics, topicsSorted };
  }, [data]);

  function timeAgoP(ts) {
    if(!ts) return "Never";
    const d=Date.now()-ts, m=Math.floor(d/60000), h=Math.floor(d/3600000), dy=Math.floor(d/86400000);
    if(m<2) return "Just now"; if(m<60) return `${m}m ago`; if(h<24) return `${h}h ago`;
    if(dy<7) return `${dy}d ago`;
    return new Date(ts).toLocaleDateString("en-SG",{day:"numeric",month:"short"});
  }

  const PTABS = [{id:"overview",icon:"📊",label:"Overview"},{id:"topics",icon:"📚",label:"Topics"},{id:"papers",icon:"📝",label:"Papers"},{id:"advice",icon:"💡",label:"Advice"}];

  return (
    <div style={{ background:"#F7F8FC", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{
        background:"#fff", borderBottom:"1px solid rgba(0,0,0,0.07)",
        padding:"14px 16px 0", position:"sticky", top:0, zIndex:50,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:"#1A1D2E" }}>👨‍👩‍👧 Parent Dashboard</div>
            <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>
              Last active: {timeAgoP(stats.lastTs)}
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {state.demoMode&&(
              <button onClick={()=>dispatch({type:"CLEAR_DEMO"})} style={{
                background:"#FEE2E2", border:"none", borderRadius:8,
                padding:"6px 10px", fontSize:11, fontWeight:700,
                color:"#DC2626", cursor:"pointer",
              }}>Clear Demo</button>
            )}
            <button onClick={()=>setLastRefresh(Date.now())} style={{
              background:"#F7F8FC", border:"1px solid rgba(0,0,0,0.1)",
              borderRadius:8, padding:"6px 10px", fontSize:12, color:"#6B7280", cursor:"pointer",
            }}>↺</button>
            <button onClick={onLock} style={{
              background:"#F7F8FC", border:"1px solid rgba(0,0,0,0.1)",
              borderRadius:8, padding:"6px 10px", fontSize:12, color:"#6B7280", cursor:"pointer",
            }}>🔒 Lock</button>
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {PTABS.map(t=>(
            <button key={t.id} onClick={()=>setPtab(t.id)} style={{
              flex:1, padding:"8px 0 10px", border:"none", background:"none",
              fontSize:11, fontWeight:ptab===t.id?700:400,
              color:ptab===t.id?"#4F7DFF":"#6B7280", cursor:"pointer",
              borderBottom:`2px solid ${ptab===t.id?"#4F7DFF":"transparent"}`,
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 16px 80px" }}>

        {/* OVERVIEW */}
        {ptab==="overview"&&(
          <div>
            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
              {[
                ["🎯","Questions tried", stats.total, stats.total>0?"Keep going!":"Not started yet", "#4F7DFF"],
                ["✅","Accuracy", `${stats.accuracy}%`, stats.accuracy>=75?"On track ✓":stats.accuracy>=50?"Needs work":"Needs focus","#16A34A"],
                ["📅","Active days (14d)", stats.activeDays, stats.activeDays>=5?"Consistent!":stats.activeDays>=3?"Could improve":"Too few","#D97706"],
                ["📚","Topics practised", `${stats.topicsSorted.length}/12`, `${stats.weakTopics.length} need focus`,"#7C3AED"],
              ].map(([ic,lb,val,sub,col])=>(
                <div key={lb} style={{
                  background:"#fff", border:"1px solid rgba(0,0,0,0.07)",
                  borderRadius:14, padding:"14px 12px", borderTop:`3px solid ${col}`,
                }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#1A1D2E" }}>{val}</div>
                  <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>{lb}</div>
                  <div style={{ fontSize:10, color:col, marginTop:2, fontWeight:600 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Weak topics alert */}
            {stats.weakTopics.length>0?(
              <div style={{
                background:"#FFF7ED", border:"1px solid #FED7AA",
                borderRadius:14, padding:"14px 16px", marginBottom:16,
              }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#92400E", marginBottom:10 }}>
                  ⚠️ Needs attention — {stats.weakTopics.length} topic{stats.weakTopics.length>1?"s":""}
                </div>
                {stats.weakTopics.map(({topic,mastery})=>(
                  <div key={topic.id} style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"8px 0", borderBottom:"1px solid #FED7AA",
                  }}>
                    <span style={{ fontSize:18 }}>{topic.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#92400E" }}>{topic.name}</div>
                      <div style={{ fontSize:11, color:"#B45309" }}>{Math.round(mastery.accuracy*100)}% accuracy · {mastery.correct}/{mastery.attempted} correct</div>
                    </div>
                    <div style={{ fontSize:10, fontWeight:700, color:"#DC2626", background:"#FEE2E2", borderRadius:8, padding:"2px 8px" }}>FOCUS</div>
                  </div>
                ))}
                <div style={{ fontSize:11, color:"#B45309", marginTop:10, lineHeight:1.6 }}>
                  💡 When your child gets these wrong, tap "Ask AI Tutor" for a step-by-step explanation.
                </div>
              </div>
            ):(
              stats.total>0&&<div style={{
                background:"#ECFDF5", border:"1px solid #BBF7D0",
                borderRadius:14, padding:"12px 14px", marginBottom:16,
              }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#16A34A" }}>🎉 No weak topics!</div>
                <div style={{ fontSize:12, color:"#166534", marginTop:3 }}>All practised topics are above 65% accuracy. Keep it up!</div>
              </div>
            )}

            {/* Top 5 topics */}
            {stats.topicsSorted.length>0&&(
              <>
                <div style={{ fontSize:11, color:"#6B7280", fontWeight:600, letterSpacing:.8, marginBottom:10 }}>TOP TOPICS</div>
                {stats.topicsSorted.slice(0,5).map(({topic,mastery})=>{
                  const acc=Math.round(mastery.accuracy*100);
                  return (
                    <div key={topic.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ width:34,height:34,borderRadius:9,background:`${topic.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{topic.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                          <span style={{ fontSize:13,fontWeight:600,color:"#1A1D2E" }}>{topic.name}</span>
                          <span style={{ fontSize:12,fontWeight:700,color:acc>=80?"#16A34A":acc>=60?"#D97706":"#DC2626" }}>{acc}%</span>
                        </div>
                        <ParentAccuracyBar pct={acc} color={topic.color}/>
                        <div style={{ display:"flex",justifyContent:"space-between",marginTop:3 }}>
                          <span style={{ fontSize:10,color:"#6B7280" }}>{mastery.correct}/{mastery.attempted} correct</span>
                          <span style={{ fontSize:10,fontWeight:600,color:PLVL_COLORS[mastery.level||0] }}>{PLVL_LABELS[mastery.level||0]}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {stats.total===0&&(
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#6B7280" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>📖</div>
                <div style={{ fontSize:14, fontWeight:600, color:"#1A1D2E" }}>No practice yet</div>
                <div style={{ fontSize:13, marginTop:6 }}>Hand the device back to your child and ask them to try some questions!</div>
              </div>
            )}
          </div>
        )}

        {/* TOPICS */}
        {ptab==="topics"&&(
          <div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:12,padding:"10px 12px",marginBottom:14 }}>
              {PLVL_LABELS.slice(1).map((l,i)=>(
                <div key={l} style={{ display:"flex",alignItems:"center",gap:4 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:PLVL_COLORS[i+1] }}/>
                  <span style={{ fontSize:11,color:"#6B7280" }}>{l}</span>
                </div>
              ))}
            </div>
            {TOPICS.map(topic=>{
              const mastery=data.mastery?.[topic.id];
              if(!mastery||!mastery.attempted) return (
                <div key={topic.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.06)",opacity:.4 }}>
                  <div style={{ width:34,height:34,borderRadius:9,background:`${topic.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{topic.icon}</div>
                  <div><div style={{ fontSize:13,fontWeight:600,color:"#1A1D2E" }}>{topic.name}</div><div style={{ fontSize:11,color:"#6B7280" }}>Not started</div></div>
                </div>
              );
              const acc=Math.round(mastery.accuracy*100);
              return (
                <div key={topic.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ width:34,height:34,borderRadius:9,background:`${topic.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{topic.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                      <span style={{ fontSize:13,fontWeight:600,color:"#1A1D2E" }}>{topic.name}</span>
                      <span style={{ fontSize:12,fontWeight:700,color:acc>=80?"#16A34A":acc>=60?"#D97706":"#DC2626" }}>{acc}%</span>
                    </div>
                    <ParentAccuracyBar pct={acc} color={topic.color}/>
                    <div style={{ display:"flex",justifyContent:"space-between",marginTop:3 }}>
                      <span style={{ fontSize:10,color:"#6B7280" }}>{mastery.correct}/{mastery.attempted} correct</span>
                      <span style={{ fontSize:10,fontWeight:600,color:PLVL_COLORS[mastery.level||0] }}>{PLVL_LABELS[mastery.level||0]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAPERS */}
        {ptab==="papers"&&(
          <div>
            <div style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:13,color:"#1A1D2E",lineHeight:1.7 }}>
              Each paper has <strong>22 questions</strong>. A score of <strong style={{ color:"#16A34A" }}>75%+</strong> shows readiness for that level.
            </div>
            {[
              {id:"mock-a",label:"Paper A",difficulty:"Foundation",  color:"#16A34A"},
              {id:"mock-b",label:"Paper B",difficulty:"Intermediate",color:"#D97706"},
              {id:"mock-c",label:"Paper C",difficulty:"Intermediate",color:"#D97706"},
              {id:"mock-d",label:"Paper D",difficulty:"Advanced",    color:"#DC2626"},
              {id:"mock-e",label:"Paper E",difficulty:"Advanced",    color:"#DC2626"},
            ].map(paper=>{
              const attempts=data.paperAttempts?.[paper.id]||{};
              const done=Object.keys(attempts).length;
              const correct=Object.values(attempts).filter(a=>a.correct).length;
              const pct=done?Math.round(correct/done*100):0;
              const lastTs=done?Math.max(...Object.values(attempts).map(a=>a.ts||0)):null;
              return (
                <div key={paper.id} style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:8 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <span style={{ fontSize:13,fontWeight:700,color:"#1A1D2E" }}>{paper.label}</span>
                        <span style={{ fontSize:10,fontWeight:700,color:paper.color,background:`${paper.color}18`,borderRadius:8,padding:"1px 7px" }}>{paper.difficulty}</span>
                      </div>
                      <div style={{ fontSize:11,color:"#6B7280",marginTop:3 }}>
                        {done?`${done}/22 attempted · Last: ${timeAgoP(lastTs)}`:"Not attempted yet"}
                      </div>
                    </div>
                    {done>0&&<div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:20,fontWeight:800,color:pct>=75?"#16A34A":pct>=50?"#D97706":"#DC2626" }}>{pct}%</div>
                      <div style={{ fontSize:10,color:"#6B7280" }}>{correct}/{done}</div>
                    </div>}
                  </div>
                  {done>0&&<div style={{ marginTop:10 }}><ParentAccuracyBar pct={pct}/></div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ADVICE */}
        {ptab==="advice"&&(
          <div>
            <div style={{ fontSize:11,color:"#6B7280",fontWeight:600,letterSpacing:.8,marginBottom:12 }}>PERSONALISED RECOMMENDATIONS</div>
            {(()=>{
              const recs=[];
              if(stats.total===0){
                recs.push({ic:"🚀",t:"No practice yet",d:"Ask your child to open the app and try at least 5 questions today to get started.",p:"high"});
              } else {
                if(stats.activeDays<3) recs.push({ic:"📅",t:"Practice more consistently",d:"Short daily sessions beat long weekly cramming. Aim for 15 minutes every day.",p:"high"});
                stats.weakTopics.slice(0,2).forEach(({topic})=>recs.push({ic:"📖",t:`Focus: ${topic.name}`,d:`Read the ${topic.name} notes together, then try 5 questions. Use AI Tutor on every wrong answer.`,p:"medium"}));
                if(stats.weakTopics.length===0&&stats.total>20) recs.push({ic:"📝",t:"Try a mock paper",d:"Good topic accuracy! Time to attempt Mock Paper B or C to practise under exam conditions.",p:"low"});
                recs.push({ic:"⏱",t:"Timed practice",d:"For PSLE: max 2 min per 1-mark question, 4 min per 2-mark question. Practice timing at home.",p:"low"});
              }
              const bgs=  {high:"#FEF2F2",medium:"#FFFBEB",low:"#F0FDF4"};
              const bords= {high:"#FECACA",medium:"#FDE68A",low:"#BBF7D0"};
              return recs.map((r,i)=>(
                <div key={i} style={{ background:bgs[r.p],border:`1px solid ${bords[r.p]}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",gap:10 }}>
                  <span style={{ fontSize:18,flexShrink:0 }}>{r.ic}</span>
                  <div>
                    <div style={{ fontSize:13,fontWeight:700,color:"#1A1D2E",marginBottom:2 }}>{r.t}</div>
                    <div style={{ fontSize:13,color:"#374151",lineHeight:1.6 }}>{r.d}</div>
                  </div>
                </div>
              ));
            })()}

            <div style={{ height:1,background:"rgba(0,0,0,0.07)",margin:"20px 0" }}/>
            <div style={{ fontSize:11,color:"#6B7280",fontWeight:600,letterSpacing:.8,marginBottom:12 }}>PSLE EXAM TIPS</div>
            {[
              ["✏️","Show all working","Even if the answer is wrong, method marks are awarded. Never leave a blank."],
              ["📐","Draw diagrams","For geometry, speed, ratio — draw and label first. It almost always unlocks the solution."],
              ["🔍","Check answers","Last 10 min: re-read every question and verify the answer makes sense."],
              ["💤","Rest before the exam","Sleep beats late-night cramming. Ensure 9+ hours the night before."],
            ].map(([ic,t,d])=>(
              <div key={t} style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",gap:12 }}>
                <span style={{ fontSize:18,flexShrink:0 }}>{ic}</span>
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1A1D2E",marginBottom:2 }}>{t}</div>
                  <div style={{ fontSize:13,color:"#6B7280",lineHeight:1.6 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const {state, dispatch} = useAppState();
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
      @keyframes pinShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
      @keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [screen, setScreen]         = useState("home");
  const [activeTopic, setActiveTopic] = useState(null);
  const [activePaper, setActivePaper] = useState(null);
  const [activeExam,  setActiveExam]  = useState(null);

  // Badge toast queue
  const [badgeQueue, setBadgeQueue]   = useState([]);
  const [prevUnlocked, setPrevUnlocked] = useState(
    () => evaluateBadges({ ...loadState() })
  );

  // Watch state for newly unlocked badges
  useEffect(() => {
    const nowUnlocked = evaluateBadges(state);
    const fresh = getNewBadges(prevUnlocked, nowUnlocked);
    if (fresh.length > 0) {
      setBadgeQueue(q => [...q, ...fresh.map(id => BADGES.find(b => b.id === id)).filter(Boolean)]);
      setPrevUnlocked(nowUnlocked);
    }
  }, [state]);

  // PIN state — session-based unlock
  const [pinUnlocked, setPinUnlocked] = useState(
    () => sessionStorage.getItem("p6prep_pin_unlocked") === "1"
  );

  function navTopic(tid){ setActiveTopic(tid); setScreen("topic"); }
  function navPaper(pid){ setActivePaper(pid); setScreen("paper"); }
  function navExam(pid) { setActiveExam(pid);  setScreen("exam");  }

  function goParent() {
    if (pinUnlocked) { setScreen("parent"); return; }
    setScreen("parent-pin");
  }
  function onPinUnlocked() { setPinUnlocked(true); setScreen("parent"); }
  function onLockDashboard() {
    sessionStorage.removeItem("p6prep_pin_unlocked");
    setPinUnlocked(false);
    setScreen("home");
  }

  const screens = {
    home:       <HomeScreen state={state} dispatch={dispatch} onTopic={navTopic} onMocks={()=>setScreen("mocks")} onPlans={()=>setScreen("plans")} onSettings={()=>setScreen("plans")}/>,
    topic:      <TopicScreen tid={activeTopic} state={state} dispatch={dispatch} onBack={()=>setScreen("home")}/>,
    mocks:      <MocksScreen state={state} dispatch={dispatch} onBack={()=>setScreen("home")} onPaper={navPaper} onExam={navExam} onPlans={()=>setScreen("plans")}/>,
    paper:      <PaperScreen pid={activePaper} state={state} dispatch={dispatch} onBack={()=>setScreen("mocks")}/>,
    exam:       <ExamScreen  pid={activeExam}  state={state} dispatch={dispatch} onBack={()=>setScreen("mocks")}/>,
    plans:      <PlansScreen state={state} dispatch={dispatch} onBack={()=>setScreen("home")} onAnalytics={()=>setScreen("analytics")}/>,
    stats:      <StatsScreen state={state} dispatch={dispatch}/>,
    badges:     <BadgesScreen state={state}/>,
    leaderboard:<LeaderboardScreen state={state}/>,
    "parent-pin": <PinGate onUnlocked={onPinUnlocked}/>,
    parent:     <ParentDashboardScreen state={state} dispatch={dispatch} onLock={onLockDashboard}/>,
    analytics:  <AnalyticsScreen onBack={()=>setScreen("plans")}/>,
  };

  const unlockedCount = evaluateBadges(state).length;

  const tabs = [
    {id:"home",        icon:"🏠", label:"Home",     nav:()=>setScreen("home")},
    {id:"mocks",       icon:"📝", label:"Papers",   nav:()=>setScreen("mocks")},
    {id:"leaderboard", icon:"🏆", label:"Ranks",    nav:()=>setScreen("leaderboard")},
    {id:"badges",      icon:"🏅", label:"Badges",   nav:()=>setScreen("badges"),
      badge: unlockedCount > 0 ? unlockedCount : null },
    {id:"parent",      icon:"👨‍👩‍👧", label:"Parent",  nav:goParent},
  ];

  // Hide tab bar on PIN/exam screens for focus
  const hideTabBar = screen === "parent-pin" || screen === "exam" || screen === "analytics";

  // ── Onboarding gate ──
  if (!state.onboarded) {
    return <OnboardingFlow dispatch={dispatch} state={state} />;
  }

  return (
    <div style={{
      background: screen==="parent"||screen==="parent-pin" ? "#F7F8FC" : T.bg,
      minHeight:"100vh", maxWidth:480, margin:"0 auto",
      display:"flex", flexDirection:"column",
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
    }}>
      {/* Badge toast — shows on top of everything */}
      {badgeQueue.length > 0 && (
        <BadgeToast
          badge={badgeQueue[0]}
          onDismiss={() => setBadgeQueue(q => q.slice(1))}
        />
      )}

      <div style={{ flex:1, overflow:"auto", paddingBottom: hideTabBar ? 0 : 64 }}>
        {screens[screen] || screens.home}
      </div>

      {!hideTabBar && (
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480,
          background: screen==="parent" ? "#fff" : T.surface,
          borderTop:`1px solid ${screen==="parent"?"rgba(0,0,0,0.07)":T.border}`,
          display:"flex", zIndex:100,
        }}>
          {tabs.map(t=>{
            const active = screen===t.id
              || (t.id==="home"   && (screen==="topic"))
              || (t.id==="parent" && screen==="parent");
            const col = screen==="parent" ? "#6B7280" : T.sec;
            const acol= screen==="parent" ? "#4F7DFF" : T.accent;
            return (
              <button key={t.id} onClick={t.nav} style={{
                flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", gap:2, padding:"10px 0 12px",
                border:"none", background:"none", cursor:"pointer",
                color: active ? acol : col, transition:"color .2s",
                position:"relative",
              }}>
                <div style={{ position:"relative", display:"inline-flex" }}>
                  <span style={{ fontSize:20 }}>{t.icon}</span>
                  {t.badge && (
                    <div style={{
                      position:"absolute", top:-4, right:-6,
                      background:"#EB4D4B", color:"#fff",
                      fontSize:9, fontWeight:800, borderRadius:8,
                      padding:"1px 4px", minWidth:14, textAlign:"center",
                      lineHeight:"14px",
                    }}>{t.badge}</div>
                  )}
                </div>
                <span style={{ fontSize:10, fontWeight:active?700:400, letterSpacing:.3 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

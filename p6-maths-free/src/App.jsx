// p6-prep-maths-free.jsx
// Complete free version - no external dependencies, no API keys needed

import React, { useState, useEffect, useReducer, useCallback, useMemo, useRef, createContext, useContext } from 'react';

// ============================================================
// CONSTANTS
// ============================================================
const TOPICS = [
  { id: 'whole-numbers', label: 'Whole Numbers', color: '#FF6B6B' },
  { id: 'fractions', label: 'Fractions', color: '#FF9F43' },
  { id: 'decimals', label: 'Decimals', color: '#F9CA24' },
  { id: 'percentage', label: 'Percentage', color: '#6AB04C' },
  { id: 'ratio', label: 'Ratio', color: '#22A6B3' },
  { id: 'algebra', label: 'Algebra', color: '#BE2EDD' },
  { id: 'speed', label: 'Speed', color: '#EB4D4B' },
  { id: 'area-perimeter', label: 'Area & Perimeter', color: '#0652DD' },
  { id: 'volume', label: 'Volume', color: '#1289A7' },
  { id: 'angles', label: 'Angles', color: '#A3CB38' },
  { id: 'average', label: 'Average', color: '#FDA7DF' },
  { id: 'data-analysis', label: 'Data Analysis', color: '#D980FA' }
];

const TOPIC_COLORS = Object.fromEntries(TOPICS.map(t => [t.id, t.color]));

const MOCK_PAPERS = [
  { id: 'A', label: 'Mock Paper A' },
  { id: 'B', label: 'Mock Paper B' },
  { id: 'C', label: 'Mock Paper C' },
  { id: 'D', label: 'Mock Paper D' },
  { id: 'E', label: 'Mock Paper E' }
];

const PSLE_SCHEDULE = [
  { subject: 'English & MT Oral', date: 'Wed 12 Aug 2026', color: '#FF9F43' },
  { subject: 'Oral Exams (Day 2)', date: 'Thu 13 Aug 2026', color: '#FF9F43' },
  { subject: 'Listening Comprehension (MT)', date: 'Tue 15 Sep 2026', color: '#22A6B3' },
  { subject: 'English Papers 1 & 2', date: 'Thu 24 Sep 2026', color: '#4F7DFF' },
  { subject: 'Mathematics Papers 1 & 2', date: 'Fri 25 Sep 2026', color: '#BE2EDD' },
  { subject: 'Mother Tongue Papers 1 & 2', date: 'Mon 28 Sep 2026', color: '#6AB04C' },
  { subject: 'Science Papers 1 & 2', date: 'Tue 29 Sep 2026', color: '#EB4D4B' },
  { subject: 'Higher Mother Tongue', date: 'Wed 30 Sep 2026', color: '#F9CA24' },
  { subject: 'Results Release', date: 'Tue 24 Nov 2026', color: '#6AB04C' }
];

const EXAM_DURATION = 44 * 60;

// ============================================================
// QUESTION BANK - 25 questions per topic (300 total)
// ============================================================
const TOPIC_QUESTIONS = {
  'whole-numbers': [
    { q: 'What is the place value of 7 in 47,832?', a: 'thousands', work: '7 is in the thousands place', marks: 1 },
    { q: 'Find the HCF of 24 and 36.', a: '12', work: '24 = 2³×3, 36 = 2²×3², HCF = 2²×3 = 12', marks: 2 },
    { q: 'Calculate 15 + 6 × 3 − 4.', a: '29', work: '6×3=18, 15+18=33, 33-4=29', marks: 2 },
    { q: 'What is the smallest prime number greater than 20?', a: '23', work: '21 is composite, 22 is composite, 23 is prime', marks: 1 },
    { q: 'Round 47,832 to the nearest thousand.', a: '48000', work: '7 is in the thousands place, next digit is 8 → round up', marks: 1 },
    { q: 'Find the LCM of 6 and 8.', a: '24', work: '6=2×3, 8=2³, LCM=2³×3=24', marks: 2 },
    { q: 'Calculate 2⁵.', a: '32', work: '2×2×2×2×2=32', marks: 1 },
    { q: 'What is the value of 3⁴?', a: '81', work: '3×3×3×3=81', marks: 1 },
    { q: 'Find the square of 12.', a: '144', work: '12×12=144', marks: 1 },
    { q: 'What is the cube root of 64?', a: '4', work: '4×4×4=64', marks: 1 },
    { q: 'Simplify 48:72.', a: '2:3', work: '48÷24=2, 72÷24=3', marks: 2 },
    { q: 'Calculate 3/4 + 1/2.', a: '5/4', work: 'Common denominator 4: 3/4+2/4=5/4', marks: 2 },
    { q: 'What is 20% of 80?', a: '16', work: '80×20÷100=16', marks: 1 },
    { q: 'Find the value of x: 2x+5=13.', a: '4', work: '2x=8, x=4', marks: 2 },
    { q: 'A rectangle is 8cm by 5cm. Find its perimeter.', a: '26', work: '2(8+5)=26cm', marks: 1 },
    { q: 'What is the area of a triangle with base 6cm and height 4cm?', a: '12', work: '½×6×4=12cm²', marks: 2 },
    { q: 'Calculate the volume of a cube with side 3cm.', a: '27', work: '3×3×3=27cm³', marks: 2 },
    { q: 'Find the average of 4, 7, 9, 12.', a: '8', work: '(4+7+9+12)÷4=8', marks: 1 },
    { q: 'What is the median of 3, 7, 8, 10, 15?', a: '8', work: 'Middle number is 8', marks: 1 },
    { q: 'A car travels 120km in 2 hours. Find its speed.', a: '60', work: '120÷2=60km/h', marks: 1 },
    { q: 'What is 3/4 of 60?', a: '45', work: '60×3÷4=45', marks: 1 },
    { q: 'A shirt costs $25 with 20% discount. Find the discount amount.', a: '5', work: '25×20%=5', marks: 2 },
    { q: 'Find the sum of the first 5 odd numbers.', a: '25', work: '1+3+5+7+9=25', marks: 2 },
    { q: 'What is the value of 9³?', a: '729', work: '9×9×9=729', marks: 1 },
    { q: 'Convert 3/4 to a percentage.', a: '75', work: '3÷4×100=75%', marks: 1 }
  ],
  'fractions': [
    { q: 'Simplify 8/12.', a: '2/3', work: 'Divide numerator and denominator by 4', marks: 1 },
    { q: 'Add 1/3 + 1/4.', a: '7/12', work: 'LCM of 3 and 4 is 12: 4/12+3/12=7/12', marks: 2 },
    { q: 'Subtract 3/8 from 5/8.', a: '1/4', work: '5/8-3/8=2/8=1/4', marks: 1 },
    { q: 'Multiply 2/3 × 3/5.', a: '2/5', work: '2×3 / 3×5 = 6/15 = 2/5', marks: 2 },
    { q: 'Divide 3/4 ÷ 2/3.', a: '9/8', work: '3/4 × 3/2 = 9/8', marks: 2 },
    { q: 'What is 2/5 of 30?', a: '12', work: '30×2÷5=12', marks: 1 },
    { q: 'Convert 5/8 to a decimal.', a: '0.625', work: '5÷8=0.625', marks: 1 },
    { q: 'What is the reciprocal of 3/7?', a: '7/3', work: 'Flip the fraction', marks: 1 },
    { q: 'Simplify 15/25.', a: '3/5', work: 'Divide by 5', marks: 1 },
    { q: 'Add 2/5 + 1/10.', a: '1/2', work: '4/10+1/10=5/10=1/2', marks: 2 },
    { q: 'Subtract 1/6 from 2/3.', a: '1/2', work: '4/6-1/6=3/6=1/2', marks: 2 },
    { q: 'Multiply 4/7 × 7/8.', a: '1/2', work: '4/7×7/8=28/56=1/2', marks: 2 },
    { q: 'Divide 5/6 ÷ 5/12.', a: '2', work: '5/6×12/5=60/30=2', marks: 2 },
    { q: 'What is 3/10 of 200?', a: '60', work: '200×3÷10=60', marks: 1 },
    { q: 'Convert 0.75 to a fraction.', a: '3/4', work: '0.75=75/100=3/4', marks: 1 },
    { q: 'What is 2/3 + 1/6?', a: '5/6', work: '4/6+1/6=5/6', marks: 2 },
    { q: 'Find 3/4 of 16.', a: '12', work: '16×3÷4=12', marks: 1 },
    { q: 'Simplify 18/24.', a: '3/4', work: 'Divide by 6', marks: 1 },
    { q: 'What is 1/2 × 2/3 × 3/4?', a: '1/4', work: '1×2×3/2×3×4=6/24=1/4', marks: 2 },
    { q: 'Convert 7/10 to a percentage.', a: '70', work: '7÷10×100=70%', marks: 1 },
    { q: 'What is 3/8 of 64?', a: '24', work: '64×3÷8=24', marks: 1 },
    { q: 'Add 3/7 + 2/7.', a: '5/7', work: '3/7+2/7=5/7', marks: 1 },
    { q: 'Subtract 2/9 from 5/9.', a: '1/3', work: '5/9-2/9=3/9=1/3', marks: 2 },
    { q: 'Multiply 2/5 × 10.', a: '4', work: '2/5×10=20/5=4', marks: 1 },
    { q: 'Divide 3/4 ÷ 6.', a: '1/8', work: '3/4×1/6=3/24=1/8', marks: 2 }
  ],
  'decimals': [
    { q: 'Write 0.35 as a fraction.', a: '7/20', work: '0.35=35/100=7/20', marks: 1 },
    { q: 'Add 3.5 + 2.7.', a: '6.2', work: '3.5+2.7=6.2', marks: 1 },
    { q: 'Subtract 4.8 from 7.2.', a: '2.4', work: '7.2-4.8=2.4', marks: 1 },
    { q: 'Multiply 2.5 × 1.4.', a: '3.5', work: '2.5×1.4=3.5', marks: 2 },
    { q: 'Divide 6.3 ÷ 0.9.', a: '7', work: '6.3÷0.9=7', marks: 2 },
    { q: 'Round 3.764 to 2 decimal places.', a: '3.76', work: '3.764 → 3.76 (4th digit is 4)', marks: 1 },
    { q: 'Convert 3/8 to a decimal.', a: '0.375', work: '3÷8=0.375', marks: 1 },
    { q: 'What is 2.5 + 3.75?', a: '6.25', work: '2.5+3.75=6.25', marks: 1 },
    { q: 'Subtract 1.25 from 5.', a: '3.75', work: '5.00-1.25=3.75', marks: 1 },
    { q: 'Multiply 0.6 × 0.5.', a: '0.3', work: '0.6×0.5=0.3', marks: 1 },
    { q: 'Divide 4.5 ÷ 1.5.', a: '3', work: '4.5÷1.5=3', marks: 2 },
    { q: 'Round 7.865 to 1 decimal place.', a: '7.9', work: '7.865 → 7.9 (2nd decimal is 6, round up)', marks: 1 },
    { q: 'Convert 2/5 to a decimal.', a: '0.4', work: '2÷5=0.4', marks: 1 },
    { q: 'What is 3.2 × 100?', a: '320', work: 'Move decimal point 2 places right', marks: 1 },
    { q: 'What is 4.5 ÷ 100?', a: '0.045', work: 'Move decimal point 2 places left', marks: 1 },
    { q: 'Add 0.75 + 0.25.', a: '1.0', work: '0.75+0.25=1.00', marks: 1 },
    { q: 'Subtract 2.3 from 5.6.', a: '3.3', work: '5.6-2.3=3.3', marks: 1 },
    { q: 'Multiply 1.2 × 3.5.', a: '4.2', work: '1.2×3.5=4.2', marks: 2 },
    { q: 'Divide 8.4 ÷ 2.1.', a: '4', work: '8.4÷2.1=4', marks: 2 },
    { q: 'Convert 0.875 to a fraction.', a: '7/8', work: '0.875=875/1000=7/8', marks: 2 },
    { q: 'What is 3.6 + 4.7?', a: '8.3', work: '3.6+4.7=8.3', marks: 1 },
    { q: 'Subtract 1.8 from 6.0.', a: '4.2', work: '6.0-1.8=4.2', marks: 1 },
    { q: 'Multiply 2.5 × 0.4.', a: '1.0', work: '2.5×0.4=1.0', marks: 1 },
    { q: 'Divide 5.6 ÷ 0.7.', a: '8', work: '5.6÷0.7=8', marks: 2 },
    { q: 'Convert 5/8 to a decimal.', a: '0.625', work: '5÷8=0.625', marks: 1 }
  ],
  'percentage': [
    { q: 'What is 25% of 80?', a: '20', work: '80×25÷100=20', marks: 1 },
    { q: 'Convert 3/5 to a percentage.', a: '60', work: '3÷5×100=60%', marks: 1 },
    { q: 'A $50 item has 10% discount. Find the sale price.', a: '45', work: '50×10%=5, 50-5=45', marks: 2 },
    { q: 'What percentage of 40 is 8?', a: '20', work: '8÷40×100=20%', marks: 2 },
    { q: 'Increase 60 by 15%.', a: '69', work: '60×15%=9, 60+9=69', marks: 2 },
    { q: 'Decrease 200 by 25%.', a: '150', work: '200×25%=50, 200-50=150', marks: 2 },
    { q: 'What is 40% of 150?', a: '60', work: '150×40÷100=60', marks: 1 },
    { q: 'Convert 0.45 to a percentage.', a: '45', work: '0.45×100=45%', marks: 1 },
    { q: 'A $80 item is on sale for $64. What is the discount percentage?', a: '20', work: '80-64=16, 16÷80×100=20%', marks: 2 },
    { q: 'What is 12% of 250?', a: '30', work: '250×12÷100=30', marks: 1 },
    { q: 'Convert 7/20 to a percentage.', a: '35', work: '7÷20×100=35%', marks: 1 },
    { q: 'Increase 40 by 30%.', a: '52', work: '40×30%=12, 40+12=52', marks: 2 },
    { q: 'Decrease 150 by 20%.', a: '120', work: '150×20%=30, 150-30=120', marks: 2 },
    { q: 'What percentage of 80 is 20?', a: '25', work: '20÷80×100=25%', marks: 2 },
    { q: 'A $120 item has 15% GST. Find the total price.', a: '138', work: '120×15%=18, 120+18=138', marks: 2 },
    { q: 'What is 5% of 300?', a: '15', work: '300×5÷100=15', marks: 1 },
    { q: 'Convert 0.08 to a percentage.', a: '8', work: '0.08×100=8%', marks: 1 },
    { q: 'A student scored 45 out of 60. What is the percentage?', a: '75', work: '45÷60×100=75%', marks: 1 },
    { q: 'What is 18% of 200?', a: '36', work: '200×18÷100=36', marks: 1 },
    { q: 'Convert 3/4 to a percentage.', a: '75', work: '3÷4×100=75%', marks: 1 },
    { q: 'Decrease 500 by 8%.', a: '460', work: '500×8%=40, 500-40=460', marks: 2 },
    { q: 'What percentage of 50 is 15?', a: '30', work: '15÷50×100=30%', marks: 2 },
    { q: 'A $90 item is on sale for $72. Find the discount percentage.', a: '20', work: '90-72=18, 18÷90×100=20%', marks: 2 },
    { q: 'What is 35% of 60?', a: '21', work: '60×35÷100=21', marks: 1 },
    { q: 'Increase 80 by 12.5%.', a: '90', work: '80×12.5%=10, 80+10=90', marks: 2 }
  ],
  'ratio': [
    { q: 'Simplify 8:12.', a: '2:3', work: 'Divide by 4', marks: 1 },
    { q: 'Divide 35 in the ratio 2:5.', a: '10,25', work: 'Total parts=7, 35÷7=5, 2×5=10, 5×5=25', marks: 2 },
    { q: 'A:B = 3:4, B:C = 2:5. Find A:C.', a: '3:10', work: 'A:B=3:4, B:C=2:5=4:10, so A:C=3:10', marks: 2 },
    { q: 'Simplify 15:25.', a: '3:5', work: 'Divide by 5', marks: 1 },
    { q: 'Divide 60 in the ratio 1:3:4.', a: '7.5,22.5,30', work: 'Total parts=8, 60÷8=7.5, 1×7.5=7.5, 3×7.5=22.5, 4×7.5=30', marks: 2 },
    { q: 'A:B = 2:3, B:C = 4:5. Find A:C.', a: '8:15', work: 'A:B=2:3=8:12, B:C=4:5=12:15, so A:C=8:15', marks: 2 },
    { q: 'Simplify 24:36.', a: '2:3', work: 'Divide by 12', marks: 1 },
    { q: 'Divide 84 in the ratio 3:4:7.', a: '18,24,42', work: 'Total parts=14, 84÷14=6, 3×6=18, 4×6=24, 7×6=42', marks: 2 },
    { q: 'The ratio of boys to girls is 3:2. If there are 15 boys, how many girls?', a: '10', work: '3 parts=15, 1 part=5, 2 parts=10', marks: 2 },
    { q: 'Simplify 18:24.', a: '3:4', work: 'Divide by 6', marks: 1 },
    { q: 'Divide 40 in the ratio 1:4.', a: '8,32', work: 'Total parts=5, 40÷5=8, 1×8=8, 4×8=32', marks: 2 },
    { q: 'A:B = 5:6, B:C = 3:4. Find A:C.', a: '5:8', work: 'A:B=5:6, B:C=3:4=6:8, so A:C=5:8', marks: 2 },
    { q: 'Simplify 45:60.', a: '3:4', work: 'Divide by 15', marks: 1 },
    { q: 'Divide 72 in the ratio 2:3:4.', a: '16,24,32', work: 'Total parts=9, 72÷9=8, 2×8=16, 3×8=24, 4×8=32', marks: 2 },
    { q: 'The ratio of apples to oranges is 4:5. If there are 20 apples, how many oranges?', a: '25', work: '4 parts=20, 1 part=5, 5 parts=25', marks: 2 },
    { q: 'Simplify 32:48.', a: '2:3', work: 'Divide by 16', marks: 1 },
    { q: 'Divide 100 in the ratio 3:7.', a: '30,70', work: 'Total parts=10, 100÷10=10, 3×10=30, 7×10=70', marks: 2 },
    { q: 'A:B = 2:5, B:C = 3:7. Find A:C.', a: '6:35', work: 'A:B=2:5=6:15, B:C=3:7=15:35, so A:C=6:35', marks: 2 },
    { q: 'Simplify 40:60.', a: '2:3', work: 'Divide by 20', marks: 1 },
    { q: 'Divide 56 in the ratio 3:4.', a: '24,32', work: 'Total parts=7, 56÷7=8, 3×8=24, 4×8=32', marks: 2 },
    { q: 'The ratio of cats to dogs is 2:3. If there are 12 dogs, how many cats?', a: '8', work: '3 parts=12, 1 part=4, 2 parts=8', marks: 2 },
    { q: 'Simplify 28:35.', a: '4:5', work: 'Divide by 7', marks: 1 },
    { q: 'Divide 90 in the ratio 2:3:4.', a: '20,30,40', work: 'Total parts=9, 90÷9=10, 2×10=20, 3×10=30, 4×10=40', marks: 2 },
    { q: 'A:B = 3:5, B:C = 2:3. Find A:C.', a: '2:5', work: 'A:B=3:5=6:10, B:C=2:3=10:15, so A:C=6:15=2:5', marks: 2 },
    { q: 'Simplify 16:24.', a: '2:3', work: 'Divide by 8', marks: 1 }
  ],
  'algebra': [
    { q: 'Simplify 3x + 2x.', a: '5x', work: 'Add like terms: 3+2=5', marks: 1 },
    { q: 'Solve 2x + 3 = 11.', a: '4', work: '2x=8, x=4', marks: 2 },
    { q: 'Expand 3(x + 4).', a: '3x+12', work: '3×x + 3×4 = 3x+12', marks: 2 },
    { q: 'Simplify 5a - 2a + 3b.', a: '3a+3b', work: '5a-2a=3a, 3b stays', marks: 2 },
    { q: 'Solve x/4 = 5.', a: '20', work: 'Multiply both sides by 4: x=20', marks: 1 },
    { q: 'Expand 2(x - 3).', a: '2x-6', work: '2×x - 2×3 = 2x-6', marks: 2 },
    { q: 'Simplify 4x + 3y - x + 2y.', a: '3x+5y', work: '4x-x=3x, 3y+2y=5y', marks: 2 },
    { q: 'Solve 3x - 4 = 14.', a: '6', work: '3x=18, x=6', marks: 2 },
    { q: 'Evaluate 2x + 3 when x = 4.', a: '11', work: '2×4+3=8+3=11', marks: 1 },
    { q: 'Expand 4(2x + 1).', a: '8x+4', work: '4×2x + 4×1 = 8x+4', marks: 2 },
    { q: 'Simplify 7x - 2x.', a: '5x', work: '7-2=5', marks: 1 },
    { q: 'Solve 2x + 5 = 17.', a: '6', work: '2x=12, x=6', marks: 2 },
    { q: 'Expand 5(x - 2).', a: '5x-10', work: '5×x - 5×2 = 5x-10', marks: 2 },
    { q: 'Simplify 2a + 3b + 4a - b.', a: '6a+2b', work: '2a+4a=6a, 3b-b=2b', marks: 2 },
    { q: 'Evaluate 4x - 5 when x = 3.', a: '7', work: '4×3-5=12-5=7', marks: 1 },
    { q: 'Expand 3(2x + 5).', a: '6x+15', work: '3×2x + 3×5 = 6x+15', marks: 2 },
    { q: 'Solve x + 7 = 15.', a: '8', work: 'x=15-7=8', marks: 1 },
    { q: 'Simplify 5x - 3x + 2y.', a: '2x+2y', work: '5x-3x=2x', marks: 2 },
    { q: 'Expand 2(3x - 4).', a: '6x-8', work: '2×3x - 2×4 = 6x-8', marks: 2 },
    { q: 'Solve 4x - 6 = 18.', a: '6', work: '4x=24, x=6', marks: 2 },
    { q: 'Evaluate x² + 3x when x = 5.', a: '40', work: '25+15=40', marks: 2 },
    { q: 'Expand 6(x + 2).', a: '6x+12', work: '6×x + 6×2 = 6x+12', marks: 2 },
    { q: 'Simplify 8x - 3x.', a: '5x', work: '8-3=5', marks: 1 },
    { q: 'Solve 5x = 35.', a: '7', work: 'x=35÷5=7', marks: 1 },
    { q: 'Expand 4(3x - 2).', a: '12x-8', work: '4×3x - 4×2 = 12x-8', marks: 2 }
  ],
  'speed': [
    { q: 'A car travels 180km in 3 hours. Find its speed.', a: '60', work: '180÷3=60km/h', marks: 1 },
    { q: 'A runner covers 100m in 10s. Find the speed in m/s.', a: '10', work: '100÷10=10m/s', marks: 1 },
    { q: 'A cyclist travels at 20km/h for 2.5 hours. Find the distance.', a: '50', work: '20×2.5=50km', marks: 2 },
    { q: 'A train travels 240km at 80km/h. Find the time taken.', a: '3', work: '240÷80=3 hours', marks: 2 },
    { q: 'Convert 72km/h to m/s.', a: '20', work: '72×1000÷3600=20m/s', marks: 2 },
    { q: 'A car travels at 90km/h for 2 hours. Find the distance.', a: '180', work: '90×2=180km', marks: 1 },
    { q: 'A person walks at 5km/h for 4 hours. Find the distance.', a: '20', work: '5×4=20km', marks: 1 },
    { q: 'A plane flies 1500km in 3 hours. Find the speed.', a: '500', work: '1500÷3=500km/h', marks: 1 },
    { q: 'Convert 15m/s to km/h.', a: '54', work: '15×3600÷1000=54km/h', marks: 2 },
    { q: 'A cyclist travels 45km in 1.5 hours. Find the speed.', a: '30', work: '45÷1.5=30km/h', marks: 2 },
    { q: 'A train travels at 60km/h for 45 minutes. Find the distance.', a: '45', work: '45min=0.75h, 60×0.75=45km', marks: 2 },
    { q: 'A car travels 120km in 2 hours. What is the speed in m/s?', a: '16.67', work: '120km=120000m, 2h=7200s, 120000÷7200=16.67m/s', marks: 2 },
    { q: 'Two cars start at the same point and travel in opposite directions. One goes at 50km/h, the other at 70km/h. How far apart are they after 2 hours?', a: '240', work: '50×2 + 70×2 = 100+140=240km', marks: 2 },
    { q: 'A runner completes a 400m track in 50s. Find the speed in m/s.', a: '8', work: '400÷50=8m/s', marks: 1 },
    { q: 'A car travels at 55km/h for 3.2 hours. Find the distance.', a: '176', work: '55×3.2=176km', marks: 2 },
    { q: 'A bus travels 300km at 75km/h. Find the time taken.', a: '4', work: '300÷75=4 hours', marks: 2 },
    { q: 'Convert 108km/h to m/s.', a: '30', work: '108×1000÷3600=30m/s', marks: 2 },
    { q: 'A person cycles at 12km/h for 2.5 hours. Find the distance.', a: '30', work: '12×2.5=30km', marks: 2 },
    { q: 'A car travels at 45km/h for 1 hour 20 minutes. Find the distance.', a: '60', work: '1h20m=1.33h, 45×1.33=60km', marks: 2 },
    { q: 'Two trains start 400km apart and travel towards each other. One at 60km/h, the other at 80km/h. How long until they meet?', a: '2.86', work: '400÷(60+80)=400÷140=2.86 hours', marks: 2 },
    { q: 'A car travels at 70km/h for 3.5 hours. Find the distance.', a: '245', work: '70×3.5=245km', marks: 1 },
    { q: 'Convert 25m/s to km/h.', a: '90', work: '25×3600÷1000=90km/h', marks: 2 },
    { q: 'A bus travels 180km in 2 hours 15 minutes. Find the speed.', a: '80', work: '2h15m=2.25h, 180÷2.25=80km/h', marks: 2 },
    { q: 'A person walks at 6km/h for 2 hours 30 minutes. Find the distance.', a: '15', work: '2h30m=2.5h, 6×2.5=15km', marks: 2 },
    { q: 'A train travels at 90km/h for 2 hours 20 minutes. Find the distance.', a: '210', work: '2h20m=2.33h, 90×2.33=210km', marks: 2 }
  ],
  'area-perimeter': [
    { q: 'Find the perimeter of a rectangle 8cm by 5cm.', a: '26', work: '2(8+5)=26cm', marks: 1 },
    { q: 'Find the area of a rectangle 6cm by 4cm.', a: '24', work: '6×4=24cm²', marks: 1 },
    { q: 'Find the area of a triangle with base 10cm and height 6cm.', a: '30', work: '½×10×6=30cm²', marks: 2 },
    { q: 'Find the perimeter of a square with side 7cm.', a: '28', work: '4×7=28cm', marks: 1 },
    { q: 'Find the area of a square with side 9cm.', a: '81', work: '9×9=81cm²', marks: 1 },
    { q: 'Find the circumference of a circle with radius 7cm. (π=22/7)', a: '44', work: '2×22/7×7=44cm', marks: 2 },
    { q: 'Find the area of a circle with radius 7cm. (π=22/7)', a: '154', work: '22/7×7×7=154cm²', marks: 2 },
    { q: 'Find the perimeter of a rectangle 12cm by 8cm.', a: '40', work: '2(12+8)=40cm', marks: 1 },
    { q: 'Find the area of a rectangle 15cm by 6cm.', a: '90', work: '15×6=90cm²', marks: 1 },
    { q: 'Find the area of a triangle with base 8cm and height 5cm.', a: '20', work: '½×8×5=20cm²', marks: 2 },
    { q: 'Find the perimeter of a square with side 12cm.', a: '48', work: '4×12=48cm', marks: 1 },
    { q: 'Find the area of a square with side 11cm.', a: '121', work: '11×11=121cm²', marks: 1 },
    { q: 'Find the circumference of a circle with diameter 14cm. (π=22/7)', a: '44', work: '22/7×14=44cm', marks: 2 },
    { q: 'Find the area of a circle with radius 3.5cm. (π=22/7)', a: '38.5', work: '22/7×3.5×3.5=38.5cm²', marks: 2 },
    { q: 'Find the perimeter of a triangle with sides 6cm, 8cm, 10cm.', a: '24', work: '6+8+10=24cm', marks: 1 },
    { q: 'Find the area of a parallelogram with base 10cm and height 6cm.', a: '60', work: '10×6=60cm²', marks: 2 },
    { q: 'Find the area of a trapezium with parallel sides 8cm and 12cm, height 5cm.', a: '50', work: '½(8+12)×5=50cm²', marks: 2 },
    { q: 'Find the circumference of a circle with radius 5cm. (π=3.14)', a: '31.4', work: '2×3.14×5=31.4cm', marks: 2 },
    { q: 'Find the area of a circle with radius 5cm. (π=3.14)', a: '78.5', work: '3.14×5×5=78.5cm²', marks: 2 },
    { q: 'Find the perimeter of a rectangle 20cm by 15cm.', a: '70', work: '2(20+15)=70cm', marks: 1 },
    { q: 'Find the area of a rectangle 25cm by 8cm.', a: '200', work: '25×8=200cm²', marks: 1 },
    { q: 'Find the area of a triangle with base 12cm and height 9cm.', a: '54', work: '½×12×9=54cm²', marks: 2 },
    { q: 'Find the perimeter of a square with side 15cm.', a: '60', work: '4×15=60cm', marks: 1 },
    { q: 'Find the area of a square with side 14cm.', a: '196', work: '14×14=196cm²', marks: 1 },
    { q: 'Find the circumference of a circle with radius 10cm. (π=3.14)', a: '62.8', work: '2×3.14×10=62.8cm', marks: 2 }
  ],
  'volume': [
    { q: 'Find the volume of a cube with side 4cm.', a: '64', work: '4×4×4=64cm³', marks: 1 },
    { q: 'Find the volume of a cuboid 5cm by 3cm by 4cm.', a: '60', work: '5×3×4=60cm³', marks: 1 },
    { q: 'Convert 2000cm³ to litres.', a: '2', work: '2000÷1000=2L', marks: 1 },
    { q: 'A cuboid has volume 72cm³, length 6cm, width 4cm. Find its height.', a: '3', work: '72÷(6×4)=72÷24=3cm', marks: 2 },
    { q: 'Find the volume of a cube with side 5cm.', a: '125', work: '5×5×5=125cm³', marks: 1 },
    { q: 'Find the volume of a cuboid 8cm by 5cm by 3cm.', a: '120', work: '8×5×3=120cm³', marks: 1 },
    { q: 'Convert 3.5L to cm³.', a: '3500', work: '3.5×1000=3500cm³', marks: 1 },
    { q: 'A cuboid has volume 180cm³, length 6cm, height 5cm. Find its width.', a: '6', work: '180÷(6×5)=180÷30=6cm', marks: 2 },
    { q: 'Find the volume of a cube with side 6cm.', a: '216', work: '6×6×6=216cm³', marks: 1 },
    { q: 'Find the volume of a cuboid 10cm by 4cm by 3cm.', a: '120', work: '10×4×3=120cm³', marks: 1 },
    { q: 'Convert 4500cm³ to litres.', a: '4.5', work: '4500÷1000=4.5L', marks: 1 },
    { q: 'A cuboid has volume 240cm³, width 5cm, height 6cm. Find its length.', a: '8', work: '240÷(5×6)=240÷30=8cm', marks: 2 },
    { q: 'Find the volume of a cube with side 7cm.', a: '343', work: '7×7×7=343cm³', marks: 1 },
    { q: 'Find the volume of a cuboid 12cm by 6cm by 4cm.', a: '288', work: '12×6×4=288cm³', marks: 1 },
    { q: 'Convert 0.25L to cm³.', a: '250', work: '0.25×1000=250cm³', marks: 1 },
    { q: 'A cuboid has volume 150cm³, length 5cm, width 6cm. Find its height.', a: '5', work: '150÷(5×6)=150÷30=5cm', marks: 2 },
    { q: 'Find the volume of a cube with side 8cm.', a: '512', work: '8×8×8=512cm³', marks: 1 },
    { q: 'Find the volume of a cuboid 9cm by 7cm by 2cm.', a: '126', work: '9×7×2=126cm³', marks: 1 },
    { q: 'Convert 300cm³ to litres.', a: '0.3', work: '300÷1000=0.3L', marks: 1 },
    { q: 'A cuboid has volume 360cm³, length 9cm, height 5cm. Find its width.', a: '8', work: '360÷(9×5)=360÷45=8cm', marks: 2 },
    { q: 'Find the volume of a cube with side 9cm.', a: '729', work: '9×9×9=729cm³', marks: 1 },
    { q: 'Find the volume of a cuboid 15cm by 4cm by 3cm.', a: '180', work: '15×4×3=180cm³', marks: 1 },
    { q: 'Convert 2.75L to cm³.', a: '2750', work: '2.75×1000=2750cm³', marks: 1 },
    { q: 'A cuboid has volume 210cm³, length 7cm, width 5cm. Find its height.', a: '6', work: '210÷(7×5)=210÷35=6cm', marks: 2 },
    { q: 'Find the volume of a cube with side 10cm.', a: '1000', work: '10×10×10=1000cm³', marks: 1 }
  ],
  'angles': [
    { q: 'Find the angle supplementary to 65°.', a: '115', work: '180-65=115°', marks: 1 },
    { q: 'Find the angle complementary to 35°.', a: '55', work: '90-35=55°', marks: 1 },
    { q: 'A triangle has angles 40° and 60°. Find the third angle.', a: '80', work: '180-40-60=80°', marks: 1 },
    { q: 'Find the angle vertically opposite to 70°.', a: '70', work: 'Vertically opposite angles are equal', marks: 1 },
    { q: 'An isosceles triangle has one angle 40°. Find the other two angles if they are equal.', a: '70,70', work: '180-40=140, 140÷2=70°', marks: 2 },
    { q: 'Find the missing angle in a quadrilateral: 80°, 110°, 90°.', a: '80', work: '360-80-110-90=80°', marks: 2 },
    { q: 'Find the angle on a straight line with 55°.', a: '125', work: '180-55=125°', marks: 1 },
    { q: 'An equilateral triangle has each angle equal to?', a: '60', work: '180÷3=60°', marks: 1 },
    { q: 'Find the angle adjacent to 45° on a straight line.', a: '135', work: '180-45=135°', marks: 1 },
    { q: 'A triangle has angles 65° and 75°. Find the third angle.', a: '40', work: '180-65-75=40°', marks: 1 },
    { q: 'Find the angle vertically opposite to 120°.', a: '120', work: 'Vertically opposite angles are equal', marks: 1 },
    { q: 'An isosceles triangle has angles 50° and 50°. Find the third angle.', a: '80', work: '180-50-50=80°', marks: 2 },
    { q: 'Find the missing angle in a quadrilateral: 120°, 60°, 100°.', a: '80', work: '360-120-60-100=80°', marks: 2 },
    { q: 'Find the angle supplementary to 105°.', a: '75', work: '180-105=75°', marks: 1 },
    { q: 'Find the angle complementary to 12°.', a: '78', work: '90-12=78°', marks: 1 },
    { q: 'A triangle has angles 30° and 110°. Find the third angle.', a: '40', work: '180-30-110=40°', marks: 1 },
    { q: 'Find the angle on a straight line with 120°.', a: '60', work: '180-120=60°', marks: 1 },
    { q: 'An isosceles triangle has one angle 100°. Find the other two equal angles.', a: '40,40', work: '180-100=80, 80÷2=40°', marks: 2 },
    { q: 'Find the angle vertically opposite to 45°.', a: '45', work: 'Vertically opposite angles are equal', marks: 1 },
    { q: 'Find the missing angle in a quadrilateral: 90°, 90°, 100°.', a: '80', work: '360-90-90-100=80°', marks: 2 },
    { q: 'Find the angle supplementary to 80°.', a: '100', work: '180-80=100°', marks: 1 },
    { q: 'Find the angle complementary to 28°.', a: '62', work: '90-28=62°', marks: 1 },
    { q: 'A triangle has angles 55° and 65°. Find the third angle.', a: '60', work: '180-55-65=60°', marks: 1 },
    { q: 'Find the angle on a straight line with 75°.', a: '105', work: '180-75=105°', marks: 1 },
    { q: 'An equilateral triangle has all angles equal. What is each angle?', a: '60', work: '180÷3=60°', marks: 1 }
  ],
  'average': [
    { q: 'Find the average of 4, 6, 8, 10.', a: '7', work: '(4+6+8+10)÷4=28÷4=7', marks: 1 },
    { q: 'Find the average of 12, 15, 18, 21, 24.', a: '18', work: '(12+15+18+21+24)÷5=90÷5=18', marks: 1 },
    { q: 'The average of 3 numbers is 8. Two numbers are 6 and 9. Find the third number.', a: '9', work: '3×8=24, 24-6-9=9', marks: 2 },
    { q: 'Find the average of 100, 120, 140, 160.', a: '130', work: '(100+120+140+160)÷4=520÷4=130', marks: 1 },
    { q: 'The average of 5 numbers is 20. If one number is 30, what is the total of the other 4?', a: '70', work: '5×20=100, 100-30=70', marks: 2 },
    { q: 'Find the average of 8, 12, 16, 20, 24.', a: '16', work: '(8+12+16+20+24)÷5=80÷5=16', marks: 1 },
    { q: 'The average of 4 numbers is 12. Three numbers are 10, 14, 12. Find the fourth.', a: '12', work: '4×12=48, 48-10-14-12=12', marks: 2 },
    { q: 'Find the average of 25, 30, 35, 40, 45.', a: '35', work: '(25+30+35+40+45)÷5=175÷5=35', marks: 1 },
    { q: 'The average of 6 numbers is 15. Find the total.', a: '90', work: '6×15=90', marks: 1 },
    { q: 'Find the average of 50, 60, 70, 80.', a: '65', work: '(50+60+70+80)÷4=260÷4=65', marks: 1 },
    { q: 'The average of 5 numbers is 12. Two numbers are 8 and 10. Find the total of the other 3.', a: '42', work: '5×12=60, 60-8-10=42', marks: 2 },
    { q: 'Find the average of 2, 4, 6, 8, 10, 12.', a: '7', work: '(2+4+6+8+10+12)÷6=42÷6=7', marks: 1 },
    { q: 'The average of 4 numbers is 25. Three numbers are 20, 30, 22. Find the fourth.', a: '28', work: '4×25=100, 100-20-30-22=28', marks: 2 },
    { q: 'Find the average of 15, 25, 35, 45.', a: '30', work: '(15+25+35+45)÷4=120÷4=30', marks: 1 },
    { q: 'The average of 8 numbers is 18. Find the total.', a: '144', work: '8×18=144', marks: 1 },
    { q: 'Find the average of 7, 14, 21, 28, 35.', a: '21', work: '(7+14+21+28+35)÷5=105÷5=21', marks: 1 },
    { q: 'The average of 6 numbers is 20. If one number is 40, what is the total of the other 5?', a: '80', work: '6×20=120, 120-40=80', marks: 2 },
    { q: 'Find the average of 32, 36, 40, 44.', a: '38', work: '(32+36+40+44)÷4=152÷4=38', marks: 1 },
    { q: 'The average of 5 numbers is 16. Four numbers are 12, 18, 14, 20. Find the fifth.', a: '16', work: '5×16=80, 80-12-18-14-20=16', marks: 2 },
    { q: 'Find the average of 11, 22, 33, 44, 55.', a: '33', work: '(11+22+33+44+55)÷5=165÷5=33', marks: 1 },
    { q: 'The average of 3 numbers is 10. If two numbers are 8 and 11, find the third.', a: '11', work: '3×10=30, 30-8-11=11', marks: 2 },
    { q: 'Find the average of 28, 32, 36, 40.', a: '34', work: '(28+32+36+40)÷4=136÷4=34', marks: 1 },
    { q: 'The average of 10 numbers is 12. Find the total.', a: '120', work: '10×12=120', marks: 1 },
    { q: 'Find the average of 5, 15, 25, 35, 45.', a: '25', work: '(5+15+25+35+45)÷5=125÷5=25', marks: 1 },
    { q: 'The average of 4 numbers is 18. Three numbers are 15, 20, 16. Find the fourth.', a: '21', work: '4×18=72, 72-15-20-16=21', marks: 2 }
  ],
  'data-analysis': [
    { q: 'Find the mean of 3, 7, 8, 10, 12.', a: '8', work: '(3+7+8+10+12)÷5=40÷5=8', marks: 1 },
    { q: 'Find the median of 2, 5, 7, 9, 11.', a: '7', work: 'Middle number is 7', marks: 1 },
    { q: 'Find the mode of 2, 3, 3, 4, 5, 5, 5.', a: '5', work: '5 appears most often', marks: 1 },
    { q: 'Find the range of 12, 18, 25, 30, 35.', a: '23', work: '35-12=23', marks: 1 },
    { q: 'Find the mean of 15, 20, 25, 30, 35.', a: '25', work: '(15+20+25+30+35)÷5=125÷5=25', marks: 1 },
    { q: 'Find the median of 8, 12, 15, 18, 22.', a: '15', work: 'Middle number is 15', marks: 1 },
    { q: 'Find the mode of 4, 6, 6, 8, 8, 8, 10.', a: '8', work: '8 appears most often', marks: 1 },
    { q: 'Find the range of 5, 10, 15, 20, 25.', a: '20', work: '25-5=20', marks: 1 },
    { q: 'Find the mean of 6, 9, 12, 15, 18.', a: '12', work: '(6+9+12+15+18)÷5=60÷5=12', marks: 1 },
    { q: 'Find the median of 5, 8, 10, 14, 20.', a: '10', work: 'Middle number is 10', marks: 1 },
    { q: 'Find the mode of 1, 2, 2, 3, 3, 3, 4.', a: '3', work: '3 appears most often', marks: 1 },
    { q: 'Find the range of 22, 28, 35, 40, 50.', a: '28', work: '50-22=28', marks: 1 },
    { q: 'Find the mean of 24, 28, 32, 36, 40.', a: '32', work: '(24+28+32+36+40)÷5=160÷5=32', marks: 1 },
    { q: 'Find the median of 3, 6, 9, 12, 15, 18.', a: '10.5', work: 'Middle two numbers are 9 and 12, (9+12)÷2=10.5', marks: 2 },
    { q: 'Find the mode of 7, 9, 7, 10, 7, 8.', a: '7', work: '7 appears most often', marks: 1 },
    { q: 'Find the range of 45, 50, 55, 60, 65.', a: '20', work: '65-45=20', marks: 1 },
    { q: 'Find the mean of 10, 20, 30, 40, 50.', a: '30', work: '(10+20+30+40+50)÷5=150÷5=30', marks: 1 },
    { q: 'Find the median of 2, 4, 6, 8, 10, 12, 14.', a: '8', work: 'Middle number is 8', marks: 1 },
    { q: 'Find the mode of 5, 10, 10, 15, 15, 15, 20.', a: '15', work: '15 appears most often', marks: 1 },
    { q: 'Find the range of 8, 16, 24, 32, 40.', a: '32', work: '40-8=32', marks: 1 },
    { q: 'Find the mean of 18, 22, 26, 30, 34.', a: '26', work: '(18+22+26+30+34)÷5=130÷5=26', marks: 1 },
    { q: 'Find the median of 11, 13, 17, 19, 23.', a: '17', work: 'Middle number is 17', marks: 1 },
    { q: 'Find the mode of 3, 5, 5, 7, 7, 7, 9.', a: '7', work: '7 appears most often', marks: 1 },
    { q: 'Find the range of 100, 200, 300, 400, 500.', a: '400', work: '500-100=400', marks: 1 },
    { q: 'Find the mean of 14, 21, 28, 35, 42.', a: '28', work: '(14+21+28+35+42)÷5=140÷5=28', marks: 1 }
  ]
};

// 22 questions per mock paper
const MOCK_QUESTIONS = {
  A: [
    { q: 'What is the place value of 3 in 32,456?', a: 'ten-thousands', work: '3 is in the ten-thousands place', marks: 1 },
    { q: 'Calculate 25 + 18 × 2.', a: '61', work: '18×2=36, 25+36=61', marks: 2 },
    { q: 'Find the LCM of 4 and 6.', a: '12', work: '4=2², 6=2×3, LCM=2²×3=12', marks: 2 },
    { q: 'Simplify 12/18.', a: '2/3', work: 'Divide by 6', marks: 1 },
    { q: 'Add 2/5 + 1/3.', a: '11/15', work: 'LCM of 5 and 3 is 15: 6/15+5/15=11/15', marks: 2 },
    { q: 'Convert 0.6 to a fraction.', a: '3/5', work: '0.6=6/10=3/5', marks: 1 },
    { q: 'What is 30% of 200?', a: '60', work: '200×30÷100=60', marks: 1 },
    { q: 'A $80 item has 25% discount. Find the sale price.', a: '60', work: '80×25%=20, 80-20=60', marks: 2 },
    { q: 'Simplify 12:18.', a: '2:3', work: 'Divide by 6', marks: 1 },
    { q: 'Divide 45 in the ratio 2:3.', a: '18,27', work: 'Total parts=5, 45÷5=9, 2×9=18, 3×9=27', marks: 2 },
    { q: 'Simplify 3x + 4x.', a: '7x', work: '3+4=7', marks: 1 },
    { q: 'Solve 2x + 5 = 19.', a: '7', work: '2x=14, x=7', marks: 2 },
    { q: 'A car travels 240km in 4 hours. Find its speed.', a: '60', work: '240÷4=60km/h', marks: 1 },
    { q: 'Find the area of a rectangle 9cm by 6cm.', a: '54', work: '9×6=54cm²', marks: 1 },
    { q: 'Find the area of a triangle with base 12cm and height 5cm.', a: '30', work: '½×12×5=30cm²', marks: 2 },
    { q: 'Find the volume of a cuboid 6cm by 4cm by 3cm.', a: '72', work: '6×4×3=72cm³', marks: 1 },
    { q: 'Find the angle supplementary to 75°.', a: '105', work: '180-75=105°', marks: 1 },
    { q: 'A triangle has angles 50° and 70°. Find the third angle.', a: '60', work: '180-50-70=60°', marks: 1 },
    { q: 'Find the average of 6, 8, 10, 12, 14.', a: '10', work: '(6+8+10+12+14)÷5=50÷5=10', marks: 1 },
    { q: 'Find the median of 3, 5, 7, 9, 11.', a: '7', work: 'Middle number is 7', marks: 1 },
    { q: 'A shop sells a shirt for $45 after a 10% discount. Find the original price.', a: '50', work: '45÷0.9=50', marks: 2 },
    { q: 'Two numbers are in the ratio 3:5 and their sum is 64. Find the numbers.', a: '24,40', work: 'Total parts=8, 64÷8=8, 3×8=24, 5×8=40', marks: 2 }
  ],
  B: [
    { q: 'What is the value of 5³?', a: '125', work: '5×5×5=125', marks: 1 },
    { q: 'Calculate 48 ÷ 6 + 7.', a: '15', work: '48÷6=8, 8+7=15', marks: 2 },
    { q: 'Find the HCF of 18 and 27.', a: '9', work: '18=2×3², 27=3³, HCF=3²=9', marks: 2 },
    { q: 'Simplify 16/24.', a: '2/3', work: 'Divide by 8', marks: 1 },
    { q: 'Subtract 3/7 from 5/7.', a: '2/7', work: '5/7-3/7=2/7', marks: 1 },
    { q: 'Convert 0.75 to a fraction.', a: '3/4', work: '0.75=75/100=3/4', marks: 1 },
    { q: 'What is 45% of 80?', a: '36', work: '80×45÷100=36', marks: 1 },
    { q: 'Increase 120 by 15%.', a: '138', work: '120×15%=18, 120+18=138', marks: 2 },
    { q: 'Simplify 20:35.', a: '4:7', work: 'Divide by 5', marks: 1 },
    { q: 'A:B = 2:3, B:C = 4:5. Find A:C.', a: '8:15', work: 'A:B=2:3=8:12, B:C=4:5=12:15, so A:C=8:15', marks: 2 },
    { q: 'Simplify 4a + 3a.', a: '7a', work: '4+3=7', marks: 1 },
    { q: 'Solve 3x - 4 = 20.', a: '8', work: '3x=24, x=8', marks: 2 },
    { q: 'A train travels 300km at 75km/h. Find the time taken.', a: '4', work: '300÷75=4 hours', marks: 2 },
    { q: 'Find the perimeter of a rectangle 14cm by 8cm.', a: '44', work: '2(14+8)=44cm', marks: 1 },
    { q: 'Find the circumference of a circle with radius 7cm. (π=22/7)', a: '44', work: '2×22/7×7=44cm', marks: 2 },
    { q: 'Find the volume of a cube with side 6cm.', a: '216', work: '6×6×6=216cm³', marks: 1 },
    { q: 'Find the angle complementary to 40°.', a: '50', work: '90-40=50°', marks: 1 },
    { q: 'An isosceles triangle has angles 70° and 70°. Find the third angle.', a: '40', work: '180-70-70=40°', marks: 2 },
    { q: 'Find the average of 15, 20, 25, 30.', a: '22.5', work: '(15+20+25+30)÷4=90÷4=22.5', marks: 2 },
    { q: 'Find the mode of 4, 6, 6, 8, 8, 8, 10.', a: '8', work: '8 appears most often', marks: 1 },
    { q: 'A car travels at 60km/h for 2.5 hours. Find the distance.', a: '150', work: '60×2.5=150km', marks: 2 },
    { q: 'Find the range of 12, 18, 25, 30, 35.', a: '23', work: '35-12=23', marks: 1 }
  ],
  C: [
    { q: 'Find the square of 11.', a: '121', work: '11×11=121', marks: 1 },
    { q: 'Calculate 72 ÷ 8 + 6.', a: '15', work: '72÷8=9, 9+6=15', marks: 2 },
    { q: 'Find the LCM of 8 and 12.', a: '24', work: '8=2³, 12=2²×3, LCM=2³×3=24', marks: 2 },
    { q: 'Simplify 20/30.', a: '2/3', work: 'Divide by 10', marks: 1 },
    { q: 'Multiply 3/4 × 2/5.', a: '3/10', work: '3×2/4×5=6/20=3/10', marks: 2 },
    { q: 'Convert 0.125 to a fraction.', a: '1/8', work: '0.125=125/1000=1/8', marks: 2 },
    { q: 'What is 18% of 150?', a: '27', work: '150×18÷100=27', marks: 1 },
    { q: 'A $60 item has 20% discount. Find the sale price.', a: '48', work: '60×20%=12, 60-12=48', marks: 2 },
    { q: 'Simplify 30:45.', a: '2:3', work: 'Divide by 15', marks: 1 },
    { q: 'Divide 72 in the ratio 3:4:5.', a: '18,24,30', work: 'Total parts=12, 72÷12=6, 3×6=18, 4×6=24, 5×6=30', marks: 2 },
    { q: 'Simplify 5x - 2x.', a: '3x', work: '5-2=3', marks: 1 },
    { q: 'Evaluate 2x + 3 when x = 5.', a: '13', work: '2×5+3=10+3=13', marks: 1 },
    { q: 'A cyclist travels 90km in 3 hours. Find the speed in m/s.', a: '8.33', work: '90km=90000m, 3h=10800s, 90000÷10800=8.33m/s', marks: 2 },
    { q: 'Find the area of a square with side 9cm.', a: '81', work: '9×9=81cm²', marks: 1 },
    { q: 'Find the area of a circle with radius 3.5cm. (π=22/7)', a: '38.5', work: '22/7×3.5×3.5=38.5cm²', marks: 2 },
    { q: 'Convert 2.5L to cm³.', a: '2500', work: '2.5×1000=2500cm³', marks: 1 },
    { q: 'Find the angle on a straight line with 130°.', a: '50', work: '180-130=50°', marks: 1 },
    { q: 'A triangle has angles 35° and 85°. Find the third angle.', a: '60', work: '180-35-85=60°', marks: 1 },
    { q: 'The average of 5 numbers is 18. Find the total.', a: '90', work: '5×18=90', marks: 1 },
    { q: 'Find the median of 2, 4, 6, 8, 10.', a: '6', work: 'Middle number is 6', marks: 1 },
    { q: 'A person walks at 5km/h for 3 hours 30 minutes. Find the distance.', a: '17.5', work: '3h30m=3.5h, 5×3.5=17.5km', marks: 2 },
    { q: 'Find the range of 20, 30, 40, 50, 60.', a: '40', work: '60-20=40', marks: 1 }
  ],
  D: [
    { q: 'What is the cube root of 27?', a: '3', work: '3×3×3=27', marks: 1 },
    { q: 'Calculate 15 × 3 + 6.', a: '51', work: '15×3=45, 45+6=51', marks: 2 },
    { q: 'Find the HCF of 24 and 36.', a: '12', work: '24=2³×3, 36=2²×3², HCF=2²×3=12', marks: 2 },
    { q: 'Simplify 24/36.', a: '2/3', work: 'Divide by 12', marks: 1 },
    { q: 'Add 3/8 + 1/4.', a: '5/8', work: '1/4=2/8, 3/8+2/8=5/8', marks: 2 },
    { q: 'Convert 0.625 to a fraction.', a: '5/8', work: '0.625=625/1000=5/8', marks: 2 },
    { q: 'What is 60% of 90?', a: '54', work: '90×60÷100=54', marks: 1 },
    { q: 'Decrease 300 by 30%.', a: '210', work: '300×30%=90, 300-90=210', marks: 2 },
    { q: 'Simplify 18:24.', a: '3:4', work: 'Divide by 6', marks: 1 },
    { q: 'A:B = 3:4, B:C = 2:5. Find A:C.', a: '3:10', work: 'A:B=3:4, B:C=2:5=4:10, so A:C=3:10', marks: 2 },
    { q: 'Simplify 6x + 2x - 3x.', a: '5x', work: '6+2-3=5', marks: 2 },
    { q: 'Solve 4x + 3 = 27.', a: '6', work: '4x=24, x=6', marks: 2 },
    { q: 'A bus travels 180km in 2.5 hours. Find the speed.', a: '72', work: '180÷2.5=72km/h', marks: 2 },
    { q: 'Find the perimeter of a square with side 11cm.', a: '44', work: '4×11=44cm', marks: 1 },
    { q: 'Find the area of a parallelogram with base 8cm and height 6cm.', a: '48', work: '8×6=48cm²', marks: 2 },
    { q: 'Find the volume of a cuboid 8cm by 6cm by 5cm.', a: '240', work: '8×6×5=240cm³', marks: 1 },
    { q: 'Find the angle vertically opposite to 100°.', a: '100', work: 'Vertically opposite angles are equal', marks: 1 },
    { q: 'An equilateral triangle has each angle equal to?', a: '60', work: '180÷3=60°', marks: 1 },
    { q: 'Find the average of 8, 12, 16, 20.', a: '14', work: '(8+12+16+20)÷4=56÷4=14', marks: 1 },
    { q: 'Find the mode of 2, 4, 4, 6, 6, 6, 8.', a: '6', work: '6 appears most often', marks: 1 },
    { q: 'A train travels at 80km/h for 3 hours 15 minutes. Find the distance.', a: '260', work: '3h15m=3.25h, 80×3.25=260km', marks: 2 },
    { q: 'Find the range of 14, 22, 30, 38, 46.', a: '32', work: '46-14=32', marks: 1 }
  ],
  E: [
    { q: 'Find the square root of 144.', a: '12', work: '12×12=144', marks: 1 },
    { q: 'Calculate 84 ÷ 7 + 5.', a: '17', work: '84÷7=12, 12+5=17', marks: 2 },
    { q: 'Find the LCM of 9 and 15.', a: '45', work: '9=3², 15=3×5, LCM=3²×5=45', marks: 2 },
    { q: 'Simplify 27/45.', a: '3/5', work: 'Divide by 9', marks: 1 },
    { q: 'Divide 5/6 ÷ 2/3.', a: '5/4', work: '5/6×3/2=15/12=5/4', marks: 2 },
    { q: 'Convert 0.4 to a percentage.', a: '40', work: '0.4×100=40%', marks: 1 },
    { q: 'What is 25% of 240?', a: '60', work: '240×25÷100=60', marks: 1 },
    { q: 'A $150 item has 10% discount. Find the sale price.', a: '135', work: '150×10%=15, 150-15=135', marks: 2 },
    { q: 'Simplify 25:40.', a: '5:8', work: 'Divide by 5', marks: 1 },
    { q: 'Divide 96 in the ratio 3:5.', a: '36,60', work: 'Total parts=8, 96÷8=12, 3×12=36, 5×12=60', marks: 2 },
    { q: 'Expand 3(x + 4).', a: '3x+12', work: '3×x + 3×4 = 3x+12', marks: 2 },
    { q: 'Evaluate 3x - 2 when x = 6.', a: '16', work: '3×6-2=18-2=16', marks: 1 },
    { q: 'A plane flies 1200km in 2.5 hours. Find the speed.', a: '480', work: '1200÷2.5=480km/h', marks: 2 },
    { q: 'Find the area of a rectangle 16cm by 9cm.', a: '144', work: '16×9=144cm²', marks: 1 },
    { q: 'Find the circumference of a circle with diameter 21cm. (π=22/7)', a: '66', work: '22/7×21=66cm', marks: 2 },
    { q: 'Convert 400cm³ to litres.', a: '0.4', work: '400÷1000=0.4L', marks: 1 },
    { q: 'Find the angle supplementary to 125°.', a: '55', work: '180-125=55°', marks: 1 },
    { q: 'An isosceles triangle has one angle 120°. Find the other two angles.', a: '30,30', work: '180-120=60, 60÷2=30°', marks: 2 },
    { q: 'The average of 4 numbers is 15. Three numbers are 12, 16, 14. Find the fourth.', a: '18', work: '4×15=60, 60-12-16-14=18', marks: 2 },
    { q: 'Find the median of 5, 8, 10, 14, 18.', a: '10', work: 'Middle number is 10', marks: 1 },
    { q: 'A car travels at 55km/h for 3.6 hours. Find the distance.', a: '198', work: '55×3.6=198km', marks: 2 },
    { q: 'Find the range of 32, 40, 48, 56, 64.', a: '32', work: '64-32=32', marks: 1 }
  ]
};

// ============================================================
// BADGES
// ============================================================
const BADGES = [
  { id: 'first-step', category: 'Beginner', label: 'First Step', icon: '🌟', condition: s => s.totalAttempts >= 1 },
  { id: 'getting-going', category: 'Beginner', label: 'Getting Going', icon: '🚀', condition: s => s.totalAttempts >= 10 },
  { id: 'century', category: 'Volume', label: 'Century', icon: '💯', condition: s => s.totalAttempts >= 100 },
  { id: 'double-century', category: 'Volume', label: 'Double Century', icon: '🏆', condition: s => s.totalAttempts >= 200 },
  { id: 'sharp-shooter', category: 'Accuracy', label: 'Sharp Shooter', icon: '🎯', condition: s => s.totalAttempts >= 20 && s.totalAccuracy >= 0.8 },
  { id: 'perfectionist', category: 'Accuracy', label: 'Perfectionist', icon: '✨', condition: s => s.perfectStreak >= 10 },
  { id: 'explorer', category: 'Breadth', label: 'Explorer', icon: '🧭', condition: s => s.topicsPractised >= 5 },
  { id: 'all-rounder', category: 'Breadth', label: 'All-Rounder', icon: '🌍', condition: s => s.topicsPractised >= 12 },
  { id: 'master-class', category: 'Breadth', label: 'Master Class', icon: '🎓', condition: s => s.topicsMastered >= 6 },
  { id: 'number-ninja', category: 'Topic', label: 'Number Ninja', icon: '🥷', condition: s => s.topicMastery['whole-numbers'] >= 0.9 && s.topicAttempts['whole-numbers'] >= 15 },
  { id: 'fraction-hero', category: 'Topic', label: 'Fraction Hero', icon: '🦸', condition: s => s.topicMastery['fractions'] >= 0.9 && s.topicAttempts['fractions'] >= 15 },
  { id: 'percent-pro', category: 'Topic', label: 'Percent Pro', icon: '📊', condition: s => s.topicMastery['percentage'] >= 0.85 && s.topicAttempts['percentage'] >= 10 },
  { id: 'speed-demon', category: 'Topic', label: 'Speed Demon', icon: '⚡', condition: s => s.topicMastery['speed'] >= 0.85 && s.topicAttempts['speed'] >= 10 },
  { id: 'algebra-ace', category: 'Topic', label: 'Algebra Ace', icon: '🔢', condition: s => s.topicMastery['algebra'] >= 0.85 && s.topicAttempts['algebra'] >= 10 },
  { id: 'paper-debut', category: 'Exam', label: 'Paper Debut', icon: '📝', condition: s => s.mockPapersCompleted >= 1 },
  { id: 'exam-ready', category: 'Exam', label: 'Exam Ready', icon: '✅', condition: s => s.bestMockScore >= 75 },
  { id: 'psle-star', category: 'Exam', label: 'PSLE Star', icon: '⭐', condition: s => s.bestMockScore >= 90 },
  { id: 'exam-veteran', category: 'Exam', label: 'Exam Veteran', icon: '🎖️', condition: s => s.mockPapersCompleted >= 5 },
  { id: 'daily-habit', category: 'Streak', label: 'Daily Habit', icon: '📅', condition: s => s.streakDays >= 3 },
  { id: 'weekly-warrior', category: 'Streak', label: 'Weekly Warrior', icon: '⚔️', condition: s => s.streakDays >= 7 },
  { id: 'comeback-kid', category: 'Streak', label: 'Comeback Kid', icon: '🔄', condition: s => s.comebacks >= 1 }
];

// ============================================================
// STATE REDUCER
// ============================================================
const initialState = {
  onboarded: false,
  profile: { name: '', targetGrade: 'steady', weakTopics: [] },
  attempts: {},
  mastery: {},
  papers: {},
  badges: [],
  totalAttempts: 0,
  totalCorrect: 0,
  demoMode: false,
  topicsPractised: 0,
  topicsMastered: 0,
  perfectStreak: 0,
  bestMockScore: 0,
  mockPapersCompleted: 0,
  streakDays: 0,
  comebacks: 0,
  currentScreen: 'home',
  currentTopic: null,
  currentPaper: null,
  currentQuestionIndex: 0,
  showAnswer: false,
  examPhase: 'briefing',
  examTimeRemaining: EXAM_DURATION,
  examResults: null,
  tutorOpen: false,
  tutorQuestion: null,
  tutorHistory: [],
  notifications: []
};

function saveState(state) {
  try {
    localStorage.setItem('p6prep_v2', JSON.stringify(state));
  } catch (e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('p6prep_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...initialState, ...parsed };
    }
  } catch (e) {}
  return null;
}

function getUid() {
  try {
    let uid = localStorage.getItem('p6prep_uid');
    if (!uid) {
      uid = Math.random().toString(36).substring(2, 10);
      localStorage.setItem('p6prep_uid', uid);
    }
    return uid;
  } catch (e) {
    return 'guest' + Math.random().toString(36).substring(2, 6);
  }
}

function calculateDerivedStats(state) {
  const attempts = state.attempts || {};
  const mastery = state.mastery || {};
  const papers = state.papers || {};
  
  const totalAttempts = Object.values(attempts).reduce((sum, t) => sum + (t?.total || 0), 0);
  const totalCorrect = Object.values(attempts).reduce((sum, t) => sum + (t?.correct || 0), 0);
  const topicsPractised = Object.keys(attempts).filter(k => attempts[k]?.total > 0).length;
  const topicsMastered = Object.values(mastery).filter(m => m?.level >= 4).length;
  
  const allScores = Object.values(papers).flatMap(p => p.attempts?.map(a => a.score) || []);
  const bestMockScore = allScores.length ? Math.max(...allScores) : 0;
  const mockPapersCompleted = Object.values(papers).filter(p => p.attempts?.length > 0).length;
  
  let perfectStreak = 0;
  let currentStreak = 0;
  const allHistory = Object.values(attempts).flatMap(t => t.history || []);
  allHistory.sort((a, b) => new Date(b.ts) - new Date(a.ts));
  for (const h of allHistory) {
    if (h.correct) { currentStreak++; if (currentStreak > perfectStreak) perfectStreak = currentStreak; }
    else break;
  }
  
  const dates = new Set();
  allHistory.forEach(h => { try { dates.add(new Date(h.ts).toDateString()); } catch (e) {} });
  const streakDays = dates.size;
  
  let comebacks = 0;
  for (const tid in attempts) {
    const hist = attempts[tid].history || [];
    for (let i = 1; i < hist.length; i++) {
      if (!hist[i-1].correct && hist[i].correct) comebacks++;
    }
  }
  
  return { totalAttempts, totalCorrect, topicsPractised, topicsMastered, perfectStreak, bestMockScore, mockPapersCompleted, streakDays, comebacks };
}

function buildBadgeState(state) {
  const topicMastery = {};
  const topicAttempts = {};
  for (const tid in state.attempts) {
    const att = state.attempts[tid];
    topicMastery[tid] = att?.total > 0 ? att.correct / att.total : 0;
    topicAttempts[tid] = att?.total || 0;
  }
  return {
    totalAttempts: state.totalAttempts,
    totalAccuracy: state.totalAttempts > 0 ? state.totalCorrect / state.totalAttempts : 0,
    topicsPractised: state.topicsPractised,
    topicsMastered: state.topicsMastered,
    perfectStreak: state.perfectStreak || 0,
    topicMastery,
    topicAttempts,
    mockPapersCompleted: state.mockPapersCompleted,
    bestMockScore: state.bestMockScore,
    streakDays: state.streakDays || 0,
    comebacks: state.comebacks || 0
  };
}

function checkBadges(state, currentBadges) {
  const earned = [];
  const existing = new Set(currentBadges.map(b => b.id));
  const badgeState = buildBadgeState(state);
  for (const badge of BADGES) {
    if (!existing.has(badge.id) && badge.condition(badgeState)) {
      earned.push(badge);
    }
  }
  return earned;
}

function normaliseAnswer(raw) {
  if (raw === undefined || raw === null) return '';
  return raw.toString().toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .replace(/cm²/g, 'cm2')
    .replace(/m²/g, 'm2')
    .replace(/cm³/g, 'cm3')
    .replace(/°/g, 'deg')
    .replace(/×/g, 'x')
    .replace(/÷/g, '/')
    .trim();
}

function checkAnswer(student, correct) {
  const s = normaliseAnswer(student);
  const c = normaliseAnswer(correct);
  if (s === c) return true;
  const sNum = parseFloat(s);
  const cNum = parseFloat(c);
  if (!isNaN(sNum) && !isNaN(cNum) && Math.abs(sNum - cNum) < 0.05) return true;
  if (s.length > 0 && c.length > 0) {
    const regex = new RegExp('\\b' + c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
    if (regex.test(s)) return true;
  }
  return false;
}

function buildDemoState() {
  const attempts = {};
  const mastery = {};
  const topics = ['whole-numbers','fractions','decimals','percentage','ratio','algebra','speed','area-perimeter','volume'];
  const weakTopics = ['speed','percentage'];
  const strongTopics = ['algebra','whole-numbers'];
  
  topics.forEach(tid => {
    const total = 15 + Math.floor(Math.random() * 15);
    const accuracy = weakTopics.includes(tid) ? 0.3 + Math.random() * 0.2 : 
                     strongTopics.includes(tid) ? 0.85 + Math.random() * 0.1 : 
                     0.5 + Math.random() * 0.3;
    const correct = Math.round(total * accuracy);
    attempts[tid] = {
      correct,
      total,
      history: Array.from({ length: total }, (_, i) => ({
        q: `Question ${i+1}`,
        a: 'answer',
        selected: i < correct ? 'answer' : 'wrong',
        correct: i < correct,
        ts: new Date(Date.now() - (total - i) * 86400000).toISOString()
      }))
    };
    mastery[tid] = { level: accuracy >= 0.9 ? 4 : accuracy >= 0.75 ? 3 : accuracy >= 0.5 ? 2 : 1, accuracy };
  });
  
  const papers = {
    A: { attempts: [{ score: 77, correct: 17, total: 22, ts: new Date(Date.now() - 6*86400000).toISOString() }] },
    B: { attempts: [{ score: 50, correct: 11, total: 22, ts: new Date(Date.now() - 2*86400000).toISOString() }] }
  };
  
  const state = {
    ...initialState,
    onboarded: true,
    profile: { name: 'Alex', targetGrade: 'steady', weakTopics: ['speed', 'percentage'] },
    attempts,
    mastery,
    papers,
    badges: [],
    totalAttempts: Object.values(attempts).reduce((s, t) => s + (t?.total || 0), 0),
    totalCorrect: Object.values(attempts).reduce((s, t) => s + (t?.correct || 0), 0),
    topicsPractised: topics.length,
    topicsMastered: Object.values(mastery).filter(m => m?.level >= 4).length,
    perfectStreak: 5,
    bestMockScore: 77,
    mockPapersCompleted: 2,
    streakDays: 12,
    comebacks: 3,
    demoMode: true
  };
  return state;
}

function stateReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'INIT': {
      const saved = loadState();
      if (saved && saved.onboarded) {
        const derived = calculateDerivedStats(saved);
        newState = { ...saved, ...derived };
      } else {
        newState = { ...initialState, ...action.payload };
      }
      break;
    }
    case 'COMPLETE_ONBOARDING':
      newState = { ...state, onboarded: true, profile: { ...state.profile, ...action.payload } };
      break;
    case 'NAVIGATE':
      newState = { ...state, currentScreen: action.payload };
      break;
    case 'OPEN_TOPIC':
      newState = { ...state, currentScreen: 'topic', currentTopic: action.payload, currentQuestionIndex: 0, showAnswer: false };
      break;
    case 'OPEN_PAPER':
      newState = { ...state, currentScreen: 'paper', currentPaper: action.payload, currentQuestionIndex: 0, showAnswer: false };
      break;
    case 'START_EXAM':
      newState = { ...state, currentScreen: 'exam', currentPaper: action.payload, examPhase: 'briefing', examTimeRemaining: EXAM_DURATION, examResults: null, currentQuestionIndex: 0, showAnswer: false };
      break;
    case 'BEGIN_EXAM':
      newState = { ...state, examPhase: 'exam' };
      break;
    case 'EXAM_TICK': {
      const remaining = Math.max(0, state.examTimeRemaining - 1);
      newState = remaining === 0 ? { ...state, examTimeRemaining: 0, examPhase: 'results' } : { ...state, examTimeRemaining: remaining };
      break;
    }
    case 'SUBMIT_EXAM': {
      const paperId = state.currentPaper;
      const questions = MOCK_QUESTIONS[paperId] || [];
      const results = state.examResults || { correct: 0, total: questions.length, answers: [] };
      const score = Math.round((results.correct / results.total) * 100);
      const papers = { ...state.papers };
      if (!papers[paperId]) papers[paperId] = { attempts: [] };
      papers[paperId].attempts.push({ score, correct: results.correct, total: results.total, ts: new Date().toISOString() });
      const allScores = Object.values(papers).flatMap(p => p.attempts?.map(a => a.score) || []);
      const bestMockScore = allScores.length ? Math.max(...allScores) : 0;
      const mockPapersCompleted = Object.values(papers).filter(p => p.attempts?.length > 0).length;
      const newBadges = checkBadges({ ...state, papers, bestMockScore, mockPapersCompleted }, state.badges || []);
      newState = { ...state, papers, examResults: { ...results, score, paperId }, examPhase: 'results', bestMockScore, mockPapersCompleted, badges: [...(state.badges || []), ...newBadges] };
      break;
    }
    case 'EXAM_ANSWER': {
      const { qIndex, selected } = action.payload;
      const questions = MOCK_QUESTIONS[state.currentPaper] || [];
      const q = questions[qIndex];
      const isCorrect = checkAnswer(selected, q.a);
      const results = state.examResults || { correct: 0, total: questions.length, answers: [] };
      results.answers[qIndex] = { selected, correct: isCorrect };
      if (isCorrect) results.correct++;
      newState = { ...state, examResults: results, currentQuestionIndex: Math.min(qIndex + 1, questions.length) };
      break;
    }
    case 'ANSWER_QUESTION': {
      const { topicId, qIndex, selected } = action.payload;
      const questions = TOPIC_QUESTIONS[topicId] || [];
      const q = questions[qIndex];
      if (!q) return state;
      const isCorrect = checkAnswer(selected, q.a);
      const attempts = { ...state.attempts };
      if (!attempts[topicId]) attempts[topicId] = { correct: 0, total: 0, history: [] };
      attempts[topicId].total++;
      if (isCorrect) attempts[topicId].correct++;
      attempts[topicId].history.push({ q: q.q, a: q.a, selected, correct: isCorrect, ts: new Date().toISOString() });
      const mastery = { ...state.mastery };
      const accuracy = attempts[topicId].total > 0 ? attempts[topicId].correct / attempts[topicId].total : 0;
      let level = 0;
      if (accuracy >= 0.9) level = 4;
      else if (accuracy >= 0.75) level = 3;
      else if (accuracy >= 0.5) level = 2;
      else if (attempts[topicId].total > 0) level = 1;
      mastery[topicId] = { level, accuracy };
      const totalAttempts = Object.values(attempts).reduce((sum, t) => sum + (t?.total || 0), 0);
      const totalCorrect = Object.values(attempts).reduce((sum, t) => sum + (t?.correct || 0), 0);
      const topicsPractised = Object.keys(attempts).filter(k => attempts[k]?.total > 0).length;
      const topicsMastered = Object.values(mastery).filter(m => m?.level >= 4).length;
      const perfectStreak = isCorrect ? (state.perfectStreak || 0) + 1 : 0;
      let comebacks = state.comebacks || 0;
      const lastHistory = attempts[topicId].history;
      if (lastHistory.length >= 2 && !lastHistory[lastHistory.length-2].correct && isCorrect) comebacks++;
      const newBadges = checkBadges({ ...state, attempts, mastery, totalAttempts, totalCorrect, topicsPractised, topicsMastered, perfectStreak, comebacks }, state.badges || []);
      newState = { ...state, attempts, mastery, totalAttempts, totalCorrect, topicsPractised, topicsMastered, perfectStreak, comebacks, badges: [...(state.badges || []), ...newBadges], showAnswer: true };
      break;
    }
    case 'NEXT_QUESTION': {
      const { topicId } = action.payload;
      const questions = TOPIC_QUESTIONS[topicId] || [];
      const nextIdx = state.currentQuestionIndex + 1;
      if (nextIdx >= questions.length) {
        newState = { ...state, currentScreen: 'topic', currentQuestionIndex: 0, showAnswer: false };
      } else {
        newState = { ...state, currentQuestionIndex: nextIdx, showAnswer: false };
      }
      break;
    }
    case 'NEXT_EXAM_QUESTION': {
      const questions = MOCK_QUESTIONS[state.currentPaper] || [];
      const nextIdx = state.currentQuestionIndex + 1;
      if (nextIdx >= questions.length) {
        const results = state.examResults || { correct: 0, total: questions.length, answers: [] };
        for (let i = 0; i < questions.length; i++) {
          if (!results.answers[i]) results.answers[i] = { selected: '', correct: false };
        }
        newState = { ...state, examResults: results };
        return stateReducer(newState, { type: 'SUBMIT_EXAM' });
      } else {
        newState = { ...state, currentQuestionIndex: nextIdx };
      }
      break;
    }
    case 'TOGGLE_TUTOR':
      newState = { ...state, tutorOpen: !state.tutorOpen };
      break;
    case 'SET_TUTOR_QUESTION':
      newState = { ...state, tutorQuestion: action.payload, tutorHistory: [] };
      break;
    case 'ADD_TUTOR_MESSAGE':
      newState = { ...state, tutorHistory: [...state.tutorHistory, action.payload] };
      break;
    case 'CLEAR_TUTOR':
      newState = { ...state, tutorOpen: false, tutorQuestion: null, tutorHistory: [] };
      break;
    case 'LOAD_DEMO': {
      const demoState = buildDemoState();
      newState = { ...demoState, demoMode: true };
      break;
    }
    case 'CLEAR_DEMO':
      newState = { ...initialState, onboarded: true };
      break;
    case 'IMPORT_STATE':
      newState = { ...action.payload, demoMode: false };
      break;
    case 'RESET_ALL':
      if (window.confirm('Are you sure you want to reset all progress?')) {
        newState = { ...initialState, onboarded: true };
      } else {
        return state;
      }
      break;
    default:
      return state;
  }
  saveState(newState);
  return newState;
}

// ============================================================
// REACT COMPONENTS
// ============================================================
const AppContext = createContext();

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [state, dispatch] = useReducer(stateReducer, null, () => {
    const saved = loadState();
    if (saved && saved.onboarded) {
      const derived = calculateDerivedStats(saved);
      return { ...saved, ...derived };
    }
    return { ...initialState };
  });
  
  const uid = useMemo(() => getUid(), []);
  
  useEffect(() => {
    if (!localStorage.getItem('p6prep_uid')) {
      localStorage.setItem('p6prep_uid', uid);
    }
  }, [uid]);
  
  const value = { state, dispatch, uid, TOPICS, MOCK_PAPERS, TOPIC_QUESTIONS, MOCK_QUESTIONS, BADGES, PSLE_SCHEDULE, EXAM_DURATION, checkAnswer, normaliseAnswer, TOPIC_COLORS };
  
  return (
    <AppContext.Provider value={value}>
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#07090F', color: '#F2F4FF', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {!state.onboarded ? <OnboardingFlow /> : <MainApp />}
      </div>
    </AppContext.Provider>
  );
}

// ============================================================
// ONBOARDING FLOW
// ============================================================
function OnboardingFlow() {
  const { dispatch } = useContext(AppContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [targetGrade, setTargetGrade] = useState('steady');
  const [weakTopics, setWeakTopics] = useState([]);
  
  const steps = ['welcome', 'name', 'target', 'weak'];
  
  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: { name, targetGrade, weakTopics } });
  };
  
  const toggleWeakTopic = (tid) => {
    setWeakTopics(prev => prev.includes(tid) ? prev.filter(t => t !== tid) : [...prev, tid]);
  };
  
  const renderStep = () => {
    switch (steps[step]) {
      case 'welcome':
        return (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📐</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>P6 Maths Prep</h1>
            <p style={{ color: '#6B7490', fontSize: 16 }}>Singapore PSLE 2026</p>
            <div style={{ marginTop: 24, background: '#131720', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, color: '#6B7490' }}>Next exam</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#BE2EDD' }}>Mathematics • Fri 25 Sep 2026</div>
              <div style={{ fontSize: 14, color: '#6B7490', marginTop: 4 }}>
                {Math.ceil((new Date('2026-09-25') - new Date()) / (1000 * 60 * 60 * 24))} days to go
              </div>
            </div>
            <button onClick={() => setStep(1)} style={{ marginTop: 32, background: '#4F7DFF', border: 'none', color: '#fff', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              Get Started →
            </button>
          </div>
        );
      case 'name':
        return (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>What's your name?</h2>
            <p style={{ color: '#6B7490', fontSize: 14 }}>This will appear on your dashboard</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value.slice(0, 20))} placeholder="Enter your name" style={{ marginTop: 24, padding: '14px 20px', borderRadius: 12, border: '2px solid #2A3140', background: '#0E1118', color: '#F2F4FF', fontSize: 18, width: '100%', outline: 'none' }} autoFocus onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(2)} />
            <button onClick={() => name.trim() && setStep(2)} disabled={!name.trim()} style={{ marginTop: 24, background: name.trim() ? '#4F7DFF' : '#2A3140', border: 'none', color: '#fff', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'default', width: '100%' }}>
              Continue →
            </button>
          </div>
        );
      case 'target':
        return (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>What's your target grade?</h2>
            <p style={{ color: '#6B7490', fontSize: 14 }}>This sets your daily study intensity</p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { id: 'intensive', label: 'A*', sub: '20 questions/day • Intensive', color: '#BE2EDD' },
                { id: 'steady', label: 'A', sub: '12 questions/day • Steady', color: '#4F7DFF' },
                { id: 'relaxed', label: 'B/C', sub: '8 questions/day • Relaxed', color: '#22A6B3' }
              ].map(opt => (
                <button key={opt.id} onClick={() => setTargetGrade(opt.id)} style={{ padding: '16px 20px', borderRadius: 12, border: targetGrade === opt.id ? `2px solid ${opt.color}` : '2px solid #2A3140', background: targetGrade === opt.id ? 'rgba(79,125,255,0.1)' : '#0E1118', color: '#F2F4FF', fontSize: 16, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: '#6B7490' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} style={{ marginTop: 24, background: '#4F7DFF', border: 'none', color: '#fff', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
              Continue →
            </button>
          </div>
        );
      case 'weak':
        return (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Which topics need extra focus?</h2>
            <p style={{ color: '#6B7490', fontSize: 14 }}>Select topics you find challenging</p>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
              {TOPICS.map(t => (
                <button key={t.id} onClick={() => toggleWeakTopic(t.id)} style={{ padding: '10px 12px', borderRadius: 8, border: weakTopics.includes(t.id) ? `2px solid ${t.color}` : '2px solid #2A3140', background: weakTopics.includes(t.id) ? 'rgba(79,125,255,0.1)' : '#0E1118', color: '#F2F4FF', fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
                  <span style={{ color: t.color }}>●</span> {t.label}
                </button>
              ))}
            </div>
            <p style={{ color: '#6B7490', fontSize: 12, marginTop: 12 }}>Selected: {weakTopics.length} topics</p>
            <button onClick={handleComplete} style={{ marginTop: 16, background: '#4F7DFF', border: 'none', color: '#fff', padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
              Start Learning! 🚀
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%' }}>
        {renderStep()}
        <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {steps.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === step ? '#4F7DFF' : '#2A3140' }} />)}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function MainApp() {
  const { state, dispatch } = useContext(AppContext);
  
  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'home': return <HomeScreen />;
      case 'topic': return <TopicScreen />;
      case 'paper': return <PaperScreen />;
      case 'exam': return <ExamScreen />;
      case 'mocks': return <MocksScreen />;
      case 'plans': return <PlansScreen />;
      case 'stats': return <StatsScreen />;
      case 'badges': return <BadgesScreen />;
      case 'leaderboard': return <LeaderboardScreen />;
      default: return <HomeScreen />;
    }
  };
  
  return (
    <div style={{ paddingBottom: 80 }}>
      {state.demoMode && (
        <div style={{ background: '#4F7DFF', padding: '8px 16px', textAlign: 'center', fontSize: 13, fontWeight: 500 }}>
          🧪 Demo Mode • <button onClick={() => dispatch({ type: 'CLEAR_DEMO' })} style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer' }}>Clear Demo</button>
        </div>
      )}
      {renderScreen()}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', maxWidth: 480, width: '100%', background: '#0E1118', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', padding: '8px 0', paddingBottom: 'env(safe-area-inset-bottom, 8px)', zIndex: 100 }}>
        {[
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'mocks', label: 'Mocks', icon: '📝' },
          { id: 'stats', label: 'Stats', icon: '📊' },
          { id: 'badges', label: 'Badges', icon: '🏅' },
          { id: 'plans', label: 'Plans', icon: '⭐' }
        ].map(item => (
          <button key={item.id} onClick={() => dispatch({ type: 'NAVIGATE', payload: item.id })} style={{ flex: 1, background: 'none', border: 'none', color: state.currentScreen === item.id ? '#4F7DFF' : '#6B7490', fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', padding: '4px 0' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HOME SCREEN
// ============================================================
function HomeScreen() {
  const { state, dispatch, TOPICS, PSLE_SCHEDULE, TOPIC_COLORS } = useContext(AppContext);
  
  const mathsDate = new Date('2026-09-25');
  const now = new Date();
  const daysToMaths = Math.ceil((mathsDate - now) / (1000 * 60 * 60 * 24));
  const nextSubject = PSLE_SCHEDULE.find(s => new Date(s.date) > now) || PSLE_SCHEDULE[0];
  const daysToNext = Math.ceil((new Date(nextSubject.date) - now) / (1000 * 60 * 60 * 24));
  const stats = {
    accuracy: state.totalAttempts > 0 ? Math.round((state.totalCorrect / state.totalAttempts) * 100) : 0,
    questions: state.totalAttempts,
    topicsMastered: state.topicsMastered || 0,
    totalTopics: TOPICS.length
  };
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>P6 Maths Prep</h1>
          <p style={{ color: '#6B7490', fontSize: 14 }}>Welcome back, {state.profile.name || 'Student'}!</p>
        </div>
        <button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'leaderboard' })} style={{ background: '#131720', border: 'none', color: '#F2F4FF', padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
          🏆 Rank
        </button>
      </div>
      
      <div style={{ background: '#131720', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#6B7490' }}>PSLE Maths 2026</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#BE2EDD' }}>{daysToMaths} days</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#6B7490' }}>Next: {nextSubject.subject}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: nextSubject.color }}>{daysToNext} days</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        <div style={{ background: '#131720', borderRadius: 12, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#4F7DFF' }}>{stats.accuracy}%</div>
          <div style={{ fontSize: 12, color: '#6B7490' }}>Accuracy</div>
        </div>
        <div style={{ background: '#131720', borderRadius: 12, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#6AB04C' }}>{stats.questions}</div>
          <div style={{ fontSize: 12, color: '#6B7490' }}>Questions</div>
        </div>
        <div style={{ background: '#131720', borderRadius: 12, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#F9CA24' }}>{stats.topicsMastered}/{stats.totalTopics}</div>
          <div style={{ fontSize: 12, color: '#6B7490' }}>Mastered</div>
        </div>
      </div>
      
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Topics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {TOPICS.map(topic => {
          const mastery = state.mastery?.[topic.id];
          const level = mastery?.level || 0;
          const progress = mastery?.accuracy || 0;
          const attempts = state.attempts?.[topic.id]?.total || 0;
          let label = 'Not started', color = '#2A3140';
          if (level >= 4) { label = 'Mastered'; color = '#6AB04C'; }
          else if (level >= 3) { label = 'Good'; color = '#4F7DFF'; }
          else if (level >= 2) { label = 'Practising'; color = '#F9CA24'; }
          else if (level >= 1) { label = 'Learning'; color = '#FF9F43'; }
          return (
            <button key={topic.id} onClick={() => dispatch({ type: 'OPEN_TOPIC', payload: topic.id })} style={{ background: '#131720', border: '2px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = TOPIC_COLORS[topic.id] || '#4F7DFF'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
              <div style={{ display: 'flex', alcurrentIdx = state.currentQuestionIndex || 0;
  const currentQ = questions[currentIdx];
  const [selected, setSelected] = useState('');
  const [answered, setAnswered] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  
  const mastery = state.mastery?.[topicId];
  const attempts = state.attempts?.[topicId];
  
  useEffect(() => { setSelected(''); setAnswered(false); setShowWork(false); setIsCorrect(null); }, [currentIdx]);
  
  const handleSubmit = () => {
    if (!selected || answered) return;
    const correct = checkAnswer(selected, currentQ.a);
    setIsCorrect(correct);
    setAnswered(true);
    dispatch({ type: 'ANSWER_QUESTION', payload: { topicId, qIndex: currentIdx, selected } });
  };
  
  const handleNext = () => { dispatch({ type: 'NEXT_QUESTION', payload: { topicId } }); };
  
  const handleTutor = () => {
    dispatch({ type: 'SET_TUTOR_QUESTION', payload: { topic: topicId, question: currentQ.q, correct: currentQ.a, work: currentQ.work, studentAnswer: selected } });
    dispatch({ type: 'TOGGLE_TUTOR' });
  };
  
  if (!topic || !currentQ) {
    return <div style={{ padding: 40, textAlign: 'center' }}><p>Topic not found</p><button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'home' })} style={{ background: '#4F7DFF', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}>Go Home</button></div>;
  }
  
  const progress = ((currentIdx + 1) / questions.length * 100);
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'home' })} style={{ background: 'none', border: 'none', color: '#6B7490', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div><div style={{ fontSize: 14, color: '#6B7490' }}>Topic</div><div style={{ fontSize: 20, fontWeight: 600 }}>{topic.label}</div></div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 13, color: '#6B7490' }}>
          {currentIdx + 1}/{questions.length}
          <div style={{ fontSize: 12, color: mastery?.level >= 4 ? '#6AB04C' : '#6B7490' }}>
            {mastery?.level >= 4 ? '✅ Mastered' : mastery?.level >= 3 ? 'Good' : mastery?.level >= 2 ? 'Practising' : mastery?.level >= 1 ? 'Learning' : 'Not started'}
          </div>
        </div>
      </div>
      
      <div style={{ height: 3, background: '#2A3140', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#4F7DFF', borderRadius: 2 }} />
      </div>
      
      <div style={{ background: '#131720', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#6B7490', marginBottom: 8 }}>Question {currentIdx + 1} ({currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''})</div>
        <div style={{ fontSize: 18, lineHeight: 1.6 }}>{currentQ.q}</div>
        
        {!answered ? (
          <div style={{ marginTop: 16 }}>
            <input type="text" value={selected} onChange={(e) => setSelected(e.target.value)} placeholder="Type your answer..." style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid #2A3140', background: '#0E1118', color: '#F2F4FF', fontSize: 16, outline: 'none' }} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} autoFocus />
            <button onClick={handleSubmit} disabled={!selected} style={{ marginTop: 12, width: '100%', background: selected ? '#4F7DFF' : '#2A3140', border: 'none', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: selected ? 'pointer' : 'default' }}>Check Answer</button>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: isCorrect ? 'rgba(106,176,76,0.15)' : 'rgba(235,77,75,0.15)', border: isCorrect ? '1px solid rgba(106,176,76,0.3)' : '1px solid rgba(235,77,75,0.3)' }}>
              <span style={{ fontSize: 24 }}>{isCorrect ? '✅' : '❌'}</span>
              <div><div style={{ fontSize: 14 }}>Your answer: {selected}</div>{!isCorrect && <div style={{ fontSize: 14, color: '#6AB04C' }}>Correct: {currentQ.a}</div>}</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setShowWork(!showWork)} style={{ background: 'none', border: 'none', color: '#4F7DFF', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>{showWork ? 'Hide' : 'Show'} Working</button>
              {showWork && <div style={{ marginTop: 8, padding: '12px 16px', background: '#0E1118', borderRadius: 8, fontSize: 14, color: '#6B7490', lineHeight: 1.6 }}>{currentQ.work}</div>}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {!isCorrect && <button onClick={handleTutor} style={{ flex: 1, background: '#BE2EDD', border: 'none', color: '#fff', padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>🤖 AI Tutor</button>}
              <button onClick={handleNext} style={{ flex: 1, background: '#4F7DFF', border: 'none', color: '#fff', padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{currentIdx + 1 >= questions.length ? 'Finish →' : 'Next →'}</button>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 10, fontSize: 13, color: '#6B7490' }}>
        <span>Accuracy: {attempts?.total > 0 ? Math.round((attempts.correct / attempts.total) * 100) : 0}%</span>
        <span>•</span>
        <span>{attempts?.total || 0} questions</span>
      </div>
      
      {state.tutorOpen && <AITutorModal />}
    </div>
  );
}

// ============================================================
// AI TUTOR MODAL (FREE VERSION - No API, uses rule-based responses)
// ============================================================
function AITutorModal() {
  const { state, dispatch } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const question = state.tutorQuestion;
  
  useEffect(() => {
    if (question) {
      setMessages([{ role: 'assistant', content: `I'll help you with this question:\n\n"${question.question}"\n\nHere's the working:\n${question.work}\n\nWhat part would you like me to explain?` }]);
    }
  }, [question]);
  
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);
  
  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    // Simple rule-based responses
    let reply = "Let's look at this step by step:\n";
    const work = question?.work || '';
    const steps = work.split(',').filter(s => s.trim().length > 0);
    
    if (steps.length > 0) {
      reply += steps.map((s, i) => `${i+1}. ${s.trim()}`).join('\n');
    } else {
      reply += "1. Read the question carefully.\n2. Identify what you need to find.\n3. Use the correct formula or method.\n4. Show your working clearly.";
    }
    
    if (userMsg.toLowerCase().includes('why') || userMsg.toLowerCase().includes('explain')) {
      reply += "\n\n💡 The key is to understand WHY each step is done, not just the answer.";
    }
    if (userMsg.toLowerCase().includes('formula') || userMsg.toLowerCase().includes('method')) {
      reply += "\n\n📐 Always write down the formula first before substituting values.";
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 500);
  };
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: '#0E1118', borderRadius: 20, maxWidth: 480, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><span style={{ fontSize: 18, marginRight: 8 }}>🤖</span><span style={{ fontSize: 16, fontWeight: 600 }}>AI Tutor (Free)</span></div>
          <button onClick={() => dispatch({ type: 'TOGGLE_TUTOR' })} style={{ background: 'none', border: 'none', color: '#6B7490', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '12px 20px', background: '#131720', fontSize: 13, color: '#6B7490', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <strong>Q:</strong> {question?.question}
        </div>
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', maxHeight: 400 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: 12, background: msg.role === 'user' ? '#4F7DFF' : '#131720', color: msg.role === 'user' ? '#fff' : '#F2F4FF', fontSize: 14, lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask a question..." style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '2px solid #2A3140', background: '#07090F', color: '#F2F4FF', fontSize: 14, outline: 'none' }} />
          <button onClick={sendMessage} disabled={!input.trim()} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: input.trim() ? '#4F7DFF' : '#2A3140', color: '#fff', fontSize: 14, fontWeight: 600, cursor: input.trim() ? 'pointer' : 'default' }}>Send</button>
        </div>
        <div style={{ padding: '8px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 11, color: '#6B7490', textAlign: 'center' }}>
          💡 Free AI Tutor - Explains based on worked solutions
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MOCKS SCREEN
// ============================================================
function MocksScreen() {
  const { state, dispatch, MOCK_PAPERS } = useContext(AppContext);
  
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Mock Papers</h1>
      <p style={{ color: '#6B7490', fontSize: 14, marginBottom: 20 }}>PSLE-style practice exams - All FREE!</p>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {MOCK_PAPERS.map(p => {
          const attempts = state.papers?.[p.id]?.attempts || [];
          const bestScore = attempts.length ? Math.max(...attempts.map(a => a.score)) : 0;
          
          return (
            <div key={p.id} style={{ flex: '1 1 calc(50% - 10px)', minWidth: 140, background: '#131720', borderRadius: 12, padding: 16, border: '2px solid rgba(79,125,255,0.2)' }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{p.label}</div>
              {attempts.length > 0 && <div style={{ fontSize: 13, color: '#6B7490' }}>Best: {bestScore}% • {attempts.length} attempt{attempts.length > 1 ? 's' : ''}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => dispatch({ type: 'OPEN_PAPER', payload: p.id })} style={{ flex: 1, background: '#2A3140', border: 'none', color: '#F2F4FF', padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Practice</button>
                <button onClick={() => dispatch({ type: 'START_EXAM', payload: p.id })} style={{ flex: 1, background: '#BE2EDD', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Exam</button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ background: '#131720', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <div style={{ fontSize: 14, color: '#6AB04C' }}>✅ All 5 mock papers are FREE!</div>
        <div style={{ fontSize: 13, color: '#6B7490' }}>Practice mode with hints • Exam mode with 44-min timer</div>
      </div>
    </div>
  );
}

// ============================================================
// PAPER SCREEN (Practice Mode)
// ============================================================
function PaperScreen() {
  const { state, dispatch, MOCK_QUESTIONS, checkAnswer } = useContext(AppContext);
  const paperId = state.currentPaper;
  const questions = MOCK_QUESTIONS[paperId] || [];
  const currentIdx = state.currentQuestionIndex || 0;
  const currentQ = questions[currentIdx];
  const [selected, setSelected] = useState('');
  const [answered, setAnswered] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  
  useEffect(() => { setSelected(''); setAnswered(false); setShowWork(false); setIsCorrect(null); }, [currentIdx]);
  
  const handleSubmit = () => {
    if (!selected || answered) return;
    const correct = checkAnswer(selected, currentQ.a);
    setIsCorrect(correct);
    setAnswered(true);
    if (correct) setScore(prev => prev + 1);
  };
  
  const goToNext = () => {
    if (currentIdx + 1 >= questions.length) {
      dispatch({ type: 'NAVIGATE', payload: 'mocks' });
    } else {
      state.currentQuestionIndex = currentIdx + 1;
      dispatch({ type: 'NAVIGATE', payload: 'paper' });
    }
  };
  
  if (!currentQ) {
    return <div style={{ padding: 40, textAlign: 'center' }}><p>No questions found</p><button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'mocks' })} style={{ background: '#4F7DFF', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}>Back</button></div>;
  }
  
  const progress = ((currentIdx + 1) / questions.length * 100);
  const paperLabel = paperId ? `Mock Paper ${paperId}` : 'Practice';
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'mocks' })} style={{ background: 'none', border: 'none', color: '#6B7490', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div><div style={{ fontSize: 14, color: '#6B7490' }}>{paperLabel}</div><div style={{ fontSize: 20, fontWeight: 600 }}>Practice Mode</div></div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 13, color: '#6B7490' }}>{currentIdx + 1}/{questions.length}<div style={{ fontSize: 12 }}>Score: {score}/{currentIdx + (isCorrect ? 1 : 0)}</div></div>
      </div>
      
      <div style={{ height: 3, background: '#2A3140', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#4F7DFF', borderRadius: 2 }} />
      </div>
      
      <div style={{ background: '#131720', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#6B7490', marginBottom: 8 }}>Question {currentIdx + 1} ({currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''})</div>
        <div style={{ fontSize: 18, lineHeight: 1.6 }}>{currentQ.q}</div>
        
        {!answered ? (
          <div style={{ marginTop: 16 }}>
            <input type="text" value={selected} onChange={(e) => setSelected(e.target.value)} placeholder="Type your answer..." style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid #2A3140', background: '#0E1118', color: '#F2F4FF', fontSize: 16, outline: 'none' }} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} autoFocus />
            <button onClick={handleSubmit} disabled={!selected} style={{ marginTop: 12, width: '100%', background: selected ? '#4F7DFF' : '#2A3140', border: 'none', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: selected ? 'pointer' : 'default' }}>Check Answer</button>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: isCorrect ? 'rgba(106,176,76,0.15)' : 'rgba(235,77,75,0.15)', border: isCorrect ? '1px solid rgba(106,176,76,0.3)' : '1px solid rgba(235,77,75,0.3)' }}>
              <span style={{ fontSize: 24 }}>{isCorrect ? '✅' : '❌'}</span>
              <div><div style={{ fontSize: 14 }}>Your answer: {selected}</div>{!isCorrect && <div style={{ fontSize: 14, color: '#6AB04C' }}>Correct: {currentQ.a}</div>}</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => setShowWork(!showWork)} style={{ background: 'none', border: 'none', color: '#4F7DFF', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>{showWork ? 'Hide' : 'Show'} Working</button>
              {showWork && <div style={{ marginTop: 8, padding: '12px 16px', background: '#0E1118', borderRadius: 8, fontSize: 14, color: '#6B7490', lineHeight: 1.6 }}>{currentQ.work}</div>}
            </div>
            <button onClick={goToNext} style={{ marginTop: 16, width: '100%', background: '#4F7DFF', border: 'none', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              {currentIdx + 1 >= questions.length ? 'Finish Practice' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EXAM SCREEN
// ============================================================
function ExamScreen() {
  const { state, dispatch, MOCK_QUESTIONS, checkAnswer } = useContext(AppContext);
  const paperId = state.currentPaper;
  const questions = MOCK_QUESTIONS[paperId] || [];
  const [selected, setSelected] = useState('');
  const [answered, setAnswered] = useState(false);
  const [timerId, setTimerId] = useState(null);
  
  const phase = state.examPhase || 'briefing';
  const timeRemaining = state.examTimeRemaining || EXAM_DURATION;
  const currentIdx = state.currentQuestionIndex || 0;
  const currentQ = questions[currentIdx];
  const results = state.examResults;
  
  useEffect(() => {
    if (phase === 'exam' && !timerId) {
      const id = setInterval(() => dispatch({ type: 'EXAM_TICK' }), 1000);
      setTimerId(id);
    }
    return () => { if (timerId) clearInterval(timerId); };
  }, [phase]);
  
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  
  const handleAnswer = () => {
    if (!selected || answered) return;
    dispatch({ type: 'EXAM_ANSWER', payload: { qIndex: currentIdx, selected } });
    setAnswered(true);
    setSelected('');
  };
  
  const handleNext = () => {
    dispatch({ type: 'NEXT_EXAM_QUESTION' });
    setAnswered(false);
    setSelected('');
  };
  
  const handleSubmitExam = () => dispatch({ type: 'SUBMIT_EXAM' });
  
  if (phase === 'briefing') {
    return (
      <div style={{ padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Mock Exam</h1>
        <p style={{ color: '#6B7490', fontSize: 16 }}>{paperId ? `Paper ${paperId}` : ''}</p>
        <div style={{ marginTop: 24, background: '#131720', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><span style={{ color: '#6B7490' }}>Questions</span><span style={{ fontWeight: 600 }}>{questions.length}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><span style={{ color: '#6B7490' }}>Duration</span><span style={{ fontWeight: 600 }}>44 minutes</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span style={{ color: '#6B7490' }}>Rules</span><span style={{ fontWeight: 600, color: '#F9CA24' }}>No hints • Timed</span></div>
        </div>
        <button onClick={() => dispatch({ type: 'BEGIN_EXAM' })} style={{ marginTop: 24, background: '#BE2EDD', border: 'none', color: '#fff', padding: '14px 48px', borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>Start Exam</button>
        <button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'mocks' })} style={{ marginTop: 12, background: 'none', border: 'none', color: '#6B7490', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
      </div>
    );
  }
  
  if (phase === 'results') {
    const score = results?.score || 0;
    let grade = 'D', color = '#EB4D4B';
    if (score >= 90) { grade = 'A*'; color = '#6AB04C'; }
    else if (score >= 75) { grade = 'A'; color = '#4F7DFF'; }
    else if (score >= 60) { grade = 'B'; color = '#22A6B3'; }
    else if (score >= 50) { grade = 'C'; color = '#F9CA24'; }
    const correctCount = results?.correct || 0;
    const total = questions.length;
    
    return (
      <div style={{ padding: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>Exam Results</h1>
        <p style={{ textAlign: 'center', color: '#6B7490', fontSize: 14, marginBottom: 20 }}>Paper {paperId}</p>
        <div style={{ textAlign: 'center', background: '#131720', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color }}>{grade}</div>
          <div style={{ fontSize: 32, fontWeight: 600 }}>{score}%</div>
          <div style={{ fontSize: 14, color: '#6B7490' }}>{correctCount} / {total} correct</div>
        </div>
        <button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'mocks' })} style={{ width: '100%', background: '#4F7DFF', border: 'none', color: '#fff', padding: '14px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Done</button>
      </div>
    );
  }
  
  const progress = ((currentIdx + 1) / questions.length * 100);
  const isLastQuestion = currentIdx + 1 >= questions.length;
  let timerColor = '#6AB04C';
  if (timeRemaining < 60) timerColor = '#EB4D4B';
  else if (timeRemaining < 300) timerColor = '#F9CA24';
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, color: '#6B7490' }}>Question {currentIdx + 1}/{questions.length}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: timerColor }}>{formatTime(timeRemaining)}</div>
      </div>
      <div style={{ height: 3, background: '#2A3140', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#4F7DFF', borderRadius: 2 }} />
      </div>
      <div style={{ background: '#131720', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#6B7490', marginBottom: 8 }}>Question {currentIdx + 1} ({currentQ?.marks || 1} mark{currentQ?.marks > 1 ? 's' : ''})</div>
        <div style={{ fontSize: 18, lineHeight: 1.6 }}>{currentQ?.q}</div>
        <div style={{ marginTop: 16 }}>
          <input type="text" value={selected} onChange={(e) => setSelected(e.target.value)} placeholder="Type your answer..." style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid #2A3140', background: '#0E1118', color: '#F2F4FF', fontSize: 16, outline: 'none' }} disabled={answered} autoFocus />
          {!answered ? (
            <button onClick={handleAnswer} disabled={!selected} style={{ marginTop: 12, width: '100%', background: selected ? '#4F7DFF' : '#2A3140', border: 'none', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: selected ? 'pointer' : 'default' }}>Submit Answer</button>
          ) : (
            <button onClick={handleNext} style={{ marginTop: 12, width: '100%', background: '#4F7DFF', border: 'none', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{isLastQuestion ? 'Submit Exam' : 'Next →'}</button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: '#6B7490' }}>{results?.answers?.filter(a => a).length || 0} answered</div>
        <button onClick={handleSubmitExam} style={{ background: 'none', border: 'none', color: '#EB4D4B', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Submit Exam</button>
      </div>
    </div>
  );
}

// ============================================================
// PLANS SCREEN
// ============================================================
function PlansScreen() {
  const { state, dispatch } = useContext(AppContext);
  const [showBackup, setShowBackup] = useState(false);
  
  const exportData = () => {
    const data = { version: 2, exportedAt: new Date().toISOString(), uid: localStorage.getItem('p6prep_uid'), name: state.profile.name, data: state };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `p6prep-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.version === 2 && data.data) {
          if (data.uid) localStorage.setItem('p6prep_uid', data.uid);
          if (data.name) localStorage.setItem('p6prep_name', data.name);
          dispatch({ type: 'IMPORT_STATE', payload: data.data });
          alert('Import successful!');
        } else alert('Invalid backup file');
      } catch (err) { alert('Error reading file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Plans</h1>
      <p style={{ color: '#6B7490', fontSize: 14, marginBottom: 20 }}>All features are FREE!</p>
      
      <div style={{ background: '#131720', borderRadius: 16, padding: 20, textAlign: 'center', border: '2px solid #6AB04C' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#6AB04C' }}>100% FREE</h2>
        <p style={{ color: '#6B7490', fontSize: 14, marginTop: 4 }}>All 12 topics • All 5 mock papers • AI Tutor • Badges • Leaderboard</p>
        <p style={{ color: '#6B7490', fontSize: 13, marginTop: 8 }}>No subscription needed. Everything is free forever!</p>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <button onClick={() => setShowBackup(!showBackup)} style={{ background: 'none', border: 'none', color: '#4F7DFF', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>{showBackup ? 'Hide Backup Options' : '💾 Backup & Restore'}</button>
        {showBackup && (
          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <button onClick={exportData} style={{ flex: 1, background: '#2A3140', border: 'none', color: '#F2F4FF', padding: '10px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Export</button>
            <label style={{ flex: 1, background: '#2A3140', border: 'none', color: '#F2F4FF', padding: '10px', borderRadius: 8, fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
              Import
              <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            </label>
          </div>
        )}
      </div>
      
      <button onClick={() => dispatch({ type: 'RESET_ALL' })} style={{ marginTop: 16, background: 'none', border: 'none', color: '#EB4D4B', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Reset All Progress</button>
    </div>
  );
}

// ============================================================
// STATS SCREEN
// ============================================================
function StatsScreen() {
  const { state, TOPICS } = useContext(AppContext);
  const totalAttempts = state.totalAttempts || 0;
  const totalCorrect = state.totalCorrect || 0;
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Statistics</h1>
      <p style={{ color: '#6B7490', fontSize: 14, marginBottom: 20 }}>Your progress at a glance</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        <div style={{ background: '#131720', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#4F7DFF' }}>{overallAccuracy}%</div>
          <div style={{ fontSize: 13, color: '#6B7490' }}>Overall Accuracy</div>
        </div>
        <div style={{ background: '#131720', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#6AB04C' }}>{totalAttempts}</div>
          <div style={{ fontSize: 13, color: '#6B7490' }}>Total Questions</div>
        </div>
        <div style={{ background: '#131720', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#F9CA24' }}>{state.topicsMastered || 0}</div>
          <div style={{ fontSize: 13, color: '#6B7490' }}>Topics Mastered</div>
        </div>
        <div style={{ background: '#131720', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#BE2EDD' }}>{state.bestMockScore || 0}%</div>
          <div style={{ fontSize: 13, color: '#6B7490' }}>Best Mock Score</div>
        </div>
      </div>
      
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Topic Mastery</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TOPICS.map(topic => {
          const attempts = state.attempts?.[topic.id]?.total || 0;
          const correct = state.attempts?.[topic.id]?.correct || 0;
          const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
          const mastery = state.mastery?.[topic.id];
          const level = mastery?.level || 0;
          let label = 'Not started', color = '#2A3140';
          if (level >= 4) { label = 'Mastered'; color = '#6AB04C'; }
          else if (level >= 3) { label = 'Good'; color = '#4F7DFF'; }
          else if (level >= 2) { label = 'Practising'; color = '#F9CA24'; }
          else if (level >= 1) { label = 'Learning'; color = '#FF9F43'; }
          return (
            <div key={topic.id} style={{ background: '#131720', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{topic.label}</span>
                <span style={{ fontSize: 13, color }}>{label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7490', marginTop: 2 }}>
                <span>{attempts} Qs</span>
                <span>{accuracy}%</span>
              </div>
              <div style={{ marginTop: 4, height: 3, background: '#2A3140', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${accuracy}%`, height: '100%', background: color, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// BADGES SCREEN
// ============================================================
function BadgesScreen() {
  const { state, BADGES } = useContext(AppContext);
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(BADGES.map(b => b.category))];
  const earned = new Set((state.badges || []).map(b => b.id));
  const filteredBadges = filter === 'all' ? BADGES : BADGES.filter(b => b.category === filter);
  const earnedCount = earned.size;
  const totalCount = BADGES.length;
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Badges</h1>
        <span style={{ fontSize: 14, color: '#6B7490' }}>{earnedCount}/{totalCount}</span>
      </div>
      <p style={{ color: '#6B7490', fontSize: 14, marginBottom: 16 }}>Collect them all!</p>
      <div style={{ height: 4, background: '#2A3140', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ width: `${(earnedCount / totalCount) * 100}%`, height: '100%', background: '#4F7DFF', borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: filter === cat ? '#4F7DFF' : '#2A3140', color: filter === cat ? '#fff' : '#6B7490', fontSize: 12, cursor: 'pointer' }}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {filteredBadges.map(badge => {
          const isEarned = earned.has(badge.id);
          return (
            <div key={badge.id} style={{ background: isEarned ? '#131720' : '#0E1118', borderRadius: 12, padding: 14, textAlign: 'center', border: isEarned ? '2px solid rgba(79,125,255,0.3)' : '2px solid rgba(255,255,255,0.04)', opacity: isEarned ? 1 : 0.4 }}>
              <div style={{ fontSize: 28 }}>{badge.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4 }}>{badge.label}</div>
              <div style={{ fontSize: 10, color: '#6B7490', marginTop: 2 }}>{badge.category}</div>
              {isEarned && <div style={{ fontSize: 10, color: '#6AB04C', marginTop: 4 }}>✅ Earned</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// LEADERBOARD SCREEN
// ============================================================
function LeaderboardScreen() {
  const { state, dispatch } = useContext(AppContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadLeaderboard = () => {
      setLoading(true);
      try {
        const storage = window.storage || localStorage;
        const keys = Object.keys(storage).filter(k => k.startsWith('lb:'));
        const data = keys.map(k => {
          try { return { uid: k.replace('lb:', ''), ...JSON.parse(storage.getItem(k)) }; }
          catch (e) { return null; }
        }).filter(Boolean);
        data.sort((a, b) => (b.score || 0) - (a.score || 0));
        setEntries(data);
      } catch (e) { setEntries([]); }
      setLoading(false);
    };
    loadLeaderboard();
    const handleUpdate = () => loadLeaderboard();
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);
  
  useEffect(() => {
    const updateScore = () => {
      const uid = localStorage.getItem('p6prep_uid');
      const name = state.profile.name || 'Student';
      const totalAttempts = state.totalAttempts || 0;
      const accuracy = totalAttempts > 0 ? state.totalCorrect / totalAttempts : 0;
      const topics = Object.keys(state.attempts || {}).length;
      const score = Math.round((accuracy * 50) + (Math.min(totalAttempts, 200) * 0.3) + (topics * 5));
      try {
        const storage = window.storage || localStorage;
        storage.setItem(`lb:${uid}`, JSON.stringify({ uid, name, score, questions: totalAttempts, accuracy: Math.round(accuracy * 100), topics }));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}
    };
    updateScore();
  }, [state]);
  
  const currentUid = localStorage.getItem('p6prep_uid');
  const rank = entries.findIndex(e => e.uid === currentUid) + 1;
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>🏆 Leaderboard</h1>
        {rank > 0 && <span style={{ fontSize: 14, color: '#4F7DFF', fontWeight: 600 }}>#{rank}</span>}
      </div>
      <p style={{ color: '#6B7490', fontSize: 14, marginBottom: 20 }}>Global rankings</p>
      
      {loading ? <div style={{ textAlign: 'center', color: '#6B7490', padding: 40 }}>Loading...</div>
      : entries.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6B7490', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p>No rankings yet. Start practising to appear on the leaderboard!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {entries.slice(0, 100).map((entry, i) => {
            const isCurrent = entry.uid === currentUid;
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`;
            return (
              <div key={entry.uid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: isCurrent ? 'rgba(79,125,255,0.15)' : '#131720', border: isCurrent ? '2px solid rgba(79,125,255,0.3)' : '2px solid transparent' }}>
                <span style={{ width: 32, fontSize: 14, color: '#6B7490', textAlign: 'center' }}>{medal}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{entry.name || 'Anonymous'}</div>
                  <div style={{ fontSize: 12, color: '#6B7490' }}>{entry.questions} Qs • {entry.accuracy}%</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#4F7DFF' }}>{entry.score}</div>
              </div>
            );
          })}
        </div>
      )}
      
      <button onClick={() => dispatch({ type: 'NAVIGATE', payload: 'home' })} style={{ marginTop: 16, width: '100%', background: '#2A3140', border: 'none', color: '#F2F4FF', padding: '12px', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Back to Home</button>
    </div>
  );
}

// Element Mixer Debugging Script
// This script directly tests the ChemCraftAI module for bugs

import { chemCraftAI } from './src/lib/chemCraftAI.js';

console.log('🔍 Direct ChemCraftAI Testing');
console.log('='.repeat(50));

async function testPrediction(testName, elements, expectedFormula) {
  console.log(`\n🧪 Testing: ${testName}`);
  console.log(`   Input: ${JSON.stringify(elements)}`);
  console.log(`   Expected: ${expectedFormula}`);
  
  try {
    const result = await chemCraftAI.predictCompound(elements);
    console.log(`   Result: ${JSON.stringify(result, null, 2)}`);
    
    if (result.will_react && result.formula === expectedFormula) {
      console.log(`   ✅ SUCCESS: Predicted ${result.name} (${result.formula})`);
    } else if (result.will_react) {
      console.log(`   ⚠️  UNEXPECTED: Got ${result.formula}, expected ${expectedFormula}`);
    } else {
      console.log(`   ❌ FAILED: No reaction predicted`);
      console.log(`   Reason: ${result.reason || 'Unknown'}`);
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
}

async function runTests() {
  // Critical test cases
  await testPrediction('Water Formation', [
    { symbol: 'H', count: 2 },
    { symbol: 'O', count: 1 }
  ], 'H2O');
  
  await testPrediction('Salt Formation', [
    { symbol: 'Na', count: 1 },
    { symbol: 'Cl', count: 1 }
  ], 'NaCl');
  
  await testPrediction('Sulfuric Acid Formation', [
    { symbol: 'H', count: 2 },
    { symbol: 'S', count: 1 },
    { symbol: 'O', count: 4 }
  ], 'H2SO4');
  
  await testPrediction('Ammonia Formation', [
    { symbol: 'N', count: 1 },
    { symbol: 'H', count: 3 }
  ], 'NH3');
  
  console.log('\n✅ Testing completed!');
}

runTests().catch(console.error);
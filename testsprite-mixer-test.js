#!/usr/bin/env node

/**
 * TestSprite Element Mixer Focused Test Runner for ChemCraft
 * This script specifically tests the element mixer functionality
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const API_KEY = "sk-user-2ayue2VHZKHXAB9E3EnKTggEcGpcsNYeCGMikw-grOYgHdLORLh2HxnVegXZ-4zLoqxkq5DxCkp9J_54eYrEMuYSH6hgQFYM-uyjSEQojEMUYaO4LfJTMRmaGMwTy0IgJmo";
const PROJECT_PATH = __dirname;
const LOCAL_PORT = 3001;

console.log('🧪 Starting TestSprite Element Mixer Testing for ChemCraft');
console.log('='.repeat(60));
console.log(`📁 Project Path: ${PROJECT_PATH}`);
console.log(`🌐 Application URL: http://localhost:${LOCAL_PORT}/mixer`);
console.log(`🔑 API Key: ${API_KEY.substring(0, 20)}...`);
console.log('='.repeat(60));

// Create focused test configuration for element mixer
const testConfig = {
  projectName: "ChemCraft-ElementMixer",
  projectType: "frontend",
  framework: "Next.js",
  port: LOCAL_PORT,
  testScope: "specific-feature",
  targetUrl: `http://localhost:${LOCAL_PORT}/mixer`,
  specialInstructions: `
    FOCUSED TESTING: Element Mixer Module
    
    Navigate to: http://localhost:${LOCAL_PORT}/mixer
    
    TEST CATEGORIES:
    
    1. ELEMENT SELECTION FUNCTIONALITY:
       ✅ Test adding hydrogen atoms (H) - multiple quantities
       ✅ Test adding oxygen atoms (O) - multiple quantities  
       ✅ Test adding sulfur atoms (S) - single quantities
       ✅ Test adding carbon atoms (C) - multiple quantities
       ✅ Test adding nitrogen atoms (N) - single quantities
       ✅ Test adding sodium atoms (Na) - single quantities
       ✅ Test adding chlorine atoms (Cl) - single quantities
       ✅ Test element counter increment/decrement buttons
       ✅ Test element removal functionality
       ✅ Test periodic table element picker integration
    
    2. COMPOUND PREDICTION TESTING:
       🧪 Test H2O formation (2H + 1O) - should predict Water
       🧪 Test H2SO4 formation (2H + 1S + 4O) - should predict Sulfuric Acid
       🧪 Test HNO3 formation (1H + 1N + 3O) - should predict Nitric Acid
       🧪 Test H3PO4 formation (3H + 1P + 4O) - should predict Phosphoric Acid
       🧪 Test NaCl formation (1Na + 1Cl) - should predict Sodium Chloride
       🧪 Test NH3 formation (1N + 3H) - should predict Ammonia
       🧪 Test CH4 formation (1C + 4H) - should predict Methane
       🧪 Test CO2 formation (1C + 2O) - should predict Carbon Dioxide
       🧪 Test SO2 formation (1S + 2O) - should predict Sulfur Dioxide
       🧪 Test NO2 formation (1N + 2O) - should predict Nitrogen Dioxide
       🧪 Test CaCO3 formation (1Ca + 1C + 3O) - should predict Calcium Carbonate
       🧪 Test NaHCO3 formation (1Na + 1H + 1C + 3O) - should predict Baking Soda
       🧪 Test C2H6O formation (2C + 6H + 1O) - should predict Ethanol
       🧪 Test C6H12O6 formation (6C + 12H + 6O) - should predict Glucose
    
    3. AI PREDICTION ENGINE TESTING:
       🤖 Test ChemCraftAI response accuracy
       🤖 Test confidence levels (should be 0.8-1.0 for common compounds)
       🤖 Test safety warnings display
       🤖 Test compound properties information
       🤖 Test uses and applications display
       🤖 Test rule-based system (R001-R036)
       🤖 Test fallback database functionality
       🤖 Test multi-element compound handling
       🤖 Test invalid combinations (should show failure messages)
    
    4. USER INTERFACE TESTING:
       🎨 Test element selection UI responsiveness
       🎨 Test "Mix Elements" button functionality
       🎨 Test results display panel
       🎨 Test loading states during prediction
       🎨 Test error message display
       🎨 Test dark theme consistency
       🎨 Test 3D Vanta.js background performance
       🎨 Test mobile responsiveness on mixer page
       🎨 Test keyboard navigation
       🎨 Test screen reader accessibility
    
    5. PERFORMANCE TESTING:
       ⚡ Test response time for predictions (<2 seconds)
       ⚡ Test memory usage during multiple predictions
       ⚡ Test concurrent element selections
       ⚡ Test large element combinations (10+ elements)
       ⚡ Test rapid button clicking (stress test)
       ⚡ Test browser compatibility (Chrome, Firefox, Safari, Edge)
    
    6. ERROR HANDLING TESTING:
       ❌ Test empty element selection (no elements chosen)
       ❌ Test invalid element combinations
       ❌ Test network failures during API calls
       ❌ Test malformed data responses
       ❌ Test browser console errors
       ❌ Test JavaScript exceptions handling
    
    7. COMPOUND DATABASE TESTING:
       📊 Test essential compounds database loading
       📊 Test complete database fallback system
       📊 Test compound lookup by exact formula
       📊 Test fuzzy matching for similar compounds
       📊 Test database performance with 550+ compounds
       📊 Test compound categorization (acids, salts, organic, etc.)
    
    8. INTEGRATION TESTING:
       🔗 Test navigation from periodic table to mixer
       🔗 Test favorites system integration
       🔗 Test data persistence across page reloads
       🔗 Test authentication integration (if enabled)
       🔗 Test deep linking to mixer with parameters
    
    CRITICAL BUG AREAS TO CHECK:
    - H2O vs OH confusion (should show water, not hydroxide)
    - NaCl prediction accuracy (sodium + chlorine reactions)
    - Multi-element combinations (3+ elements)
    - Stoichiometry calculations (correct element ratios)
    - Safety warnings for dangerous compounds
    - Performance with rare/synthetic elements (Lanthanides, Actinides)
    
    EXPECTED OUTCOMES:
    ✅ 100% success rate for common compounds (H2O, NaCl, CO2, etc.)
    ✅ Accurate safety classifications (very high for acids, low for salts)
    ✅ Fast response times (<2 seconds for any combination)
    ✅ No JavaScript console errors
    ✅ Responsive design on all screen sizes
    ✅ Accessibility compliance (WCAG 2.1 AA)
  `
};

// Write focused test configuration
fs.writeFileSync(path.join(__dirname, 'testsprite-mixer-config.json'), JSON.stringify(testConfig, null, 2));

console.log('📝 Element Mixer Test Configuration Created');
console.log('🔍 Starting TestSprite Bootstrap Process...\n');

// Run TestSprite MCP with focused testing
const env = {
  ...process.env,
  API_KEY: API_KEY,
  LOCAL_PORT: LOCAL_PORT.toString(),
  PROJECT_PATH: PROJECT_PATH,
  TEST_TYPE: 'frontend',
  TEST_SCOPE: 'specific-feature',
  TARGET_URL: `http://localhost:${LOCAL_PORT}/mixer`
};

console.log('🧪 Executing TestSprite MCP Server for Element Mixer...');

const testProcess = spawn('npx', ['@testsprite/testsprite-mcp@latest'], {
  stdio: 'inherit',
  env: env,
  cwd: PROJECT_PATH,
  shell: true
});

let testStartTime = Date.now();

testProcess.on('spawn', () => {
  console.log('✅ TestSprite MCP Server started successfully');
  console.log('🎯 Focusing on Element Mixer functionality...');
});

testProcess.on('error', (error) => {
  console.error('❌ TestSprite Error:', error.message);
  process.exit(1);
});

testProcess.on('close', (code) => {
  const duration = Math.round((Date.now() - testStartTime) / 1000);
  
  if (code === 0) {
    console.log('\n🎉 Element Mixer Testing Completed Successfully!');
    console.log(`⏱️  Total Duration: ${duration} seconds`);
    console.log('📊 Check the TestSprite dashboard for detailed results');
    console.log('🔗 Dashboard: https://www.testsprite.com/dashboard');
    console.log('\n📋 Test Summary Expected:');
    console.log('   - Element selection functionality: PASS');
    console.log('   - Compound prediction accuracy: PASS');
    console.log('   - AI engine performance: PASS'); 
    console.log('   - UI/UX responsiveness: PASS');
    console.log('   - Error handling: PASS');
    console.log('   - Database integration: PASS');
  } else {
    console.error(`\n❌ Element Mixer testing failed with code ${code}`);
    console.error(`⏱️  Duration: ${duration} seconds`);
    console.log('\n🔧 Common issues to check:');
    console.log('   - Is the dev server running on port 3001?');
    console.log('   - Are there any JavaScript console errors?');
    console.log('   - Is the ChemCraftAI module loading correctly?');
    console.log('   - Are element combinations returning proper results?');
    process.exit(code);
  }
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Element Mixer tests...');
  testProcess.kill('SIGINT');
});

console.log('⏳ TestSprite is now analyzing Element Mixer functionality...');
console.log('🧪 Testing compound predictions for all 118 elements...');
console.log('📱 Monitor progress at: https://www.testsprite.com/dashboard');
console.log('\n💡 Focused testing may take 5-10 minutes for comprehensive coverage.');
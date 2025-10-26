#!/usr/bin/env node

/**
 * TestSprite Comprehensive Test Runner for ChemCraft
 * This script runs TestSprite MCP with the proper configuration
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const API_KEY = "sk-user-2ayue2VHZKHXAB9E3EnKTggEcGpcsNYeCGMikw-grOYgHdLORLh2HxnVegXZ-4zLoqxkq5DxCkp9J_54eYrEMuYSH6hgQFYM-uyjSEQojEMUYaO4LfJTMRmaGMwTy0IgJmo";
const PROJECT_PATH = __dirname;
const LOCAL_PORT = 3001;

console.log('🚀 Starting TestSprite Comprehensive Testing for ChemCraft');
console.log('='.repeat(60));
console.log(`📁 Project Path: ${PROJECT_PATH}`);
console.log(`🌐 Application URL: http://localhost:${LOCAL_PORT}`);
console.log(`🔑 API Key: ${API_KEY.substring(0, 20)}...`);
console.log('='.repeat(60));

// Create test configuration
const testConfig = {
  projectName: "ChemCraft",
  projectType: "frontend",
  framework: "Next.js",
  port: LOCAL_PORT,
  testScope: "codebase",
  specialInstructions: `
    Test the following key features of ChemCraft:
    
    1. PERIODIC TABLE MODULE:
       - Element selection and interaction
       - Periodic table layout and responsiveness
       - Element information display
       - Category-based element highlighting
    
    2. ELEMENT MIXER MODULE:
       - Compound creation functionality
       - Element combination logic
       - Visual feedback for valid/invalid combinations
       - Results display and storage
    
    3. QUIZ SYSTEM MODULE:
       - Question generation and display
       - Answer validation and scoring
       - Difficulty level settings
       - Progress tracking and completion
    
    4. UI/UX TESTING:
       - Dark theme consistency across all pages
       - 3D Vanta.js background performance
       - Navigation between sections
       - Responsive design (mobile/desktop)
       - Header and footer functionality
    
    5. AUTHENTICATION:
       - Clerk authentication integration
       - Sign-in/sign-up flows
       - Protected route access
    
    6. PERFORMANCE TESTING:
       - Page load times
       - 3D animation performance
       - Large dataset handling (periodic table)
       - Memory usage during interactions
    
    7. ACCESSIBILITY TESTING:
       - Screen reader compatibility
       - Keyboard navigation
       - Color contrast ratios
       - ARIA labels and semantic HTML
    
    8. ERROR HANDLING:
       - Invalid user inputs
       - Network failures
       - Missing data scenarios
       - Browser compatibility issues
  `
};

// Write test configuration
fs.writeFileSync(path.join(__dirname, 'testsprite-config.json'), JSON.stringify(testConfig, null, 2));

console.log('📝 Test Configuration Created');
console.log('🔍 Starting TestSprite Bootstrap Process...\n');

// Run TestSprite MCP
const env = {
  ...process.env,
  API_KEY: API_KEY,
  LOCAL_PORT: LOCAL_PORT.toString(),
  PROJECT_PATH: PROJECT_PATH,
  TEST_TYPE: 'frontend',
  TEST_SCOPE: 'codebase'
};

console.log('🧪 Executing TestSprite MCP Server...');

const testProcess = spawn('npx', ['@testsprite/testsprite-mcp@latest'], {
  stdio: 'inherit',
  env: env,
  cwd: PROJECT_PATH,
  shell: false
});

let testStartTime = Date.now();

testProcess.on('spawn', () => {
  console.log('✅ TestSprite MCP Server started successfully');
});

testProcess.on('error', (error) => {
  console.error('❌ TestSprite Error:', error.message);
  process.exit(1);
});

testProcess.on('close', (code) => {
  const duration = Math.round((Date.now() - testStartTime) / 1000);
  
  if (code === 0) {
    console.log('\n🎉 TestSprite Testing Completed Successfully!');
    console.log(`⏱️  Total Duration: ${duration} seconds`);
    console.log('📊 Check the TestSprite dashboard for detailed results');
    console.log('🔗 Dashboard: https://www.testsprite.com/dashboard');
  } else {
    console.error(`\n❌ TestSprite process exited with code ${code}`);
    console.error(`⏱️  Duration: ${duration} seconds`);
    process.exit(code);
  }
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping TestSprite tests...');
  testProcess.kill('SIGINT');
});

console.log('⏳ TestSprite is now analyzing your ChemCraft application...');
console.log('📱 You can monitor progress at: https://www.testsprite.com/dashboard');
console.log('\n💡 This process may take several minutes to complete comprehensive testing.');
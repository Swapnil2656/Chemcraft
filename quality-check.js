#!/usr/bin/env node

/**
 * ChemCraft Quality Assurance Script
 * Comprehensive testing and validation for deployment readiness
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

console.log('🚀 ChemCraft Quality Assurance Suite');
console.log('='.repeat(50));

class QualityAssurance {
  constructor() {
    this.results = {
      typescript: { passed: false, errors: [] },
      lint: { passed: false, errors: [] },
      build: { passed: false, errors: [] },
      tests: { passed: false, errors: [] }
    };
  }

  async run() {
    console.log('📋 Starting comprehensive quality checks...\n');
    
    await this.checkTypeScript();
    await this.checkLinting();
    await this.checkBuild();
    await this.generateReport();
  }

  async checkTypeScript() {
    console.log('🔍 Checking TypeScript compilation...');
    try {
      const { stdout, stderr } = await execAsync('npm run type-check');
      console.log('✅ TypeScript check passed');
      this.results.typescript.passed = true;
    } catch (error) {
      console.log('❌ TypeScript check failed');
      this.results.typescript.errors.push(error.stdout || error.message);
      console.log(`Error: ${error.stdout || error.message}`);
    }
    console.log('');
  }

  async checkLinting() {
    console.log('🔍 Checking code linting...');
    try {
      const { stdout, stderr } = await execAsync('npm run lint');
      console.log('✅ Linting check passed');
      this.results.lint.passed = true;
    } catch (error) {
      console.log('⚠️  Linting issues found (may not be critical)');
      this.results.lint.errors.push(error.stdout || error.message);
      console.log(`Warnings: ${error.stdout || error.message}`);
    }
    console.log('');
  }

  async checkBuild() {
    console.log('🔍 Testing production build...');
    try {
      const { stdout, stderr } = await execAsync('npm run build');
      console.log('✅ Production build successful');
      this.results.build.passed = true;
    } catch (error) {
      console.log('❌ Production build failed');
      this.results.build.errors.push(error.stdout || error.message);
      console.log(`Error: ${error.stdout || error.message}`);
    }
    console.log('');
  }

  generateReport() {
    console.log('📊 Quality Assurance Report');
    console.log('='.repeat(50));
    
    const checks = [
      { name: 'TypeScript Compilation', result: this.results.typescript },
      { name: 'Code Linting', result: this.results.lint },
      { name: 'Production Build', result: this.results.build }
    ];

    let passedCount = 0;
    checks.forEach(check => {
      const status = check.result.passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`${check.name}: ${status}`);
      if (check.result.passed) passedCount++;
    });

    console.log('');
    console.log(`Overall Status: ${passedCount}/${checks.length} checks passed`);
    
    if (passedCount === checks.length) {
      console.log('🎉 All quality checks passed! Ready for deployment.');
      return true;
    } else {
      console.log('⚠️  Some checks failed. Review errors above.');
      return false;
    }
  }
}

// Run the quality assurance suite
const qa = new QualityAssurance();
qa.run().then(() => {
  console.log('\n🏁 Quality assurance complete.');
}).catch(error => {
  console.error('💥 Quality assurance failed:', error);
  process.exit(1);
});
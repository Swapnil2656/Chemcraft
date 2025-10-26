#!/usr/bin/env node

/**
 * ChemCraft Bug Detection and Testing Suite
 * Comprehensive testing for UI/UX issues, logic bugs, and performance problems
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

class BugDetector {
  constructor() {
    this.issues = {
      critical: [],
      warnings: [],
      suggestions: []
    };
    this.testResults = {
      typescript: false,
      build: false,
      lint: false,
      codeAnalysis: false
    };
  }

  async runAllTests() {
    console.log('🐛 ChemCraft Bug Detection Suite');
    console.log('='.repeat(50));
    console.log('Scanning for potential issues...\n');

    await this.checkTypeScriptErrors();
    await this.checkBuildErrors();
    await this.checkLintIssues();
    await this.analyzeCodePatterns();
    await this.checkFileStructure();
    await this.generateBugReport();
  }

  async checkTypeScriptErrors() {
    console.log('🔍 Checking TypeScript compilation errors...');
    try {
      const { stdout, stderr } = await execAsync('npm run type-check');
      console.log('✅ TypeScript compilation: PASSED');
      this.testResults.typescript = true;
    } catch (error) {
      console.log('❌ TypeScript compilation: FAILED');
      this.issues.critical.push({
        type: 'TypeScript Error',
        description: 'TypeScript compilation failed',
        details: error.stdout || error.message,
        severity: 'critical'
      });
    }
    console.log('');
  }

  async checkBuildErrors() {
    console.log('🔍 Checking production build errors...');
    try {
      const { stdout, stderr } = await execAsync('npm run build');
      console.log('✅ Production build: PASSED');
      this.testResults.build = true;
      
      // Check for build warnings
      if (stdout.includes('Warning:') || stderr.includes('Warning:')) {
        const warnings = (stdout + stderr).split('\n').filter(line => 
          line.includes('Warning:') || line.includes('warn')
        );
        warnings.forEach(warning => {
          this.issues.warnings.push({
            type: 'Build Warning',
            description: warning.trim(),
            severity: 'warning'
          });
        });
      }
    } catch (error) {
      console.log('❌ Production build: FAILED');
      this.issues.critical.push({
        type: 'Build Error',
        description: 'Production build failed',
        details: error.stdout || error.message,
        severity: 'critical'
      });
    }
    console.log('');
  }

  async checkLintIssues() {
    console.log('🔍 Checking ESLint issues...');
    try {
      const { stdout, stderr } = await execAsync('npm run lint');
      console.log('✅ ESLint check: PASSED');
      this.testResults.lint = true;
    } catch (error) {
      console.log('⚠️  ESLint issues found');
      const lintOutput = error.stdout || error.message;
      const lines = lintOutput.split('\n');
      
      lines.forEach(line => {
        if (line.includes('error') && line.includes('.tsx')) {
          this.issues.critical.push({
            type: 'ESLint Error',
            description: line.trim(),
            severity: 'critical'
          });
        } else if (line.includes('warning') && line.includes('.tsx')) {
          this.issues.warnings.push({
            type: 'ESLint Warning',
            description: line.trim(),
            severity: 'warning'
          });
        }
      });
    }
    console.log('');
  }

  async analyzeCodePatterns() {
    console.log('🔍 Analyzing code patterns for potential bugs...');
    
    const srcDir = path.join(__dirname, 'src');
    const patterns = await this.scanForCommonIssues(srcDir);
    
    if (patterns.length === 0) {
      console.log('✅ Code pattern analysis: No common issues found');
    } else {
      console.log(`⚠️  Found ${patterns.length} potential code issues`);
      patterns.forEach(issue => this.issues.warnings.push(issue));
    }
    
    this.testResults.codeAnalysis = true;
    console.log('');
  }

  async scanForCommonIssues(dir) {
    const issues = [];
    const files = await this.getAllFiles(dir, ['.tsx', '.ts', '.js']);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for common React issues
          if (line.includes('useEffect') && !line.includes('dependencies')) {
            const nextLines = lines.slice(index, index + 5).join('\n');
            if (nextLines.includes('[]') && (nextLines.includes('state') || nextLines.includes('props'))) {
              issues.push({
                type: 'React Hook Issue',
                description: `Potential missing dependency in useEffect at ${path.basename(file)}:${index + 1}`,
                severity: 'warning'
              });
            }
          }
          
          // Check for console.log statements (should be removed in production)
          if (line.includes('console.log') && !line.includes('//')) {
            issues.push({
              type: 'Debug Code',
              description: `Console.log found at ${path.basename(file)}:${index + 1} - should be removed for production`,
              severity: 'suggestion'
            });
          }
          
          // Check for potential null/undefined issues
          if (line.includes('.map(') && !line.includes('?.')) {
            issues.push({
              type: 'Potential Runtime Error',
              description: `Array.map without null check at ${path.basename(file)}:${index + 1}`,
              severity: 'warning'
            });
          }
          
          // Check for hardcoded values that should be constants
          if (line.match(/\d{3,}/) && !line.includes('const') && !line.includes('px')) {
            issues.push({
              type: 'Magic Number',
              description: `Large numeric literal at ${path.basename(file)}:${index + 1} - consider using a named constant`,
              severity: 'suggestion'
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return issues;
  }

  async getAllFiles(dir, extensions) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await this.getAllFiles(fullPath, extensions));
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async checkFileStructure() {
    console.log('🔍 Checking file structure and dependencies...');
    
    // Check for missing essential files
    const essentialFiles = [
      'package.json',
      'next.config.js',
      'tailwind.config.ts',
      'tsconfig.json',
      'src/app/layout.tsx',
      'src/app/page.tsx'
    ];
    
    const missingFiles = essentialFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
      missingFiles.forEach(file => {
        this.issues.critical.push({
          type: 'Missing File',
          description: `Essential file missing: ${file}`,
          severity: 'critical'
        });
      });
    }
    
    // Check package.json for potential issues
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check for dev dependencies in dependencies
      const devDepsInDeps = Object.keys(packageJson.dependencies || {}).filter(dep => 
        dep.includes('eslint') || dep.includes('@types/') || dep.includes('typescript')
      );
      
      if (devDepsInDeps.length > 0) {
        this.issues.warnings.push({
          type: 'Dependency Issue',
          description: `Development dependencies found in dependencies: ${devDepsInDeps.join(', ')}`,
          severity: 'warning'
        });
      }
      
    } catch (error) {
      this.issues.critical.push({
        type: 'Package Configuration',
        description: 'Could not read or parse package.json',
        severity: 'critical'
      });
    }
    
    console.log('✅ File structure check: COMPLETED');
    console.log('');
  }

  async generateBugReport() {
    console.log('📊 Bug Detection Report');
    console.log('='.repeat(50));
    
    const totalIssues = this.issues.critical.length + this.issues.warnings.length + this.issues.suggestions.length;
    
    if (totalIssues === 0) {
      console.log('🎉 No bugs or issues detected! Your application is ready for deployment.');
      return;
    }
    
    console.log(`Found ${totalIssues} total issues:`);
    console.log(`  🔴 Critical: ${this.issues.critical.length}`);
    console.log(`  🟡 Warnings: ${this.issues.warnings.length}`);
    console.log(`  🔵 Suggestions: ${this.issues.suggestions.length}\n`);
    
    // Critical Issues
    if (this.issues.critical.length > 0) {
      console.log('🔴 CRITICAL ISSUES (Must Fix):');
      console.log('-'.repeat(40));
      this.issues.critical.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type}: ${issue.description}`);
        if (issue.details) {
          console.log(`   Details: ${issue.details.substring(0, 200)}...`);
        }
        console.log('');
      });
    }
    
    // Warnings
    if (this.issues.warnings.length > 0) {
      console.log('🟡 WARNINGS (Should Fix):');
      console.log('-'.repeat(40));
      this.issues.warnings.slice(0, 10).forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type}: ${issue.description}`);
      });
      if (this.issues.warnings.length > 10) {
        console.log(`   ... and ${this.issues.warnings.length - 10} more warnings`);
      }
      console.log('');
    }
    
    // Suggestions
    if (this.issues.suggestions.length > 0) {
      console.log('🔵 SUGGESTIONS (Nice to Fix):');
      console.log('-'.repeat(40));
      this.issues.suggestions.slice(0, 5).forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type}: ${issue.description}`);
      });
      if (this.issues.suggestions.length > 5) {
        console.log(`   ... and ${this.issues.suggestions.length - 5} more suggestions`);
      }
      console.log('');
    }
    
    // Test Results Summary
    console.log('📋 Test Results Summary:');
    console.log('-'.repeat(40));
    console.log(`TypeScript Compilation: ${this.testResults.typescript ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Production Build: ${this.testResults.build ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`ESLint Check: ${this.testResults.lint ? '✅ PASSED' : '⚠️  ISSUES'}`);
    console.log(`Code Analysis: ${this.testResults.codeAnalysis ? '✅ COMPLETED' : '❌ FAILED'}`);
    
    // Deployment Readiness
    const criticalBlocking = this.issues.critical.length > 0;
    console.log('');
    console.log('🚀 Deployment Status:');
    console.log('-'.repeat(40));
    if (criticalBlocking) {
      console.log('❌ NOT READY - Critical issues must be resolved before deployment');
    } else {
      console.log('✅ READY - No critical issues detected, safe to deploy');
      if (this.issues.warnings.length > 0) {
        console.log('⚠️  Consider fixing warnings for better code quality');
      }
    }
  }
}

// Run the bug detection suite
const detector = new BugDetector();
detector.runAllTests().then(() => {
  console.log('\n🏁 Bug detection complete.');
}).catch(error => {
  console.error('💥 Bug detection failed:', error);
  process.exit(1);
});
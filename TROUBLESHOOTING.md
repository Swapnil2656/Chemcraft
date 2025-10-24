# ChemCraft - Troubleshooting Guide

## Common Issues and Solutions

### 1. "npm error Missing script: 'dev'" Error

**Problem**: Terminal is in the wrong directory or npm can't find package.json

**Solutions**:
1. **Use the provided start scripts** (Recommended):
   - Double-click `start-dev.bat` 
   - Or run `start-dev.ps1` in PowerShell

2. **Manual fix**:
   ```bash
   cd "C:\Users\swapn\Desktop\Projects\Chemcraft\chemcraft"
   npm run dev
   ```

3. **Verify you're in the correct directory**:
   ```bash
   ls package.json  # Should show the file exists
   ```

### 2. SWC Dependencies Warning

**Problem**: "Found lockfile missing swc dependencies, patching..."

**Solution**: Already fixed! The @next/swc-win32-x64-msvc package has been installed.

### 3. Port 3000 Already in Use

**Problem**: "Error: listen EADDRINUSE: address already in use :::3000"

**Solutions**:
1. **Kill existing process**:
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Use different port**:
   ```bash
   npm run dev -- -p 3001
   ```

### 4. Node Modules Issues

**Problem**: Dependency conflicts or corrupted installations

**Solution**:
```bash
npm run reinstall  # Uses the custom script we added
```

### 5. TypeScript Errors

**Problem**: Type checking failures

**Solutions**:
1. **Check types**:
   ```bash
   npm run type-check
   ```

2. **Fix automatically**:
   ```bash
   npm run lint:fix
   ```

## Quick Start Methods (Choose One)

### Method 1: Start Scripts ⭐ (Recommended)
- **Windows**: Double-click `start-dev.bat`
- **PowerShell**: Right-click `start-dev.ps1` → "Run with PowerShell"

### Method 2: Command Line
```bash
cd "C:\Users\swapn\Desktop\Projects\Chemcraft\chemcraft"
npm run dev
```

### Method 3: VS Code
- Open `chemcraft.code-workspace`
- Ctrl+Shift+P → "Tasks: Run Task" → "Start Dev Server"

### Method 4: Create Desktop Shortcut
```bash
# Run this once to create a desktop shortcut:
cscript create-shortcut.vbs
```

## Development URLs

- **Local**: http://localhost:3000
- **Network**: Check terminal output for network IP

## Support

If you continue to experience issues:
1. Check that all dependencies are installed: `npm install`
2. Clear Next.js cache: `npm run clean`
3. Restart your terminal/command prompt
4. Use the batch file (`start-dev.bat`) which handles directory navigation automatically
# TestSprite Setup for ChemCraft

## Overview
TestSprite is an AI-powered testing tool that automatically generates and runs comprehensive test suites for your web applications. This guide will help you set up TestSprite for your ChemCraft project.

## Prerequisites ✅
- ✅ Node.js 22+ (You have v24.6.0)
- ✅ VS Code with MCP extensions installed
- ✅ TestSprite MCP package available

## Setup Steps

### 1. Get Your API Key
1. Visit: https://www.testsprite.com/auth/cognito/sign-up
2. Sign up for a free account
3. Go to Dashboard → Settings → API Keys
4. Generate a new API key
5. Copy the API key (starts with `ts_live_` or similar)

### 2. Configure MCP Server
Update the `.vscode/mcp.json` file with your API key:

```json
{
  "mcp": {
    "servers": {
      "TestSprite": {
        "command": "npx",
        "args": ["@testsprite/testsprite-mcp@latest"],
        "env": {
          "API_KEY": "your-actual-api-key-here"
        }
      }
    }
  }
}
```

### 3. Start Your ChemCraft Application
Make sure your application is running before testing:

```bash
# In the chemcraft directory
npm run dev
```

Your app should be accessible at `http://localhost:3000` or `http://localhost:3001`

### 4. Run Your First Test
Once configured, you can use TestSprite in several ways:

#### Option A: Using AI Assistant (Recommended)
In VS Code, open the AI chat and say:
```
Help me test this ChemCraft project with TestSprite. It's a React/Next.js chemistry learning application with a 3D background, periodic table, element mixer, and quiz features.
```

#### Option B: Manual Testing Commands
Use the Command Palette (Ctrl+Shift+P) and look for TestSprite commands.

### 5. Test Configuration for ChemCraft
When TestSprite asks for configuration, use these settings:

- **Project Type**: Frontend
- **Port**: 3000 or 3001 (depending on which port your app is running on)
- **Test Scope**: Codebase (for comprehensive testing)
- **Special Instructions**: 
  ```
  Test the following key features:
  1. Periodic table interactions and element selection
  2. Element mixer functionality for creating compounds
  3. Quiz system with different difficulty levels
  4. Theme consistency (dark mode)
  5. 3D background animation performance
  6. Responsive design across different screen sizes
  7. Navigation between different sections (periodic, mixer, quiz, favorites)
  ```

## Expected Test Coverage
TestSprite will automatically generate tests for:

- ✅ **UI Components**: Periodic table, element cards, quiz components
- ✅ **User Interactions**: Clicking elements, mixing compounds, taking quizzes
- ✅ **Navigation**: Routing between pages, header/footer functionality
- ✅ **Data Handling**: Element data loading, compound creation, quiz scoring
- ✅ **Performance**: 3D background rendering, page load times
- ✅ **Accessibility**: Screen reader compatibility, keyboard navigation
- ✅ **Responsive Design**: Mobile and desktop layouts
- ✅ **Error Handling**: Invalid inputs, network failures

## Troubleshooting

### Common Issues:
1. **API Key Invalid**: Make sure you copied the complete API key from TestSprite dashboard
2. **Port Issues**: Ensure your app is running on the correct port (3000 or 3001)
3. **MCP Server Not Found**: Restart VS Code after configuration changes
4. **Permission Errors**: Run `npx @testsprite/testsprite-mcp@latest --version` to verify installation

### Getting Help:
- TestSprite Documentation: https://github.com/TestSprite/Docs
- TestSprite Discord: https://discord.com/invite/GXWFjCe4an
- Support Email: contact@testsprite.com

## Next Steps
After successful setup:
1. Run comprehensive tests on your ChemCraft application
2. Review test results and fix any identified issues
3. Set up automated testing workflows
4. Integrate with CI/CD pipeline for continuous testing

---
*Last updated: October 25, 2025*
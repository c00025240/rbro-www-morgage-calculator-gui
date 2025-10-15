#!/bin/bash

# Robust build script that tries multiple approaches
echo "🚀 Starting robust build process..."

# Function to try different ng command approaches
try_ng_build() {
    local config=$1
    echo "📦 Attempting to build with configuration: $config"
    
    # Method 1: Direct node execution
    if [ -f "node_modules/@angular/cli/bin/ng.js" ]; then
        echo "✓ Method 1: Using node directly with @angular/cli/bin/ng.js"
        node node_modules/@angular/cli/bin/ng.js build --configuration=$config
        return $?
    fi
    
    # Method 2: Check for ng in lib folder
    if [ -f "node_modules/@angular/cli/lib/init.js" ]; then
        echo "✓ Method 2: Using @angular/cli/lib/init.js"
        node -e "require('./node_modules/@angular/cli/lib/init.js')" build --configuration=$config
        return $?
    fi
    
    # Method 3: Try executable with fixed permissions
    if [ -f "node_modules/.bin/ng" ]; then
        echo "✓ Method 3: Using node_modules/.bin/ng with fixed permissions"
        chmod +x node_modules/.bin/ng 2>/dev/null || true
        node_modules/.bin/ng build --configuration=$config
        return $?
    fi
    
    # Method 4: Use npx as fallback
    echo "✓ Method 4: Using npx as fallback"
    npx ng build --configuration=$config
    return $?
}

# Try to build
try_ng_build "test"

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory contents:"
    ls -la dist/ 2>/dev/null || echo "No dist directory found"
else
    echo "❌ All build methods failed!"
    echo "🔍 Debugging info:"
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Current directory: $(pwd)"
    echo "Angular CLI files:"
    find node_modules/@angular/cli -name "*.js" -path "*/bin/*" 2>/dev/null || echo "No Angular CLI bin files found"
    exit 1
fi

#!/bin/bash

# Script to verify which server config is being used
echo "🔍 Verifying server configuration for test build..."

# Build with test configuration
echo "🏗️ Building with test configuration..."
npm run build:test

# Check the built files for server URLs
echo "📋 Checking built files for server configuration..."

if [ -d "dist" ]; then
    echo "🔍 Searching for test URLs in built files..."
    
    # Look for test URLs
    if grep -r "ocp4-test" dist/ 2>/dev/null; then
        echo "✅ Found TEST server URLs - correct configuration!"
    else
        echo "❌ No test URLs found"
    fi
    
    # Look for production URLs  
    if grep -r "raiffeisen.ro" dist/ 2>/dev/null; then
        echo "⚠️ Found PRODUCTION server URLs - wrong configuration!"
    else
        echo "✅ No production URLs found - correct!"
    fi
else
    echo "❌ No dist folder found - build failed?"
fi

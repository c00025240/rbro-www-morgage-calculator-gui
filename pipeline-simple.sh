#!/bin/bash

# Simple pipeline script that handles nvm install automatically
echo "🚀 Starting pipeline build with automatic Node.js setup"

# Check if .nvmrc exists and install the version
if [ -f ".nvmrc" ]; then
    NODE_VERSION=$(cat .nvmrc)
    echo "📋 Found .nvmrc with Node.js version: $NODE_VERSION"
    
    # Install the version from .nvmrc
    echo "⬇️ Installing Node.js v$NODE_VERSION..."
    nvm install $NODE_VERSION
    
    # Use the installed version
    echo "🔄 Switching to Node.js v$NODE_VERSION..."
    nvm use $NODE_VERSION
    
    # Verify the installation
    echo "✅ Current Node.js version: $(node --version)"
    echo "✅ Current npm version: $(npm --version)"
else
    echo "⚠️ No .nvmrc file found, using system Node.js"
fi

# Install dependencies
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the application
echo "🏗️ Building application for test environment..."
echo "📋 Using configuration: test"
echo "📋 Expected server config: server.config.test.ts"
npm run ci:build:test

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 Pipeline completed successfully!"
echo "📁 Build output in: dist/"

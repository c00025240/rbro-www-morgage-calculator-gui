#!/bin/bash

# Pipeline setup script
# Ensures correct Node.js version and builds the application

echo "🔧 Pipeline setup and build script"

# Check if nvm is available
if command -v nvm >/dev/null 2>&1; then
    echo "📦 Using nvm to manage Node.js version"
    
    # Try to use version from .nvmrc
    if [ -f ".nvmrc" ]; then
        echo "📋 Found .nvmrc file: $(cat .nvmrc)"
        nvm use || {
            echo "⬇️ Installing Node.js version from .nvmrc..."
            nvm install
        }
    else
        echo "📋 Using Node.js 20.19.1 (Angular CLI requirement)"
        nvm use 20.19.1 || {
            echo "⬇️ Installing Node.js 20.19.1..."
            nvm install 20.19.1
            nvm use 20.19.1
        }
    fi
else
    echo "⚠️ nvm not available, checking current Node.js version"
    NODE_VERSION=$(node --version)
    echo "📋 Current Node.js version: $NODE_VERSION"
    
    # Extract version numbers for comparison
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
    NODE_MINOR=$(echo $NODE_VERSION | cut -d'.' -f2)
    
    # Check version compatibility
    if [ $NODE_MAJOR -lt 20 ] || ([ $NODE_MAJOR -eq 20 ] && [ $NODE_MINOR -lt 19 ]); then
        echo "❌ Node.js version $NODE_VERSION is incompatible!"
        echo "🔄 Required: Node.js >=20.19.0"
        echo "💡 Please update Node.js to 20.19.1 in your pipeline configuration"
        exit 1
    fi
fi

# Show final Node.js version
echo "✅ Using Node.js: $(node --version)"
echo "✅ Using npm: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps || {
    echo "❌ Failed to install dependencies"
    exit 1
}

# Build application
echo "🏗️ Building application for test environment..."
npm run ci:build:test || {
    echo "❌ Build failed"
    exit 1
}

echo "✅ Pipeline completed successfully!"

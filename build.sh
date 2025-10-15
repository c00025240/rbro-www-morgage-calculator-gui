#!/bin/bash

# Build script for CI/CD pipeline
# This script handles permission issues and builds the Angular application

echo "🚀 Starting build process..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📋 Node.js version: $NODE_VERSION"

# Extract major and minor version numbers
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
NODE_MINOR=$(echo $NODE_VERSION | cut -d'.' -f2)

# Check if Node.js version meets requirements
if [ $NODE_MAJOR -lt 20 ] || ([ $NODE_MAJOR -eq 20 ] && [ $NODE_MINOR -lt 19 ]); then
    echo "❌ Node.js version $NODE_VERSION is too old!"
    echo "🔄 Required: Node.js >=20.19.0"
    echo "💡 Please update Node.js or use nvm: nvm use 20.19.1"
    exit 1
fi

echo "✅ Node.js version is compatible"

# Fix permissions for node_modules binaries
echo "🔧 Fixing permissions..."
chmod +x node_modules/.bin/* 2>/dev/null || true

# Use node directly to avoid permission issues
echo "📦 Building application for test environment..."
node node_modules/@angular/cli/bin/ng.js build --configuration=test

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory: dist/"
    ls -la dist/ 2>/dev/null || true
else
    echo "❌ Build failed!"
    exit 1
fi

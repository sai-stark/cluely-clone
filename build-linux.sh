#!/bin/bash

echo "🚀 Building Cluely Clone for Linux (Executable Only)..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Run: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for Linux (executable only)
echo "🔨 Building Linux executable..."
npx electron-builder --linux --dir

echo "✅ Build completed!"
echo "📁 Your Linux executable is in: dist/linux-unpacked/"
echo "🚀 To run the app: ./dist/linux-unpacked/cluely-clone"

# Show the built files
if [ -d "dist/linux-unpacked" ]; then
    echo "📋 Built files:"
    ls -la dist/linux-unpacked/
    echo ""
    echo "🎯 To create a simple installer, you can:"
    echo "   1. Copy the linux-unpacked folder to /opt/cluely-clone/"
    echo "   2. Create a desktop shortcut"
    echo "   3. Or run directly: ./dist/linux-unpacked/cluely-clone"
fi

#!/bin/bash

echo "🚀 Building Cluely Clone for Linux..."

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

# Build for Linux
echo "🔨 Building for Linux..."
npm run build

echo "✅ Build completed!"
echo "📁 Check the 'dist' folder for your Linux packages:"
echo "   - .AppImage (portable, works on most Linux distros)"
echo "   - .deb (Debian/Ubuntu package)"
echo "   - .rpm (Red Hat/Fedora package)"

# Show the built files
if [ -d "dist" ]; then
    echo "📋 Built files:"
    ls -la dist/
fi 
#!/bin/bash

echo "🖥️  Creating Desktop Shortcut for Cluely Clone..."

# Check if the executable exists
if [ ! -f "dist/linux-unpacked/cluely-clone" ]; then
    echo "❌ Executable not found. Please run ./build-linux.sh first."
    exit 1
fi

# Get the current directory
CURRENT_DIR=$(pwd)
EXECUTABLE_PATH="$CURRENT_DIR/dist/linux-unpacked/cluely-clone"
ICON_PATH="$CURRENT_DIR/favicon.png"

# Create desktop entry file
DESKTOP_ENTRY="$HOME/.local/share/applications/cluely-clone.desktop"

echo "📝 Creating desktop entry at: $DESKTOP_ENTRY"

cat > "$DESKTOP_ENTRY" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Cluely Clone
Comment=AI Interview Assistant
Exec=$EXECUTABLE_PATH
Icon=$ICON_PATH
Terminal=false
Categories=Utility;Office;
Keywords=ai;interview;assistant;overlay;
StartupWMClass=cluely-clone
EOF

# Make it executable
chmod +x "$DESKTOP_ENTRY"

echo "✅ Desktop shortcut created successfully!"
echo "🔄 You may need to log out and log back in for the shortcut to appear in your applications menu."
echo "🎯 You can also run the app directly with: $EXECUTABLE_PATH"

# Try to refresh desktop
if command -v update-desktop-database &> /dev/null; then
    echo "🔄 Updating desktop database..."
    update-desktop-database ~/.local/share/applications
fi

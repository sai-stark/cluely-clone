# Cluely Clone - Multi-Provider AI Interview Assistant

A transparent overlay Electron app that provides AI-generated interview answers based on your resume. Supports multiple AI providers including Google Gemini (free), OpenAI, Grok, and Claude.

## 🌟 Features

- **Multi-Provider Support**: Choose between Google Gemini (free), OpenAI, Grok, and Claude
- **Transparent Overlay**: Invisible during screen sharing and remote interviews
- **Voice-to-Text**: Real-time speech transcription
- **AI-Powered Answers**: Contextual responses based on your resume
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Stealth Mode**: Hidden from dock/taskbar, toggle with keyboard shortcuts

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cluely-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npm start
   ```

## 🔧 Building for Different Platforms

### Linux (Ubuntu/Debian)

#### Option 1: Using the simplified build script (Recommended)

```bash
./build-linux.sh
```

This creates the Linux executable without AppImage packaging issues.

#### Option 2: Using the original build script

```bash
./build.sh
```

**Note:** May fail due to icon issues, but the executable will still be created.

#### Option 3: Manual build

```bash
npm run build
```

**Linux Output:**

- **Executable** (`dist/linux-unpacked/cluely-clone`) - Ready to run
- **AppImage** (`.AppImage`) - May fail due to icon issues
- **Debian Package** (`.deb`) - May fail due to icon issues
- **RPM Package** (`.rpm`) - May fail due to icon issues

#### Creating Desktop Shortcut (Linux)

After building, create a desktop shortcut:

```bash
./create-desktop-shortcut.sh
```

### Windows

```bash
npm run build -- --win
```

**Output:** `.exe` installer

### macOS

```bash
npm run build -- --mac
```

**Output:** `.dmg` files (Intel x64 + Apple Silicon ARM64)

## 📱 Usage

1. **Launch the app** - It will appear as a transparent overlay
2. **Paste your resume** in the text area
3. **Select AI provider** from the dropdown
4. **Enter API key** (optional for free providers like Gemini)
5. **Click "Start Interview"**
6. **Use spacebar or mic button** to record questions
7. **Read AI-generated answers** based on your resume

## ⌨️ Keyboard Shortcuts

- **Ctrl+Shift+O** (or Cmd+Shift+O on Mac): Toggle overlay visibility
- **Spacebar**: Start/stop recording during interview mode

## 🤖 AI Providers

| Provider          | Cost        | Audio Support         | Text Generation    | Free Tier     |
| ----------------- | ----------- | --------------------- | ------------------ | ------------- |
| **Google Gemini** | Free        | ✅ (Whisper fallback) | ✅ Gemini Pro      | ✅ 15 req/min |
| **OpenAI**        | Pay per use | ✅ Whisper            | ✅ GPT-3.5-turbo   | ❌            |
| **Grok AI**       | X Premium+  | ✅ Whisper            | ✅ Grok-beta       | ❌            |
| **Claude**        | Pay per use | ✅ Whisper            | ✅ Claude-3-Sonnet | ❌            |

## 🐧 Linux-Specific Features

- **Window Management**: Optimized for Linux desktop environments
- **Always-on-Top**: Ensures overlay stays visible
- **Multi-Architecture**: Supports both x64 and ARM64
- **Package Formats**: Multiple distribution formats for easy installation

## 🔒 Privacy & Security

- **Local Processing**: Audio is processed locally before sending to AI APIs
- **No Data Storage**: Your resume and conversations are not stored
- **Secure APIs**: Uses official API endpoints with your keys

## 🛠️ Development

### Project Structure

```
cluely-clone/
├── main.js          # Electron main process
├── renderer.js      # UI logic and API calls
├── preload.js       # Secure IPC bridge
├── index.html       # User interface
├── package.json     # Dependencies and build config
└── build.sh         # Linux build script
```

### Adding New AI Providers

1. Add provider configuration to `providers` object in `renderer.js`
2. Implement provider-specific API functions
3. Update the provider selection dropdown in `index.html`

## 📋 Requirements

### Linux (Ubuntu 20.04+)

- Node.js 16+
- npm 8+
- Modern desktop environment (GNOME, KDE, XFCE)

### Windows 10+

- Node.js 16+
- npm 8+

### macOS 10.15+

- Node.js 16+
- npm 8+

## 🚨 Troubleshooting

### Common Issues

**App won't start:**

- Ensure Node.js and npm are installed
- Run `npm install` to install dependencies

**Microphone not working:**

- Check system microphone permissions
- Ensure microphone is not used by other applications

**Build fails on Linux:**

- Install required packages: `sudo apt-get install fakeroot dpkg-dev`
- Ensure you have write permissions to the project directory

**Overlay not staying on top:**

- On Linux, try different window managers
- Use the keyboard shortcut to toggle visibility

## 📄 License

This project is for educational purposes. Please ensure compliance with your organization's policies regarding interview integrity.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## ⚠️ Disclaimer

This tool is designed for educational purposes. Using AI assistance during interviews may violate company policies or terms of service. Use responsibly and ethically.

// Modern, optimized AI Interview Assistant
class InterviewAssistant {
  constructor() {
    this.isInterviewing = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.lastTranscript = '';
    this.whisperTranscribing = false;
    
    this.initializeElements();
    this.bindEvents();
    this.updateProviderInfo();
  }

  initializeElements() {
    // Main elements
    this.mainPanel = document.getElementById('main-panel');
    this.setupContent = document.getElementById('setup-content');
    this.interviewContent = document.getElementById('interview-content');
    this.micIndicator = document.getElementById('mic-indicator');
    
    // Setup elements
    this.resumeInput = document.getElementById('resume-input');
    this.providerSelect = document.getElementById('provider-select');
    this.apiKeyInput = document.getElementById('api-key-input');
    this.startBtn = document.getElementById('start-btn');
    this.statusIndicator = document.getElementById('status-indicator');
    
    // Interview elements
    this.answerContainer = document.getElementById('answer-container');
    this.stopBtn = document.getElementById('stop-btn');
    this.interviewStatus = document.getElementById('interview-status');
    
    // Control elements
    this.minimizeBtn = document.getElementById('minimize-btn');
    this.closeBtn = document.getElementById('close-btn');
    this.dragHandle = document.getElementById('drag-handle');
  }

  bindEvents() {
    // Setup events
    this.startBtn.addEventListener('click', () => this.startInterview());
    this.providerSelect.addEventListener('change', () => this.updateProviderInfo());
    
    // Interview events
    this.stopBtn.addEventListener('click', () => this.stopInterview());
    
    // Microphone events
    if (this.micIndicator) {
      console.log('Setting up microphone click listener');
      this.micIndicator.addEventListener('click', (e) => {
        console.log('Microphone clicked!');
        e.preventDefault();
        this.toggleRecording();
      });
    } else {
      console.error('❌ Microphone indicator not found!');
    }
    
    // Control events
    this.minimizeBtn.addEventListener('click', () => this.minimize());
    this.closeBtn.addEventListener('click', () => this.close());
    
    // Dragging functionality
    this.setupDragging();
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Prevent default drag behavior on inputs
    this.preventDragOnInputs();
  }

  preventDragOnInputs() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });
    });
  }

  updateProviderInfo() {
    const selectedProvider = this.providerSelect.value;
    const provider = this.getProviderConfig(selectedProvider);
    
    if (provider.free) {
      this.apiKeyInput.placeholder = 'API Key (Optional for free tier)';
      this.apiKeyInput.style.borderColor = 'rgba(0, 255, 153, 0.5)';
    } else {
      this.apiKeyInput.placeholder = 'API Key Required';
      this.apiKeyInput.style.borderColor = 'rgba(255, 77, 79, 0.5)';
    }
  }

  getProviderConfig(provider) {
    const configs = {
      gemini: {
        name: 'Google Gemini',
        free: true,
        info: 'Free tier: 15 req/min, 1500/day'
      },
      openai: {
        name: 'OpenAI GPT',
        free: false,
        info: 'Pay per use: $0.006/min audio + $0.0015/1K tokens'
      },
      grok: {
        name: 'Grok AI',
        free: false,
        info: 'Requires X Premium+ subscription'
      },
      claude: {
        name: 'Anthropic Claude',
        free: false,
        info: 'Pay per use: $0.003/1K input + $0.015/1K output'
      }
    };
    return configs[provider] || configs.gemini;
  }

  async startInterview() {
    const resume = this.resumeInput.value.trim();
    if (!resume) {
      this.showStatus('Please paste your resume first.', 'error');
      return;
    }

    const selectedProvider = this.providerSelect.value;
    const provider = this.getProviderConfig(selectedProvider);
    
    if (!provider.free && !this.apiKeyInput.value.trim()) {
      this.showStatus(`Please enter your ${provider.name} API key.`, 'error');
      return;
    }

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'audio/webm' });
      
      // Setup media recorder events
      this.setupMediaRecorder();
      
      // Switch to interview mode
      this.switchToInterviewMode();
      
      this.showStatus(`Interview started with ${provider.name}. Press SPACEBAR or click mic to record.`, 'success');
      
    } catch (error) {
      this.showStatus(`Microphone error: ${error.message}`, 'error');
    }
  }

  setupMediaRecorder() {
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      if (this.audioChunks.length > 0 && this.isInterviewing) {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        await this.processAudio(blob);
      }
    };
  }

  switchToInterviewMode() {
    this.isInterviewing = true;
    this.setupContent.classList.add('hidden');
    this.interviewContent.classList.remove('hidden');
    this.micIndicator.classList.remove('hidden');
    
    // Add fade-in animation
    this.interviewContent.classList.add('fade-in');
  }

  switchToSetupMode() {
    this.isInterviewing = false;
    this.interviewContent.classList.add('hidden');
    this.setupContent.classList.remove('hidden');
    this.micIndicator.classList.add('hidden');
    
    // Reset answer container
    this.answerContainer.textContent = '🎤 Click the microphone or press SPACEBAR to start recording your question...';
    this.answerContainer.classList.remove('has-answer');
  }

  async stopInterview() {
    this.isInterviewing = false;
    this.isRecording = false;
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.micIndicator.classList.remove('recording');
    this.switchToSetupMode();
    this.showStatus('Interview stopped.', 'info');
  }

  toggleRecording() {
    if (!this.isInterviewing) return;
    
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    console.log('Attempting to start recording...');
    console.log('MediaRecorder state:', this.mediaRecorder?.state);
    console.log('Is interviewing:', this.isInterviewing);
    
    if (!this.mediaRecorder) {
      this.showInterviewStatus('❌ Microphone not initialized. Please restart interview.', 'error');
      return;
    }
    
    if (this.mediaRecorder.state === 'inactive') {
      this.audioChunks = [];
      this.mediaRecorder.start(1000); // Record in 1-second chunks
      this.isRecording = true;
      this.micIndicator.classList.add('recording');
      this.showInterviewStatus('🎤 Recording... Click mic or press SPACEBAR to stop.', 'recording');
      console.log('Recording started successfully');
    } else {
      console.log('MediaRecorder not in inactive state:', this.mediaRecorder.state);
      this.showInterviewStatus('❌ Recording already in progress', 'error');
    }
  }

  stopRecording() {
    console.log('Attempting to stop recording...');
    console.log('MediaRecorder state:', this.mediaRecorder?.state);
    
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.micIndicator.classList.remove('recording');
      this.showInterviewStatus('🔄 Processing audio...', 'processing');
      console.log('Recording stopped successfully');
    } else {
      console.log('MediaRecorder not in recording state:', this.mediaRecorder?.state);
      this.showInterviewStatus('❌ No active recording to stop', 'error');
    }
  }

  async processAudio(blob) {
    if (this.whisperTranscribing) return;
    this.whisperTranscribing = true;
    
    const selectedProvider = this.providerSelect.value;
    const apiKey = this.apiKeyInput.value.trim();
    const resume = this.resumeInput.value.trim();
    
    try {
      // Transcribe audio
      const transcript = await this.transcribeAudio(blob, selectedProvider, apiKey);
      
      if (transcript && transcript !== this.lastTranscript) {
        this.lastTranscript = transcript;
        
        // Get AI response
        const answer = await this.getAIResponse(transcript, resume, selectedProvider, apiKey);
        
        if (answer) {
          this.displayAnswer(answer);
          this.showInterviewStatus('Ready. Press SPACEBAR or click mic to record.', 'ready');
        } else {
          this.showInterviewStatus('No answer received.', 'error');
        }
      } else if (!transcript) {
        this.showInterviewStatus('No speech detected.', 'warning');
      }
      
    } catch (error) {
      this.showInterviewStatus(`Error: ${error.message}`, 'error');
    } finally {
      this.whisperTranscribing = false;
    }
  }

  async transcribeAudio(blob, provider, apiKey) {
    // For now, use OpenAI Whisper as it's the most reliable
    // In the future, we can implement provider-specific audio transcription
    return await this.transcribeWithOpenAI(blob, apiKey);
  }

  async transcribeWithOpenAI(blob, apiKey) {
    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Transcription failed');
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      throw new Error(`Transcription error: ${error.message}`);
    }
  }

  async getAIResponse(question, resume, provider, apiKey) {
    const systemPrompt = `You are helping in a live interview. Use the following resume to answer as if you are the candidate. Ignore any unrelated speech or background talk. Focus on the actual interview question and answer smartly as per the resume.\n\nResume:\n${resume}`;
    
    try {
      if (provider === 'ollama') {
        const model = document.getElementById('ollama-model-select').value;
        return await this.callOllamaAPI(question, systemPrompt, model);
      } else if (provider === 'gemini') {
        return await this.callGeminiAPI(question, systemPrompt, apiKey);
      } else if (provider === 'openai') {
        return await this.callOpenAIAPI(question, systemPrompt, apiKey);
      } else if (provider === 'grok') {
        return await this.callGrokAPI(question, systemPrompt, apiKey);
      } else if (provider === 'claude') {
        return await this.callClaudeAPI(question, systemPrompt, apiKey);
      }
    } catch (error) {
      throw new Error(`AI API error: ${error.message}`);
    }
  }

  async callGeminiAPI(question, systemPrompt, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nQuestion: ${question}` }]
        }]
      })
    });
    
    if (!response.ok) throw new Error('Gemini API failed');
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  async callOpenAIAPI(question, systemPrompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ]
      })
    });
    
    if (!response.ok) throw new Error('OpenAI API failed');
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async callGrokAPI(question, systemPrompt, apiKey) {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ]
      })
    });
    
    if (!response.ok) throw new Error('Grok API failed');
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async callClaudeAPI(question, systemPrompt, apiKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `${systemPrompt}\n\nQuestion: ${question}` }]
      })
    });
    
    if (!response.ok) throw new Error('Claude API failed');
    
    const data = await response.json();
    return data.content[0].text.trim();
  }

  displayAnswer(answer) {
    this.answerContainer.textContent = answer;
    this.answerContainer.classList.add('has-answer');
  }

  showStatus(message, type = 'info') {
    this.statusIndicator.textContent = message;
    this.statusIndicator.className = `status-indicator ${type}`;
  }

  showInterviewStatus(message, type = 'info') {
    this.interviewStatus.textContent = message;
    this.interviewStatus.className = `status-indicator ${type}`;
  }

  handleKeydown(event) {
    if (!this.isInterviewing) return;
    
    if (event.code === 'Space') {
      event.preventDefault();
      this.toggleRecording();
    }
  }

  minimize() {
    if (window.electronAPI && window.electronAPI.minimize) {
      window.electronAPI.minimize();
    }
  }

  close() {
    if (window.electronAPI && window.electronAPI.close) {
      window.electronAPI.close();
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new InterviewAssistant();
}); 
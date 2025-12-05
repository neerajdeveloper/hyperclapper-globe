/**
 * Sound Manager for Hyperclapper Globe UI
 * Handles background music and event sound effects
 */

class SoundManager {
  constructor() {
    this.isMuted = false;
    this.backgroundMusicStarted = false;
    this.backgroundMusic = null;
    this.likeSound = null;
    this.commentSound = null;
    
    this.init();
  }

  init() {
    // Get audio elements
    this.backgroundMusic = document.getElementById('bg-music');
    this.likeSound = document.getElementById('like-sound');
    this.commentSound = document.getElementById('comment-sound');
    
    // Debug: Check if audio elements exist
    if (!this.backgroundMusic) {
      console.warn('SoundManager: bg-music audio element not found');
    }
    if (!this.likeSound) {
      console.warn('SoundManager: like-sound audio element not found');
    }
    if (!this.commentSound) {
      console.warn('SoundManager: comment-sound audio element not found');
    }
    
    // Set initial volumes
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.08; // 0.05-0.1 range, using 0.08
      this.backgroundMusic.loop = true;
      
      // Handle audio loading errors
      this.backgroundMusic.addEventListener('error', (e) => {
        console.error('SoundManager: Background music failed to load. Make sure assets/bg-music.mp3 exists.', e);
      });
      
      this.backgroundMusic.addEventListener('loadeddata', () => {
        console.log('SoundManager: Background music loaded successfully');
      });
    }
    
    if (this.likeSound) {
      this.likeSound.volume = 0.2; // 0.15-0.25 range, using 0.2
      this.likeSound.addEventListener('error', (e) => {
        console.error('SoundManager: Like sound failed to load. Make sure assets/like.mp3 exists.', e);
      });
    }
    
    if (this.commentSound) {
      this.commentSound.volume = 0.2; // 0.15-0.25 range, using 0.2
      this.commentSound.addEventListener('error', (e) => {
        console.error('SoundManager: Comment sound failed to load. Make sure assets/comment.mp3 exists.', e);
      });
    }
    
    // Set up click listener to start background music (Chrome autoplay workaround)
    this.setupAutoplayWorkaround();
    
    console.log('SoundManager initialized');
  }

  setupAutoplayWorkaround() {
    // Start background music on first user interaction
    const startMusic = () => {
      if (!this.backgroundMusicStarted && this.backgroundMusic && !this.isMuted) {
        this.backgroundMusic.play().catch(err => {
          console.log('Background music autoplay prevented:', err);
        });
        this.backgroundMusicStarted = true;
      }
      // Remove listeners after first click
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };
    
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });
  }

  initializeBackgroundMusic() {
    // Try to start background music immediately (may fail due to autoplay policy)
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.play().then(() => {
        this.backgroundMusicStarted = true;
      }).catch(err => {
        // Autoplay blocked - will start on first user interaction
        console.log('Background music will start on first user interaction');
      });
    }
  }

  playLikeSound() {
    if (this.isMuted) return;
    
    if (!this.likeSound) {
      console.warn('SoundManager: Like sound not available');
      return;
    }
    
    try {
      this.likeSound.currentTime = 0;
      const playPromise = this.likeSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Like sound play error:', err);
        });
      }
    } catch (err) {
      console.error('Like sound play exception:', err);
    }
  }

  playCommentSound() {
    if (this.isMuted) return;
    
    if (!this.commentSound) {
      console.warn('SoundManager: Comment sound not available');
      return;
    }
    
    try {
      this.commentSound.currentTime = 0;
      const playPromise = this.commentSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Comment sound play error:', err);
        });
      }
    } catch (err) {
      console.error('Comment sound play exception:', err);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.backgroundMusic) {
      if (this.isMuted) {
        this.backgroundMusic.pause();
      } else {
        if (this.backgroundMusicStarted) {
          this.backgroundMusic.play().catch(err => {
            console.log('Background music play error:', err);
          });
        } else {
          // Try to start if not started yet
          this.initializeBackgroundMusic();
        }
      }
    }
    
    // Update button text
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
      soundToggleBtn.textContent = this.isMuted ? '🔇 Muted' : '🔊 Sound On';
    }
    
    return this.isMuted;
  }

  isSoundMuted() {
    return this.isMuted;
  }
}

// Create global instance
let soundManager = null;

// Initialize function
function initializeSoundManager() {
  if (!soundManager) {
    console.log('Initializing SoundManager...');
    soundManager = new SoundManager();
    soundManager.initializeBackgroundMusic();
    
    // Export functions for use in main script
    window.playLikeSound = () => {
      if (soundManager) {
        soundManager.playLikeSound();
      } else {
        console.error('SoundManager not initialized yet!');
      }
    };

    window.playCommentSound = () => {
      if (soundManager) {
        soundManager.playCommentSound();
      } else {
        console.error('SoundManager not initialized yet!');
      }
    };

    window.initializeBackgroundMusic = () => {
      if (soundManager) {
        soundManager.initializeBackgroundMusic();
      } else {
        console.error('SoundManager not initialized yet!');
      }
    };

    window.toggleSound = () => {
      if (soundManager) {
        return soundManager.toggleMute();
      } else {
        console.error('SoundManager not initialized yet!');
        return false;
      }
    };
    
    console.log('SoundManager initialized and functions exported');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSoundManager);
} else {
  // DOM already loaded, but wait a bit for audio elements
  setTimeout(initializeSoundManager, 100);
}


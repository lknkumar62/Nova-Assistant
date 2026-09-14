# Maya reference -> NOVA implementation matrix

This document records behavior discovered from the supplied Maya 4.18.5 APK. It is an implementation specification, not a copy of Maya source code or proprietary assets.

## Core runtime
- Foreground/background assistant lifecycle
- Wake-word recognition and wake state
- Voice interaction session
- Native microphone/audio pipeline
- Speech recognition
- Text-to-speech and voice selection
- Interrupt/barge-in handling
- Conversation history and chat UI
- Settings and assistant preferences
- Notifications, reminders and phone-state events
- Accessibility/device automation where Android permissions allow it
- Guardian/safety gate for background voice
- ML assets for wake word, VAD/guardian and barcode features

## Voice/ML observations
Maya contains dedicated TFLite assets for mel spectrogram, embeddings and multiple wake phrases, plus Guardian ECAPA/VAD models. NOVA will use the same architectural separation (wake detector -> VAD -> STT -> AI -> TTS -> playback) with independently implemented code and legally usable model assets.

## UI contract
- Home: full-screen assistant focus with NOVA quantum orb
- Chat: message timeline, composer, voice affordance
- Voice: wake-word, microphone and voice controls
- Tools: device and assistant actions
- Settings: voice, wake, privacy, background behavior and provider settings
- Persistent bottom navigation with active state
- Dark, glassy, high-contrast visual system

## Completion rule
A feature is considered complete only when its UI state, service/API boundary, Android permission handling, failure path and build integration are implemented and verified. Stubs must be explicitly marked as stubs; they are not counted as complete features.

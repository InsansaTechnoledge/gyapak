# 🎓 AI Proctoring Engine (C++)

Welcome to the AI Proctoring Engine — your digital exam invigilator, built to help ensure academic integrity in online tests.

This project is designed like a real-world proctor, equipped with:

- 👁 **Eyes** (to detect if you're present and alone)
- 🧠 **Awareness** (to notice if you leave the test window)
- 👂 **Ears** (to listen for suspicious noises)

It works seamlessly with a MERN-based test platform via **Socket.IO** to report suspicious activities in real-time.

---

## 📦 Features

- Real-time **face detection** via webcam
- **Screen monitoring** to detect window switches
- **Audio monitoring** to detect loud/unusual sounds
- **Cross-platform**: Windows & Linux supported
- **Socket.IO** integration for real-time event logging
- **Modular design** with clean separation of concerns
- **Multi-threaded** for performance and responsiveness

---

## 🧠 Understanding the System (Like a Teacher Would)

### 1. The Big Picture

This program is like a vigilant virtual invigilator.

| Sense | Component | Role |
|-------|-----------|------|
| 👁 Eye | `FaceDetector` | Detect faces from the webcam |
| 🖥 Awareness | `ScreenMonitor` | Check if you switch away from test window |
| 👂 Ear | `AudioMonitor` | Listen for loud noise via microphone |
| 📡 Voice | `EventEmitter` | Report events to server |
| 🧠 Brain | `ProctorEngine` | Coordinate all sensors and send alerts |

---

### 2. Component Breakdown

#### 🧠 `ProctorEngine`
The central brain of the system. It:
- Initializes all modules
- Runs a loop every second to check face, screen, and sound
- Sends events when suspicious behavior is detected

#### 👁 `FaceDetector`
- Uses OpenCV to access the webcam
- Continuously captures frames
- Detects if **no face** (user left) or **multiple faces** (cheating)

#### 🖥 `ScreenMonitor`
- Checks the **active window title**
- Uses platform-specific APIs (WinAPI / Xlib)
- Alerts if the user switches to a different app

#### 👂 `AudioMonitor` *(Optional)*
- Uses PortAudio to monitor sound input
- Calculates audio loudness (RMS)
- Sends alert on loud or unexpected noise

#### 📡 `EventEmitter`
- Uses Socket.IO to connect to backend
- Sends events in JSON format
- Includes metadata: `userId`, `examId`, `eventType`, `timestamp`

---

## 🧪 Example in Action

If a student switches to Chrome during an exam:
1. `ScreenMonitor` detects window title change
2. `ProctorEngine` constructs a `ProctorEvent`
3. `EventEmitter` sends:
   ```json
   {
     "userId": "student123",
     "examId": "math101",
     "eventType": "screen_change",
     "timestamp": "2025-04-16T14:30:45.123Z",
     "details": "Window changed to: Google Chrome"
   }


## flow of how this algo shall work and test submittion 

C++ Proctor Engine
Detects suspicious events

Sends them via Socket.IO or IPC to Electron/web app

2. Frontend Receives Logs
Maintains a warning counter

When counter reaches 5 warnings, do:

🔒 Lock the UI

⏱ End the test

✅ Auto-submit answers

🚫 Show “Test terminated due to proctoring violations”

3. Optional: Backend Sync
Send a final POST to backend to:

Mark test as invalid

Store a reason like "Auto-terminated after 5 proctoring alerts"

## place to handle 

Function	                        Place to Handle
Face/audio/screen detection	        🔹 C++ Engine
Counting warnings	                ✅ Frontend (Electron/React)
Deciding when to close the test	    ✅ Frontend
Displaying UI messages	            ✅ Frontend
Sending logs to backend	            🔸 C++ + Frontend
Final test submission	            ✅ Frontend

## file structure and components 

proctor-engine/
├── CMakeLists.txt                 # Main CMake configuration file
├── include/                       # Header files
│   ├── proctor_engine.h           # Main engine coordination
│   ├── face_detector.h            # OpenCV face detection
│   ├── screen_monitor.h           # Screen/window change detection
│   ├── audio_monitor.h            # Audio level monitoring
│   ├── event_emitter.h            # Socket.IO communication
│   └── utils.h                    # Utility functions
│
├── src/                           # Implementation files
│   ├── main.cpp                   # Entry point
│   ├── proctor_engine.cpp         # Main engine implementation
│   ├── face_detector.cpp          # Face detection implementation
│   ├── screen_monitor.cpp         # Screen monitoring implementation
│   ├── audio_monitor.cpp          # Audio monitoring implementation
│   ├── event_emitter.cpp          # Event emission implementation
│   └── utils.cpp                  # Utility implementation
│
├── demo/                          # Demo application
│   └── proctor_demo.cpp           # Sample usage demo
│
├── server/                        # Sample server implementation
│   └── proctor_server.js          # Socket.IO server to receive events
│
└── README.md                      # Documentation
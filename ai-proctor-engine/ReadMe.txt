# AI Proctoring Engine

A production-ready C++ AI Proctoring engine that can be integrated with an Electron-based test-taking interface. This engine includes real-time face detection using OpenCV, screen switch detection, and microphone noise monitoring.

## Features

- **Face Detection**: Uses OpenCV to detect 0, 1, or multiple faces in the camera feed
- **Screen Monitoring**: Detects when user switches between applications or windows
- **Audio Monitoring**: Detects high levels of audio that might indicate communication with others
- **Real-time Event Emission**: Sends events to a server using Socket.IO
- **Resilient Operation**: Handles errors gracefully and attempts to recover from failures

## Prerequisites

To build and run this project, you'll need:

- C++17 compatible compiler (GCC 8+, MSVC 2019+, Clang 6+)
- CMake 3.10+
- OpenCV 4.x
- Socket.IO Client C++ (sioclient)
- PortAudio
- nlohmann/json
- On Linux: X11 development libraries
- On Windows: WinAPI (included with Windows SDK)

## Building the Project

### Installing Dependencies

#### On Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install build-essential cmake libopencv-dev libportaudio2 libportaudiocpp0 portaudio19-dev libx11-dev
```

You'll need to build Socket.IO Client C++ from source:

```bash
git clone https://github.com/socketio/socket.io-client-cpp.git
cd socket.io-client-cpp
mkdir build && cd build
cmake ..
make -j4
sudo make install
```

#### On Windows

1. Install [Visual Studio](https://visualstudio.microsoft.com/) with C++ development tools
2. Install [CMake](https://cmake.org/download/)
3. Install [vcpkg](https://github.com/microsoft/vcpkg) and use it to install dependencies:

```bash
vcpkg install opencv:x64-windows
vcpkg install portaudio:x64-windows
vcpkg install sioclient:x64-windows
vcpkg install nlohmann-json:x64-windows
```

### Building the Project

1. Clone this repository
2. Create a build directory and run CMake:

```bash
mkdir build && cd build
cmake ..
```

3. Build the project:

On Linux/macOS:
```bash
make -j4
```

On Windows:
```bash
cmake --build . --config Release
```

## Usage

Run the proctor engine with the following command:

```bash
./proctor_engine --user-id USER_ID --exam-id EXAM_ID --socket-url SOCKET_URL
```

Where:
- `USER_ID` is a unique identifier for the test-taker
- `EXAM_ID` is a unique identifier for the exam session
- `SOCKET_URL` is the URL of the Socket.IO server (e.g., http://localhost:3000)

### Integrating with Electron

This proctoring engine is designed to be integrated with an Electron-based test-taking interface. There are several ways to integrate:

1. **Subprocess approach**: Launch the proctor engine as a subprocess from your Electron app
2. **Native Node.js addon**: Wrap the engine as a native Node.js addon
3. **Inter-process communication**: Use IPC to communicate between the engine and your Electron app

Example of launching as a subprocess from Electron:

```javascript
const { spawn } = require('child_process');
const proctorProcess = spawn('./proctor_engine', [
  '--user-id', userId,
  '--exam-id', examId,
  '--socket-url', 'http://your-server.com'
]);

proctorProcess.stdout.on('data', (data) => {
  console.log(`Proctor output: ${data}`);
});

proctorProcess.stderr.on('data', (data) => {
  console.error(`Proctor error: ${data}`);
});

// To stop the proctoring when exam is over
function stopProctoring() {
  proctorProcess.kill();
}
```

## Socket.IO Events

The engine emits events with the following format:

```json
{
  "userId": "user-123",
  "examId": "exam-456",
  "eventType": "face_detection",
  "timestamp": "2025-04-16T14:30:45.123Z",
  "details": "Multiple faces detected: 2"
}
```

Event types include:
- `session_start`: When proctoring session begins
- `session_end`: When proctoring session ends
- `face_detection`: When face count changes (0, 1, or multiple)
- `screen_change`: When user switches windows/applications
- `audio_detection`: When high audio levels are detected

## Server Example

Here's a simple Node.js server example that receives and logs proctoring events:

```javascript
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Proctor client connected');
  
  socket.on('proctor:log', (eventData) => {
    const event = JSON.parse(eventData);
    console.log(`[${event.timestamp}] ${event.eventType} - ${event.details}`);
    
    // Here you could:
    // - Store events in a database
    // - Alert instructors about suspicious activity
    // - Take automated actions based on event types
  });
  
  socket.on('disconnect', () => {
    console.log('Proctor client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

## License

[MIT License](LICENSE)
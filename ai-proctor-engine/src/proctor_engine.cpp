#include "proctor_engine.h"
#include "event_emitter.h"  
// #include "proctor_event.h"
#include "screen_monitor.h" 
#include "event_sender.h"

#include "utils.h"
#include <iostream>
#include <chrono>
#include <thread>
#include <csignal>
#include <iomanip>
#include <sstream>
#include <mutex>
#include <exception>


// Global pointer for signal handling
static ProctorEngine* g_engineInstance = nullptr;

// Signal handler
void signalHandler(int signum) {
    if (g_engineInstance) {
        utils::log("Signal received, initiating graceful shutdown...");
        g_engineInstance->stop();
    }
}

#include "event_emitter.h"  // Make sure this is included at the top

ProctorEngine::ProctorEngine(const std::string& userId, const std::string& examId, const std::string& socketUrl)
    : userId_(userId), examId_(examId), socketUrl_(socketUrl), running_(false) {
    
    g_engineInstance = this;

    // Set up signal handling
    std::signal(SIGINT, signalHandler);
    std::signal(SIGTERM, signalHandler);

    // 👇 Initialize and connect EventEmitter
    std::string emitUrl = socketUrl_.empty() 
        ? "http://localhost:8383/emit-event"
        : socketUrl_;

    eventEmitter_ = std::make_shared<EventEmitter>(emitUrl);
    eventEmitter_->connect();
}

ProctorEngine::~ProctorEngine() {
    try {
        std::cout << "🧹 ProctorEngine destructor called\n";
        stop();  // Already handles checks
        g_engineInstance = nullptr;

        if (monitorThread_.joinable()) {
            monitorThread_.join();
            utils::log("Monitor thread joined.");
        }
        
    } catch (const std::exception& e) {
        utils::log("❌ Exception in ProctorEngine destructor: " + std::string(e.what()));
    } catch (...) {
        utils::log("❌ Unknown error in ProctorEngine destructor");
    }
}


// bool ProctorEngine::initialize() {
//     try {
//         utils::log("Initializing Proctor Engine...");

//         if (!screenMonitor_.initialize()) {
//             utils::log("Failed to initialize Screen Monitor");
//             return false;
//         }

//         faceDetector_ = std::make_unique<FaceDetector>();
//         if (!faceDetector_->initialize()) {
//             utils::log("Failed to initialize Face Detector");
//             return false;
//         }

//         utils::log("Proctor Engine initialized successfully");
//         return true;
//     }
//     catch (const std::exception& e) {
//         utils::log("Exception during initialization: " + std::string(e.what()));
//         return false;
//     }
// }

bool ProctorEngine::initialize() {
    try {
        utils::log("Initializing Proctor Engine...");

        eventEmitter_ = std::make_shared<EventEmitter>(socketUrl_);
        eventEmitter_->connect(); // Start the thread

        // 1. Initialize Screen Monitor
        if (!screenMonitor_.initialize()) {
            utils::log("❌ Failed to initialize Screen Monitor");
            return false;
        }

        // 2. Initialize Face Detector
        faceDetector_ = std::make_unique<FaceDetector>();
        if (!faceDetector_->initialize()) {
            utils::log("❌ Failed to initialize Face Detector");
            return false;
        }

        // 3. Initialize Event Emitter (optional if not connected)
        // eventEmitter_ = std::make_shared<EventEmitter>(socketUrl_);
        // if (!eventEmitter_->connect()) {
        //     utils::log("⚠️ Could not connect to event server (Socket.IO)");
        //     // Optionally return false here or run in offline mode
        // }

        utils::log("✅ Proctor Engine initialized successfully");
        return true;
    }
    catch (const std::exception& e) {
        utils::log("🚨 Exception during initialization: " + std::string(e.what()));
        return false;
    }
}


void ProctorEngine::start() {
    if (running_.exchange(true)) {
        return; // Already running
    }
    
    utils::log("Starting proctoring session...");
    
    // Start components
    if (faceDetector_) {
        faceDetector_->startCapture();
    }
    
    
    // Start monitoring loop
    monitorThread_ = std::thread(&ProctorEngine::monitorLoop, this);
    
    // Emit session start event
    ProctorEvent startEvent{
        userId_,
        examId_,
        "session_start",
        utils::getCurrentTimestamp(),
        "Proctoring session started"
    };
    
    if (eventEmitter_) {
        eventEmitter_->emitEvent(startEvent);
    }
}

void ProctorEngine::stop() {
    if (!running_.exchange(false)) {
        return; // Already stopped
    }
    
    utils::log("Stopping proctoring session...");
    
    // Emit session end event
    ProctorEvent endEvent{
        userId_,
        examId_,
        "session_end",
        utils::getCurrentTimestamp(),
        "Proctoring session ended"
    };
    
    if (eventEmitter_) {
        eventEmitter_->emitEvent(endEvent);
    }
    
    // Stop components
    // if (faceDetector_) {
    //     faceDetector_->stopCapture();
    // }

    utils::log("Proctoring session stopped");
}

bool ProctorEngine::isRunning() const {
    return running_;
}

void ProctorEngine::monitorLoop() {
    int consecutiveFailures = 0;
    const int MAX_FAILURES = 5;

    std::string lastWindowTitle = screenMonitor_.getCurrentWindowTitle();
    int lastFaceCount = 1;

    while (running_) {
        try {
            // ✅ Face Detection - always log, emit on change
            int faceCount = faceDetector_->detectFaces();
            utils::log("Detected faces: " + std::to_string(faceCount));

            if (faceCount != lastFaceCount) {
                std::string details = (faceCount == 0) ? "No face detected"
                                      : (faceCount > 1) ? "Multiple faces detected: " + std::to_string(faceCount)
                                      : "Face detection normalized";

                ProctorEvent faceEvent{userId_, examId_, "face_detection", utils::getCurrentTimestamp(), details};
                lastFaceCount = faceCount;

                if (eventEmitter_) {
                    
                    eventEmitter_->emitEvent(faceEvent);
                    utils::log("📤 [Face JSON] " + utils::formatEventJson(
                        faceEvent.userId, faceEvent.examId, faceEvent.eventType, faceEvent.details));
                }
            }

            // ✅ Screen Monitoring
            std::string newTitle;
            if (screenMonitor_.detectScreenChange(newTitle)) {
                std::string prevTitle = lastWindowTitle;
                utils::log("Active window changed from: " + prevTitle + " → " + newTitle);
                lastWindowTitle = newTitle;

                ProctorEvent screenEvent{userId_, examId_, "window_change", utils::getCurrentTimestamp(), newTitle};
                if (eventEmitter_) {
                    eventEmitter_->emitEvent(screenEvent);
                    utils::log("📤 [Window JSON] " + utils::formatEventJson(
                        screenEvent.userId, screenEvent.examId, screenEvent.eventType, screenEvent.details));
                }
            }

            consecutiveFailures = 0;
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
        catch (const std::exception& e) {
            utils::log("Error in monitor loop: " + std::string(e.what()));
            if (++consecutiveFailures >= MAX_FAILURES) {
                utils::log("Too many failures, restarting FaceDetector");
                if (faceDetector_) {
                    faceDetector_->stopCapture();
                    faceDetector_->initialize();
                    faceDetector_->startCapture();
                }
                consecutiveFailures = 0;
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(500));
        }
    }
}

void ProctorEngine::handleGracefulShutdown() {
    stop();
}

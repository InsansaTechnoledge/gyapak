#include "proctor_engine.h"
#include "proctor_event.h"
#include "frame_queue.h"

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

ProctorEngine::ProctorEngine(const std::string& userId, const std::string& examId, const std::string& socketUrl, FrameQueue& queue)
    : userId_(userId), examId_(examId), socketUrl_(socketUrl), running_(false), frameQueue_(queue) {
    g_engineInstance = this;

    std::signal(SIGINT, signalHandler);
    std::signal(SIGTERM, signalHandler);
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


bool ProctorEngine::initialize() {
    try {
        utils::log("Initializing Proctor Engine...");
        
        // Initialize components
        // faceDetector_ = std::make_unique<FaceDetector>();
        faceDetector_ = std::make_unique<FaceDetector>(frameQueue_);

        if (!faceDetector_->initialize()) {
            utils::log("Failed to initialize Face Detector");
            return false;
        }
        
        utils::log("Proctor Engine initialized successfully");
        return true;
    }
    catch (const std::exception& e) {
        utils::log("Exception during initialization: " + std::string(e.what()));
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
    
    // if (eventEmitter_) {
    //     eventEmitter_->emitEvent(startEvent);
    // }
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
    
    // if (eventEmitter_) {
    //     eventEmitter_->emitEvent(endEvent);
    // }
    
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
    
    
    std::string lastWindowTitle;
    int lastFaceCount = 1;  // Assume starting with one face
    
    while (running_) {
        try {
            // Check for faces
            int faceCount = faceDetector_->detectFaces();
            utils::log("Detected faces: " + std::to_string(faceCount));

            if (faceCount != lastFaceCount) {
                std::string details;
                
                if (faceCount == 0) {
                    details = "No face detected";
                } else if (faceCount > 1) {
                    details = "Multiple faces detected: " + std::to_string(faceCount);
                } else {
                    details = "Face detection normalized";
                }
                
                ProctorEvent faceEvent{
                    userId_,
                    examId_,
                    "face_detection",
                    utils::getCurrentTimestamp(),
                    details
                };
                // if(eventEmitter_) {
                //     eventEmitter_->emitEvent(faceEvent);
                // }
                lastFaceCount = faceCount;
            }
            
            
            // Reset failure counter on successful iteration
            consecutiveFailures = 0;
            
            // Wait for next check interval (1 second)
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
        catch (const std::exception& e) {
            utils::log("Error in monitor loop: " + std::string(e.what()));
            consecutiveFailures++;
            
            if (consecutiveFailures >= MAX_FAILURES) {
                utils::log("Too many consecutive failures, restarting components...");
                
                // Try to reinitialize components
                try {
                    if (faceDetector_) {
                        faceDetector_->stopCapture();
                        faceDetector_->initialize();
                        faceDetector_->startCapture();
                    }
                    
                    // Reset counter after recovery attempt
                    consecutiveFailures = 0;
                }
                catch (const std::exception& e) {
                    utils::log("Failed to recover components: " + std::string(e.what()));
                }
            }
            
            // Short delay before retrying
            std::this_thread::sleep_for(std::chrono::milliseconds(500));
        }
    }
}

void ProctorEngine::handleGracefulShutdown() {
    stop();
}

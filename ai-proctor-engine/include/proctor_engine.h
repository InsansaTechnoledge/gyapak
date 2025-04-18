#pragma once 

#include <iostream>
#include <atomic>
#include <memory>
#include <thread>
#include "face_detector.h"
#include "screen_monitor.h"  // ✅ Include this
#include "event_emitter.h" // ✅ Required to declare EventEmitter


class ProctorEngine {
public:
    ProctorEngine(const std::string& userId , const std::string& examId, const std::string& socketUrl);
    ~ProctorEngine();

    bool initialize();
    void start();
    void stop();
    bool isRunning() const;

private:
    std::string userId_;
    std::string examId_;
    std::string socketUrl_;
    
    std::atomic<bool> running_;
    std::thread monitorThread_;

    std::unique_ptr<FaceDetector> faceDetector_;
    ScreenMonitor screenMonitor_;  // ✅ Add screen monitor instance

    std::shared_ptr<EventEmitter> eventEmitter_;

    void monitorLoop();
    void handleGracefulShutdown();
};

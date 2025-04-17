#pragma once 

#include<iostream>
#include<atomic>
#include<memory>
#include<thread>
#include "face_detector.h"
#include "frame_queue.h"


// std::shared_ptr<EventEmitter> eventEmitter_;

class ProctorEngine {
    public:

        ProctorEngine(const std::string& userId , const std::string& examId, const std::string& socketUrl, FrameQueue& frameQueue);
        ~ProctorEngine();

        bool initialize();
        void start();
        void stop();
        bool isRunning() const;

    private:
        FrameQueue& frameQueue_;
        std::string userId_;
        std::string examId_;
        std::string socketUrl_;
        
        std::atomic<bool> running_;
        std::thread monitorThread_;

        std::unique_ptr<FaceDetector> faceDetector_;

        std::shared_ptr<void> eventEmitter_;  // Dummy placeholder to prevent compile errors



        void monitorLoop();
        void handleGracefulShutdown();

};
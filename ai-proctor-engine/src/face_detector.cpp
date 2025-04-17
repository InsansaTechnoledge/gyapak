#include "face_detector.h"
#include "frame_queue.h"
#include "utils.h"
#include <iostream>
#include <thread>
#include <stdexcept>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <mutex>
#include <exception>

// FaceDetector::FaceDetector() : isRunning_(false) {}

FaceDetector::FaceDetector(FrameQueue& sharedQueue)
    : frameQueue_(sharedQueue), isRunning_(false) {}


FaceDetector::~FaceDetector() {
    try {
        stopCapture();
        utils::log("🧹 FaceDetector destructor complete.");
    } catch (const std::exception& e) {
        utils::log("❌ Exception in FaceDetector destructor: " + std::string(e.what()));
    } catch (...) {
        utils::log("❌ Unknown error in FaceDetector destructor");
    }
}



bool FaceDetector::initialize() {
    try {
        std::string cascadePath = cv::samples::findFile("haarcascades/haarcascade_frontalface_default.xml");
        if (!faceCascade_.load(cascadePath)) {
            utils::log("Error: could not load face cascade");
            return false;
        }
        return true;
    } catch (const std::exception& e) {
        utils::log("Exception in faceDetector initialization: " + std::string(e.what()));
        return false;
    }
}

bool FaceDetector::startCapture() {
    if (isRunning_.exchange(true)) {
        return true;
    }

    try {
        capture_.open(0);
        if (!capture_.isOpened()) {
            utils::log("Error: could not open camera");
            isRunning_ = false;
            return false;
        }

        CaptureThread_ = std::thread(&FaceDetector::captureLoop, this);
        utils::log("Capture thread started.");
        return true;
    } catch (const std::exception& e) {
        utils::log("Exception in starting faceDetector: " + std::string(e.what()));
        isRunning_ = false;
        return false;
    }
}

void FaceDetector::stopCapture() {
    if (!isRunning_.exchange(false)) {
        return;  // Already stopped
    }

    if (CaptureThread_.joinable()) {
        CaptureThread_.join();
        utils::log("Capture thread joined.");
    }

    if (capture_.isOpened()) {
        capture_.release();
    }

    utils::log("Face detector stopped and cleaned up.");
}


void FaceDetector::captureLoop() {
    while (isRunning_) {
        try {
            cv::Mat frame;

            if (!capture_.read(frame)) {
                utils::log("Error: failed to capture frame");
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
                continue;
            }

            if (frame.empty()) {
                utils::log("Error: empty frame captured");
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
                continue;
            }

            {
                std::lock_guard<std::mutex> lock(frameMutex_);
                currentFrame_ = frame.clone();
            }

            frameQueue_.push(frame); // send to UI

            std::this_thread::sleep_for(std::chrono::milliseconds(30));
        } catch (const std::exception& e) {
            utils::log("Exception in capture loop: " + std::string(e.what()));
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    }
}

int FaceDetector::detectFaces() {
    try {
        cv::Mat frame;

        {
            std::lock_guard<std::mutex> lock(frameMutex_);
            if (currentFrame_.empty()) {
                return 0;
            }
            frame = currentFrame_.clone();
        }

        cv::Mat frameGray;
        cv::cvtColor(frame, frameGray, cv::COLOR_BGR2GRAY);
        cv::equalizeHist(frameGray, frameGray);

        std::vector<cv::Rect> faces;
        
        faceCascade_.detectMultiScale(
            frameGray,
            faces,
            1.1,        
            5,          
            0 | cv::CASCADE_SCALE_IMAGE,
            cv::Size(80, 80)  
        );
        
        return static_cast<int>(faces.size());
    } catch (const std::exception& e) {
        utils::log("Exception in detectFaces: " + std::string(e.what()));
        return 0;
    }
    // this is just some random comment
}

cv::Mat FaceDetector::getCurrentFrame() {
    std::lock_guard<std::mutex> lock(frameMutex_);
    return currentFrame_.clone();
}

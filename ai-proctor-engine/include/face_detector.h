#pragma once
#include <opencv2/opencv.hpp>
#include <opencv2/dnn.hpp>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <atomic>

class FaceDetector {
public:
    FaceDetector();
    ~FaceDetector();

    bool initialize();
    bool startCapture();
    void stopCapture();
    int detectFaces();               // Waits for new frame
    cv::Mat getCurrentFrame();       // Access latest frame (thread-safe)

private:
    cv::VideoCapture capture_;
    std::thread CaptureThread_;
    std::mutex frameMutex_;
    std::condition_variable frameReady_;
    std::atomic<bool> isRunning_;
    cv::Mat currentFrame_;

    // DNN-specific
    cv::dnn::Net faceNet_;
    float confidenceThreshold_ = 0.5f;

    void captureLoop();
};

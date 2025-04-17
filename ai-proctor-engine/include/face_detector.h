#pragma once
#include <opencv2/opencv.hpp>
#include <opencv2/dnn.hpp>
#include <thread>
#include <mutex>
#include <atomic>

class FaceDetector {
public:
    FaceDetector();
    ~FaceDetector();

    bool initialize();
    bool startCapture();
    void stopCapture();
    int detectFaces();
    cv::Mat getCurrentFrame();

private:
    cv::VideoCapture capture_;
    std::thread CaptureThread_;
    std::mutex frameMutex_;
    std::atomic<bool> isRunning_;
    cv::Mat currentFrame_;

    // DNN-specific
    cv::dnn::Net faceNet_;
    float confidenceThreshold_ = 0.5f;

    void captureLoop();
};

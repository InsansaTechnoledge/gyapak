#pragma once

#include<iostream>
#include<atomic>
#include<mutex>
#include <opencv2/opencv.hpp>
#include<string>
#include<vector>

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
        cv::CascadeClassifier faceCascare_;
        std::mutex frameMutex_;
        cv::Mat currentFrame_;
        std::atomic<bool> isRunning_;
        std::thread CaptureThread_;

        void captureLoop();
};


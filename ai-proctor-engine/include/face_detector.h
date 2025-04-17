#pragma once
#include <thread>
#include <mutex>
#include <atomic>
#include<iostream>
#include <opencv2/opencv.hpp>
#include<string>
#include<vector>
#include "frame_queue.h"

class FaceDetector {
    public:
        // FaceDetector();
        FaceDetector(FrameQueue& sharedQueue);
        ~FaceDetector();

        bool initialize();
        bool startCapture();
        void stopCapture();
        int detectFaces();
        cv::Mat getCurrentFrame();

    private:
        FrameQueue& frameQueue_;
        cv::VideoCapture capture_;
        cv::CascadeClassifier faceCascade_;
        std::mutex frameMutex_;
        cv::Mat currentFrame_;
        std::atomic<bool> isRunning_;
        std::thread CaptureThread_;

        void captureLoop();
};


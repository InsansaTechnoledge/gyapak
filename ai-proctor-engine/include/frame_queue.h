#pragma once
#include <queue>
#include <mutex>
#include <condition_variable>
#include <opencv2/opencv.hpp>

class FrameQueue {
public:
    void push(const cv::Mat& frame) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (queue_.size() > maxSize_) queue_.pop(); // drop oldest
        queue_.push(frame.clone());
        cond_.notify_one();
    }

    bool pop(cv::Mat& frame) {
        std::unique_lock<std::mutex> lock(mutex_);
        cond_.wait(lock, [&]() { return !queue_.empty(); });
        frame = queue_.front().clone();
        queue_.pop();
        return true;
    }

private:
    std::queue<cv::Mat> queue_;
    std::mutex mutex_;
    std::condition_variable cond_;
    const size_t maxSize_ = 10;
};

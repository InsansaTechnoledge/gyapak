#include "proctor_engine.h"
#include "frame_queue.h"       // You’ll create this
#include <opencv2/opencv.hpp>
#include <iostream>
#include <thread>
#include <chrono>

int main() {
    try {
        FrameQueue frameQueue;

        ProctorEngine engine("user123", "exam123", "", frameQueue);
        if (!engine.initialize()) {
            std::cerr << "❌ Failed to initialize engine.\n";
            return 1;
        }

        engine.start();

        // Viewer loop (main thread)
        cv::namedWindow("Live Feed", cv::WINDOW_AUTOSIZE);
        cv::Mat frame;
        for (int i = 0; i < 100 && engine.isRunning(); ++i) {
            if (frameQueue.pop(frame)) {
                cv::imshow("Live Feed", frame);
            }

            if (cv::waitKey(10) == 27) {  // ESC to exit early
                engine.stop();
                break;
            }
        }

        engine.stop();
        std::cout << "✅ Engine completed successfully.\n";
        cv::destroyAllWindows();
    }
    catch (const std::exception& e) {
        std::cerr << "🚨 Unhandled exception in main: " << e.what() << std::endl;
    }
    catch (...) {
        std::cerr << "🚨 Unknown fatal error in main." << std::endl;
    }

    return 0;
}

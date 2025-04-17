#include "proctor_engine.h"
#include "screen_monitor.h"
#include <iostream>
#include <thread>
#include <chrono>
#include <atomic>

int main() {
    try {
        ProctorEngine engine("user123", "exam123", "");

        // Initialize Proctor Engine
        if (!engine.initialize()) {
            std::cerr << "❌ Failed to initialize engine.\n";
            return 1;
        }

        // Initialize Screen Monitor
        ScreenMonitor screenMonitor;
        if (!screenMonitor.initialize()) {
            std::cerr << "❌ Failed to initialize screen monitor.\n";
            return 1;
        }

        // Flag to control monitoring thread
        std::atomic<bool> running(true);

        // Background thread for screen monitoring
        std::thread monitorThread([&]() {
            while (running) {
                std::string newTitle;

                if (screenMonitor.detectScreenChange(newTitle)) {
                    std::cout << "🖥️ Active Window: " << newTitle << "\n";
                }
                std::this_thread::sleep_for(std::chrono::seconds(1));
            }
        });

        engine.start();
        std::this_thread::sleep_for(std::chrono::seconds(10));
        engine.stop();

        running = false;
        if (monitorThread.joinable()) monitorThread.join();

        std::cout << "✅ Engine completed successfully.\n";
    }
    catch (const std::exception& e) {
        std::cerr << "🚨 Unhandled exception in main: " << e.what() << std::endl;
    }
    catch (...) {
        std::cerr << "🚨 Unknown fatal error in main." << std::endl;
    }

    return 0;
}

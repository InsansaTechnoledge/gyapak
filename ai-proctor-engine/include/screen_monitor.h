#ifndef SCREEN_MONITOR_H
#define SCREEN_MONITOR_H

#include <string>
#include <atomic>
#include <vector>
#include <chrono>

#ifdef __linux__
#include <X11/Xlib.h>
#endif

class ScreenMonitor {
public:
    ScreenMonitor();
    ~ScreenMonitor();

    bool initialize();
    bool detectScreenChange(std::string& newTitle);
    std::string getCurrentWindowTitle() const;

private:
#ifdef _WIN32
    void* lastActiveWindow_;  // HWND
#elif __APPLE__
    pid_t lastAppPID_;
#elif __linux__
    Display* display_;             // ✅ ADD THIS LINE
    unsigned long lastActiveWindow_;
#endif

    std::string lastWindowTitle_;
    std::chrono::time_point<std::chrono::steady_clock> lastFocusTime_;

    std::string getActiveWindowTitlePlatform();
};

#endif  // SCREEN_MONITOR_H

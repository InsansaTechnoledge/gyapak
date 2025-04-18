#include "screen_monitor.h"
#include "utils.h"
#include <iostream>

#ifdef __APPLE__
#include <unistd.h>
#include <ApplicationServices/ApplicationServices.h>
#include <CoreFoundation/CoreFoundation.h>
#endif

ScreenMonitor::ScreenMonitor() {
#ifdef _WIN32
    lastActiveWindow_ = nullptr;
#elif __APPLE__
    lastAppPID_ = -1;
#else
    display_ = XOpenDisplay(nullptr);
    lastActiveWindow_ = 0;
#endif
    lastFocusTime_ = std::chrono::steady_clock::now();
}

ScreenMonitor::~ScreenMonitor() {
    #if defined(__linux__)
        if (display_) XCloseDisplay(display_);
    #endif
    }
    
bool ScreenMonitor::initialize() {
    lastWindowTitle_ = getActiveWindowTitlePlatform();
    return !lastWindowTitle_.empty();
}
bool ScreenMonitor::detectScreenChange(std::string& newTitle) {
    newTitle = getActiveWindowTitlePlatform();
    if (newTitle != lastWindowTitle_) {
        lastWindowTitle_ = newTitle;
        lastFocusTime_ = std::chrono::steady_clock::now();
        return true;
    }
    return false;
}


std::string ScreenMonitor::getCurrentWindowTitle() const {
    return lastWindowTitle_;
}


// Platform-specific implementation
std::string ScreenMonitor::getActiveWindowTitlePlatform() {
#ifdef _WIN32
    char title[256];
    HWND hwnd = GetForegroundWindow();
    if (hwnd && GetWindowTextA(hwnd, title, sizeof(title))) {
        lastActiveWindow_ = hwnd;
        return std::string(title);
    }
    return "";

#elif __APPLE__
    CFArrayRef windowList = CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly, kCGNullWindowID);
    std::string result = "";

    if (windowList) {
        for (CFIndex i = 0; i < CFArrayGetCount(windowList); ++i) {
            CFDictionaryRef window = static_cast<CFDictionaryRef>(CFArrayGetValueAtIndex(windowList, i));
            CFStringRef titleRef = static_cast<CFStringRef>(CFDictionaryGetValue(window, kCGWindowName));

            if (titleRef) {
                char buffer[256];
                CFStringGetCString(titleRef, buffer, sizeof(buffer), kCFStringEncodingUTF8);
                result = std::string(buffer);
                break;
            }
        }
        CFRelease(windowList);
    }
    return result;

#else
    Atom actualType;
    int actualFormat;
    unsigned long nItems, bytesAfter;
    unsigned char* prop;
    Window window;
    char* windowName = nullptr;

    if (!display_) return "";

    XGetInputFocus(display_, &window, reinterpret_cast<int*>(&actualType));
    if (window == 0) return "";

    Atom netWmName = XInternAtom(display_, "_NET_WM_NAME", False);
    Atom utf8Str = XInternAtom(display_, "UTF8_STRING", False);

    if (XGetWindowProperty(display_, window, netWmName, 0, (~0L), False, utf8Str,
                           &actualType, &actualFormat, &nItems, &bytesAfter, &prop) == Success) {
        if (prop) {
            std::string title = reinterpret_cast<char*>(prop);
            XFree(prop);
            return title;
        }
    }

    // fallback
    if (XFetchName(display_, window, &windowName) > 0) {
        std::string title(windowName);
        XFree(windowName);
        return title;
    }

    return "";
#endif
}

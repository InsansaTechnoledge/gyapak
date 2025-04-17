#include "utils.h"
#include <iostream>
#include <iomanip>
#include <sstream>
#include <ctime>

namespace utils {

std::string getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);

    char buf[100];
    std::strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", std::localtime(&time));
    return std::string(buf);
}

std::string formatEventJson(const std::string& userId,
                            const std::string& examId,
                            const std::string& eventType,
                            const std::string& details) {
    std::ostringstream oss;
    oss << "{"
        << "\"userId\":\"" << userId << "\","
        << "\"examId\":\"" << examId << "\","
        << "\"eventType\":\"" << eventType << "\","
        << "\"timestamp\":\"" << getCurrentTimestamp() << "\","
        << "\"details\":\"" << details << "\""
        << "}";
    return oss.str();
}

void configureLogHandler() {
    // Placeholder if you want to redirect logs to file in the future
}

void log(const std::string& message) {
    std::cout << "[LOG] " << message << std::endl;
}

} // namespace utils ✅ (This was missing in your previous error)

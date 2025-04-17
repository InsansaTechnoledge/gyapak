// include/utils.h
#pragma once

#include <string>
#include <chrono>

namespace utils {
    std::string getCurrentTimestamp();
    std::string formatEventJson(const std::string& userId, 
                                const std::string& examId,
                                const std::string& eventType,
                                const std::string& details);
    void configureLogHandler();
    void log(const std::string& message);
}
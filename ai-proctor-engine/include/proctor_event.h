#pragma once
#include <string>

struct ProctorEvent {
    std::string userId;
    std::string examId;
    std::string eventType;
    std::string timestamp;
    std::string details;
};

// event_sender.h
#pragma once
#include <string>

bool send_event_to_backend(const std::string& url, const std::string& jsonStr); // ✅ FIXED

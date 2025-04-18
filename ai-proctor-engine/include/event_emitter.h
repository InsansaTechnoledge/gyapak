// include/event_emitter.h
#pragma once

#include <string>
#include <mutex>
#include <queue>
#include <thread>
#include <atomic>

struct ProctorEvent {
    std::string userId;
    std::string examId;
    std::string eventType;
    std::string timestamp;
    std::string details;
};

class EventEmitter {
public:
    EventEmitter(const std::string& url);
    ~EventEmitter();

    bool connect();
    void disconnect();
    bool isConnected() const;

    void emitEvent(const ProctorEvent& event);

private:
    std::string url_;
    std::mutex eventQueueMutex_;
    std::queue<ProctorEvent> eventQueue_;
    std::atomic<bool> connected_;
    std::thread eventThread_;
    std::atomic<bool> running_;



    void processEventQueue();
    std::string getCurrentTimestamp();
};


#include "event_emitter.h"
#include "event_sender.h"

#include "utils.h"
#include <nlohmann/json.hpp>
#include <iostream>


using json = nlohmann::json;

EventEmitter::EventEmitter(const std::string& url)
    : url_(url), connected_(false), running_(false) {}

EventEmitter::~EventEmitter() {
    disconnect();
}

bool EventEmitter::connect() {
    connected_ = true;
    running_ = true;

    eventThread_ = std::thread(&EventEmitter::processEventQueue, this);
    utils::log("🧵 EventEmitter thread started.");
    return true;
}

void EventEmitter::disconnect() {
    running_ = false;
    connected_ = false;

    if (eventThread_.joinable()) {
        eventThread_.join();
        utils::log("🧵 EventEmitter thread joined.");
    }
}

bool EventEmitter::isConnected() const {
    return connected_;
}

void EventEmitter::emitEvent(const ProctorEvent& event) {
    {
        std::lock_guard<std::mutex> lock(eventQueueMutex_);
        eventQueue_.push(event);
    }

    // Log JSON immediately
    json eventData = {
        {"userId", event.userId},
        {"examId", event.examId},
        {"eventType", event.eventType},
        {"timestamp", event.timestamp},
        {"details", event.details}
    };

    utils::log("📤 Emitting JSON Event:\n" + eventData.dump(4));
}

// void EventEmitter::processEventQueue() {
//     while (running_) {
//         ProctorEvent event;
//         bool hasEvent = false;

//         {
//             std::lock_guard<std::mutex> lock(eventQueueMutex_);
//             if (!eventQueue_.empty()) {
//                 event = eventQueue_.front();
//                 eventQueue_.pop();
//                 hasEvent = true;
//             }
//         }

//         if (!hasEvent) {
//             std::this_thread::sleep_for(std::chrono::milliseconds(100));
//             continue;
//         }

//         auto emitStart = std::chrono::steady_clock::now();

//         json eventData = {
//             {"userId", event.userId},
//             {"examId", event.examId},
//             {"eventType", event.eventType},
//             {"timestamp", event.timestamp},
//             {"details", event.details}
//         };

//         auto emitEnd = std::chrono::steady_clock::now();
//         std::cout << "[EMIT THREAD] (" 
//           << std::chrono::duration_cast<std::chrono::milliseconds>(emitEnd - emitStart).count() 
//           << "ms) " << eventData.dump(2) << std::endl;


//         send_event_to_backend(url_, eventData);


//         // std::cout << "[EMIT THREAD] " << eventData.dump(2) << std::endl;

//         // Future: socket emit logic here
//         // client_.socket()->emit("proctor:event", eventData.dump());
//     }
// }

void EventEmitter::processEventQueue() {
    while (running_) {
        ProctorEvent event;
        bool hasEvent = false;

        {
            std::lock_guard<std::mutex> lock(eventQueueMutex_);
            if (!eventQueue_.empty()) {
                event = eventQueue_.front();
                eventQueue_.pop();
                hasEvent = true;
            }
        }

        if (!hasEvent) {
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            continue;
        }

        auto emitStart = std::chrono::steady_clock::now();

        json eventData = {
            {"userId", event.userId},
            {"examId", event.examId},
            {"eventType", event.eventType},
            {"timestamp", event.timestamp},
            {"details", event.details}
        };

        // 🔥 Send the JSON to backend over HTTP
        std::cout<<"this is final data 😩" << eventData.dump();
        send_event_to_backend(url_, eventData.dump());

        auto emitEnd = std::chrono::steady_clock::now();
        std::cout << "[EMIT THREAD] (" 
                  << std::chrono::duration_cast<std::chrono::milliseconds>(emitEnd - emitStart).count() 
                  << "ms) " << eventData.dump(2) << std::endl;
    }
}

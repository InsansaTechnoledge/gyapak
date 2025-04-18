#include "event_sender.h"
#include <curl/curl.h>
#include <iostream>

bool send_event_to_backend(const std::string& url, const std::string& jsonStr) {
    CURL* curl = curl_easy_init();
    if (!curl) return false;

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    // std::string jsonStr = payload.dump(); 

    std::cout<< "this is json str" << jsonStr;

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, jsonStr.length()); 

    std::cout << "📦 Payload:\n" << jsonStr << std::endl;

    CURLcode res = curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    return (res == CURLE_OK);
}

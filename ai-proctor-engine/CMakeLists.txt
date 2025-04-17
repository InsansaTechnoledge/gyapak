# cmake_minimum_required(VERSION 3.10)
# project(ProctorEngine VERSION 1.0.0)

# # Optional: Add WebSocketPP headers if needed

# include_directories(/opt/homebrew/include/websocketpp)

# # Set C++ standard
# set(CMAKE_CXX_STANDARD 17)
# set(CMAKE_CXX_STANDARD_REQUIRED ON)

# # Platform-specific library flags
# if(WIN32)
#     set(PLATFORM_LIBS winmm user32 gdi32)
# elseif(APPLE)
#     set(PLATFORM_LIBS "")  # No special platform libs needed
# elseif(UNIX)
#     find_package(X11 REQUIRED)
#     set(PLATFORM_LIBS ${X11_LIBRARIES} pthread)
# endif()

# # Manually specify include paths (Homebrew)
# include_directories(
#     ${CMAKE_CURRENT_SOURCE_DIR}/include
#     /opt/homebrew/include                 # OpenCV, PortAudio, WebSocketPP
# )

# # Manually link dirs
# link_directories(
#     /opt/homebrew/lib                    # OpenCV, PortAudio, sioclient
# )

# # Source files
# set(SOURCES
#     src/main.cpp
#     src/proctor_engine.cpp
#     src/face_detector.cpp
#     src/screen_monitor.cpp
#     src/audio_monitor.cpp
#     src/event_emitter.cpp
#     src/utils.cpp
# )

# # Create executable
# add_executable(proctor_engine ${SOURCES})

# # Link manually
# target_link_libraries(proctor_engine
#     opencv_core
#     opencv_highgui
#     opencv_imgproc
#     opencv_objdetect
#     portaudio
#     sioclient
#     ${PLATFORM_LIBS}
# )

# # Install step
# install(TARGETS proctor_engine DESTINATION bin)
# install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/include/ DESTINATION include)

cmake_minimum_required(VERSION 3.10)
project(ProctorEngine VERSION 1.0.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(/opt/homebrew/include)
link_directories(/opt/homebrew/lib)

add_executable(proctor_engine src/main.cpp)

target_link_libraries(proctor_engine
    portaudio
    opencv_core
    opencv_highgui
    opencv_imgproc
    opencv_objdetect
)

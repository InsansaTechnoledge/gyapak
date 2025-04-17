cmake_minimum_required(VERSION 3.10)
project(ProctorEngine VERSION 1.0.0)

# ✅ C++17 Standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ✅ Find OpenCV using pkg-config
find_package(PkgConfig REQUIRED)
pkg_check_modules(OpenCV REQUIRED opencv4)

# ✅ Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${OpenCV_INCLUDE_DIRS}
    /opt/homebrew/include        # For portaudio, if needed
)

# ✅ Link directories
link_directories(
    ${OpenCV_LIBRARY_DIRS}
    /opt/homebrew/lib
)

# ✅ Source files
set(SOURCES
    src/main.cpp
    src/proctor_engine.cpp
    src/utils.cpp
    src/face_detector.cpp
    # Add others like audio_monitor.cpp, screen_monitor.cpp if needed
)

# ✅ Create the executable
add_executable(proctor_engine ${SOURCES})

# ✅ Link the OpenCV and PortAudio libraries
target_link_libraries(proctor_engine
    ${OpenCV_LIBRARIES}
    portaudio
)

# ✅ Optional install (useful for `make install`)
install(TARGETS proctor_engine DESTINATION bin)
install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/include/ DESTINATION include)

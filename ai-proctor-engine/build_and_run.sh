#!/bin/bash

# Navigate to the script's root folder (ai-proctor-engine)
cd "$(dirname "$0")"

echo "🔧 Building AI Proctor Engine..."

# Use a clean build folder in project root
mkdir -p build
cd build

cmake .. -DCMAKE_BUILD_TYPE=Release
make -j4

if [ $? -eq 0 ]; then
  echo "🚀 Running Proctor Engine..."
  ./proctor_engine
else
  echo "❌ Build failed. Check above for errors."
fi

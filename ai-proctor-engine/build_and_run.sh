#!/bin/bash

echo "🔧 Building AI Proctor Engine..."
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

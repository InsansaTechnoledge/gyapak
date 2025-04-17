Build Command (1st time or after major changes)

mkdir -p build
cd build
cmake .
make -j4

This will generate a release-optimized binary:

./proctor_engine
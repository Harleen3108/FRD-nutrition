#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Build Frontend
echo "Building Frontend..."
cd frdfrontend
npm install
npm run build
cd ..

# 2. Build Backend (mostly for dependencies)
echo "Building Backend..."
cd frdbackend
npm install
# Move frontend assets into backend for easier serving on Render
echo "Moving frontend assets into backend..."
rm -rf dist
cp -r ../frdfrontend/dist ./dist
cd ..

echo "Build Complete! 🚀"

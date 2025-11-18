#!/bin/bash
# Launcher script for Gesture Meme Tracker
# This ensures we use the correct Python interpreter from the virtual environment

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Activate virtual environment
if [ -d "$SCRIPT_DIR/venv" ]; then
    source "$SCRIPT_DIR/venv/bin/activate"
    echo "Starting Gesture Meme Tracker..."
    echo "Using Python: $(which python)"
    echo ""
    python "$SCRIPT_DIR/gesture_meme_tracker.py"
else
    echo "Error: Virtual environment not found at $SCRIPT_DIR/venv"
    echo "Please run: python3.12 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi


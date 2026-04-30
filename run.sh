#!/bin/bash
set -e

echo "Starting Crypto-Forex Signal Giver..."

source .venv/bin/activate || pip install virtualenv && python -m venv .venv && source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload


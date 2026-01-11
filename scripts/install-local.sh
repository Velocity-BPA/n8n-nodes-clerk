#!/bin/bash
set -e

echo "📦 Installing n8n-nodes-clerk locally..."

# Build the project
./scripts/build.sh

# Create n8n custom directory if it doesn't exist
mkdir -p ~/.n8n/custom

# Remove existing symlink if present
rm -f ~/.n8n/custom/n8n-nodes-clerk

# Create symlink
ln -s "$(pwd)" ~/.n8n/custom/n8n-nodes-clerk

echo "✅ Installation complete!"
echo "🔄 Please restart n8n to load the new node."

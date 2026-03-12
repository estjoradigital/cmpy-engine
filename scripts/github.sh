#!/bin/bash

# Stage the local changes
git add .

# Specify the upstream branch to fetch changes from
echo "Enter the upstream branch to pull the latest changes from: e.g main, master, develop"
read -r upstream_branch

# Validate upstream branch input
if [ -z "$upstream_branch" ]; then
  echo "Error: No upstream branch specified. Exiting."
  exit 1
fi

# Pull changes from the specified upstream branch
if git pull origin "$upstream_branch"; then
  echo "Successfully pulled changes from $upstream_branch"
else
  echo "Error pulling changes from $upstream_branch. Exiting."
  exit 1
fi

# Check if there are staged changes before committing
if git diff-index --quiet HEAD --; then
  echo "No changes to commit. Skipping commit step."
else
  # Prompt user for commit message
  echo "Enter commit message: "
  read -r commit_message

  # Commit with the given message
  if git commit -m "$commit_message"; then
    echo "Successfully committed changes"
  else
    echo "Error committing changes. Exiting."
    exit 1
  fi
fi

# Extract the current branch from git
branch=$(git rev-parse --abbrev-ref HEAD)

# Push to the current branch
if git push origin "$branch"; then
  echo "Successfully pushed changes to $branch"
else
  echo "Error pushing changes to $branch. Exiting."
  exit 1
fi
echo "All operations completed successfully."
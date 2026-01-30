# GitHub Pages Setup Instructions for PharmaLink

## Quick Fix for 404 Error

Your code is deployed, but GitHub Pages needs to be enabled. Follow these steps:

### Enable GitHub Pages:

1. Go to: **https://github.com/Raphasha27/pharmalink/settings/pages**

2. Under **"Build and deployment"**:
   - **Source:** Select "Deploy from a branch"
   - **Branch:** Select `main` (not gh-pages)
   - **Folder:** Select `/ (root)`

3. Click **Save**

4. Wait 1-2 minutes for GitHub to build the site

5. Your live site will be available at:
   **https://raphasha27.github.io/pharmalink/**

---

## Alternative: If the repository doesn't have a main branch

If you only see `gh-pages` in the branch dropdown:

1. Set **Branch** to `gh-pages`
2. Keep **Folder** as `/ (root)`
3. Click **Save**

---

## Verification

Once enabled, you should see a message like:
> "Your site is live at https://raphasha27.github.io/pharmalink/"

The index.html file is already in the root of your repository, so it will work immediately after enabling Pages.

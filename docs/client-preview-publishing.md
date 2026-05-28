# Client Preview Publishing Process

Last updated: 2026-05-28

## Goal
Publish the exact content of `origin/client-preview` at:

- `https://thelearningwarehouse.com/client-preview/`

without changing the main public site root:

- `https://thelearningwarehouse.com/`

## Important Context
`/client-preview/` is a folder path on the deployed `main` site, not an automatic branch URL.

That means:
- Updating branch `client-preview` alone is not enough.
- We must copy/snapshot `origin/client-preview` into the `client-preview/` directory in `main`, then push `main`.

## Reliable Workflow (Step by Step)
Run from a clean local clone.

1. Update remotes and checkout `main`

```bash
git fetch origin --prune
git checkout main
git pull --ff-only origin main
```

2. Create temporary worktree from `origin/client-preview`

```bash
git worktree add --detach ../twh-web__wt_client_preview origin/client-preview
```

3. Replace `client-preview/` folder in `main` with snapshot content

Windows PowerShell example:

```powershell
$repo = "C:\path\to\repo"
$wt   = "C:\path\to\twh-web__wt_client_preview"
$dst  = Join-Path $repo "client-preview"

if (Test-Path $dst) { Remove-Item -Recurse -Force $dst }
New-Item -ItemType Directory -Path $dst | Out-Null

robocopy $wt $dst /E /NFL /NDL /NJH /NJS /NP /XD .git .github .claude .cursor | Out-Null
```

4. Remove temporary worktree

```bash
git worktree remove ../twh-web__wt_client_preview --force
```

5. Commit and push `main`

```bash
git add client-preview
git commit -m "Publish client-preview snapshot under /client-preview"
git push origin main
```

6. Verify

- Open `https://thelearningwarehouse.com/client-preview/`
- Hard refresh (`Ctrl+F5`)
- Wait 1-3 minutes for Pages/CDN cache if needed

## Quick Consistency Checks
Before publishing:

```bash
git rev-parse origin/client-preview
```

After publishing (optional):
- Inspect `client-preview/` files in `main` commit
- Validate key pages:
  - `/client-preview/`
  - `/client-preview/about/`
  - `/client-preview/how-we-help/`
  - `/client-preview/learning-we-trust/`
  - `/client-preview/contact/`

## Branch Alignment Notes
Current safe branch policy:
- `dev`: working branch
- `client-preview`: preview source branch
- `main`: production branch + hosts `/client-preview/` snapshot folder

If `client-preview` must mirror `dev` exactly:

```bash
git push --force-with-lease origin dev:client-preview
```

(Optional backup first)

```bash
git push origin origin/client-preview:refs/heads/client-preview-backup
```

## Known Pitfalls We Hit
1. Permission errors on Google Drive mounted path (`G:\Mi unidad\...`) can break checkout/merge.
2. `git archive | tar` on Windows was unreliable in this environment.
3. `/client-preview/` URL does not auto-follow branch `client-preview`; it follows files committed to `main` under that folder.

## Recommended Operating Setup
Use a local NTFS path for Git operations, e.g.:

- `C:\Users\NITRO\Desktop\twh-web-clean-2`

Then push changes to GitHub.
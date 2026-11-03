# Mission Specialty website

Static landing page (`index.html`) for Mission Specialty, part of Mission Pet Health. Self-contained: open the file in a browser or host it on any static host.

TODO: add videos, real leadership bios, wire the contact form, replace `#home` placeholder links.

## Deploying

`.github/workflows/deploy-pages.yml` publishes `index.html` to GitHub Pages on every push to `main`. It can also be run by hand from **Actions → Deploy to GitHub Pages → Run workflow**. Only `index.html` is published; the README and workflow files are not.

### One-time setup

1. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main` (or run the workflow). The site URL appears on the workflow run and under **Settings → Pages**, normally `https://cherriclub.github.io/mission-pethealth-specialty/`.

This repo is private. Pages for a private repo needs a paid GitHub plan on the `cherriclub` account (Team or Enterprise for an organization), and the published site is still public unless the account is on Enterprise Cloud and the site's visibility is set to private.

### Custom domain (optional)

Under **Settings → Pages → Custom domain**, enter the domain and add the DNS record GitHub shows (a `CNAME` to `cherriclub.github.io` for a subdomain such as `www`). Then turn on **Enforce HTTPS**.

# Mission Specialty website

Static landing page (`index.html`) for Mission Specialty, part of Mission Pet Health. Self-contained: open the file in a browser or host it on any static host.

TODO: add videos, real leadership bios, wire the contact form, replace `#home` placeholder links.

## WordPress theme

The page ships to WordPress as a theme named `mission-specialty`. `index.html` stays the only page source; the build turns it into a theme:

```
theme/style.css        theme header (name, version)
theme/functions.php    removes WP front-end assets the page doesn't use
scripts/build-theme.sh generates dist/mission-specialty/ and dist/mission-specialty.zip
```

The build copies `theme/` and generates `index.php` from `index.html`, adding `language_attributes()`, `wp_head()`, `body_class()`, `wp_body_open()` and `wp_footer()` so plugins (analytics, SEO, the admin bar) still work. Build locally with:

```bash
bash scripts/build-theme.sh
```

To install by hand, upload `dist/mission-specialty.zip` under **Appearance → Themes → Add New → Upload Theme**.

## Deploying to WordPress

`.github/workflows/deploy-wordpress.yml` runs on every push and pull request:

1. **build** runs the build script and PHP lint, then uploads the theme zip as a workflow artifact.
2. **deploy** runs only for pushes to `main` and manual runs (**Actions → Deploy WordPress theme → Run workflow**). It rsyncs the theme over SSH into `<WP_THEMES_PATH>/mission-specialty/`, deleting files that were removed from the theme.

The host needs SSH access with rsync installed. WP Engine, Kinsta, SiteGround, Cloudways and most VPS setups provide this.

### One-time setup

1. Create an SSH key for deploys and add the public key to the hosting account:
   ```bash
   ssh-keygen -t ed25519 -f wp-deploy -N "" -C "github-actions"
   ```
2. In GitHub, go to **Settings → Environments** and create an environment named `production`. Add required reviewers there if deploys should need approval.
3. Add these to the `production` environment:

   | Name | Kind | Value |
   |---|---|---|
   | `SSH_PRIVATE_KEY` | secret | contents of `wp-deploy` (the private key) |
   | `SSH_KNOWN_HOSTS` | secret | output of `ssh-keyscan -p <port> <host>`. Optional, but without it the workflow trusts whatever key the host presents. |
   | `SSH_HOST` | variable | e.g. `example.ssh.wpengine.net` |
   | `SSH_USER` | variable | SSH username |
   | `SSH_PORT` | variable | optional, defaults to `22` (Kinsta uses a custom port) |
   | `WP_THEMES_PATH` | variable | absolute path to `wp-content/themes`, e.g. `/var/www/html/wp-content/themes` |
   | `WP_PATH` | variable | optional. WordPress root; if set, the workflow runs `wp theme activate mission-specialty && wp cache flush` with WP-CLI after syncing |

4. Activate the theme once under **Appearance → Themes**, unless `WP_PATH` is set. In **Settings → Reading**, either "latest posts" or a static front page works, since the theme serves the landing page for every URL.

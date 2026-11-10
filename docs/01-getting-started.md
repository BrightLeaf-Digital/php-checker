# Getting Started with PHP Compatibility Scanner

## Overview

**PHP Compatibility Scanner** helps you find out whether your plugins and themes are likely to keep working when your host moves your site to a newer version of PHP.

It reads the code of the plugins and themes you choose and checks it against the PHP version you plan to upgrade to (8.0, 8.1, 8.2, 8.3, 8.4 or 8.5). It then compares that against the PHP version your site runs today and shows you **only the new issues** — the problems that would appear after the upgrade. Problems that already exist on your current PHP version are left out, so the report focuses on what the upgrade would change.

The scanner only reads code. It never changes your files, and it does not run the code it checks.

------------------------------------------------------------------------

## Requirements

- PHP 7.4 or newer.
- A WordPress administrator account. The scanner page is only available to users who can manage site options.

------------------------------------------------------------------------

## Installation

1. In your WordPress admin dashboard, go to **Plugins → Add New**.
2. Install the plugin, or click **Upload Plugin** and choose the ZIP file if you downloaded it.
3. Click **Activate**.

There is nothing to configure. Once activated, the scanner is available under **Tools → PHP Compatibility Scanner**.

The plugin also includes the shared GravityOps library from BrightLeaf Digital, which adds a **GravityOps** dashboard with our other free and premium tools, announcements and an optional newsletter signup.

------------------------------------------------------------------------

## Your Baseline and Your Target

At the top of the **Tools → PHP Compatibility Scanner** page you will see your **Baseline** — the PHP version your site runs right now (for example `8.2`).

The **Target PHP** list only offers versions newer than your baseline. If your site already runs PHP 8.5, there is no newer version to compare against yet, so the list is empty.

Every scan answers one question: *"What new problems would these plugins and themes have if my site moved from my baseline to this target?"*

Next: [Running a Scan](02-running-a-scan.md).

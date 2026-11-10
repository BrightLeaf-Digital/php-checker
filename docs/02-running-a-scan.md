# Running a Scan

Go to **Tools → PHP Compatibility Scanner**, choose your settings, and click **Run scan**.

------------------------------------------------------------------------

## Scan Settings

### Target PHP

The PHP version you want to check against. Only versions newer than the one your site runs today are listed.

### Include warnings

Off by default, so the report shows only errors — code that is expected to break on the target version. Turn it on to also see warnings, such as features that are deprecated in the target version and may be removed later. Warnings are useful for planning ahead, but they make the report longer.

### Plugins

- Tick **Scan all plugins** to scan every plugin in your plugins folder, or
- Tick individual plugins in the list below it.

The list shows each plugin's folder name (or file name, for single-file plugins such as Hello Dolly). It includes inactive plugins as well as active ones, because they are files on your server too.

Must-use plugins (MU-plugins) are not listed and are never scanned.

### Themes

- Tick **Scan all themes** to scan every installed theme, or
- Tick individual themes in the list. Your active theme is marked *(active theme)*, and child themes are marked *(child of …)*.

**Also scan parent when a child theme is selected** is on by default. A child theme relies on its parent theme's code, so leaving this on means selecting a child theme scans its parent too.

You can scan plugins only, themes only, or both in the same scan.

### Extra excludes

Leave this empty unless you need it. It accepts a comma-separated list of rule codes to skip. Each issue in the report shows the rule that found it in its **Source** column, and a failed scan may name a rule in its error message. Copy that code here and run the scan again to skip that rule.

------------------------------------------------------------------------

## While the Scan Runs

After you click **Run scan**, a status box shows the scan's progress, for example *"Scan status: running (40%). Processed 4 / 10 items…"*. Each plugin or theme is one item, and each item is checked twice: once against your current PHP version and once against the target.

**Keep the page open.** The scan moves forward one item at a time while the page is open in your browser. It does not use WP-Cron or run in the background, so if you close the tab or leave the page, the scan stops advancing. Coming back to the page later does not reconnect to that scan — simply run a new one.

### Pause, Resume and Stop

Two buttons appear above the status box while a scan runs:

- **Pause** — finishes the item currently being checked, then waits. The button changes to **Resume**; click it to carry on from where the scan left off. Keep the page open while paused.
- **Stop** — ends the scan and shows the results for the items that were already finished. Items the scan had not reached yet are not checked. A stopped scan does not update the badges on the Plugins screen.

When the scan finishes, the status box is replaced by the report. See [Reading the Results](03-reading-the-results.md).

------------------------------------------------------------------------

## Tips for Large Sites

- Scanning every plugin and theme on a large site can take a while. If you only care about a few items, select just those.
- Each item is checked in a single request to your server, so a very large plugin can take a long time on its own. If the progress count stays on the same number for a long time, try scanning that plugin by itself, or check your server's error log for a timeout.

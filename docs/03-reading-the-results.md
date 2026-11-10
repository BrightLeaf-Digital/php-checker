# Reading the Results

## The Report

When a scan finishes, the report appears on the **Tools → PHP Compatibility Scanner** page under the heading **Results: Baseline *current* → Target *target*** (for example *Baseline 8.2 → Target 8.4*).

### Everything passed

If no selected plugin or theme has new issues, you will see a green notice saying all selected items show no new issues for the target version.

### Items with new issues

Plugins and themes with new issues are listed under **Plugins** and **Themes** headings. Each one shows a summary line such as *"Not compatible with PHP 8.4 (new issues: 3)"*, followed by a table:

| Column  | What it shows                                                                                   |
|---------|-------------------------------------------------------------------------------------------------|
| File    | The file the issue was found in, starting with the plugin or theme folder name.                 |
| Line    | The line number in that file.                                                                   |
| Col     | The column (position on the line).                                                              |
| Type    | **ERROR** (expected to break on the target version) or **WARNING** (only when warnings are on). |
| Message | A plain description of the problem.                                                             |
| Source  | The code of the rule that found it. You can paste this into **Extra excludes** to skip it.      |

Up to 300 new issues are kept for each plugin or theme.

Plugins and themes that had **no** new issues are not listed one by one. After a scan that ran to completion, an item you selected that does not appear under **Plugins**, **Themes** or the could-not-be-scanned notice had no new issues.

After you click **Stop**, the report covers only the items that were finished before the scan stopped. Items it had not reached yet were not checked, even though they are not listed as having issues and the green "no new issues" notice may still appear — run a new scan to check them.

### Items that could not be scanned

If something went wrong while checking an item, it is listed in a red notice: *"These items could not be scanned, so their compatibility is unknown"*, with the reason next to each one. A failed item is never reported as compatible. See [Limitations and Troubleshooting](04-limitations-and-troubleshooting.md) for common reasons.

### What to do with the results

- **Errors** in a plugin or theme you rely on: check for an update first, since many developers have already fixed these. If there is none, share the report with the developer or look for a replacement before upgrading PHP.
- **Errors** in a plugin you no longer use: consider deleting it. Inactive plugins are still files on your server.
- Always test on a staging copy of your site on the new PHP version before upgrading your live site.

------------------------------------------------------------------------

## Badges on the Plugins Screen

After a scan **completes**, each scanned plugin gets a small badge on the **Plugins** screen, next to its version and author details:

- Green — **PHP 8.2→8.4: OK** — no new issues were found.
- Red — **PHP 8.2→8.4: 3 new issues** — open the scanner to run a scan and see the details.

A few things to know about the badges:

- Badges are shown for plugins only, not themes.
- They always reflect the **most recent completed scan**. Each completed scan replaces all earlier badges, so plugins that were not part of the latest scan lose their badge.
- A stopped scan does not change the badges.
- A plugin that could not be scanned gets no badge, rather than a misleading "OK".
- Badges are removed automatically **30 days** after the scan, so you are not looking at outdated results.
- Badges are also removed once your site is running the target PHP version (or newer), since the comparison no longer applies.

The full report itself is not saved. To see the details again, run a new scan.

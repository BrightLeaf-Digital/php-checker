# Limitations and Troubleshooting

## What the Scanner Can and Cannot Tell You

The scanner uses **static analysis**: it reads the code without running it. This is fast and safe, but it means the results are guidance, not a guarantee.

### False positives (issues that are not real problems)

The scanner may flag code that would actually work fine, for example:

- Code that first checks which PHP version is running, or whether a function exists, before using it.
- Code that brings its own replacement for a function that newer PHP versions removed.
- Bundled libraries inside a plugin that the plugin never actually loads.

### False negatives (real problems that are missed)

The scanner can also miss problems, for example:

- Code whose behavior depends on values only known when it runs, such as function names built from text.
- Changes in how PHP behaves at run time that are not visible in the code itself.
- Problems caused by your server's configuration or PHP extensions rather than the code.

### Other things to keep in mind

- Only the **new** issues between your current PHP version and the target are shown. Problems that already exist on your current version are left out of the report.
- Only `.php` files are checked.
- Every file in a plugin or theme folder is checked, including bundled libraries and inactive plugins.
- Must-use plugins (MU-plugins) are not scanned.

**Always test your site on a staging copy running the new PHP version before upgrading your live site.**

------------------------------------------------------------------------

## Troubleshooting

### "Another plugin has already loaded PHP_CodeSniffer (for example Plugin Check)"

The scanner is built on a code-checking engine called PHP_CodeSniffer. Some other plugins — most commonly the **Plugin Check** plugin — include their own copy of that engine. If another plugin has already loaded its copy, the scanner refuses to run rather than mix the two and give unreliable results. Each affected item appears in the *"could not be scanned"* list with this message.

To fix it:

1. Temporarily deactivate the other plugin (for example Plugin Check).
2. Run your scan again.
3. Reactivate the other plugin when the scan is finished.

### An item could not be scanned because of a specific rule

If the error for an item names a rule code, copy that code into **Extra excludes** (separate several codes with commas) and run the scan again. That rule will be skipped for the whole scan.

### "Target PHP must be greater than runtime PHP"

The target you chose is not newer than the PHP version your site runs today. Pick a newer target.

### "No plugins or themes selected."

Tick **Scan all plugins**, **Scan all themes**, or at least one individual plugin or theme, then click **Run scan** again.

### The scan stopped making progress

- Make sure the scanner page stayed open. The scan only moves forward while the page is open in your browser.
- A very large plugin can take a long time to check on its own. Try scanning it by itself, and check your server's error log for a timeout.

### "Job not found or expired."

A scan's progress is kept for up to six hours. If you see this message, run a new scan.

### "The bundled PHP_CodeSniffer is missing. Reinstall the plugin."

Part of the plugin's files is missing, usually from an incomplete upload. Delete the plugin and install it again.

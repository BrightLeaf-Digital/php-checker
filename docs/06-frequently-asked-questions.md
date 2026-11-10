# Frequently Asked Questions

**Q1: What PHP versions can I target?**
**A1:** 8.0, 8.1, 8.2, 8.3, 8.4 and 8.5 — but only versions newer than the one your site runs today appear in the list.

**Q2: Why is the Target PHP list empty?**
**A2:** Your site already runs the newest version the scanner supports (PHP 8.5), so there is no newer version to compare against yet.

**Q3: Does the scanner change my code?**
**A3:** No. It only reads code and reports what it finds.

**Q4: If a plugin shows "OK", is it guaranteed to work on the new PHP version?**
**A4:** No. The scanner reads code without running it, so it can miss some problems and flag others that are not real. Treat the results as guidance and test on a staging copy of your site first. See [Limitations and Troubleshooting](04-limitations-and-troubleshooting.md).

**Q5: Do I need WP-Cron for scans?**
**A5:** No. Scans move forward while the **Tools → PHP Compatibility Scanner** page is open in your browser. Keep the page open until the scan finishes.

**Q6: Does it scan MU-plugins?**
**A6:** No. Must-use plugins are intentionally skipped.

**Q7: Does it scan inactive plugins?**
**A7:** Yes. Every plugin in your plugins folder can be selected, active or not.

**Q8: Why don't my themes have badges?**
**A8:** Badges appear on the **Plugins** screen only. Theme results are shown in the report on the scanner page.

**Q9: Where did my badges go?**
**A9:** Badges show the most recent completed scan only, and are removed after 30 days or once your site runs the target PHP version. Run a new scan to bring them back.

**Q10: The scan says another plugin has already loaded PHP_CodeSniffer. What do I do?**
**A10:** Temporarily deactivate the other plugin (often Plugin Check), run the scan, then reactivate it.

**Q11: Does the scanner slow down my site?**
**A11:** The scanning engine only loads while a scan is running. It does not run on your site's front end or on other admin pages.

**Q12: Is my code sent anywhere?**
**A12:** No. Scanning runs entirely on your server. See [Privacy and External Services](05-privacy-and-external-services.md).

**Q13: Where can I get help?**
**A13:** Visit the [GravityOps Help community](https://brightleafdigital.io/community/gravityops-help/) for how-to questions and examples. If you opened a support thread on WordPress.org, continue that conversation there.

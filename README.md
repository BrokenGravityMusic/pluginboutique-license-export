pluginboutique-license-export

A UserScript for exporting your licenses on PluginBoutique.com for backup purposes.
## Description

This is a userscript meant to be run through tools like TamperMonkey or GreaseMonkey in your browser. It has only been tested on Firefox so far.

## Usage

Once installed, navigate to https://www.pluginboutique.com/myaccount (ensure you're logged in). You should see two new buttons at the top-right of the browser view: one to export licenses from the "current page" and another for "all pages." Click either button, and a white textarea will appear shortly. From there, you can copy your license information into a local text file, a Google Doc, or wherever you prefer to back up your data.

Example output:
```
Product: Monark - Black Friday Gift
Category: Reaktor Ensemble
Manufacturer: Native Instruments
Serial Number: 12345-12345-12345-12345-12345
#------
Product: Life
Category: Sampler
Manufacturer: XLN Audio
Serial Number: Q-LOLO-123456-MOM-XXY
#------
Product: PSP VintageWarmer2
Category: Compressor
Manufacturer: PSP Audioware
Serial Number: 123456ff-99ff-00af-99fe-123456beef
#------
```


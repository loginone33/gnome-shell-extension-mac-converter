# MAC Address Converter for GNOME Shell

**MAC Address Converter** is a GNOME Shell extension that allows you to quickly convert MAC address formats (colons, hyphens, dots, clean hex) directly from the GNOME panel. This extension uses the clipboard to easily copy and paste MAC addresses.

---

## Features

- **Quick Conversion**: Easily convert between different MAC address formats:
  - **Colons**: `AA:BB:CC:11:22:33`
  - **Hyphens**: `AA-BB-CC-11-22-33`
  - **Dots**: `AABB.CC11.2233`
  - **Clean Hex**: `AABBCC112233`
- **Clipboard Integration**: Instantly paste MAC addresses from your clipboard, and automatically copy the converted result.
- **Clean & Lightweight**: Native GNOME Shell implementation with zero external dependencies.

---

## Compatibility

- **GNOME Shell**: 45, 46, 47, 48, 49, 50
- **Session**: Wayland & X11

---

## Installation & Deployment

### Local Installation

1. Clone or download this repository.
2. Run the included installation script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. Restart GNOME Shell (log out and log back in on Wayland, or press `Alt+F2`, type `r`, and press `Enter` on X11).
4. Enable the extension:
   ```bash
   gnome-extensions enable mac-converter@loginone
   ```

---

## Support & Donations

If you like this extension and want to support its ongoing development, your support is greatly appreciated!

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate%20(PayPal)-ff5e5b.svg)](https://ko-fi.com/loginone)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg)](https://buymeacoffee.com/loginone)

- **Ko-fi** *(PayPal available)*: [ko-fi.com/loginone](https://ko-fi.com/loginone)
- **Buy Me A Coffee**: [buymeacoffee.com/loginone](https://buymeacoffee.com/loginone)

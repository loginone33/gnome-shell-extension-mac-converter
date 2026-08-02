import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import St from 'gi://St';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';

const MACConverterButton = GObject.registerClass(
class MACConverterButton extends PanelMenu.Button {
    _init(path) {
        super._init(0.0, 'MAC Address Converter');

        this._timeoutId = 0;

        const iconFile = Gio.File.new_for_path(`${path}/mac-converter-symbolic.svg`);
        const gicon = new Gio.FileIcon({ file: iconFile });

        this._icon = new St.Icon({
            gicon: gicon,
            style_class: 'system-status-icon',
        });
        this.add_child(this._icon);

        this._buildUI();
    }

    _buildUI() {
        const menuSection = new PopupMenu.PopupMenuSection();

        const headerBox = new St.BoxLayout({
            vertical: false,
            style: 'margin-bottom: 8px;',
        });
        const headerLabel = new St.Label({
            text: 'MAC Address Converter',
            style: 'font-weight: bold; font-size: 1.1em;',
        });
        headerBox.add_child(headerLabel);
        menuSection.actor.add_child(headerBox);

        const entryBox = new St.BoxLayout({
            vertical: false,
            style: 'margin-bottom: 8px;',
        });

        this._entry = new St.Entry({
            hint_text: 'e.g. AABBCC112233 or AA:BB...',
            can_focus: true,
            track_hover: true,
            style: 'width: 250px; font-family: monospace;',
        });

        this._entry.clutter_text.connect('activate', () => {
            this._convert(':');
        });

        this._entry.clutter_text.connect('text-changed', () => {
            this._updateResult('');
        });

        entryBox.add_child(this._entry);

        const pasteBtn = new St.Button({
            label: 'Paste',
            style_class: 'button',
            style: 'margin-left: 6px; padding: 4px 8px;',
        });
        pasteBtn.connect('clicked', () => {
            const clipboard = St.Clipboard.get_default();
            clipboard.get_text(St.ClipboardType.CLIPBOARD, (_clip, text) => {
                if (text) {
                    this._entry.set_text(text.trim());
                    this._convert(':');
                }
            });
        });
        entryBox.add_child(pasteBtn);

        menuSection.actor.add_child(entryBox);

        const buttonGrid1 = new St.BoxLayout({
            vertical: false,
            style: 'margin-bottom: 6px; spacing: 4px;',
        });

        const btnColons = new St.Button({
            label: 'Colons ( : )',
            style_class: 'button',
            x_expand: true,
        });
        btnColons.connect('clicked', () => this._convert(':'));

        const btnHyphens = new St.Button({
            label: 'Hyphens ( - )',
            style_class: 'button',
            x_expand: true,
        });
        btnHyphens.connect('clicked', () => this._convert('-'));

        buttonGrid1.add_child(btnColons);
        buttonGrid1.add_child(btnHyphens);
        menuSection.actor.add_child(buttonGrid1);

        const buttonGrid2 = new St.BoxLayout({
            vertical: false,
            style: 'margin-bottom: 10px; spacing: 4px;',
        });

        const btnDots = new St.Button({
            label: 'Dots ( . )',
            style_class: 'button',
            x_expand: true,
        });
        btnDots.connect('clicked', () => this._convert('.'));

        const btnClean = new St.Button({
            label: 'Clean Hex',
            style_class: 'button',
            x_expand: true,
        });
        btnClean.connect('clicked', () => this._convert(''));

        const btnClear = new St.Button({
            label: 'Clear',
            style_class: 'button',
        });
        btnClear.connect('clicked', () => {
            this._entry.set_text('');
            this._updateResult('');
        });

        buttonGrid2.add_child(btnDots);
        buttonGrid2.add_child(btnClean);
        buttonGrid2.add_child(btnClear);
        menuSection.actor.add_child(buttonGrid2);

        const resultBox = new St.BoxLayout({
            vertical: false,
            style: 'margin-top: 4px; align-items: center;',
        });

        this._resultLabel = new St.Label({
            text: '',
            style: 'font-family: monospace; font-size: 1.1em; font-weight: bold; color: #3584e4; background-color: rgba(255, 255, 255, 0.08); padding: 6px 10px; border-radius: 4px; width: 210px;',
        });

        this._copyBtn = new St.Button({
            label: 'Copy',
            style_class: 'button suggested-action',
            style: 'margin-left: 6px; padding: 6px 12px;',
        });
        this._copyBtn.connect('clicked', () => this._copyResult());

        resultBox.add_child(this._resultLabel);
        resultBox.add_child(this._copyBtn);

        menuSection.actor.add_child(resultBox);

        this.menu.addMenuItem(menuSection);
    }

    _getCleanMac() {
        const text = this._entry.get_text() || '';
        const cleaned = text.replace(/[:.-]|\s/g, '');
        if (cleaned.length !== 12 || !/^[0-9a-fA-F]{12}$/.test(cleaned)) {
            return null;
        }
        return cleaned.toUpperCase();
    }

    _convert(separator) {
        const cleanedMac = this._getCleanMac();
        if (!cleanedMac) {
            this._updateResult('Invalid MAC format', true);
            return;
        }

        let formatted = '';
        if (separator === '') {
            formatted = cleanedMac;
        } else if (separator === '.') {
            const parts = cleanedMac.match(/.{1,4}/g);
            formatted = parts.join('.');
        } else {
            const parts = cleanedMac.match(/.{1,2}/g);
            formatted = parts.join(separator);
        }

        this._updateResult(formatted, false);
        this._copyToClipboard(formatted);
    }

    _updateResult(text, isError = false) {
        this._resultLabel.set_text(text);
        if (isError) {
            this._resultLabel.set_style('font-family: monospace; font-size: 0.95em; color: #e01b24; background-color: rgba(224, 27, 36, 0.1); padding: 6px 10px; border-radius: 4px; width: 210px;');
        } else {
            this._resultLabel.set_style('font-family: monospace; font-size: 1.1em; font-weight: bold; color: #3584e4; background-color: rgba(255, 255, 255, 0.08); padding: 6px 10px; border-radius: 4px; width: 210px;');
        }
    }

    _copyToClipboard(text) {
        if (!text || text === 'Invalid MAC format')
            return;

        const clipboard = St.Clipboard.get_default();
        clipboard.set_text(St.ClipboardType.CLIPBOARD, text);

        this._copyBtn.set_label('Copied!');
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = 0;
        }
        this._timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
            this._copyBtn.set_label('Copy');
            this._timeoutId = 0;
            return GLib.SOURCE_REMOVE;
        });
    }

    _copyResult() {
        const text = this._resultLabel.get_text();
        if (text && text !== 'Invalid MAC format') {
            this._copyToClipboard(text);
        }
    }

    destroy() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = 0;
        }
        super.destroy();
    }
});

export default class MACConverterExtension extends Extension {
    enable() {
        this._button = new MACConverterButton(this.path);
        Main.panel.addToStatusArea(this.uuid, this._button);
    }

    disable() {
        this._button?.destroy();
        this._button = null;
    }
}

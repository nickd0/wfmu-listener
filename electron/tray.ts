import { Tray, Menu, BrowserWindow } from 'electron';
import path from 'path';

export default class TrayGenerator {
  tray: Tray | null;
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.tray = null;
    this.mainWindow = mainWindow;
  }

  getWindowPosition(): {x: number, y: number} | null {
    if (this.tray != null) {
      const windowBounds = this.mainWindow.getBounds();
      const trayBounds = this.tray!.getBounds();
      const x = Math.round(trayBounds.x - (windowBounds.width / 2));
      const y = Math.round(trayBounds.y + trayBounds.height);
      return { x, y };
    }
    return null;
  };

  showWindow() {
    const position = this.getWindowPosition();
    if (position) {
      this.mainWindow.setPosition(position!.x, position!.y, false);
      this.mainWindow.show();
      this.mainWindow.setVisibleOnAllWorkspaces(true);
      this.mainWindow.focus();
      this.mainWindow.setVisibleOnAllWorkspaces(false);
    }
  };

  toggleWindow() {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showWindow();
    }
  };

  rightClickMenu() {
  }

  createTray(icon: string) {
    this.tray = new Tray(icon)
    this.tray.setIgnoreDoubleClickEvents(true)
  
    this.tray.on('click', this.toggleWindow.bind(this))
  };
}

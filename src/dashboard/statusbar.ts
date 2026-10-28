import * as vscode from 'vscode';

export interface DashboardStatusBarItem {
    show(dashboardUrl: string): void;
    hide(): void;
}

export function newStatusBarItem(): DashboardStatusBarItem {
    return new DashboardStatusBarItemImpl();
}

class DashboardStatusBarItemImpl implements DashboardStatusBarItem {
    private item: vscode.StatusBarItem | null;
    constructor() {
        this.item = null;
    }

    show(dashboardUrl: string) {
        if (this.item === null) {
            this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
            this.item.text = "Spin Dashboard";
            this.item.command = "spin.dashboard.onStatusBarItemClicked";
        }
        this.item.tooltip = `Running at ${dashboardUrl}`;
        this.item.show();
    }

    hide() {
        if (this.item !== null) {
            this.item.hide();
        }
    }
}

export async function onStatusBarItemClicked() {
    const commands = [
        { label: "Spin: Start Dev Dashboard", command: "spin.dashboard.start" },
        { label: "Spin: Stop Dev Dashboard", command: "spin.dashboard.stop" },
    ];

    const commandPick = await vscode.window.showQuickPick(commands);

    if (commandPick) {
        vscode.commands.executeCommand(commandPick.command);
    }
}

export const DASHBOARD_STATUS_BAR_ITEM: DashboardStatusBarItem = new DashboardStatusBarItemImpl();

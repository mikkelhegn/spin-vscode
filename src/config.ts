import * as vscode from 'vscode';

function spinConfiguration(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("spin");
}

export function customPath(): string | undefined {
    return spinConfiguration().get("customProgramPath");
}

export function deployPlugin(): string | undefined {
    const plugin = spinConfiguration().get<string>("deployPlugin");
    return plugin ? plugin.trim() : undefined;
}

export type DashboardOpenIn = "browser" | "webview";

export function dashboardOpenIn(): DashboardOpenIn {
    return spinConfiguration().get<DashboardOpenIn>("dashboardOpenIn") || "browser";
}

export function dashboardPort(): number {
    return spinConfiguration().get<number>("dashboardPort") || 3001;
}

const DEFAULT_DASHBOARD_PLUGIN_URL = "https://github.com/radu-matei/dash/releases/download/canary/dashboard.json";

export function dashboardPluginUrl(): string {
    return spinConfiguration().get<string>("dashboardPluginUrl") || DEFAULT_DASHBOARD_PLUGIN_URL;
}

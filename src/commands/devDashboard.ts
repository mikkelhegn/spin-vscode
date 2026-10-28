import * as vscode from 'vscode';
import got from 'got';
import * as fs from 'fs';
import * as path from 'path';

import * as config from '../config';
import { DASHBOARD_STATUS_BAR_ITEM } from '../dashboard/statusbar';
import { disposeDashboardWebview, showDashboardWebview } from '../dashboard/webview';
import { installDashboardPlugin, isDashboardPluginInstalled } from '../dashboard/plugin';
import { isErr } from '../errorable';
import { longRunning, longRunningProcess } from '../longrunning';
import { spinCommand, TASK_SOURCE } from '../tasks';
import { setAmbientContext } from '../utils/context';

const DASHBOARD_RUNNING_CONTEXT = "spin.dashboardRunning";
const DASHBOARD_COMMAND = "dashboard";

export function registerDashboardTaskListeners(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.tasks.onDidEndTask(async (e) => {
            if (isDashboardTask(e.execution.task) && !findDashboardExecution()) {
                await setDashboardRunning(false);
            }
        })
    );
}

export async function startDevDashboard(): Promise<void> {
    const workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot || !fs.existsSync(path.join(workspaceRoot, 'spin.toml'))) {
        await vscode.window.showErrorMessage('Open a Spin application (a folder containing spin.toml) to use the Dev Dashboard.');
        return;
    }

    if (findDashboardExecution()) {
        await openDashboardUi(dashboardUrl());
        return;
    }

    const pluginCheck = await isDashboardPluginInstalled();
    if (isErr(pluginCheck)) {
        await vscode.window.showErrorMessage(`Unable to check Spin plugins: ${pluginCheck.message}`);
        return;
    }
    if (!pluginCheck.value) {
        const choice = await vscode.window.showInformationMessage(
            'The Spin Dashboard plugin is not installed. Install it now?',
            'Install', 'Cancel'
        );
        if (choice !== 'Install') {
            return;
        }
        const installResult = await longRunningProcess('Installing Spin Dashboard plugin...', (tok) => installDashboardPlugin(tok));
        if (isErr(installResult)) {
            await vscode.window.showErrorMessage(`Failed to install the Spin Dashboard plugin: ${installResult.message}`);
            return;
        }
    }

    const port = config.dashboardPort();
    const options = ['--no-open', '--port', String(port)];
    const execution = await spinCommand([DASHBOARD_COMMAND, ...options]);
    const task = new vscode.Task(
        { type: 'spin', command: DASHBOARD_COMMAND, options },
        vscode.TaskScope.Workspace,
        DASHBOARD_COMMAND,
        TASK_SOURCE,
        execution
    );
    task.group = vscode.TaskGroup.Test;
    task.isBackground = true;

    await vscode.tasks.executeTask(task);

    const ready = await longRunning('Starting Spin Dashboard...', () => waitUntilReady(port));
    if (!ready) {
        await vscode.window.showErrorMessage('Timed out waiting for the Spin Dashboard to start. Check the integrated terminal for errors.');
        return;
    }

    await setDashboardRunning(true);
    await openDashboardUi(dashboardUrl());
}

export async function stopDevDashboard(): Promise<void> {
    const existing = findDashboardExecution();
    if (existing) {
        existing.terminate();
    }
    disposeDashboardWebview();
    await setDashboardRunning(false);
}

function dashboardUrl(): string {
    return `http://localhost:${config.dashboardPort()}`;
}

async function openDashboardUi(url: string): Promise<void> {
    if (config.dashboardOpenIn() === 'webview') {
        showDashboardWebview(url);
        return;
    }
    const opened = await vscode.env.openExternal(vscode.Uri.parse(url));
    if (!opened) {
        await vscode.window.showErrorMessage(`Unable to open ${url}.`);
    }
}

async function waitUntilReady(port: number, timeoutMs = 15000): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    const url = `http://localhost:${port}`;
    while (Date.now() < deadline) {
        try {
            await got(url, { timeout: { request: 1000 }, retry: { limit: 0 }, throwHttpErrors: false });
            return true;
        } catch {
            await sleep(300);
        }
    }
    return false;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function findDashboardExecution(): vscode.TaskExecution | undefined {
    return vscode.tasks.taskExecutions.find((e) => isDashboardTask(e.task));
}

function isDashboardTask(task: vscode.Task): boolean {
    return task.source === TASK_SOURCE &&
        task.definition.type === 'spin' &&
        (task.definition as { command?: unknown }).command === DASHBOARD_COMMAND;
}

async function setDashboardRunning(running: boolean): Promise<void> {
    await setAmbientContext(DASHBOARD_RUNNING_CONTEXT, running);
    if (running) {
        DASHBOARD_STATUS_BAR_ITEM.show(dashboardUrl());
    } else {
        DASHBOARD_STATUS_BAR_ITEM.hide();
    }
}

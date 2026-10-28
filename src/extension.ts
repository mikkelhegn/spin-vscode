import * as vscode from 'vscode';

import { addToTerminalPath } from './commands/add-to-terminal-path';
import { connect } from './commands/connect';
import { deploy } from './commands/deploy';
import { openDashboard } from './commands/openDashboard';
import { registerDashboardTaskListeners, startDevDashboard, stopDevDashboard } from './commands/devDashboard';
import { showActiveEnvironmentUI } from './fermyon/environment-ui';
import { onStatusBarItemClicked } from './fermyon/statusbar';
import { onStatusBarItemClicked as onDashboardStatusBarItemClicked } from './dashboard/statusbar';

import * as tasks from './tasks';

export async function activate(context: vscode.ExtensionContext) {
    const disposables = [
        vscode.commands.registerCommand('spin.addToTerminalPath', () => addToTerminalPath(context)),
        vscode.commands.registerCommand('spin.deploy', deploy),
        vscode.commands.registerCommand('spin.connect', connect),
        vscode.commands.registerCommand('spin.onStatusBarItemClicked', onStatusBarItemClicked),
        vscode.commands.registerCommand('spin.openDashboard', openDashboard),
        vscode.commands.registerCommand('spin.dashboard.start', startDevDashboard),
        vscode.commands.registerCommand('spin.dashboard.stop', stopDevDashboard),
        vscode.commands.registerCommand('spin.dashboard.onStatusBarItemClicked', onDashboardStatusBarItemClicked),
        vscode.tasks.registerTaskProvider("spin", tasks.provider()),
    ];

    context.subscriptions.push(...disposables);
    registerDashboardTaskListeners(context);

    await showActiveEnvironmentUI();
}

export async function deactivate() {
    await stopDevDashboard();
}

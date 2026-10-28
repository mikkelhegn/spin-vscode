import * as vscode from 'vscode';

let currentPanel: vscode.WebviewPanel | undefined;

export function showDashboardWebview(url: string) {
    if (currentPanel) {
        currentPanel.webview.html = buildHtml(url);
        currentPanel.reveal(vscode.ViewColumn.Active);
        return;
    }

    currentPanel = vscode.window.createWebviewPanel(
        'spinDashboard',
        'Spin Dashboard',
        vscode.ViewColumn.Active,
        { enableScripts: true, retainContextWhenHidden: true }
    );
    currentPanel.webview.html = buildHtml(url);
    currentPanel.onDidDispose(() => {
        currentPanel = undefined;
    });
}

export function disposeDashboardWebview() {
    currentPanel?.dispose();
    currentPanel = undefined;
}

function buildHtml(url: string): string {
    const origin = new URL(url).origin;
    const csp = `default-src 'none'; frame-src ${origin}; style-src 'unsafe-inline';`;
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <style>
        html, body, iframe { margin: 0; padding: 0; width: 100%; height: 100%; border: none; display: block; }
    </style>
</head>
<body>
    <iframe src="${url}"></iframe>
</body>
</html>`;
}

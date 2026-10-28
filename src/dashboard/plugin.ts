import { CancellationToken } from 'vscode';
import * as config from '../config';
import { Errorable, isErr, ok } from '../errorable';
import { ensureSpinInstalled } from '../installer';
import { shell, invokeErrFeed, RunningProcess } from '../utils/shell';
import * as log from '../logger';

const DASHBOARD_PLUGIN_NAME = "dashboard";

export async function isDashboardPluginInstalled(): Promise<Errorable<boolean>> {
    const binOpt = await ensureSpinInstalled();
    if (isErr(binOpt)) {
        return binOpt;
    }
    const bin = binOpt.value;

    const cmd = `${bin} plugins list --installed`;
    log.info(isDashboardPluginInstalled.name, `$ ${cmd}`);
    return await shell.execObj<boolean>(
        cmd,
        'spin plugins list',
        shell.execOpts(),
        (stdout) => {
            const names = stdout.split('\n').map((line) => line.trim().split(/\s+/)[0]);
            return names.includes(DASHBOARD_PLUGIN_NAME);
        }
    );
}

export async function installDashboardPlugin(token: CancellationToken): Promise<Errorable<RunningProcess>> {
    const binOpt = await ensureSpinInstalled();
    if (isErr(binOpt)) {
        return binOpt;
    }
    const bin = binOpt.value;

    // The dashboard plugin isn't (yet) listed in Spin's official plugin catalog, so
    // `spin plugins install dashboard` fails with "plugin not found at expected
    // location" even after `spin plugins update`. Install directly from its
    // published manifest instead; see spin.dashboardPluginUrl for overriding this
    // once the plugin lands in the official catalog or a newer build is published.
    const url = config.dashboardPluginUrl();
    return ok(invokeErrFeed(bin, ['plugins', 'install', '--url', url, '--yes'], {}, token));
}

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { join } from 'path';
import { ExtensionContext, window, TreeViewExpansionEvent, workspace, TextDocument, Uri } from 'vscode';
import {
	LanguageClient,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

import MezzuriteDataProvider from './models/MezzuriteDataProvider';
import MezzuriteComponent from './models/MezzuriteComponent';
import MezzuriteTreeItem from './models/MezzuriteTreeItem';

let client: LanguageClient;

export function activate (context: ExtensionContext) {
	// The server is implemented in node
  let serverModule = context.asAbsolutePath(
		join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

	// Create the language client and start the client.
  client = new LanguageClient(
		'vscode-mezzurite',
		'Mezzurite',
		serverOptions,
		undefined
  );

  let treeView = window.createTreeView('mezzuriteComponentList', {
    treeDataProvider: new MezzuriteDataProvider([], context.extensionPath)
  });

	// Start the client. This will also launch the server
  client.start();

  client.onReady()
    .catch(() => client.info('The client could not be initialized.'))
    .then(() => {
      client.onNotification('custom/mezzuriteComponents', (message: { value: MezzuriteComponent[] }) => {
        treeView = window.createTreeView('mezzuriteComponentList', {
          treeDataProvider: new MezzuriteDataProvider(message.value, context.extensionPath)
        });

        treeView.onDidCollapseElement(onTreeViewExpansionEvent);

        treeView.onDidExpandElement(onTreeViewExpansionEvent);
      });
    });

  const fileWatcher = workspace.createFileSystemWatcher('**/*.{ts,js,tsx,jsx}', false, false, false);

  fileWatcher.onDidChange((event: Uri) => {
    client.sendNotification('custom/fileChanged', event.fsPath);
  });

  fileWatcher.onDidDelete((event: Uri) => {
    client.sendNotification('custom/fileDeleted', event.fsPath);
  });

  function onTreeViewExpansionEvent (event: TreeViewExpansionEvent<MezzuriteTreeItem>): void {
    if (event.element.resourceUri != null) {
      workspace.openTextDocument(event.element.resourceUri.path)
        .then((document: TextDocument) => {
          window.showTextDocument(document);
        });
    }
  }
}

export function deactivate (): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

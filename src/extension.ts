'use strict';

import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, workspace} from 'vscode';
import * as path from 'path';
import * as Buddy from 'buddy.js';

const JS_LANGUAGE_ID : string = `javascript`;

export function activate(context: ExtensionContext) {
    let vsBuddy = new VSBuddy();

    context.subscriptions.push(vsBuddy);

    workspace.onDidChangeTextDocument(vsBuddy.updateMagicNumberCount, vsBuddy);
    window.onDidChangeActiveTextEditor(vsBuddy.updateMagicNumberCount, vsBuddy, context.subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class VSBuddy {
    private _statusBarItem: StatusBarItem;

    public updateMagicNumberCount() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        if (doc.languageId !== JS_LANGUAGE_ID) {
            return this._statusBarItem.hide();
        }

        const { _statusBarItem } = this;

        const buddy = new Buddy(
            [ doc.uri.fsPath ],
            {
                detectObjects: true,
                enforceConst: true,
                ignore: []
            }
        );

        buddy.run().then(function(report) {
            _statusBarItem.text = `Magic Numbers: ${ report.length }`;
            _statusBarItem.show();
        });
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const documentSymbolProvider_1 = require("./docSymbolProvider.js");
const foldingRangeProvider_1 = require("./foldingRangeProvider.js")

function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider([
        { language: 'ini' },
    ], new documentSymbolProvider_1.IniDocumentSymbolProvider()));

    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider([
        { language: 'ini' },
    ], new foldingRangeProvider_1.IniFoldingRangeProvider()));
}

exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map

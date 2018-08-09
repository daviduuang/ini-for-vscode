"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class IniDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        const result = [];

        // 段
        const sectionRegex = /^\s*\[([^\]]+)\]/;
        // 键
        const keyRegex = /^\s*([^\[;=]+)\s*=/;

        let prevSecName = null;
        let prevSecRangeStart = null;
        let prevSecRangeEnd = null;
        
        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line);

            // 匹配段
            const secMatched = text.match(sectionRegex);
            if (secMatched) {

                // 先闭合上一个段
                if (prevSecName != null)
                {
                    prevSecRangeEnd = new vscode.Position(line, 0);
                    // 注意：“Range objects are immutable.”
                    const secLoc = new vscode.Location(document.uri, new vscode.Range(prevSecRangeStart, prevSecRangeEnd));
                    const prevSectionSymbol = new vscode.SymbolInformation(prevSecName, vscode.SymbolKind.Class, '', secLoc);
                    result.push(prevSectionSymbol);
                }

                // 记录下新段的信息
                prevSecName = secMatched[1];
                prevSecRangeStart = new vscode.Position(line, 0);
                continue;
            }

            // 匹配键（注意：键必须位于最近的段下面）
            const keyMatched = text.match(keyRegex);
            if((prevSecName != null) && keyMatched){
                const keyLoc = new vscode.Location(document.uri, new vscode.Position(line, 0));
                result.push(new vscode.SymbolInformation(keyMatched[1], vscode.SymbolKind.Function, prevSecName, keyLoc));    
                continue;
            }
        }

        // 记得：闭合最后一个段！
        if (prevSecName != null)
        {
            prevSecRangeEnd = new vscode.Position(document.lineCount -1 , 0);
            const secLoc = new vscode.Location(document.uri, new vscode.Range(prevSecRangeStart, prevSecRangeEnd));
            const prevSectionSymbol = new vscode.SymbolInformation(prevSecName, vscode.SymbolKind.Class, '', secLoc);
            result.push(prevSectionSymbol);
        }

        return result;
    }
}
exports.IniDocumentSymbolProvider = IniDocumentSymbolProvider;
//# sourceMappingURL=docSymbolProvider.js.map
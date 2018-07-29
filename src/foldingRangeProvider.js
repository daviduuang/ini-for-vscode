"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class IniFoldingRangeProvider {
    provideFoldingRanges(document, foldingContext, token) {
        const result = [];

        // 段
        const sectionRegex = /\[([^\]]+)\]/;
        // 键
        const keyRegex = /^\s*([^\[;=]+)\s*=/;

        let prevSecName = null;
        let prevSecLineStart = null;
        let prevSecLineEnd = null;
        // 段下面最后的键所在的行号
        // (段只会折叠到其下面最后一个键所在行，后面的注释不会被折叠！)
        let lastKeyLine = null;
        
        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line);

            // 匹配段
            const secMatched = text.match(sectionRegex);
            if (secMatched) {

                // 先闭合上一个段
                if (prevSecName != null)
                {
                    prevSecLineEnd = lastKeyLine;
                    const prevSecFoldingRange = new vscode.FoldingRange(prevSecLineStart, prevSecLineEnd, vscode.FoldingRangeKind.Region);
                    result.push(prevSecFoldingRange);
                }

                // 记录下新段的信息
                prevSecName = secMatched[1];
                prevSecLineStart = line;
                continue;
            }

            // 匹配键（注意：键必须位于最近的段下面）
            const keyMatched = text.match(keyRegex);
            if((prevSecName != null) && keyMatched){
                lastKeyLine = line;   
                continue;
            }
        }

        // 记得：闭合最后一个段！
        if (prevSecName != null)
        {
            prevSecLineEnd = document.lineCount - 1;
            const prevSecFoldingRange = new vscode.FoldingRange(prevSecLineStart, prevSecLineEnd, vscode.FoldingRangeKind.Region);
            result.push(prevSecFoldingRange);
        }

        return result;
    }
}

exports.IniFoldingRangeProvider = IniFoldingRangeProvider;
//# sourceMappingURL=foldingRangeProvider.js.map
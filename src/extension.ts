import * as vscode from 'vscode';
import axios from 'axios';

const url = 'http://localhost:5000/evaluate'; // サーバーのURL

export function activate(context: vscode.ExtensionContext) {
	const provider1 = vscode.languages.registerCompletionItemProvider('latex', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			const commitCharacterCompletion = new vscode.CompletionItem(' =');
			commitCharacterCompletion.commitCharacters = ['='];
			commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `=` to get `console.`');
			return [commitCharacterCompletion];
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'latex',
		{
			async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.slice(0, position.character);
				const linePrefix2 = document.lineAt(position).text.slice(0, position.character - 2);
				console.log(linePrefix);
				if (!linePrefix.endsWith(' =')) {
					console.log('not end with \' =\'');
					return undefined;
				}

				const replacedString = linePrefix2.replace(/\\SI{([0-9.}]+)}{[^}]*}/g, '$1');
				console.log(replacedString);

				const data = {
					replacedString: replacedString,
				};

				let result = "!!!!!";
				let expr = "something went wrong";

				try {
					const response = await axios.post(url, data);
					result = response.data.result;
					expr = response.data.expression;
					console.log('Result:', result);
					console.log('Expression:', expr);

					const resultText = new vscode.CompletionItem(" " + result, vscode.CompletionItemKind.Method);
					resultText.documentation = new vscode.MarkdownString(expr);

					return [resultText];
				} catch (error) {
					console.error('Error:', error);
					return [];
				}
			}
		},
		'=' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(provider1, provider2);
}

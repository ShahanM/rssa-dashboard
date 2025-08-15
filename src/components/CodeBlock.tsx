import clsx from 'clsx';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Or your chosen theme
import React, { useEffect, useRef } from 'react';
import { CopyToClipboardButton } from './buttons/CopyToClipboardButton';

interface CodeBlockProps {
	codeString: string;
	language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ codeString, language }) => {
	const codeRef = useRef(null);
	language = language || "json";

	useEffect(() => {
		if (codeRef && codeRef.current) {
			const codeEle: HTMLElement = codeRef.current;
			if (codeEle.attributes.getNamedItem("data-highlighted")?.value === "yes") return;
			hljs.highlightBlock(codeRef.current);
		}
	}, [codeRef]);

	return (
		<pre className="rounded-lg">
			<code ref={codeRef} className={clsx(
				`language-${language}`,
				"hljs rounded-lg p-3 mt-5",
				"tracking-tight"
			)}
			>
				{codeString}
			</code>
			<CopyToClipboardButton textToCopy={codeString} showLabel={true}
				className={clsx(
					"mt-3 bg-red-800 text-purple-100 float-end h-10",
					"hover:bg-purple-900"
				)}
			/>
		</pre>
	);
};

export default CodeBlock;
import React, { useEffect, useRef } from "react";

import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import "highlight.js/lib/languages/json";


interface HighlightProps {
	children: string;
	language?: string;
}

const Highlight: React.FC<HighlightProps> = ({ children, language }) => {
	const codeNode = useRef(null);
	language = language || "json";

	useEffect(() => {
		if (codeNode && codeNode.current) {
			const codeEle: HTMLElement = codeNode.current;
			if (codeEle.attributes.getNamedItem("data-highlighted")?.value === "yes") return;
			hljs.highlightBlock(codeNode.current);
		}
	}, [codeNode]);

	return (
		<pre className="rounded">
			<code ref={codeNode} className={language}>
				{children}
			</code>
		</pre>
	);
}


export default Highlight;

import clsx from 'clsx';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import React, { useEffect, useRef } from 'react';

interface CodeBlockProps {
    codeString: string;
    language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ codeString, language }) => {
    const codeRef = useRef(null);
    language = language || 'python';

    useEffect(() => {
        if (codeRef && codeRef.current) {
            const codeEle: HTMLElement = codeRef.current;
            if (codeEle.attributes.getNamedItem('data-highlighted')?.value === 'yes') return;
            hljs.highlightBlock(codeRef.current);
        }
    }, [codeRef]);

    return (
        <pre className="rounded-lg">
            <code
                ref={codeRef}
                className={clsx(
                    `language-${language}`,
                    'hljs rounded-lg p-3 mt-5',
                    'tracking-tight',
                    'max-h-[75vh] overflow-y-scroll',
                    'scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700'
                )}
            >
                {codeString}
            </code>
        </pre>
    );
};

export default CodeBlock;

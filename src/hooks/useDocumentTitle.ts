import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
    const defaultTitle = 'RSSA';

    useEffect(() => {
        document.title = title ? `${title} | RSSA` : defaultTitle;
        return () => {
            document.title = defaultTitle;
        };
    }, [title]);
};

export default useDocumentTitle;

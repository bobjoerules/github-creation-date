(function () {
    'use strict';

    const SELECTOR_DATA = 'script[data-target="react-app.embeddedData"]';
    const INJECT_ID = 'gh-repo-creation-date-extension';

    function findRepoCreatedAt(obj) {
        if (typeof obj !== 'object' || obj === null) return null;
        if (obj.repo && obj.repo.createdAt) return obj.repo.createdAt;
        for (const key in obj) {
            const res = findRepoCreatedAt(obj[key]);
            if (res) return res;
        }
        return null;
    }

    function getInjectionPoint() {
        const aboutSection = Array.from(document.querySelectorAll('.BorderGrid-cell'))
            .find(cell => cell.querySelector('h2')?.textContent.trim() === 'About');

        if (!aboutSection) return null;

        const firstMetaLink = aboutSection.querySelector('.mt-2:not(.gh-repo-creation-date)');
        if (firstMetaLink) {
            return { element: firstMetaLink, position: 'beforebegin' };
        }

        return null;
    }

    function injectCreationDate() {
        if (document.getElementById(INJECT_ID)) return;

        const injection = getInjectionPoint();
        if (!injection) return;

        try {
            const scriptTag = document.querySelector(SELECTOR_DATA);
            if (!scriptTag) return;

            const data = JSON.parse(scriptTag.textContent);
            const createdAt = findRepoCreatedAt(data);

            if (createdAt) {
                const date = new Date(createdAt);
                const formattedDate = date.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                const creationDiv = document.createElement('div');
                creationDiv.id = INJECT_ID;
                creationDiv.className = 'gh-repo-creation-date mt-2 color-fg-muted';

                creationDiv.innerHTML = `
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-calendar">
                        <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z"></path>
                    </svg>
                    <span>${formattedDate}</span>
                `;

                if (injection.position === 'afterend') {
                    injection.element.parentNode.insertBefore(creationDiv, injection.element.nextSibling);
                } else {
                    injection.element.parentNode.insertBefore(creationDiv, injection.element);
                }
            }
        } catch (e) {
            console.warn('GitHub Repo Creation Date Extension: Error', e);
        }
    }

    injectCreationDate();

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(injectCreationDate, 500);
        }
        if (!document.getElementById(INJECT_ID)) {
            injectCreationDate();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();

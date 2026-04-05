(function () {
    'use strict';

    const SELECTOR_DATA = 'script[data-target="react-app.embeddedData"]';
    const INJECT_ID = 'gh-repo-creation-date-extension';

    function findRepoCreatedAt(obj) {
        if (typeof obj !== 'object' || obj === null) return null;
        if (obj.repo && obj.repo.createdAt) return obj.repo.createdAt;
        if (obj.repository && obj.repository.createdAt) return obj.repository.createdAt;
        if (obj.createdAt && typeof obj.createdAt === 'string' && obj.createdAt.includes('T')) {
            if (obj.name || obj.id || obj.owner) return obj.createdAt;
        }
        for (const key in obj) {
            try {
                const res = findRepoCreatedAt(obj[key]);
                if (res) return res;
            } catch (e) { }
        }
        return null;
    }

    function getInjectionPoint() {
        const aboutSection = Array.from(document.querySelectorAll('.BorderGrid-cell'))
            .find(cell => {
                const h2 = cell.querySelector('h2');
                return h2 && (h2.textContent.trim() === 'About' || h2.textContent.trim() === 'Repository details');
            });

        if (!aboutSection) return null;

        const topics = aboutSection.querySelector('.topic-tag')?.closest('.tmp-my-3') ||
            aboutSection.querySelector('.topic-tag')?.closest('div') ||
            aboutSection.querySelector('.list-topics-container');
        if (topics) {
            return { element: topics, position: 'afterend' };
        }

        const description = aboutSection.querySelector('p.f4') || aboutSection.querySelector('.f4');
        if (description) {
            return { element: description, position: 'afterend' };
        }

        const h2 = aboutSection.querySelector('h2');
        if (h2) {
            return { element: h2, position: 'afterend' };
        }

        return { element: aboutSection, position: 'afterbegin' };
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

                const creationBlock = document.createElement('div');
                creationBlock.id = INJECT_ID;

                creationBlock.innerHTML = `
                    <h3 class="sr-only">Creation Date</h3>
                    <div class="mt-2 color-fg-muted">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-calendar" style="margin-right: 8px; vertical-align: text-bottom;">
                            <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z"></path>
                        </svg>
                        <span>${formattedDate}</span>
                    </div>
                `;

                injection.element.insertAdjacentElement(injection.position, creationBlock);
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

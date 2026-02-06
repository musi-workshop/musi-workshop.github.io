document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("all-editions-container");
    if (!container) return;

    const rootPath = container.getAttribute("data-root-path") || ".";
    const activeId = container.getAttribute("data-active") || "";

    fetch(`${rootPath}/js/editions.md`)
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            let linksHtml = '';

            const linkRegex = /-\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:<!--\s*id:\s*(\w+)\s*-->)?/;

            lines.forEach(line => {
                const match = line.match(linkRegex);
                if (match) {
                    const label = match[1];
                    let url = match[2];
                    const id = match[3];

                    // Resolve relative URL
                    if (!url.startsWith('http') && !url.startsWith('//')) {
                        url = `${rootPath}/${url}`;
                    }

                    if (id === activeId) {
                        linksHtml += `<span class="block px-4 py-2 text-sm text-indigo-600 bg-indigo-50 font-semibold cursor-default">${label}</span>`;
                    } else {
                        linksHtml += `<a href="${url}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">${label}</a>`;
                    }
                }
            });

            const html = `
                <div class="relative group">
                    <button class="text-gray-600 hover:text-indigo-600 font-medium flex items-center focus:outline-none">
                        All Editions
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>
                    </button>
                    <div class="absolute right-0 mt-0 w-48 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div class="py-1">
                            ${linksHtml}
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = html;
        })
        .catch(err => console.error('Failed to load editions.md:', err));
});

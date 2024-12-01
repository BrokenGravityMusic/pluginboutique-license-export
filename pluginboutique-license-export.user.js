// ==UserScript==
// @name         License Export Script
// @namespace    https://github.com/BrokenGravityMusic/
// @version      2024-12-01
// @description  Extracts your license keys, with product names and other useful info for backup purpose.
// @author       bgrav
// @match        https://www.pluginboutique.com/myaccount*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pluginboutique.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let collectedData = '';

    function extractData() {
        const productBlocks = document.querySelectorAll('.userproduct');

        if (productBlocks.length === 0) {
            return;
        }

        productBlocks.forEach((block) => {
            const title = block.querySelector('.userproduct-title a')?.textContent.trim();
            const category = block.querySelector('.userproduct-meta h4 a:first-child')?.textContent.trim();
            const manufacturer = block.querySelector('.userproduct-meta h4 a:last-child')?.textContent.trim();
            const serial = block.querySelector('.userproduct-serial-value pre')?.textContent.trim();

            collectedData += `Product: ${title || 'N/A'}\n`;
            collectedData += `Category: ${category || 'N/A'}\n`;
            collectedData += `Manufacturer: ${manufacturer || 'N/A'}\n`;
            collectedData += `Serial Number: ${serial || 'N/A'}\n`;
            collectedData += `#------\n`;
        });
    }

    function createTextarea() {
        const existingTextarea = document.getElementById('export-textarea');
        if (existingTextarea) existingTextarea.remove();

        const textarea = document.createElement('textarea');
        textarea.id = 'export-textarea';
        textarea.style.position = 'fixed';
        textarea.style.top = '150px';
        textarea.style.right = '10px';
        textarea.style.width = '400px';
        textarea.style.height = '300px';
        textarea.style.zIndex = '10000';
        textarea.style.backgroundColor = '#fff';
        textarea.style.border = '1px solid #ccc';
        textarea.style.padding = '10px';
        textarea.value = collectedData || 'No data collected.';
        textarea.readOnly = true;
        document.body.appendChild(textarea);
    }

    function hasNextPage() {
        return !!document.querySelector('a.paging-next');
    }

    function goToNextPage() {
        const nextButton = document.querySelector('a.paging-next');
        if (nextButton) {
            nextButton.click();
            return true;
        }
        return false;
    }

    function waitForProducts() {
        return new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                const productBlocks = document.querySelectorAll('.userproduct');
                if (productBlocks.length > 0) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    async function scrapeAllPages() {
        collectedData = '';
        do {
            extractData();
            if (hasNextPage()) {
                goToNextPage();
                await waitForProducts();
            } else {
                break;
            }
        } while (true);

        if (collectedData.trim()) {
            createTextarea();
        } else {
            alert('No data was collected. Ensure products are visible on the page.');
        }

        const allPagesButton = document.getElementById('export-all-pages-button');
        if (allPagesButton) {
            allPagesButton.disabled = false;
            allPagesButton.textContent = 'All pages';
        }
    }

    async function scrapeCurrentPage() {
        collectedData = '';
        extractData();
        if (collectedData.trim()) {
            createTextarea();
        } else {
            alert('No data was collected. Ensure products are visible on the page.');
        }
    }

    function createExportButtons() {
        const existingButtons = document.getElementById('export-buttons-container');
        if (existingButtons) existingButtons.remove();

        const container = document.createElement('div');
        container.id = 'export-buttons-container';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#2f2f2f';
        container.style.padding = '10px';
        container.style.border = '1px solid #777';
        container.style.width = '200px';

        // Header
        const header = document.createElement('div');
        header.textContent = 'Export licenses';
        header.style.backgroundColor = '#2196F3';
        header.style.color = 'white';
        header.style.padding = '10px';
        header.style.textAlign = 'center';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '10px';

        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-between';

        // Current page button
        const currentPageButton = document.createElement('button');
        currentPageButton.textContent = 'Current page';
        currentPageButton.style.padding = '10px';
        currentPageButton.style.backgroundColor = '#4CAF50';
        currentPageButton.style.color = 'white';
        currentPageButton.style.border = 'none';
        currentPageButton.style.cursor = 'pointer';
        currentPageButton.style.flex = '1';
        currentPageButton.style.marginRight = '5px';

        currentPageButton.addEventListener('click', async () => {
            await scrapeCurrentPage();
        });

        // All pages button
        const allPagesButton = document.createElement('button');
        allPagesButton.id = 'export-all-pages-button';
        allPagesButton.textContent = 'All pages';
        allPagesButton.style.padding = '10px';
        allPagesButton.style.backgroundColor = '#f44336';
        allPagesButton.style.color = 'white';
        allPagesButton.style.border = 'none';
        allPagesButton.style.cursor = 'pointer';
        allPagesButton.style.flex = '1';
        allPagesButton.style.marginLeft = '5px';

        allPagesButton.addEventListener('click', async () => {
            allPagesButton.disabled = true;
            allPagesButton.textContent = 'Exporting all pages...';
            await scrapeAllPages();
        });

        buttonsContainer.appendChild(currentPageButton);
        buttonsContainer.appendChild(allPagesButton);

        container.appendChild(header);
        container.appendChild(buttonsContainer);
        document.body.appendChild(container);
    }

    // Initialize the export buttons
    createExportButtons();
})();

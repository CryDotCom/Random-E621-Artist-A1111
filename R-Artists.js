// ==UserScript==
// @name         A1111 - Random Artists to Prompt
// @version      0.3
// @namespace    https://github.com/CryDotCom/Random-E621-Artist-A1111
// @updateURL    https://raw.githubusercontent.com/CryDotCom/Random-E621-Artist-A1111/master/R-Artists.js
// @downloadURL  https://raw.githubusercontent.com/CryDotCom/Random-E621-Artist-A1111/master/R-Artists.js
// @description  Add randomly chosen E621 Artist names to a textarea from the top 700+ sorted by post count
// @author       Onocom/Crydotcom
// @match        http://127.0.0.1:7860
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    // Function to load names from an online hosted raw text file
    function loadNamesFromURL(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    const namesText = response.responseText;
                    const namesList = namesText.split('\n').map(name => name.trim()).filter(Boolean);
                    callback(namesList);
                } else {
                    console.error('Failed to load Artists from the provided URL.');
                }
            },
            onerror: function (error) {
                console.error('Error loading Artists:', error);
            }
        });
    }

    // Function to add names to the textarea
    function addNamesToTextarea(names, count) {
        const textarea = document.activeElement;

        if (textarea.tagName === 'TEXTAREA') {
            const currentContent = textarea.value;

            // Prompt for the number of names to add
            const numberOfNames = count || prompt("How many Artists do you want to add?");
            const namesToAdd = parseInt(numberOfNames, 10);

            if (!isNaN(namesToAdd) && namesToAdd > 0) {
                // Choose random names
                const randomNames = [];
                for (let i = 0; i < namesToAdd; i++) {
                    const randomIndex = Math.floor(Math.random() * names.length);
                    // Replace "_" with a space, and "(artist)" with "\(artist\)"
                    const cleanedName = names[randomIndex].replace(/_/g, ' ').replace(/\(artist\)/g, '\\(artist\\)').trim();
                    randomNames.push(cleanedName);
                }

                // Format the names
                const formattedNames = randomNames.map(names => `by ${names}`).join(', ');

                // Add the formatted names to the end of the current content
                const newContent = currentContent.length > 0 ? currentContent + ', ' + formattedNames : formattedNames;

                // Set the new content to the textarea
                textarea.value = newContent;
            } else {
                alert('Please enter a valid number greater than 0.');
            }
        } else {
            alert('Please focus on a textarea before using this script.');
        }
    }

    // Register the menu command
    GM_registerMenuCommand('Add Random Artists', function () {
        const url = 'https://raw.githubusercontent.com/CryDotCom/Random-E621-Artist-A1111/main/Artist-Names-E621.txt';
        loadNamesFromURL(url, function (names) {
            addNamesToTextarea(names);
        });
    });
})();

// ==UserScript==
// @name         YouTube disable AdBlocker reminder remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes annoying reminder to disable AdBlocker
// @author       Dmytro Leonov
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==


const urlPath = "/watch";
const logPrefix = "%cYouTube AdBlocker reminder remover:";
const logPrefixStyle = "background-color: #a4f5bc; color: #000; font-size: 1.2em;";
let listenerIsSet = false;


const removeReminder = (reminder) => {
    console.info(logPrefix, logPrefixStyle, "Trying to remove annoying reminder")
    try {
        reminder.parentElement.remove();
        console.info(logPrefix, logPrefixStyle, "Removed annoying reminder to disable adblocker");

        // May need to check if video is paused before unpausing
        document.querySelector("video").click();
        console.info(logPrefix, logPrefixStyle, "Unpaused video");
    }
    catch (e) {
        console.error(logPrefix, logPrefixStyle, "An error occurred trying to remove reminder");
    }
}

const init = () => {
    // Check URL
    if (!window.location.pathname.startsWith(urlPath) || listenerIsSet) { return }

    // Add observer
    // Get a reference to the target ytd-popup-container element
    const targetContainer = document.querySelector('ytd-popup-container');

    // Function to handle the mutation
    const handleMutation = (mutationsList, observer) => {
        const reminder = document.getElementsByTagName("ytd-enforcement-message-view-model")
        if (reminder.length) {
            // Remove Reminder
            removeReminder(reminder[0]);
        }
    };

    // Create a new MutationObserver
    const observer = new MutationObserver(handleMutation);

    // Configure the observer to watch for childList changes (adding/removing nodes)
    const config = { childList: true };

    // Start observing the target ytd-popup-container
    observer.observe(targetContainer, config);

    // Toggle listenerIsSet
    listenerIsSet = true;

    console.info(logPrefix, logPrefixStyle, "Added event listener to popup container");
}

/**
 * Handle in-page navigation (modern YouTube)
 * @listens window:Event#yt-navigate-finish
 */
window.addEventListener("yt-navigate-finish", () => {
    init();
})

/**
 * Handle in-page initial page loading, reloading
 * @listens document:Event#readystatechange
 */
document.addEventListener("readystatechange", () => {
    if (document.readyState === "interactive") { init() }
})

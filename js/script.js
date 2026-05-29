/*
Configuration
------------------------
If something doesn't work please contact me on discord (Astronawta#0012).
*/

window.config = window.config || {};
Object.assign(window.config, {
    serverInfo: {
        serverLogoImageFileName: "logo.png", /*This is a file name for logo in /images/ (If you upload new logo with other name, you must change this value)*/
        serverName: "RemoCraft", /*Server name*/
        serverIp: "play.remocraft.com", /*Server IP / domain for Minecraft server status*/
        discordServerID: "1249803735157309500" /*Your Discord server ID. Set this to your real server ID after enabling the Widget in Discord settings.*/
    }
});
const config = window.config;

/*If you want to change website color go to /css/global.css and in :root {} is a color pallete (don't change names of variables, change only values)*/
















/*If you want everything to work as it should and you don't understand what is written here, don't touch it :D*/


/*Mobile navbar (open, close)*/
const navbar = document.querySelector(".navbar");
const navbarLinks = document.querySelector(".links");
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
    navbarLinks.classList.toggle("active");
})

/*FAQs*/
const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener("click", () => {
        accordionItemHeader.classList.toggle("active");
        const accordionItemBody = accordionItemHeader.nextElementSibling;

        if(accordionItemHeader.classList.contains("active")) accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
        else accordionItemBody.style.maxHeight = "0px";
    });
});

/*Config navbar*/
const serverName = document.querySelector(".server-name");
const serverLogo = document.querySelector(".logo-img");
/*Config header*/
const serverIp = document.querySelector(".minecraft-server-ip");
const serverLogoHeader = document.querySelector(".logo-img-header");
const discordOnlineUsers = document.querySelector(".discord-online-users");
const minecraftOnlinePlayers = document.querySelector(".minecraft-online-players");
/*Config contact*/
const contactForm = document.querySelector(".contact-form");
const inputWithLocationAfterSubmit = document.querySelector(".location-after-submit");

const assetPrefix = (() => {
    const match = location.pathname.match(/^\/(\w{2})\//);
    if (match && match[1] !== '') {
        return '../';
    }
    return '';
})();
const getAssetPath = (relativePath) => `${assetPrefix}${relativePath}`;


const getDiscordOnlineUsers = async () => {
    try {
        const discordServerId = config.serverInfo.discordServerID;
        if (!discordServerId || discordServerId === "YOUR_DISCORD_SERVER_ID") {
            return "None";
        }

        const apiWidgetUrl = `https://discord.com/api/guilds/${discordServerId}/widget.json`;
        let response = await fetch(apiWidgetUrl);
        let data = await response.json();

        if (!data || typeof data.presence_count === 'undefined') return "None";
        return data.presence_count || "None";
    } catch (e) {
        console.log(e);
        return "None";
    }
}

const getMinecraftOnlinePlayer = async () => {
    try {
        const serverIp = config.serverInfo.serverIp;

        const apiUrl = `https://api.mcsrvstat.us/2/${serverIp}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || !data.players || typeof data.players.online === 'undefined') {
            return "None";
        }

        return data.players.online;
    } catch (e) {
        console.log(e);
        return "None";
    }
}

/*IP copy only works if you have HTTPS on your website*/
const copyIp = () => {
    const copyIpButton = document.querySelector(".copy-ip");
    const copyIpAlert = document.querySelector(".ip-copied");

    // Si el botón no existe en la página, no hacer nada
    if (!copyIpButton) return;

    copyIpButton.addEventListener("click", () => {
        try {
            navigator.clipboard.writeText(config.serverInfo.serverIp);
    
            copyIpAlert.classList.add("active");

            setTimeout(() => {
                copyIpAlert.classList.remove("active");
            }, 5000);
        } catch (e) {
            console.log(e);
            copyIpAlert.innerHTML = "An error has occurred!";
            copyIpAlert.classList.add("active");
            copyIpAlert.classList.add("error");

            setTimeout(() => {
                copyIpAlert.classList.remove("active");
                copyIpAlert.classList.remove("error");
            }, 5000);
        }
    })
}

const setDataFromConfigToHtml = async () => {
    /*Set config data to navbar*/
    serverName.innerHTML = config.serverInfo.serverName;
    serverLogo.src = getAssetPath(`images/${config.serverInfo.serverLogoImageFileName}`);

    /*Set config data to header*/
    serverIp.innerHTML = config.serverInfo.serverIp;

    let locationPathname = location.pathname;

    if(locationPathname == "/" || locationPathname.includes("index")) {
        copyIp();
        /*Set config data to header*/
        serverLogoHeader.src = getAssetPath(`images/${config.serverInfo.serverLogoImageFileName}`);
        discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
        minecraftOnlinePlayers.innerHTML = await getMinecraftOnlinePlayer();
    } else if(locationPathname.includes("rules")) {
        copyIp();
    } else if(locationPathname.includes("contact")) {
        contactForm.action = `https://formsubmit.co/${config.contactPage.email}`;
        discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
        inputWithLocationAfterSubmit.value = location.href;
    }
}

setDataFromConfigToHtml();

/* Language selector toggle (accessible) */

const closeAllLangMenus = () => {
    document.querySelectorAll('.lang-menu').forEach(menu => {
        menu.style.display = 'none';
        menu.setAttribute('aria-hidden', 'true');
        const wrapper = menu.closest('.lang-switcher');
        if (wrapper) {
            const btn = wrapper.querySelector('.lang-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Click handling: open/close specific menu, close others, close on outside click
document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.lang-btn');

    // If clicked a language button
    if (btn) {
        const wrapper = btn.closest('.lang-switcher');
        const menu = wrapper.querySelector('.lang-menu');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            // close this
            btn.setAttribute('aria-expanded', 'false');
            menu.style.display = 'none';
            menu.setAttribute('aria-hidden', 'true');
            btn.focus();
        } else {
            // open this, close others
            closeAllLangMenus();
            btn.setAttribute('aria-expanded', 'true');
            menu.style.display = 'block';
            menu.setAttribute('aria-hidden', 'false');
            const firstItem = menu.querySelector('a, button, [tabindex]');
            if (firstItem) firstItem.focus();
        }
        return;
    }

    // Clicked outside any lang-switcher -> close all
    if (!e.target.closest || !e.target.closest('.lang-switcher')) {
        closeAllLangMenus();
    }
});

// Close menus with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeAllLangMenus();
    }
});
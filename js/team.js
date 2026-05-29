window.config = window.config || {};
Object.assign(window.config, {
    userSKinTypeInAdminTeam: "bust", /*[full, bust, head, face, front, frontFull, skin]*/
    atGroupsDefaultColors: {
        leaders: "rgba(255, 124, 124, 0.5)",
        moderators: "rgba(0, 190, 10, 0.5)",
        helpers: "rgba(11, 175, 255, 0.5)",
        builders: "rgba(247, 2, 176, 0.5)",
    },
    adminTeamPage: {
        leaders: [
            {
                inGameName: "RemoCraftMC",
                rank: "Owner",
                skinUrlOrPathToFile: "",
                rankColor: "rgba(255, 3, 3, 1)"
            }
        ],
        moderators: [
            {
                inGameName: "Zunallein",
                rank: "Moderator",
                skinUrlOrPathToFile: "",
                rankColor: ""
            },
            {
                inGameName: "mojanj",
                rank: "Moderator",
                skinUrlOrPathToFile: "",
                rankColor: ""
            },
            {
                inGameName: "SrSpaghetti",
                rank: "Moderator",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ],
        helpers: [
            {
                inGameName: "drex21",
                rank: "Helper",
                skinUrlOrPathToFile: "",
                rankColor: ""
            },
            {
                inGameName: "Gehzt630",
                rank: "Helper",
                skinUrlOrPathToFile: "",
                rankColor: ""
            },
            {
                inGameName: "Nyxxie_",
                rank: "Helper",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ],
        builders: [
            {
                inGameName: "AlconNT",
                rank: "Builder",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ]
    }
});

/*Admin-Team
------------
This team-specific configuration is loaded only on the team page.
*/

const getUuidByUsername = async (username) => {
    try {
        const ashconUrl = `https://api.ashcon.app/mojang/v2/user/${username}`;
        let response = await fetch(ashconUrl);

        if (response.ok) {
            let data = await response.json();
            if (data && data.uuid) return data.uuid.replace(/-/g, "");
        }

        const playerDbUrl = `https://playerdb.co/api/player/minecraft/${username}`;
        response = await fetch(playerDbUrl);
        if (!response.ok) {
            throw new Error(`UUID fetch failed: ${response.status}`);
        }

        let data = await response.json();
        if (data && data.data && data.data.player) {
            return data.data.player.raw_id || data.data.player.id.replace(/-/g, "");
        }

        return "None";
    } catch (e) {
        console.log(e);
        return "None";
    }
};

const getSkinByUuid = async (username) => {
    try {
        const uuid = await getUuidByUsername(username);
        const fallbackSkin = getAssetPath(`images/skin_not_loaded.png`);

        if (!uuid || uuid === "None") return fallbackSkin;

        const skinByUuidApi = `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/${uuid}`;
        let response = await fetch(skinByUuidApi);

        if (response.status === 400) return fallbackSkin;
        return skinByUuidApi;
    } catch (e) {
        console.log(e);
        return "None";
    }
};

const initTeamPage = async () => {
    if (!location.pathname.includes("team")) return;

    const atContent = document.querySelector(".at-content");
    if (!atContent) return;

    for (const team in config.adminTeamPage) {
        const group = document.createElement("div");
        group.classList.add("group");
        group.classList.add(team);

        const groupSchema = `
            <h2 class="rank-title">${team.charAt(0).toUpperCase() + team.slice(1)}</h2>
            <div class="users"></div>
        `;

        group.innerHTML = groupSchema;
        atContent.appendChild(group);

        const users = config.adminTeamPage[team];
        const fallbackSkin = getAssetPath(`images/skin_not_loaded.png`);

        for (let j = 0; j < users.length; j++) {
            const user = users[j];
            const currentGroup = group.querySelector(".users");

            const userDiv = document.createElement("div");
            userDiv.classList.add("user");

            let rankColor = config.atGroupsDefaultColors[team];
            if (user.rankColor) rankColor = user.rankColor;

            const imgId = `skin-${team}-${j}`;
            const userDivSchema = `
                <img id="${imgId}" src="${fallbackSkin}" alt="${user.inGameName}">
                <h5 class="name">${user.inGameName}</h5>
                <p class="rank ${team}" style="background: ${rankColor}">${user.rank}</p>
            `;

            userDiv.innerHTML = userDivSchema;
            currentGroup.appendChild(userDiv);

            if (user.skinUrlOrPathToFile) {
                document.getElementById(imgId).src = user.skinUrlOrPathToFile;
            } else {
                getSkinByUuid(user.inGameName).then((skin) => {
                    const imgElement = document.getElementById(imgId);
                    if (imgElement) {
                        imgElement.src = skin === "None" ? fallbackSkin : skin;
                    }
                });
            }
        }
    }
};

initTeamPage();

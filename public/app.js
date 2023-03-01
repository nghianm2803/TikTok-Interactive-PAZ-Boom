// This will use the demo backend if you open index.html locally via file://, otherwise your server will be used
let backendUrl = location.protocol === 'file:' ? "https://tiktok-chat-reader.zerody.one/" : undefined;
let connection = new TikTokIOConnection(backendUrl);

// Counter
let viewerCount = 0;
let likeCount = 0;
let diamondsCount = 0;

// These settings are defined by obs.html
if (!window.settings) window.settings = {};

let idComment = undefined;

let bannedUserSpam = []

$(document).ready(() => {
    $('#connectButton').click(connect);
    $('#uniqueIdInput').on('keyup', function (e) {
        if (e.key === 'Enter') {
            connect();
        }
    });

    if (window.settings.username) connect();
})

const ENUM_TYPE_ACTION = {
    SHARE_FOLLOW: "SHARE_FOLLOW",
    LIKE: "LIKE",
    GIFT: "GIFT",
    JOIN: "JOIN",
    COMMENT: "COMMENT",
}

function connect() {
    let uniqueId = window.settings.username || $('#uniqueIdInput').val();
    if (uniqueId !== '') {

        // $('#stateText').text('Connecting...');
        connection.connect(uniqueId, {
            enableExtendedGiftInfo: true
        }).then(state => {
            console.log("Connected: " + state)
            $('#stateText').text(`Connected to roomId ${state.roomId}`);

            // reset stats
            viewerCount = 0;
            likeCount = 0;
            diamondsCount = 0;
            updateRoomStats();
            SelectModal(10)
        }).catch(errorMessage => {
            console.log(errorMessage, "errorMessage")
            $('#stateText').text(errorMessage);

            // schedule next try if obs username set
            if (window.settings.username) {
                setTimeout(() => {
                    connect(window.settings.username);
                }, 30000);
            }
        })

    } else {
        alert('no username entered');
    }
}

// Prevent Cross site scripting (XSS)
function sanitize(text) {
    return text.replace(/</g, '&lt;')
}

function updateRoomStats() {
    $('#roomStats').html(`Viewers: <b>${viewerCount.toLocaleString()}</b> Likes: <b>${likeCount.toLocaleString()}</b> Earned Diamonds: <b>${diamondsCount.toLocaleString()}</b>`)
}

function generateUsernameLink(data) {
    return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
}

function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

/**
 * Add a new message to the chat container
 */
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function handleEventLive(typeEvent, data) {
    // if ([ENUM_TYPE_ACTION.SHARE_FOLLOW, ENUM_TYPE_ACTION.GIFT, ENUM_TYPE_ACTION.LIKE, ENUM_TYPE_ACTION.JOIN].includes(typeEvent)) {
    if (idComment === data.msgId) return;
    idComment = data.msgId;

    if (typeEvent === ENUM_TYPE_ACTION.JOIN) {
        let random = Math.floor(Math.random() * 10)
        if (random === 2) {
            let textHello;
            switch (Math.floor(Math.random() * 6)) {
                case 0:
                    textHello = "Tim để chơi " + data?.nickname + " ơi";
                    break;
                case 1:
                    textHello = "Chào mừng " + data?.nickname + " đến chơi";
                    break;
                case 2:
                    textHello = "Chơi game không " + data?.nickname;
                    break;
                case 3:
                    textHello = "Tim mạnh lên mọi người";
                    break;
                case 4:
                    textHello = "Chơi game đi " + data?.nickname;
                    break;
                default:
                    textHello = "Ở lại chơi " + data?.nickname + " nhé";
                    break;
            }
            TextToSpeech(textHello)
        }
    }

    if (typeEvent === ENUM_TYPE_ACTION.GIFT) {
        if (Number.isInteger(data.diamondCount) && data.diamondCount > 0) {
            for (let i = 0; i < data.diamondCount; i++) {
                await delay(500);
                BirthZombie(data.userId + "", true, data.nickname || "", data.profilePictureUrl, ZombieNameGift[Math.floor(Math.random() * ZombieNameGift.length)], data.diamondCount);
            }
        }
        TextToSpeech(data?.nickname + " đã tặng quà để mua zombie vip", true)
    } else {
        if (!bannedUserSpam.includes(data.userId)) {
            BirthZombie(data.userId + "", false, data.nickname || "", data.profilePictureUrl, ZombieName[Math.floor(Math.random() * ZombieName.length)], 1);
            bannedUserSpam.push(data.userId);
            setTimeout(() => {
                let indexUserInBannedArr = bannedUserSpam.indexOf(data.userId);
                if (indexUserInBannedArr > -1) {
                    bannedUserSpam.splice(indexUserInBannedArr, 1);
                }
            }, 10000)
        }
    }
    // }

}

/**
 * Add a new gift to the gift container
 */
// function addGiftItem(data) {
//     let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.giftcontainer');
//
//     if (container.find('div').length > 200) {
//         container.find('div').slice(0, 100).remove();
//     }
//
//     let streakId = data.userId.toString() + '_' + data.giftId;
//
//     let html = `
//         <div data-streakid=${isPendingStreak(data) ? streakId : ''}>
//             <img class="miniprofilepicture" src="${data.profilePictureUrl}">
//             <span>
//                 <b>${generateUsernameLink(data)}:</b> <span>${data.describe}</span><br>
//                 <div>
//                     <table>
//                         <tr>
//                             <td><img class="gifticon" src="${data.giftPictureUrl}"></td>
//                             <td>
//                                 <span>Name: <b>${data.giftName}</b> (ID:${data.giftId})<span><br>
//                                 <span>Repeat: <b style="${isPendingStreak(data) ? 'color:red' : ''}">x${data.repeatCount.toLocaleString()}</b><span><br>
//                                 <span>Cost: <b>${(data.diamondCount * data.repeatCount).toLocaleString()} Diamonds</b><span>
//                             </td>
//                         </tr>
//                     </tabl>
//                 </div>
//             </span>
//         </div>
//     `;
//
//     let existingStreakItem = container.find(`[data-streakid='${streakId}']`);
//
//     if (existingStreakItem.length) {
//         existingStreakItem.replaceWith(html);
//     } else {
//         container.append(html);
//     }
//
//     container.stop();
//     container.animate({
//         scrollTop: container[0].scrollHeight
//     }, 800);
// }


// viewer stats
// connection.on('roomUser', (msg) => {
//     if (typeof msg.viewerCount === 'number') {
//         viewerCount = msg.viewerCount;
//         updateRoomStats();
//     }
// })

// like stats
connection.on('like', (data) => {
    handleEventLive(ENUM_TYPE_ACTION.LIKE, data);
})

// Member join
// let joinMsgDelay = 0;
connection.on('member', (data) => {
    // if (window.settings.showJoins === "0") return;

    // let addDelay = 250;
    // if (joinMsgDelay > 500) addDelay = 100;
    // if (joinMsgDelay > 1000) addDelay = 0;
    //
    // joinMsgDelay += addDelay;
    //
    // setTimeout(() => {
    //     joinMsgDelay -= addDelay;
    //     handleEventLive('#21b2c2', msg, 'joined', true);
    // }, joinMsgDelay);

    handleEventLive(ENUM_TYPE_ACTION.JOIN, data);
})

// New chat comment received
// connection.on('chat', (msg) => {
//     if (window.settings.showChats === "0") return;
//
//     handleEventLive('', msg, msg.comment);
// })

// New gift received
connection.on('gift', (data) => {
    if (data.gift.repeat_end == 0) {
        handleEventLive(ENUM_TYPE_ACTION.GIFT, data);
    }
})

// share, follow
connection.on('social', (data) => {
    handleEventLive(ENUM_TYPE_ACTION.SHARE_FOLLOW, data);
})

// connection.on('streamEnd', () => {
//     $('#stateText').text('Stream ended.');
//
//     // schedule next try if obs username set
//     if (window.settings.username) {
//         setTimeout(() => {
//             connect(window.settings.username);
//         }, 30000);
//     }
// })

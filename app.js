const fetch = require('node-fetch');
const moment = require('moment');

ip = '192.168.1.3'
userId = '7jhcjMbfoBLLWxEHPi8ZAa0ZFHNCq5jueS3-WFtz';
url = `http://${ip}/api/${userId}`;


groups = {
    "1": ['9', '10'],
    "2": ['11', '12', '13'],
    "3": ['14', '15'],
    "4": ['16', '17'],
    "5": ['18']
}

start();


async function start() {
    // let color = calculateColor();
    // let lights = await getLights();
    // await changeColors(color, lights);

    // createScenes();
    let scenes = await getScenes();
    getCustomScenes(scenes);
}

async function getCustomScenes(scenes){
    count = 0;
    for (let [key, value] of Object.entries(scenes)){
        if (value['name'].startsWith('group')){
            parts = value['name'].split('_');
            group = parts[0].split('-')[1];
            ct = parseInt(parts[1].split('-')[1]);
            // if (value['name'].startsWith('group-5')){
            //     console.log(value);
            //     count +=1;
            // }

            for (let light of value['lights']){
                let endpoint = `${url}/scenes/${key}/lightstates/${light}`;
                let body = { 
                    "transitiontime": 1, 
                    "on": false,
                    "ct": ct
                };
                console.log(ct);
                let resp = await fetch(endpoint, {
                    method: 'PUT',
                    body: JSON.stringify(body)
                });
                let data = await resp.json();

                console.log(data);
            }
        }
    }
    console.log(count)
}

async function changeColors(color, lights) {
    console.log(lights);
    for (let [id, value] of Object.entries(lights)) {
        console.log(color);
        if (value.state.on) {
            let url = `${url}/${id}/state/`;
            let body = { "ct": color };
            let resp = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(body)
            });
            console.log(resp);
        }
    }
}

async function getLights() {
    let resp = await fetch(`${url}/lights/`);
    let data = await resp.json();
    return data;
}

function calculateColor() {
    let hoursOffset = moment().hour() - 9;
    let ctVal = hoursOffset * 29 + 153;
    if (ctVal < 153) { return 153; }
    else if (ctVal > 500) { return 500; }
    return ctVal;
}

async function getScenes() {
    let resp = await fetch(`${url}/scenes/`);
    let data = await resp.json();
    return data;
    console.log(data);
}

async function getGroups() {
    let resp = await fetch(`${url}/groups/`);
    let data = await resp.json();
    console.log(data);
}


function createPayload(key, value, ctVal) {
    let obj = {
        group: key,
        name: `group-${key}_ct-${ctVal}`,
        type: 'GroupScene',
        recycle: false
    }
    let lightstates = {}
    for (let light of value) {
        lightstates[light] = {
            'ct': ctVal,
            'transitiontime': 18000,
            'on': false
        }
    }

    obj['lightstates'] = lightstates;
    return obj;
}

async function postScene(payload) {
    let body = payload;
    let resp = await fetch(`${url}/scenes/`, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    let data = await resp.json();
    console.log(data);
}

async function createScenes() {

    ctVal = 153;
    while (ctVal <= 500) {
        for (let [key, value] of Object.entries(groups)) {
            let payload = createPayload(key, value, ctVal);
            await postScene(payload);
        }
        ctVal += 14
    }
    for (let [key, value] of Object.entries(groups)) {
        let payload = createPayload(key, value, 500);
        await postScene(payload);
    }

}


//14 per half hour on 


//25 scenes for each light group
//14 per scene
//transition time 30 minutes


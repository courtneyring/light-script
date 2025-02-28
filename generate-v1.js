const bodyBase = require('./example-body.json')


async function getCustomScenes(scenes) {
    count = 0;
    for (let [key, value] of Object.entries(scenes)) {
        if (value['name'].startsWith('group')) {
            parts = value['name'].split('_');
            group = parts[0].split('-')[1];
            ct = parseInt(parts[1].split('-')[1]);
            // if (value['name'].startsWith('group-5')){
            //     console.log(value);
            //     count +=1;
            // }

            for (let light of value['lights']) {
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

async function getGroups() {
    let resp = await fetch(`${url}/groups/`);
    let data = await resp.json();
    console.log(data);
}


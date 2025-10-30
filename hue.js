
const ip = '172.16.184.18'
const userId = '7jhcjMbfoBLLWxEHPi8ZAa0ZFHNCq5jueS3-WFtz';
// url = `http://${ip}/api/${userId}`;
const url = `https://${ip}/clip/v2`

const headers = {
    'hue-application-key': userId
}

const checkForLight = async ({ id }) => {
    let isLight = (await fetch(`${url}/resource/light/${id}`, { headers })).ok;
    return isLight

}

const getLightFromDevice = async ({ id }) => {
    let data = await fetch(`${url}/resource/device/${id}`, { headers })
    if (!data.ok) return null;
    let json = await data.json()
    let services = json.data[0].services
    console.log(services.find((service) => service.rtype == 'light'))
    let lightId = services.find((service) => service.rtype == 'light')?.rid
    return lightId
}

const getLight = async({id}) => {
    let resp = await fetch(`${url}/resource/light/${id}`, { headers });
    let data = await resp.json();
    return data.data;
}

const updateLight = async ({ id, payload }) => {
    let resp = await fetch(`${url}/resource/light/${id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(payload)
    });
    let data = await resp.json();
    console.log(data);
}

async function getScenes() {
    let resp = await fetch(`${url}/resource/scene`, { headers });
    let scenes = await resp.json();
    console.log(scenes.data.length)
    return scenes.data;
}

const getRooms = async () => {
    let resp = await fetch(`${url}/resource/room`, { headers });
    let json = await resp.json();
    return json.data;
}


const getZone = async ({ id }) => {
    let resp = await fetch(`${url}/resource/zone/${id}`, { headers });
    let data = await resp.json();
    return data.data;
}

const postScene = async (payload) => {
    let resp = await fetch(`${url}/resource/scene`, {
        headers,
        method: 'POST',
        body: JSON.stringify(payload)
    });
    let data = await resp.json();
    console.log(data);
}

const postScenes = async (payloads) => {
    for (let payload of payloads) {
        await postScene(payload);
    }
}

const deleteScene = async ({ id }) => {
    let resp = await fetch(`${url}/resource/scene/${id}`, {
        headers,
        method: 'DELETE'
    });
    let data = await resp.json();
}

const deleteAllScenes = async () => {
    let scenes = await getScenes();

    for (let scene of scenes) {
       await deleteScene({ id: scene.id });
    }
}


const activateScene = async ({ id }) => {
    let resp = await fetch(`${url}/resource/scene/${id}`, {
        headers,
        method: 'PUT', 
        body: JSON.stringify({recall: {action: 'active'}})
    });
    let data = await resp.json();
    console.log(data);
}

export { 
    checkForLight, 
    getLightFromDevice, 
    getScenes, 
    getRooms, 
    getZone, 
    postScene, 
    postScenes, 
    activateScene, 
    deleteAllScenes, 
    getLight, 
    updateLight
};
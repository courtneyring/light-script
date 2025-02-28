import fs from 'fs';
import moment from 'moment';
import { checkForLight, getLightFromDevice, getScenes, getRooms, deleteAllScenes, postScenes } from './hue.js';


// =========== Converted to V2 ============ //


async function createPayload({ ctVal, on, group, name }) {
    let obj = { actions: [], metadata: {}, group: {}, speed: 1, auto_dynamic: true, palette: {} };

    for (let child of group.children) {
        let lightId = await checkForLight({id: child.rid}) ? child.rid : await getLightFromDevice({id: child.rid})

        if (lightId) {
            obj.actions.push({
                target: {
                    rid: lightId,
                    rtype: 'light'
                },
                action: {
                    ...(on && { on: { on: true } }),
                    dimming: {
                        brightness: 100.00
                    },
                    color_temperature: {
                        mirek: ctVal
                    }
                }
            })


        }

    }
    obj.metadata['name'] =  name;
    obj.group['rid'] = group.id
    obj.group['rtype'] = group.type
    obj.palette.color = []
    obj.palette.dimming = []
    obj.palette.effects = []
    obj.palette.color_temperature = [{
        color_temperature: {
            mirek: ctVal
        },
        dimming: {
            brightness: 100.00
        }
    }]

    return obj;
}


async function formatSceneData({ on, group, startHour = 7, endHour = 20, totalScenes = 10 }) {

    let payloads = [];
    let ctVal = 153;
    let totalMinutes = (endHour - startHour) * 60;
    let minuteIncrements = Math.floor(totalMinutes / totalScenes);
    let time = moment().hour(7).startOf('hour');
    let ctIncrement = Math.floor((500 - 153) / totalScenes);


    
    for (let i = 0; i < totalScenes; i++) {
        if (i == totalScenes - 1) ctVal = 500;
        let name = on ? time.format('h:mma') : `script-${time.format('h:mma') }`
        let payload = await createPayload({ ctVal, on, group, name });
        payloads.push(payload);
        ctVal += ctIncrement;
        time.add(minuteIncrements, 'minute')

    }

    return payloads;
}





(async function() {
    await deleteAllScenes();
    const rooms = await getRooms();
    fs.writeFileSync('rooms.json', JSON.stringify(rooms, null, 2))
    const maxSwitchScenes = 10;
    const maxScriptScenes = Math.floor(200 / rooms.length - maxSwitchScenes);
    
    for (let room of rooms) {
        // This is creating the scene for the script because the property 'on' cannot be true or all the lights will turn on 
        let scriptScenes = await formatSceneData({ on: false, group: room, totalScenes: maxScriptScenes });

        // This is for the light switches because we need the property 'on' to be true for the lights to turn on
        let switchScenes = await formatSceneData({ on: true, group: room, totalScenes: maxSwitchScenes }); 
        await postScenes([...scriptScenes, ...switchScenes]);
    }


    const scenes = await getScenes();

    // fs.writeFileSync('scenes.json', JSON.stringify(scenes, null, 2))

})();
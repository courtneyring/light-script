import { getScenes, getRooms, activateScene, checkForLight, getLight, getLightFromDevice } from './hue.js';
import moment from 'moment';

function closestTime(arr, time) {
    return arr.reduce(function (prev, curr) {

        let currTime = moment(curr.metadata.name, 'h:mma');
        let prevTime = moment(prev.metadata.name, 'h:mma');
        // console.log(curr.metadata.name, currTime.from(time), prev.metadata.name, prevTime.from(time));
        return Math.abs(currTime.diff(time)) < Math.abs(prevTime.diff(time)) ? curr : prev;
    });
}

(async function() {
    const rooms = await getRooms();
    const scenes = await getScenes();
    const now = +moment().format('x');

    for (let room of rooms.slice(1,2)) {
        // console.log(room.metadata.name);

        let roomIsOn = false;
        for (let child of room.children) {
            const lightId = await checkForLight({ id: child.rid }) ? child.rid : await getLightFromDevice({ id: child.rid })
            const light = await getLight({ id: lightId });
            // console.log(light)
            if (light[0].on.on) {
                roomIsOn = true;
                break;
            }
        }

        if (roomIsOn) {
            const roomScenes = scenes.filter((scene) => scene.group.rid === room.id && !scene.metadata.name.includes('script-'));

            if (roomScenes.length === 0) continue;
            const closest = closestTime(roomScenes, now);
            await activateScene({ id: closest.id });
        }
        


        
    }
})();
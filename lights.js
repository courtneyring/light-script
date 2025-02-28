import { getScenes, getRooms, activateScene } from './hue.js';
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

    for (let room of rooms) {
        const roomScenes = scenes.filter((scene) => scene.group.rid === room.id && scene.metadata.name.includes('script-'));
        if (roomScenes.length === 0) continue;
        const closest = closestTime(roomScenes, now);
        await activateScene({ id: closest.id });


        
    }
})();
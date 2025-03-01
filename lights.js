import { getScenes, getRooms, activateScene, checkForLight, getLight, getLightFromDevice, updateLight } from './hue.js';
import moment from 'moment';

const startHour = 7;
const endHour = 20;
const mirekMax = 500;
const mirekMin = 153;
const minutesPerMirek = ((endHour - startHour) * 60)  /(mirekMax - mirekMin);

function closestTime(arr, time) {
    return arr.reduce(function (prev, curr) {

        let currTime = moment(curr.metadata.name, 'h:mma');
        let prevTime = moment(prev.metadata.name, 'h:mma');
        return Math.abs(currTime.diff(time)) < Math.abs(prevTime.diff(time)) ? curr : prev;
    });
}

const getMirek =  () => {
    const startMoment = moment().hour(startHour).minute(0);
    const minutesPast = moment().diff(startMoment, 'minutes');
    const mirek = Math.floor(153 + minutesPast/minutesPerMirek);
    console.log(mirek)
    return mirek
}


(async function() {
    const rooms = await getRooms();
    // const scenes = await getScenes();
    // const now = +moment().format('x');
    // const regex = new RegExp("^([1-9]|1[0-2]):[0-5][0-9][a|p]m$")

    for (let room of rooms) {
        for (let child of room.children) {
            const lightId = await checkForLight({ id: child.rid }) ? child.rid : await getLightFromDevice({ id: child.rid })
            const light = await getLight({ id: lightId });
            if (light[0].on.on) {
                const payload = { color_temperature: { mirek: getMirek()}};
                await updateLight({ id: lightId, payload });
            }
        }

        
    }
})();
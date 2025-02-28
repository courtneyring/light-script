# Phillips Hue Light Script

Script to control Phillips Hue lights by setting the Ct value depending on the time of day

The node script generated the scenes

The python script runs on a raspberry pi every 30 minutes to check the time of day and set the scene accordingly

### generate.js
This is to generate the scenes for each room

startHour is when the transitions start at a very blue light, and end will be a very orange light. The bridge limits number of scenes to 200. Current the script calculates scenes per room by dividing that by number of rooms. 

There is an error involving self-signed certs on the work computer so the script has been updated to disable the warning.

V1 is outdated and built based on the first version of the API. It probably won't run but there for ref.


### Lights.py
This is the script that runs at regular intervals using a cronjob to update the light colors throughout the day

Crontab is set to run every 30 minutes from 7am to 8pm
```
*/1 7-20 * * * cd /Users/courtney.ring/Documents/dev-projects/light-script && export NODE_TLS_REJECT_UNAUTHORIZED='0' && /Users/courtney.ring/.nvm/versions/node/v20.13.1/bin/node lights.js
```

### Future Improvements
Right now we have 10 scenes for each room light switch preset to 'on' and the remaining were made with the property 'on' to false to be used by the script. I realize now we can just check each room to see if they're on and activate the scene only if they are. Then we don't need a separate set of scenes just for the scrits and it'll make less requests overall 
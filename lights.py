import requests
import math
from datetime import datetime
import json


ip = '192.168.1.3'
userId = '7jhcjMbfoBLLWxEHPi8ZAa0ZFHNCq5jueS3-WFtz'
url = 'http://' + ip + '/api/' + userId

groupIds = ['1', '2', '3', '4', '5']

def start():
    ctVal = getCtVal()

    for groupId in groupIds:
        sceneId = findScene(ctVal, groupId)
        setState(groupId, sceneId, ctVal)

    
    print(getGroup("3"))

def getGroup(id):
    endpoint = url + '/groups/' + id
    response = requests.get(endpoint)
    return json.loads(response.text)

def getScenes():
    endpoint = url + '/scenes'
    response = requests.get(endpoint)
    return json.loads(response.text)


def findScene(ctVal, id):
    scenes = getScenes()
    for key, value in scenes.items():
        if value['name'] == 'group-' + id + '_ct-' + str(ctVal):
            return key

def turnOn(groupId):
    endpoint = url + '/groups/' + groupId + '/c'
    body = json.dumps({'on': True})
    resp = requests.put(endpoint, data=body)
    print(resp.text)


def setState(groupId, sceneId, ctVal):
    group = getGroup(groupId)
    endpoint = url + '/groups/' + groupId + '/action'
    if group["state"]["any_on"]:
        body = json.dumps({'ct': ctVal})
        resp = requests.put(endpoint, data=body)
        print(resp.text)
    else:
        body = json.dumps({'scene': sceneId})
        resp = requests.put(endpoint, data=body)
        print(resp.text)
        

def getCtVal():
    now = datetime.now()
    hour = now.hour
    minute = now.minute

    if hour < 4 or hour >= 21:
        return 500

    elif hour < 8 and hour >= 4:
        return 153
    
    else:
        hourOffset = hour - 8
        minuteOffset = math.floor(minute/30)
        ctVal = 167 + (hourOffset * 28) + (minuteOffset * 14)
        return int(ctVal)



start()
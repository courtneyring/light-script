from datetime import datetime 
import requests 
import json 
import math
import smtplib

f = open("ip.txt", "r+")

groupIds = ['1', '2', '3', '4', '5']


def start():

	global url
	url = getUrl()
	ctVal = getCtVal()

	for groupId in groupIds:
		sceneId = findScene(ctVal, groupId)
		setState(groupId, sceneId, ctVal)
	print("success")



def buildUrl(ip):
	return 'http://' + ip + '/api/7jhcjMbfoBLLWxEHPi8ZAa0ZFHNCq5jueS3-WFtz';

def getUrl():
	
	ip = f.read()
	url = buildUrl(ip)
	
	try:
		resp = requests.head(url + '/scenes')
		print(resp.status_code)
		return url

	except requests.ConnectionError:
		resp = requests.get('https://discovery.meethue.com/')
		data = json.loads(resp.text)
		newIp = data[0]['internalipaddress']
		f.seek(0)
		f.write(newIp)
		f.truncate()
		f.close()
		return buildUrl(newIp)

def findScene(ctVal, id):
	scenes = getScenes()
	for key, value in scenes.items():
		if value['name'] == 'group-' + id + '_ct-' + str(ctVal):
			return key

def getGroup(id):
	endpoint = url + '/groups/' + id
	response = requests.get(endpoint)
	return json.loads(response.text)



def getScenes():
	endpoint = url + '/scenes'
	response = requests.get(endpoint)
	return json.loads(response.text)


def setState(groupId, sceneId, ctVal):
	group = getGroup(groupId)
	endpoint = url + '/groups/' + groupId + '/action'
	if group['state']['any_on']:
		body = json.dumps({'ct': ctVal})
		resp = requests.put(endpoint, data=body)
	else:
		body = json.dumps({'scene': sceneId})
		resp = requests.put(endpoint, data=body)

def getCtVal():
	now = datetime.now()
	hour = now.hour
	minute = now.minute

	if hour < 4 or hour >= 24:
		return 500

	elif hour < 11 and hour >=4:
		return 153

	else:
		hourOffset = hour - 11
		minuteOffset = math.floor(minute/30)
		ctVal = 167 + (hourOffset * 28) + (minuteOffset * 14)
		return int(ctVal)


start()

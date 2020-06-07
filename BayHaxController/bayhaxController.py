import RPi.GPIO as GPIO
from time import sleep
import os
import requests
import json
from datetime import datetime
from picamera import PiCamera
import base64
import alsaaudio
import pygame
import random
import mutagen.mp3

pygame.mixer.init()

volume = alsaaudio.Mixer('Headphone')

camera = PiCamera()
camera.resolution= (600,600)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

GPIO.setup(7,GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
GPIO.setup(10,GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
GPIO.setup(13,GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

cT = 0
req = 0
timer = 60*60

def playSound(filename):
    mp3 = mutagen.mp3.MP3(filename)
    print("sample rate:",mp3.info.sample_rate)
    pygame.mixer.quit()
    pygame.mixer.init(mp3.info.sample_rate)
    pygame.mixer.music.load(filename)
    pygame.mixer.music.play()

def sendData(data):
    print("time:", data['time'])
    url = "https://bayhax.ethanhorowitz.repl.co/rpi"
    print('sending')
    # sending post request and saving response as response object
    
    obj = requests.post(url= url, data= json.dumps(data), headers={'content-type':'application/json'})
    print("got it")
    response = json.loads(obj.text)
    
    volume.setvolume(int(response['volume']))
    
    '''
    if response['frequency']*60 != timer:
        playSound('combined.mp3')
        cT = 0
        timer = response['frequency']*60
    '''
    return response

playSound("combined.mp3")

print("now listening")
while True:
    if cT >= timer:
        cT = 0
        playSound("combined.mp3")
    
    now = datetime.now()
    date = now.strftime("%Y/%m/%d")
    time = now.strftime("%H:%M")
    
    pressed = False
    data = {'id': 'abc123', 'mood': '', 'picture': '', 'date': date, 'time': time}
    choices = []
    if GPIO.input(10) == GPIO.HIGH:
        pressed = True
        data['mood'] = 'happy'
        print("pin 10 pushed")
        choices = ['yay.mp3','woohoo.mp3','hooray.mp3']
    elif GPIO.input(13) == GPIO.HIGH:
        pressed = True
        data['mood'] = 'angry'
        print("pin 13 pushed")
        choices = ['soz.mp3','no.mp3','hug.mp3']
    elif GPIO.input(7) == GPIO.HIGH:
        pressed = True
        data['mood'] = 'sad'
        print("pin 7 pushed")
        choices = ['soz.mp3','no.mp3','hug.mp3']
    if pressed:
        camera.start_preview()
        sleep(3)
        camera.capture('img.jpg')
        camera.stop_preview()
        data['picture'] = base64.b64encode(open('img.jpg','rb').read()).decode('utf-8')
        response = sendData(data)
        playSound(choices[random.randrange(3)])
        print(response)
    else:
        sleep(1)
        if cT//300 != req:
            req = cT//300
            response = sendData(data)
        else:
            sleep(1)
    cT+=2
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
from io import BytesIO
import requests
import os

load_dotenv()
client = OpenAI()
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

app = Flask(__name__)

#Hello world route
@app.route("/")
def oden():
    return "niete nambo no, oden ni sooro!!"

#Receives a {prompt:""} body
#Returns openai's answer
@app.route("/prompt", methods=["POST"])
def prompt():
    data = request.get_json()
    prompt_text = data.get("prompt")

    answer = openaiPrompt(prompt_text)
    return jsonify({"message": f"{answer}"})

#Transcript audio
@app.route("/transcript", methods=["POST"])
def transcript():
    file_id = request.data.decode("utf-8")

    transcript = process_transcript(file_id)
    return jsonify(transcript)


#Process prompt through openai API
def openaiPrompt(prompt):
    response = client.responses.create(
    model="gpt-4.1",
    input=prompt
    )
    return response.output_text

#Process file_id and get file
def process_transcript(file_id):

    # file_path
    url_get_file = f'https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={file_id}'
    response = requests.get(url_get_file)
    response.raise_for_status()
    file_path = response.json()["result"]["file_path"]

    #download file
    file_url = f'https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}'
    file_response = requests.get(file_url)
    file_response.raise_for_status()
    file_bytes = BytesIO(file_response.content)

    transcript = transcribe_audio(file_bytes)
    return transcript

def transcribe_audio(file_bytes: BytesIO):
    response = client.audio.transcriptions.create(
        model="whisper-1",
        file=("audio.ogg", file_bytes, "audio/ogg"),  # nombre, datos binarios, tipo MIME
        response_format="text"
    )
    return response
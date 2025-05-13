from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()
client = OpenAI()

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
    return jsonify({"transcript": f"{transcript}"})


#Process prompt through openai API
def openaiPrompt(prompt):
    response = client.responses.create(
    model="gpt-4.1",
    input=prompt
    )
    return response.output_text

#Process file_id and get file
def process_transcript(file_id):
    return "processed " + file_id
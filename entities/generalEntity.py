import os
import signal
import requests
from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello World!"


@app.route("/patient/")
def get_patient_records():
    # TODO: The general entity sends a request to the user and asks for encrypted data.
    pass


@app.route("/exit/")
def exit_server():
    os.kill(os.getpid(), signal.SIGTERM)


if __name__ == '__main__':
    app.run(host="localhost", port=8002, debug=True)

import os
import signal
import requests
from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello World!"


@app.route("/verify/", methods=['POST'])
def verify_patient_record():
    # TODO: The legal entity verifies the patient records by signing the data with its private keys.
    pass


@app.route("/exit/")
def exit_server():
    os.kill(os.getpid(), signal.SIGTERM)


if __name__ == '__main__':
    app.run(host="localhost", port=8001, debug=True)

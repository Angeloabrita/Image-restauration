import os

#using the localhost address
# from dotenv import load_dotenv, find_dotenv
# load_dotenv(find_dotenv())

SECRET_KEY = os.environ.get("SECRET_KEY")

import flask
from flask import Flask, render_template, request, jsonify, make_response
from flask.helpers import flash

from flask_wtf.csrf import CSRFProtect

import restaure



app = Flask(__name__)

app.config.update(
    SECRET_KEY=SECRET_KEY,
    WTF_CSRF_SECRET_KEY=SECRET_KEY,
    WTF_CSRF_TIME_LIMIT=None
)

csrf = CSRFProtect(app)


@app.route('/', methods=["GET","POST"])
def index():
     
   if flask.request.method == "GET":
      return render_template('index.html')

   if flask.request.method == "POST":
     
   
      req = request.get_json()
      
      print("csrf is valid")
      conv = restaure.res(req['sImg'], req['mask']) 
      res = make_response(jsonify({"result": conv}), 200)
      return res



if __name__ == '__main__':
   app.run()
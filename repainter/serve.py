#https://github.com/JiahuiYu/generative_inpainting
#https://pythonise.com/series/learning-flask/flask-and-fetch-api

#https://stackoverflow.com/questions/58369348/flask-csrf-and-fetch-api
from flask import Flask, render_template, request, jsonify, make_response
import flask

from flask.helpers import flash
from flask_wtf.csrf import CSRFProtect

import restaure



app = Flask(__name__)

app.config.update(
    SECRET_KEY='secret_xxx',
    WTF_CSRF_SECRET_KEY='secret_xxx',
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
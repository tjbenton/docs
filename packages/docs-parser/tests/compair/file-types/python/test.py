###
## @author Tyler Benton
## @page tests/py-file
###

## @name main
## @description
## main method
import os
import sqlite3
from datetime import datetime
from flask import Flask, g, request, render_template, flash

app = Flask(__name__)

app.config.update(dict(
    DATABASE = os.path.join(app.root_path, 'db.sqlite3'),
    SECRET_KEY = 'secret key'
))

app.config.from_object(__name__)

## @name something
## @description
## This is a normal multi-line comment made of single line comments.

@app.before_request
def before_request():
    g.db = connect_db()


## @name something else
## @description
## This is another normal multi-line comment made of single line comments.

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()
    g.db.close()

# This is a normal single-line comment.
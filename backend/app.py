import app_config
import argparse
import json
import pandas as pd
from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session  # https://pythonhosted.org/Flask-Session
from flask_restful import Resource, Api, reqparse
from bivariate import *
from utils import helper as hlp
from werkzeug.middleware.proxy_fix import ProxyFix
import statsmodels.api as sm
import numpy as np
from statsmodels.tsa.stattools import acf, pacf
from statsmodels.formula.api import ols
import scipy.stats as stats
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import *
from sklearn.preprocessing import LabelEncoder
from sklearn.multiclass import OneVsRestClassifier
import statsmodels.api as sm
from statsmodels.formula.api import ols
import scipy.stats as stats
from statsmodels.nonparametric.smoothers_lowess import lowess
from fileupload import *
from univariate import *
from regression import *

ALLOWED_EXTENSIONS = {"tsv", "csv"}

df_data_global = None
numerical_cols = None
cat_cols = None

parser = argparse.ArgumentParser()
parser.add_argument('env', nargs='?', default='prod')
args = parser.parse_args()

if args.env == 'dev':
    app = Flask(__name__, static_folder="../frontend/static", static_url_path="/")
else:
    app = Flask(__name__, static_folder="./static", static_url_path="/")
app.config.from_object(app_config)
Session(app)
api = Api(app)

# This section is needed for url_for("foo", _external=True) to automatically
# generate http scheme when this sample is running on localhost,
# and to generate https scheme when it is deployed behind reversed proxy.
# See also https://flask.palletsprojects.com/en/1.0.x/deploying/wsgi-standalone/#proxy-setups
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)


@app.route("/exploration")
@app.route("/upload")
@app.route('/preview')
@app.route("/")
def index():
    return app.send_static_file("index.html")


# API to fetch JSON of exploration page
class Exploration(Resource):
    def get(self):
        return session["exp_data"], 200


# Verify the extension of uploaded file
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


class DecomposeTimeSeries(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()

    def post(self):

        self.parser.add_argument(
            "column", type=str
        )

        self.parser.add_argument(
            "model", type=str
        )

        args = self.parser.parse_args()

        data_df = pd.read_json(session.get("data"), orient="table")
        decomposed = sm.tsa.seasonal_decompose(data_df[args.get('column')].values, model=args.get('model'), freq=12)

        return pd.DataFrame({
            "seasonal": list(np.nan_to_num(decomposed.seasonal)),
            "trend": list(np.nan_to_num(decomposed.trend)),
            "residual": list(np.nan_to_num(decomposed.resid)),
            "observed": list(np.nan_to_num(decomposed.observed)),
        }).round(2).to_json()



class AcfPacfData(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    
    def post(self):
        self.parser.add_argument(
            "column", type=str
        )

        args= self.parser.parse_args()
        data_df = pd.read_json(session.get("data"), orient="table")

        pacf_x, confint_pacf = pacf(data_df[args.column], nlags=30, alpha=.05, method='ywunbiased')

        lower_band_pacf = confint_pacf[:, 0] - pacf_x
        upper_band_pacf = confint_pacf[:, 1] - pacf_x

        acf_x, confint_acf = acf(data_df[args.column], nlags=30, alpha=.05, fft=False)

        lower_band_acf = confint_acf[:, 0] - acf_x
        upper_band_acf = confint_acf[:, 1] - acf_x

        return pd.DataFrame({
            'acf': list(acf_x),
            'lower_band_acf': list(lower_band_acf),
            'upper_band_acf': list(upper_band_acf),
            'pacf': list(pacf_x),
            'lower_band_pacf': list(lower_band_pacf),
            'upper_band_pacf': list(upper_band_pacf),
        }).round(2).to_json()

# define API endpoints
api.add_resource(Exploration, "/exploration-data")
api.add_resource(FileUploader, "/uploader")
api.add_resource(DecomposeTimeSeries, "/decompose")
api.add_resource(AcfPacfData, "/acfpacf")
api.add_resource(BiVariateAnaysis, "/BiVariateAnaysis")
api.add_resource(UniVariateAnaysis, "/UniVariateAnaysis")
api.add_resource(UniVariateAnaysis_Association, "/UniVariateAnaysis_Association")
api.add_resource(BiVariateAnaysis_Association, "/BiVariateAnaysis_Association")
api.add_resource(Regression, "/Regression")

if __name__ == "__main__":
    app.run(debug=True)

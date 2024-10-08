import app_config
import argparse
import json
import pandas as pd
import werkzeug
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
ALLOWED_EXTENSIONS = {"tsv", "csv"}
def num_missing(x):
    return len(x.index)-x.count()

def num_unique(x):
    return x.nunique(dropna = True)

def exploration():
    global numerical_cols,cat_cols
    data = df_data_global

    temp_df = data.describe().T.round(2)

    # Find missing data
    missing_df = pd.DataFrame(data.apply(num_missing, axis=0)) 
    missing_df.columns = ['missing']

    #Find unique counts
    unq_df = pd.DataFrame(data.apply(num_unique, axis=0))
    unq_df.columns = ['unique']

    # Find data types of columns
    types_df = pd.DataFrame(data.dtypes)
    types_df.columns = ['DataType']
    types_df['DataType'] = types_df.astype('str')

    # Cereate a summary df
    summary_df = temp_df.join(missing_df).join(unq_df).join(types_df)
    ColNames = list(summary_df)
    summary_df['Feature'] = summary_df.index
    ColNamesOrder = ['Feature']
    ColNamesOrder.extend(ColNames)

    #Create data set table for the numerical features
    numerical_df  = summary_df[ColNamesOrder]
    numerical_df = numerical_df.reset_index(drop = True)
    numerical_cols = list(numerical_df['Feature'].drop_duplicates())

    #Create data set for categorical columns
    col_names = list(data) #Get all col names
    cat_cols = list(set(col_names) - set(numerical_cols))
    num_cols = len(col_names)
    index = range(num_cols)
    cat_index = []
    for i in index: #Find the indices of columns in Categorical columns
        if col_names[i] in cat_cols:
            cat_index.append(i)
    summary_df_cat = missing_df.join(unq_df).join(types_df.iloc[cat_index], how='inner') #Only summarize categorical columns
    ColNames2 = list(summary_df_cat)
    summary_df_cat['Feature'] = summary_df_cat.index
    ColNamesOrder2 = ['Feature']
    ColNamesOrder2.extend(ColNames2)
    categorical_df = summary_df_cat[ColNamesOrder2]
    categorical_df = categorical_df.reset_index(drop = True)

    return {
        "input_data_columns": list(data.columns),
        "data_sample": data.head(5).values.tolist(),
        "numerical_columns": list(numerical_df.columns),
        "numerical_data": list(numerical_df.values.tolist()),
        "categorical_columns": list(categorical_df.columns),
        "categorical_data": list(categorical_df.values.tolist()),
        "numerical_col":list(numerical_cols), #List of numerical
        "cat_cols":list(cat_cols) #List of cat
    }

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# API to upload file
class FileUploader(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()

    def post(self):
        self.parser.add_argument(
            "file", type=werkzeug.datastructures.FileStorage, location="files"
        )
        
        args = self.parser.parse_args()
        try:
            file = args.get("file")
            if file and allowed_file(file.filename):

                file.seek(0)

                global df_data_global
                global numerical_cols,cat_cols
                
                df_data_global = hlp.read_file_to_dataframe(
                    file.filename, file
                )  # used from helper file
                numerical_cols = list(df_data_global._get_numeric_data().columns)
                cat_cols=list(set(df_data_global.columns)-set(numerical_cols))
                session["upload_error"] = False

                exploration_data = exploration()
                session["exp_data"] = json.dumps(exploration_data)
                
                return {
                    "message": "Data uploaded!!"
                }, 200  # return status code 201 if everthing worked fine
            return {"message": "Something went wrong!!"}, 501
        except:
            return {"message": "Something went wrong!!"}, 501

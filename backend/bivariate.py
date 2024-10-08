from isort import file
import numpy as np
import app_config
import argparse
import json
import pandas as pd
from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session  # https://pythonhosted.org/Flask-Session
from flask_restful import Resource, Api, reqparse
import fileupload

class BiVariateAnaysis(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    def post(self):
        # data_df = pd.read_json(session.get("data"), orient="table")
        global df_data_global
        df_data_global=fileupload.df_data_global
        data_df = df_data_global
        numerical_col=[]
        cat_col=[]

        global numerical_cols,cat_cols
        numerical_cols=fileupload.numerical_cols
        cat_cols=fileupload.cat_cols
        numerical_col.append(numerical_cols)
        cat_col.append(cat_cols)
        #For correalation heatmap
        corr_mat=data_df.corr().round(3)
        z = corr_mat.values.T.tolist()
        x = list(corr_mat.columns)
        features=[]
        y_features=[]
        features.append(x)
        y_features.append(x[::-1])
        #print(y_features)
        print(features)
        y = list(corr_mat.index)
        corr_result=[]
        l=[]
        corr1=[]
        corr_table_col=[]
        corr_table_values=[]
        for i in range(len(x)):
            #d={'name':'','data':l}
        #     d['name']=x[i]
        #     print( d['name'])
            l=[]
            for j in range(0,len(x)):
                l.append(z[i][j])
                #print(l)
            #d['data']=l
            corr1.append(l)

        corr_result.append(corr1)
        #For correlation table
        corr_df = data_df.corr().unstack().reset_index()
        corr_df.columns = ['Feature1', 'Feature2', 'Correlation']
        au_corr = corr_df.copy()
        au_corr['AbsoluteCorrelation'] = au_corr['Correlation'].abs()
        au_corr_final = au_corr[~pd.DataFrame(np.sort(au_corr.filter(like='Feature'), axis=1)).duplicated()]
        au_corr_final = au_corr_final[~(au_corr_final['Feature1'] == au_corr_final['Feature2'])]
        corr_final_df = au_corr_final.sort_values(by=['AbsoluteCorrelation'], ascending=False).reset_index(drop = True)
        corr_final_df = corr_final_df.drop(columns = ['AbsoluteCorrelation']) 
        corr_table_col.append(list(corr_final_df.columns))
        corr_table_values.append(list(corr_final_df.values))

        df1= {
            "correlation_data":corr_result,
            "corr_table_col":list(corr_table_col),
            "corr_final_data":list(corr_table_values),
            "numerical_cols":list(numerical_col),
            "categorical_cols":list(cat_col),
            "x_features":list(features)
        }
        res1 = pd.concat([pd.Series(v, name=k) for k, v in df1.items()], axis=1)
        return res1.to_json()

class BiVariateAnaysis_Association(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    def post(self):
        self.parser.add_argument(
            "column1", type=str
        )
        self.parser.add_argument(
            "column2", type=str
        )
        args= self.parser.parse_args()
        column1 = args.column1
        column2 = args.column2
        global df_data_global
        df_data_global=fileupload.df_data_global
        data_df = df_data_global
        data_df = df_data_global
        numerical_col=[]
        cat_col=[]
        numerical_col.append(numerical_cols)
        cat_col.append(cat_cols)
        
        #Plot between column1 & column2
        bivariate_data_cc=[]
        bivariate_data_nc=[]
        bivariate_data_cn=[]
        bivariate_data_nn=[]
        col1_unq = []
        col2_unq = []
        column1_unq=[]
        column2_unq=[]
        selected_combination=""
        if ((column1 is not None) & (column2 is not None) & (numerical_cols is not None) & (cat_cols is not None)):
            if (column1 == column2):
                bivariate_data=[]
            if (column1 in numerical_cols):
                selected_combination = selected_combination + 'N'
            else:
                selected_combination = selected_combination + 'C'
            if (column2 in numerical_cols):
                selected_combination = selected_combination + 'N'
            else:
                selected_combination = selected_combination + 'C'
            if (selected_combination == 'CC'): #column1 & column2 categorical
                #BarChart
                col1_unq=list(data_df[column1].unique())
                column1_unq.append(col1_unq)
                col2_unq=list(data_df[column2].unique())
                column2_unq.append(col2_unq)
                bivariate_data1=[]
                for i in col2_unq:
                    l=[]
                    d={'name':'','data':l}
                    df1=data_df[data_df[column2]==i]
                    h=[]
                    h=[list(df1[column1]).count(j) for j in col1_unq]
                    d['name']=i
                    d['data']=h
                    bivariate_data1.append(d)
                bivariate_data_cc.append(bivariate_data1)
            elif (selected_combination == 'NC'): #column1 numerical & column2 categorical
                #Boxplot
                bivariate_data2=[]
                k=list(data_df[column2].unique())
                l=[]
                for i in k:
                    l=[]
                    d={'x':'','y':l}
                    h=data_df[data_df[column2]==i]
                    d['x']=i
                    min1=min(h[column1])
                    max1=max(h[column1])
                    med=h[column1].median()
                    q3, q1 = np.percentile(np.array(h[column1]),[75 ,25])
                    l.extend([min1,q1,med,q3,max1])
                    bivariate_data2.append(d)
                bivariate_data_nc.append(bivariate_data2)
            elif (selected_combination == 'CN'): #column1 categorical & column2 numerical
                #Boxplot
                bivariate_data3=[]
                k=list(data_df[column1].unique())
                l=[]
                for i in k:
                    l=[]
                    d={'x':'','y':l}
                    h=data_df[data_df[column1]==i]
                    d['x']=i
                    min1=min(h[column2])
                    max1=max(h[column2])
                    med=h[column2].median()
                    q3, q1 = np.percentile(np.array(h[column2]),[75 ,25])
                    l.extend([min1,q1,med,q3,max1])
                    bivariate_data3.append(d)
                bivariate_data_cn.append(bivariate_data3)
            elif (selected_combination == 'NN'): #column1 & column2 numerical
                #Scatterplot
                bivariate_data4=[]
                if(len(numerical_cols)>=2):
                    bivariate_data=[]
                    l1=list(data_df[column1])
                    l2=list(data_df[column2])
                    k=column1+" vs "+column2
                    l=[]
                    for i,j in zip(l1,l2):
                        l.append([i,j])
                    dict1={"name":k,"data":l}
                    bivariate_data_nn.append(dict1)
        df1= {
            "bivariate_data_cc": list(bivariate_data_cc),
            "bivariate_data_cn": list(bivariate_data_cn),
            "bivariate_data_nc": list(bivariate_data_nc),
            "bivariate_data_nn": list(bivariate_data_nn),
            "catcol1_unq":list(column1_unq),
            "catcol2_unq":list(column2_unq),
            "numerical_cols":list(numerical_col),
            "categorical_cols":list(cat_col)
        }
        res1 = pd.concat([pd.Series(v, name=k) for k, v in df1.items()], axis=1)
        return res1.to_json()
       
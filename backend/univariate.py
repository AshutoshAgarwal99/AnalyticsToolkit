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
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.formula.api import ols
import scipy.stats as stats
import statsmodels.api as sm

global df_data_global

class UniVariateAnaysis(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    def post(self):
        self.parser.add_argument(
            "column", type=str
        )
        args= self.parser.parse_args()
        column = args.column
        df_data_global=fileupload.df_data_global
        data_df = df_data_global
        numerical_col=[]
        cat_col=[]
        global numerical_cols,cat_cols
        numerical_cols=fileupload.numerical_cols
        cat_cols=fileupload.cat_cols
        hist_data=[]
        box_data=[]
        box_data_outliers=[]
        dist_data = []
        if column in numerical_cols:
            plt.clf()
            data = [[int(h.get_height()),int(round(h.xy[0],0))] for h in sns.distplot(a=data_df[column],kde=False).patches]
            counts,bins = map(list,zip(*data))
            hist={'counts':counts,'bins':bins}
            hist_data.append(hist)
            # Box Plot
            #box_data=[]
            q3,med, q1 = np.percentile(np.array(data_df[column]), [75 ,50,25])
            iqr=q3-q1
            min1=q1-(1.5*iqr).round(2)
            max1=q3+(1.5*iqr).round(2)
            k=[min1,q1,med,q3,max1]
            low=[]
            up=[]
            for i in list(data_df[column]):
                if i < min1:
                    low.append(i)
                elif i>max1:
                    up.append(i)
            box_values={'name':'box','type':'boxplot','data':[{'x':column,'y':k}]}
            outliers={'name':'outliers','type':'scatter','data':[{'x1':'lower','y1':low},{'x2':'upper','y2':up}]}
            box_data.append(box_values)
            box_data_outliers.append(outliers)
            distplot_val = sns.distplot(a=data_df[column]).get_lines()[0].get_data()
            x = list(distplot_val[0])
            y = list(distplot_val[1])
            dist={'x':x,'y':y}
            dist_data.append(dist)
        piechart=[]
        cat_hist_data=[]

        if column in cat_cols:
            #Pie chart
            #piechart=[]
            labels=list(data_df[column].unique())
            pie_values=list(data_df[column].value_counts())
            pie_dict={'series':pie_values,'labels':labels}
            piechart.append(pie_dict)
            #hist or bar
            hist_labels=list(data_df[column].unique())
            hist_values=list(data_df[column].value_counts())
            dict1={'data':hist_values,'categories':hist_labels}
            cat_hist_data.append(dict1)

        df= {
        "num_hist_bins":hist_data, #Numerical Histogram 
        "num_box_data":list(box_data), #Numerical Box
        "num_box_outliers_data":list(box_data_outliers), #Numerical Box
        "num_dist_data":dist_data,#NUmerical Distplot
        "cat_pie_data":list(piechart), #Cat Pie chart
        "cat_hist_data":list(cat_hist_data), #Categorical Histogram
        "numerical_col":list(numerical_col), #List of numerical
        "cat_cols":list(cat_col) #List of cat
        }
        res = pd.concat([pd.Series(v, name=k) for k, v in df.items()], axis=1)
        return res.to_json()

class UniVariateAnaysis_Association(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    def post(self):
        self.parser.add_argument(
            "column", type=str
        )
        self.parser.add_argument(
            "slider1", type=int
        )
        self.parser.add_argument(
            "slider2", type=int
        )
        args= self.parser.parse_args()
        column = args.column
        slider1 = args.slider1
        slider2 = args.slider2
        #data_df = pd.read_json(df_data_global, orient="table")
        df_data_global=fileupload.df_data_global
        data_df = df_data_global
        numerical_col=[]
        cat_col=[]
        numerical_col.append(numerical_cols)
        cat_col.append(cat_cols)
                    
        selected_column=column
        corr_col=[]
        corr_val=[]
        num_topK_esq_col=[]
        num_topK_esq_val=[]
        cat_topK_esq_col=[]
        cat_topK_esq_val=[]
        topK_cramer_col=[]
        topK_cramer_val=[]

        if selected_column in numerical_cols:

            if len(numerical_cols)>1:
                try:
                    number=min(slider1,len(numerical_cols)-1)
                except:
                    number=len(numerical_cols)
                df2 = data_df[numerical_cols]
                corrdf = df2.corr()
                corrdf = abs(corrdf) 
                corrdf2 = corrdf[corrdf.index==selected_column].reset_index()[[each for each in corrdf.columns \
                                                              if selected_column not in each]].unstack().sort_values(kind="quicksort", 
                                                                                                          ascending=False).head(number)
                corrdf2 = corrdf2.reset_index()
                corrdf2.columns = ['Columns','level1','Absolute Correlation']
                corrdf2.set_index('Columns', inplace=True)
                corr_col.append(list(corrdf2.index))
                corr_val.append(list(corrdf2['Absolute Correlation']))

            if len(cat_cols) >= 1:
                try:
                    number=slider2
                except:
                    number=len(cat_cols)
                etasquared_dict = {}
                for each in cat_cols:
                    mod = ols('{} ~ C({})'.format(selected_column, each),data=data_df[[selected_column,each]],missing='drop').fit()
                    aov_table = sm.stats.anova_lm(mod, typ=1)
                    esq_sm = aov_table['sum_sq'][0]/(aov_table['sum_sq'][0]+aov_table['sum_sq'][1])
                    etasquared_dict[each] = esq_sm
                topk_esq = pd.DataFrame.from_dict(etasquared_dict, orient='index').unstack().sort_values(\
                            kind = 'quicksort', ascending=False).head(number).reset_index().set_index('level_1')
                topk_esq.index = topk_esq.index.rename("Columns")
                topk_esq.columns = ['level_0', 'EtaSquared']
                num_topK_esq_col.append(list(topk_esq.index))
                num_topK_esq_val.append(list(topk_esq['EtaSquared']))
 
        if selected_column in cat_cols:

            if len(numerical_cols) >= 1:
                try:
                    number=slider1
                except:
                    number=len(numerical_cols)
                etasquared_dict = {}
                for each in numerical_cols:
                    mod = ols('{} ~ C({})'.format(each, selected_column), data = data_df[[selected_column,each]]).fit()
                    aov_table = sm.stats.anova_lm(mod, typ=1)
                    esq_sm = aov_table['sum_sq'][0]/(aov_table['sum_sq'][0]+aov_table['sum_sq'][1])
                    etasquared_dict[each] = esq_sm
                topk_esq = pd.DataFrame.from_dict(etasquared_dict, orient='index').unstack().sort_values(\
                            kind = 'quicksort', ascending=False).head(number).reset_index().set_index('level_1')
                topk_esq.index = topk_esq.index.rename("Columns")
                topk_esq.columns = ['level_0', 'EtaSquared']
                cat_topK_esq_col.append(list(topk_esq.index))
                cat_topK_esq_val.append(list(topk_esq['EtaSquared']))

            if len(cat_cols)>1:
                try:
                    number=min(slider2,len(cat_cols)-1)
                except:
                    number=len(cat_cols)
                cramer_dict = {}
                for each in cat_cols:
                    if each != selected_column:
                        tbl = pd.crosstab(data_df[selected_column], data_df[each])
                        chisq = stats.chi2_contingency(tbl, correction=False)[0]
                        try:
                            cramer = np.sqrt(chisq/tbl.sum().sum())
                        except:
                            cramer = np.sqrt(chisq/tbl.as_matrix().sum())
                            pass
                        cramer_dict[each] = cramer
                topk_cramer = pd.DataFrame.from_dict(cramer_dict, orient='index').unstack().sort_values(\
                            kind = 'quicksort', ascending=False).head(number).reset_index().set_index('level_1')
                topk_cramer.index = topk_cramer.index.rename("Columns")
                topk_cramer.columns = ['level_0','CramersV']
                topK_cramer_col.append(list(topk_cramer.index))
                topK_cramer_val.append(list(topk_cramer['CramersV']))

        df= {
        "corr_col":list(corr_col), #NN x axis
        "corr_val":list(corr_val), #NN y axis
        "num_topK_esq_col": list(num_topK_esq_col), #NC x axis
        "num_topk_esq_val":list(num_topK_esq_val), #NC y axis
        "cat_topK_esq_col": list(cat_topK_esq_col), #CN X
        "cat_topk_esq_val":list(cat_topK_esq_val), #CN Y
        "topK_cramer_col":list(topK_cramer_col), #CC X
        "topK_cramer_val":list(topK_cramer_val), #CC Y
        "numerical_col":list(numerical_col), #List of numerical
        "cat_cols":list(cat_col) #List of cat
        }
        res = pd.concat([pd.Series(v, name=k) for k, v in df.items()], axis=1)
        return res.to_json()
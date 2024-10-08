from isort import file
import numpy as np

import pandas as pd
from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session  # https://pythonhosted.org/Flask-Session
from flask_restful import Resource, Api, reqparse
import fileupload
from statsmodels.nonparametric.smoothers_lowess import lowess

from statsmodels.formula.api import ols
import scipy.stats as stats
import statsmodels.api as sm
class Regression(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    
    def post(self):
        self.parser.add_argument(
            "column", type=list
           
        )
        self.parser.add_argument(
            "column2", type=str
           
        )

        args= self.parser.parse_args()
        predictors = args.column
        target_feature = args.column2
        predictor=''
        predictor=predictor.join(predictors)
        predictors=[]
        predictors=predictor.split(',')

        #predictors=["E_POP","S_POP"]
        target_feature="DISTANCE"
        print(predictors)
        print(target_feature)
        global df_data_global
        df_data_global=fileupload.df_data_global
        data_df=df_data_global
        global numerical_cols,cat_cols
        numerical_cols=fileupload.numerical_cols
        cat_cols=fileupload.cat_cols
        numerical_col=[]
        cat_col=[]
        reg_eq=[]
        warnings_list=[]
        table1_list=[]
        table2_column=[]
        table2_data=[]
        table3_data=[]
        fitvsresid=[]
        normalqq=[]
        fitvssqrt_std_residuals=[]
        residual_vs_levarage=[]
        numerical_col.append(numerical_cols)
        cat_col.append(cat_cols)
        if target_feature in numerical_cols:
            data = pd.DataFrame(data_df)
            cat_predictors = list(set(cat_cols) & set(predictors))
            num_predictors = list(set(numerical_cols) & set(predictors))
            if cat_predictors:
                dum_df = pd.get_dummies(data[cat_predictors])
                if num_predictors:
                    InputData = data[num_predictors].join(dum_df)
                else:
                    InputData = dum_df
            else:
                InputData = InputData = data[num_predictors]
            OutputData = data[target_feature]
            X = sm.add_constant(InputData)
            Y = OutputData
            model = sm.OLS(Y, X)
            res = model.fit()
            results_summary = res.summary()
            if "Notes" in str(results_summary):
                warnings = str(results_summary).split("Notes:",1)[1]
                warnings_list.append(warnings.split("\n"))
            elif "Warnings" in str(results_summary):
                warnings = str(results_summary).split("Warnings:",1)[1]
                warnings_list.append(warnings.split("\n"))
            else:
                warnings_list.append(["0 Warnings"])
            #regression equation
            reg_equation = 'Regression Equation : ' + target_feature + " ~ " + " + ".join(predictors)
            reg_eq=[]
            reg_eq.append(reg_equation)
            #print(reg_equation)
            #Model summary and performance metrics
            results_as_html1 = results_summary.tables[0].as_html()
            table1 = pd.read_html(results_as_html1, header=0, index_col=0)[0].reset_index().replace(np.nan, '').round(4)
            data1=table1.to_dict('rows')
            columns1=[{'name': i, 'id': i} for i in table1.columns]
            table1.loc[len(table1)] = table1.columns
            table1.columns = range(len(table1.columns))
            table1_lis=[]
            for i in table1.values:
                if "" in i[-2:]:
                    pass
                else:
                    table1_lis.append(list(i[-2:]))
            table1_list.append(table1_lis)
            # print(table1_list)


            results_as_html2 = results_summary.tables[1].as_html()
            table2 = pd.read_html(results_as_html2, header=0, index_col=0)[0].reset_index().replace(np.nan, '').round(4)
            data2=table2.to_dict('rows'),
            columns2=[{'name': i, 'id': i} for i in table2.columns]
            table2_column.append(list(table2.columns))
            table2_lis=[]
            for i in table2.values:
                table2_lis.append(list(i))
            table2_data.append(table2_lis)
            #print(table2_data)

            results_as_html3 = results_summary.tables[2].as_html()
            table3 = pd.read_html(results_as_html3, header=0, index_col=0)[0].reset_index().replace(np.nan, '').round(4)
            data3=table3.to_dict('rows')
            columns3=[{'name': i, 'id': i} for i in table3.columns]
            table3.loc[len(table3)] = table3.columns
            table3.columns = range(len(table3.columns))
            table3_lis=[]
            for i in table3.values:
                table3_lis.append(list(i))
            table3_data.append(table3_lis)
            #print(table3_data)

            #Diagnostic plots

            #Plot-1 Residuals vs Fitted
            residuals = res.resid
            #print(residuals)
            fitted = res.fittedvalues
            #print(fitted)
            smoothed = lowess(residuals,fitted)
            top3 = abs(residuals).sort_values(ascending = False)[:3]
            fitvsresid=[]
            l1=list(fitted)
            l2=list(residuals)
            k="Residuals vs Fitted Scatter"
            l=[]
            for i,j in zip(l1,l2):
                l.append([i,j])
            fvsr_scatter={"name":k,"data":l}
            #fitvsresid.append(fvsr_scatter)
            line=[]
            plot2="Residuals vs Fitted line"
            for i,j in zip(smoothed[:,0],smoothed[:,1]):
                k=[]
                #print([i,j])
                k.extend([i,j])
                line.append(k)
            print(line)
            fvsr_line={"name":plot2,"data":line}
            #fitvsresid.append(fvsr_line)
            fvsr_const={"name":"constant","data":[[min(fitted),max(fitted)],[0,0]]}
            #fitvsresid.append(fvsr_const)
            fitvsresid.append([fvsr_scatter,fvsr_line,fvsr_const])
            #print(fitvsresid)

            #plot-2 Normal QQ
            sorted_residuals = pd.Series(res.get_influence().resid_studentized_internal)
            sorted_residuals.index = res.resid.index
            sorted_residuals = sorted_residuals.sort_values(ascending = True)
            df = pd.DataFrame(sorted_residuals)
            df.columns = ['sorted_residuals']
            df['theoretical_quantiles'] = stats.probplot(df['sorted_residuals'], dist = 'norm', fit = False)[0]
            rankings = abs(df['sorted_residuals']).sort_values(ascending = False)
            top3 = rankings[:3]
            x = df['theoretical_quantiles']
            y = df['sorted_residuals']
            normalqq=[]
            theoretical_quantiles=list(x)
            sorted_residuals=list(y)
            k="Normalqq Scatter"
            scatter_qq=[]
            for i,j in zip(theoretical_quantiles,sorted_residuals):
                scatter_qq.append([i,j])
            normalqq_scatter={"name":k,"data":scatter_qq}
        #     normalqq.append(normalqq_scatter)
            normalqq_line={"name":"Normalqq line","data":[[np.min([x,y]),np.max([x,y])],[np.min([x,y]),np.max([x,y])]]}
        #     normalqq.append(normalqq_line)
            normalqq.append([normalqq_scatter,normalqq_line])
            #print(normalqq)

            #Plot-3 root_squared_student_residuals vs fitted
            residuals = res.resid
            fitted = res.fittedvalues
            student_residuals = res.get_influence().resid_studentized_internal
            sqrt_student_residuals = pd.Series(np.sqrt(np.abs(student_residuals)))
            sqrt_student_residuals.index = res.resid.index
            smoothed_fvsqrt = lowess(sqrt_student_residuals,fitted)
            top3 = abs(sqrt_student_residuals).sort_values(ascending = False)[:3]
            fitvssqrt_std_residuals=[]
            fitted_list=list(fitted)
            sqrt_student_residuals=list(sqrt_student_residuals)
            k="fitted vs sqrt_student_residuals Scatter"
            fvssqr1=[]
            for i,j in zip(fitted_list,sqrt_student_residuals):
                fvssqr1.append([i,j])
            fvssqr_scatter={"name":k,"data":fvssqr1}
            #fitvssqrt_std_residuals.append(fvssqr_scatter)
            fvssqr2=[]
            plot_line="fitted vs sqrt_student_residuals line"
            for i,j in zip(smoothed_fvsqrt[:,0],smoothed_fvsqrt[:,1]):
                k=[]
                k.extend([i,j])
                fvssqr2.append(k)
            fvssqrt_line={"name":plot_line,"data":fvssqr2}
            fitvssqrt_std_residuals.append([fvssqr_scatter,fvssqrt_line])
            #print(fitvssqrt_std_residuals)

            #Plot-4 Residuals vs Leverage
            student_residuals = pd.Series(res.get_influence().resid_studentized_internal)
            student_residuals.index = res.resid.index
            df = pd.DataFrame(student_residuals)
            df.columns = ['student_residuals']
            df['leverage'] = res.get_influence().hat_matrix_diag
            smoothed = lowess(df['student_residuals'],df['leverage'])
            sorted_student_residuals = abs(df['student_residuals']).sort_values(ascending = False)
            top3 = sorted_student_residuals[:3]
            x = list(df['leverage'])
            y = list(df['student_residuals'])
            xpos = max(x)+max(x)*0.01  
            cooksx = np.linspace(min(x), xpos, 50)
            p = len(res.params)
            poscooks1y = np.sqrt((p*(1-cooksx))/cooksx)
            poscooks05y = np.sqrt(0.5*(p*(1-cooksx))/cooksx)
            negcooks1y = -np.sqrt((p*(1-cooksx))/cooksx)
            negcooks05y = -np.sqrt(0.5*(p*(1-cooksx))/cooksx)
            set_ylim=list((min(y)-min(y)*0.15,max(y)+max(y)*0.15))
            set_xlim=list((-0.01,max(x)+max(x)*0.05))
            residual_vs_levarage=[]
            k="residuals vs Leverage Scatter"
            resvslev1=[]
            for i,j in zip(x,y):
                resvslev1.append([i,j])
            resvslev_scatter={"name":k,"data":resvslev1}
            #residual_vs_levarage.append(fvssqr_scatter)
            resvslev2=[]
            plot_line1="Cook's Distance"
            for i,j in zip(cooksx,poscooks1y):
                k=[]
                k.extend([i,j])
                resvslev2.append(k)
            resvslev_line1={"name":plot_line1,"data":resvslev2}
            #residual_vs_levarage.append(resvslev_line1)


            resvslev3=[]
            plot_line2="cooksx,poscooks05y"
            for i,j in zip(cooksx,poscooks05y):
                k=[]
                k.extend([i,j])
                resvslev3.append(k)
            resvslev_line2={"name":plot_line2,"data":resvslev3}
            #residual_vs_levarage.append(resvslev_line2)


            resvslev4=[]
            plot_line3="cooksx,negcooks1y"
            for i,j in zip(cooksx,negcooks1y):
                k=[]
                k.extend([i,j])
                resvslev4.append(k)
            resvslev_line3={"name":plot_line3,"data":resvslev4}
            #residual_vs_levarage.append(resvslev_line3)

            resvslev5=[]
            plot_line3="cooksx,negcooks05y"
            for i,j in zip(cooksx,negcooks05y):
                k=[]
                k.extend([i,j])
                resvslev5.append(k)
            resvslev_line4={"name":plot_line3,"data":resvslev4}
            #residual_vs_levarage.append(resvslev_line4)

            resvslev_line5={"name":"constant1","data":[[0,0],set_ylim]}
            #residual_vs_levarage.append(resvslev_line5)

            resvslev_line6={"name":"constant2","data":[set_xlim,[0,0]]}
            residual_vs_levarage.append([fvssqr_scatter,resvslev_line1,resvslev_line2,resvslev_line3,resvslev_line4,resvslev_line5,resvslev_line6])
            #print(residual_vs_leverage)

        df2={
            "numerical_cols":list(numerical_col),
            "categorical_cols":list(cat_col),
            "regression_eq":reg_eq,
            "warnings":list(warnings_list),
            "table1_data":list(table1_list),
            "table2_columns":list(table2_column),
            "table2_values":list(table2_data),
            "table3_data":list(table3_data),
            "fit_vs_residual":list(fitvsresid),
            "normalqq":list(normalqq),
            "fitvssqrt_std_residuals":list(fitvssqrt_std_residuals),
            "residual_vs_levarage":list(residual_vs_levarage)
            }
        res3 = pd.concat([pd.Series(v, name=k) for k, v in df2.items()], axis=1)
        return res3.to_json()
import pandas as pd


def read_file_to_dataframe(filename, file_path_name):
    ext = "." in filename and filename.rsplit(".", 1)[1].lower()

    if ext == "tsv":
        dataFrame = pd.read_csv(file_path_name, delimiter="\t")
    elif ext == "csv":
        dataFrame = pd.read_csv(file_path_name)
    return dataFrame

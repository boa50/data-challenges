from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df_athlete = pd.read_csv(
    get_path("Olympic_Athlete_Bio.csv"), usecols=["athlete_id", "sex"]
)
df_event = pd.read_csv(
    get_path("Olympic_Athlete_Event_Results.csv"), usecols=["edition", "athlete_id"]
)


print(df_event.head())

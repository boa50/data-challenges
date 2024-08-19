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

df = pd.merge(df_event, df_athlete, how="left", on="athlete_id")
assert df.shape[0] == df_event.shape[0]

df = df[df["edition"].str.contains("Summer")]
df["year"] = df["edition"].str[:4]

df = df.drop_duplicates()

print(df.shape)
print(df.isna().sum())

df = df.dropna()

print("After dropping")
print(df.shape)
print(df.isna().sum())

df = df.groupby(["year", "sex"]).count().reset_index()
df = df.drop("athlete_id", axis=1)
df = pd.pivot(df, index="year", columns="sex", values="edition").reset_index()

df = df.rename(columns={"Female": "female", "Male": "male"})

### Manually adding data for the Paris Olympics, source: https://apnews.com/article/2024-olympic-games-gender-parity-c194ca5934911efbce801363f28e8c04
df = pd.concat(
    [df, pd.DataFrame.from_records([{"year": 2024, "female": 5503, "male": 5712}])],
    ignore_index=True,
)

print(df)

df.to_csv(get_path("dataset.csv"), index=False)
